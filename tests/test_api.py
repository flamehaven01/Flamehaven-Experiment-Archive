#!/usr/bin/env python3
"""
API v1 integration test suite — Flamehaven Verification Ledger.

Runs two phases:
  Phase 1 (local)  — validates api/v1/ files on disk
  Phase 2 (live)   — hits GitHub Pages HTTP endpoints (requires --live)

Usage:
  python tests/test_api.py           # local only
  python tests/test_api.py --live    # local + HTTP
  python tests/test_api.py --save    # write results to tests/results.json (gitignored)
"""
import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent.parent
API_DIR = ROOT / "api" / "v1"
BASE_URL = "https://flamehaven01.github.io/Flamehaven-Verification-Ledger"

EXPECTED_IDS = [
    "toe-test-0059", "toe-test-0058",
    "toe-test-0057", "toe-test-0056", "toe-test-0055",
    "toe-test-0054", "toe-test-0053", "toe-test-0052",
    "bav-exp-034",   "bav-exp-033",   "bav-exp-032",
    "bav-exp-031",   "bav-exp-028",   "bav-exp-005",
    "bsc-yorkeccak-bio", "bsc-bioclaw", "bsc-doctobert",
]
EXPECTED_LANES = {"EQA", "BAV", "BSC"}
RUN_SUMMARY_FIELDS = {"id", "lane", "title", "verdict", "verdict_label", "date", "brief", "detail_url"}
RUN_DETAIL_FIELDS  = {"schema", "id", "lane", "title", "verdict", "verdict_label", "date",
                      "summary", "key_metrics", "findings", "evidence_links"}
SCHEMA_TOP_KEYS    = {"schema", "lanes", "verdicts", "metrics", "disclaimer"}
BAV_IDS = [i for i in EXPECTED_IDS if i.startswith("bav-")]


class T:
    def __init__(self):
        self.results = []

    def ok(self, name, detail=""):
        self.results.append({"test": name, "status": "PASS", "detail": detail})
        label = f"[PASS] {name}"
        print(label + (f"  ({detail})" if detail else ""))

    def fail(self, name, reason):
        self.results.append({"test": name, "status": "FAIL", "detail": reason})
        print(f"[FAIL] {name}  -> {reason}")

    def check(self, name, cond, ok_msg="", fail_msg="assertion failed"):
        self.ok(name, ok_msg) if cond else self.fail(name, fail_msg)

    @property
    def passed(self):
        return sum(1 for r in self.results if r["status"] == "PASS")

    @property
    def failed(self):
        return sum(1 for r in self.results if r["status"] == "FAIL")

    def summary(self):
        total = len(self.results)
        return f"{self.passed}/{total} PASSED  {self.failed} FAILED"


def load_local(rel_path):
    p = API_DIR / rel_path
    if not p.exists():
        return None, f"{rel_path} not found on disk"
    try:
        return json.loads(p.read_text(encoding="utf-8")), None
    except json.JSONDecodeError as e:
        return None, f"JSON parse error: {e}"


def fetch_live(path, timeout=10):
    url = f"{BASE_URL}/api/v1/{path}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "FH-API-Test/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read().decode("utf-8"), r.headers.get("Content-Type", "")
    except urllib.error.HTTPError as e:
        return e.code, "", ""
    except Exception as e:
        return None, "", str(e)


# ─── PHASE 1: local file validation ────────────────────────────────────────


