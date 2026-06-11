#!/usr/bin/env python3
"""
Generates static API JSON files for the Flamehaven Verification Ledger.

Each experiment must have a manifest.json with an "api_summary" block.
The build script reads those blocks; no per-experiment extraction logic needed.
Adding a new experiment: register it in js/*-registry.js and add api_summary
to its manifest.json -- no changes to this script required.

Manifest locations:
  EQA  eqa/toe-test-XXXX/manifest.json
  BAV  bav/exp-XXX/manifest.json
  BSC  stem-bio-ai/manifest.json  (reports[].api_summary)

Usage:
  python scripts/build_api.py          # (re)generate api/v1/
  python scripts/build_api.py --check  # fail if committed files differ
"""
import argparse
import filecmp
import json
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).parent.parent
API_DIR = ROOT / "api" / "v1"
BASE_URL = "https://flamehaven01.github.io/Flamehaven-Verification-Ledger"


def _load(path):
    p = Path(path)
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}


def _parse_registry(js_path):
    """Extract {id, jsonPath} entries from a JS registry file.
    Uses brace-depth tracking to handle nested objects (e.g. sidebar: {...}).
    """
    text = Path(js_path).read_text(encoding="utf-8")
    out = {}
    depth, start = 0, -1
    for i, ch in enumerate(text):
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start >= 0:
                block = text[start:i + 1]
                id_m = re.search(r"\bid:\s*['\"]([^'\"]+)['\"]", block)
                jp_m = re.search(r"\bjsonPath:\s*['\"]([^'\"]+)['\"]", block)
                if id_m and jp_m:
                    out[id_m.group(1)] = jp_m.group(1)
                start = -1
    return out


def _manifest_path(exp_id):
    if exp_id.startswith("toe-test-"):
        return ROOT / "eqa" / exp_id / "manifest.json"
    if exp_id.startswith("bav-exp-"):
        return ROOT / "bav" / ("exp-" + exp_id[len("bav-exp-"):]) / "manifest.json"
    return None


def _write(path, obj):
    Path(path).write_text(json.dumps(obj, indent=2, ensure_ascii=True), encoding="utf-8")