def phase_local(t):
    print("\n=== Phase 1: Local file validation ===\n")

    # 1.1 All expected files exist
    for fname in ["runs.json", "schema.json", "metrics/bav.json"]:
        p = API_DIR / fname
        t.check(f"file_exists:{fname}", p.exists(), fail_msg=f"missing {p}")
    for eid in EXPECTED_IDS:
        p = API_DIR / "runs" / f"{eid}.json"
        t.check(f"file_exists:runs/{eid}", p.exists(), fail_msg=f"missing {p}")

    # 1.2 runs.json structure
    print()
    runs_data, err = load_local("runs.json")
    if err:
        t.fail("runs.json:loadable", err)
        return
    t.ok("runs.json:loadable")

    count = runs_data.get("count", 0)
    t.check("runs.json:count=17", count == 17, ok_msg=f"count={count}", fail_msg=f"count={count}")

    run_list = runs_data.get("runs", [])
    found_ids = {r["id"] for r in run_list}
    t.check("runs.json:all_ids_present", found_ids == set(EXPECTED_IDS),
            ok_msg=f"{len(found_ids)} ids", fail_msg=f"missing={set(EXPECTED_IDS)-found_ids}")

    found_lanes = {r.get("lane") for r in run_list}
    t.check("runs.json:all_3_lanes", found_lanes == EXPECTED_LANES,
            ok_msg=str(found_lanes), fail_msg=f"lanes={found_lanes}")

    missing_fields = []
    for run in run_list:
        missing = RUN_SUMMARY_FIELDS - set(run.keys())
        if missing:
            missing_fields.append(f"{run['id']}: {missing}")
    t.check("runs.json:all_runs_have_required_fields", not missing_fields,
            ok_msg="all fields present", fail_msg="; ".join(missing_fields[:3]))

    # 1.3 schema.json structure
    print()
    schema, err = load_local("schema.json")
    if err:
        t.fail("schema.json:loadable", err)
    else:
        t.ok("schema.json:loadable")
        t.check("schema.json:top_keys", SCHEMA_TOP_KEYS.issubset(schema.keys()),
                ok_msg=str(list(schema.keys())), fail_msg=f"missing {SCHEMA_TOP_KEYS - set(schema.keys())}")
        t.check("schema.json:3_lanes", set(schema.get("lanes", {}).keys()) == EXPECTED_LANES,
                ok_msg=str(list(schema["lanes"].keys())))
        n_verdicts = len(schema.get("verdicts", []))
        t.check("schema.json:verdicts_gte_10", n_verdicts >= 10, ok_msg=f"{n_verdicts} verdicts")
        n_metrics = len(schema.get("metrics", {}))
        t.check("schema.json:metrics_gte_4", n_metrics >= 4, ok_msg=f"{n_metrics} metric defs")

    # 1.4 metrics/bav.json structure
    print()
    bav, err = load_local("metrics/bav.json")
    if err:
        t.fail("metrics/bav.json:loadable", err)
    else:
        t.ok("metrics/bav.json:loadable")
        exps = bav.get("experiments", [])
        t.check("metrics/bav.json:6_experiments", len(exps) == 6, ok_msg=f"{len(exps)} entries")
        all_have_metrics = all(
            any(k not in ("id", "title", "verdict", "date") for k in e.keys())
            for e in exps
        )
        t.check("metrics/bav.json:all_have_metrics", all_have_metrics, ok_msg="all experiments have metrics")

    # 1.5 spot-check individual run detail files
    print()
    checks = [
        ("bav-exp-034",          "verdict", "PASS"),
        ("bav-exp-033",          "verdict", "FAIL"),
        ("bav-exp-028",          "verdict", "ABSTAIN"),
        ("toe-test-0059",        "verdict", "DEGRADED_PASS"),
        ("toe-test-0058",        "verdict", "DEGRADED_PASS"),
        ("toe-test-0056",        "verdict", "PASS"),
        ("toe-test-0054",        "verdict", "BLOCK"),
        ("bsc-yorkeccak-bio",    "verdict", "T1"),
        ("bsc-bioclaw",          "verdict", "T2"),
        ("bsc-doctobert",        "verdict", "T0"),
    ]
    for eid, field, expected in checks:
        detail, err = load_local(f"runs/{eid}.json")
        if err:
            t.fail(f"runs/{eid}:loadable", err)
            continue
        actual = detail.get(field)
        t.check(f"runs/{eid}:{field}={expected}", actual == expected,
                ok_msg=f"{field}={actual}", fail_msg=f"expected {expected}, got {actual}")

    # 1.6 external_anchors present where expected
    detail, _ = load_local("runs/toe-test-0056.json")
    if detail:
        has_anchors = bool(detail.get("external_anchors"))
        t.check("runs/toe-test-0056:has_external_anchors", has_anchors,
                ok_msg="Zenodo DOI present")

    detail, _ = load_local("runs/bav-exp-005.json")
    if detail:
        has_anchors = bool(detail.get("external_anchors"))
        t.check("runs/bav-exp-005:has_external_anchors", has_anchors,
                ok_msg="blog link present")

    # 1.7 all detail files have required fields
    print()
    bad = []
    for eid in EXPECTED_IDS:
        d, err = load_local(f"runs/{eid}.json")
        if err:
            bad.append(f"{eid}:not_loadable")
            continue
        missing = RUN_DETAIL_FIELDS - set(d.keys())
        if missing:
            bad.append(f"{eid}:missing {missing}")
    t.check("all_detail_files:required_fields", not bad,
            ok_msg=f"all {len(EXPECTED_IDS)} detail files valid",
            fail_msg="; ".join(bad[:3]))

    # 1.8 cross-reference: detail_url in index matches actual file path
    bad_urls = []
    for run in run_list:
        expected_url = f"{BASE_URL}/api/v1/runs/{run['id']}.json"
        if run.get("detail_url") != expected_url:
            bad_urls.append(run["id"])
    t.check("runs.json:detail_urls_correct", not bad_urls,
            ok_msg="all detail_urls match", fail_msg=f"bad: {bad_urls[:3]}")


# ─── PHASE 2: live HTTP tests ───────────────────────────────────────────────


def phase_live(t):
    print("\n=== Phase 2: Live HTTP tests ===\n")

    live_checks = [
        ("runs.json",              200),
        ("schema.json",            200),
        ("metrics/bav.json",       200),
        ("runs/bav-exp-034.json",  200),
        ("runs/toe-test-0056.json",200),
        ("runs/bsc-bioclaw.json",  200),
        ("runs/bsc-doctobert.json",200),
        ("runs/nonexistent.json",  404),
    ]

    for path, expected_status in live_checks:
        status, body, ct = fetch_live(path)
        if status is None:
            t.fail(f"http:{path}", f"connection error: {body}")
            continue

        t.check(f"http:{path}:status={expected_status}", status == expected_status,
                ok_msg=f"HTTP {status}", fail_msg=f"got HTTP {status}")

        if expected_status == 200 and body:
            try:
                parsed = json.loads(body)
                t.ok(f"http:{path}:valid_json", f"{len(body)} bytes")
            except json.JSONDecodeError:
                t.fail(f"http:{path}:valid_json", "response is not valid JSON")


# ─── main ───────────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--live", action="store_true", help="Run live HTTP tests")
    parser.add_argument("--save", action="store_true", help="Save results to api-test/results.json")
    args = parser.parse_args()

    t = T()
    started = time.time()

    phase_local(t)
    if args.live:
        phase_live(t)
    else:
        print("\n[skipped] Phase 2: run with --live to test HTTP endpoints")

    elapsed = round(time.time() - started, 2)
    print(f"\n{'='*50}")
    print(f"  {t.summary()}")
    print(f"  elapsed: {elapsed}s")
    print(f"{'='*50}")

    if args.save or args.live:
        out = {
            "run_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "elapsed_s": elapsed,
            "summary": t.summary(),
            "passed": t.passed,
            "failed": t.failed,
            "live_tested": args.live,
            "results": t.results,
        }
        out_path = Path(__file__).parent / "results.json"
        out_path.write_text(json.dumps(out, indent=2, ensure_ascii=True), encoding="utf-8")
        print(f"\n  Results saved -> {out_path}")

    sys.exit(0 if t.failed == 0 else 1)


if __name__ == "__main__":
    main()