def build_all(out_dir):
    out_dir = Path(out_dir)
    (out_dir / "runs").mkdir(parents=True, exist_ok=True)
    (out_dir / "metrics").mkdir(parents=True, exist_ok=True)

    eqa_reg = _parse_registry(ROOT / "js" / "eqa-registry.js")
    bav_reg = _parse_registry(ROOT / "js" / "bav-registry.js")
    bsc_man = _load(ROOT / "stem-bio-ai" / "manifest.json")
    now = datetime.now(timezone.utc).isoformat()

    all_runs = []
    bav_metrics = []

    for exp_id, json_path in {**eqa_reg, **bav_reg}.items():
        lane = "EQA" if exp_id.startswith("toe-test-") else "BAV"
        mpath = _manifest_path(exp_id)
        manifest = _load(mpath) if mpath else {}
        api = manifest.get("api_summary")
        if not api:
            print(f"  WARN: no api_summary in {mpath}", file=sys.stderr)
            continue

        portal_page = "eqa.html" if lane == "EQA" else "index.html"
        evidence = {
            "portal_url": f"{BASE_URL}/{portal_page}#{exp_id}",
            "payload_json": f"{BASE_URL}/{json_path.lstrip('./')}",
        }

        all_runs.append({
            "id": exp_id, "lane": lane,
            "title": api["title"], "verdict": api["verdict"],
            "verdict_label": api["verdict_label"], "date": api["date"],
            "brief": api["brief"],
            "detail_url": f"{BASE_URL}/api/v1/runs/{exp_id}.json",
        })

        detail = {
            "schema": "flamehaven_api_v1_run_detail",
            "id": exp_id, "lane": lane,
            "title": api["title"], "verdict": api["verdict"],
            "verdict_label": api["verdict_label"], "date": api["date"],
            "summary": api.get("summary", api["brief"]),
            "key_metrics": api.get("metrics", {}),
            "findings": api.get("findings", []),
            "evidence_links": evidence,
        }
        if api.get("external_anchors"):
            detail["external_anchors"] = api["external_anchors"]
        _write(out_dir / "runs" / f"{exp_id}.json", detail)

        if lane == "BAV":
            bav_metrics.append({
                "id": exp_id, "title": api["title"],
                "verdict": api["verdict"], "date": api["date"],
                **api.get("metrics", {}),
            })

    for report in bsc_man.get("reports", []):
        rid = f"bsc-{report['id']}"
        api = report.get("api_summary")
        if not api:
            print(f"  WARN: no api_summary in bsc report {report['id']}", file=sys.stderr)
            continue

        all_runs.append({
            "id": rid, "lane": "BSC",
            "title": api["title"], "verdict": api["verdict"],
            "verdict_label": api["verdict_label"], "date": api["date"],
            "brief": api["brief"],
            "detail_url": f"{BASE_URL}/api/v1/runs/{rid}.json",
        })

        rep_path = report.get("file", "").lstrip("./")
        _write(out_dir / "runs" / f"{rid}.json", {
            "schema": "flamehaven_api_v1_run_detail",
            "id": rid, "lane": "BSC",
            "title": api["title"], "verdict": api["verdict"],
            "verdict_label": api["verdict_label"], "date": api["date"],
            "summary": api.get("summary", api["brief"]),
            "key_metrics": api.get("metrics", {}),
            "findings": api.get("findings", []),
            "evidence_links": {
                "portal_url": f"{BASE_URL}/index.html#{rid}",
                "report_json": f"{BASE_URL}/{rep_path}" if rep_path else "",
            },
            "disclaimer": bsc_man.get("disclaimer", ""),
        })

    _write(out_dir / "runs.json", {
        "schema": "flamehaven_api_v1_runs_index",
        "generated_at_utc": now,
        "count": len(all_runs),
        "runs": all_runs,
    })

    _write(out_dir / "metrics" / "bav.json", {
        "schema": "flamehaven_api_v1_bav_metrics",
        "generated_at_utc": now,
        "note": "SR9 >= 0.70 pipeline guard, >= 0.80 honesty gate. DI2 <= 0.30 pipeline guard, <= 0.20 honesty gate. p_e2e = capture x transfer x model x clinical.",
        "experiments": bav_metrics,
    })

    schema = _load(ROOT / "scripts" / "api_schema_static.json")
    schema["generated_at_utc"] = now
    _write(out_dir / "schema.json", schema)


def _strip_ts(obj):
    obj.pop("generated_at_utc", None)
    return obj


def check_mode():
    diffs = []
    with tempfile.TemporaryDirectory() as tmp:
        build_all(tmp)
        for gen in Path(tmp).rglob("*.json"):
            rel = gen.relative_to(tmp)
            committed = API_DIR / rel
            if not committed.exists():
                diffs.append(f"MISSING in api/v1/: {rel}")
                continue
            if not filecmp.cmp(gen, committed, shallow=False):
                g = _strip_ts(json.loads(gen.read_text(encoding="utf-8")))
                c = _strip_ts(json.loads(committed.read_text(encoding="utf-8")))
                if g != c:
                    diffs.append(f"DIFFERS: {rel}")
    return diffs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true",
                        help="Fail if committed api/v1/ differs from generated output")
    args = parser.parse_args()

    if args.check:
        diffs = check_mode()
        if diffs:
            print("API drift detected -- run `python scripts/build_api.py` and commit:")
            for d in diffs:
                print(f"  {d}")
            sys.exit(1)
        print("api/v1/ is up to date.")
    else:
        build_all(API_DIR)
        files = list(API_DIR.rglob("*.json"))
        print(f"Generated {len(files)} files in {API_DIR}")


if __name__ == "__main__":
    main()
