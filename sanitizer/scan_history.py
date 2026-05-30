#!/usr/bin/env python3
"""Scan-history ledger + calibration for the Flamehaven Ledger Sanitizer.

Mirrors the AI-SLOP-DETECTOR history/self-calibration idea in a git-friendly
form: every run appends one JSON line to scan_history.jsonl; calibration.json
is then derived from the accumulated history (per-rule frequency, recurring
files, and false-positive candidates that a human can promote to the config
allowlist).
"""
from __future__ import annotations

import json
import time
from collections import Counter, defaultdict
from pathlib import Path
from typing import Dict, List

HISTORY = "scan_history.jsonl"
CALIBRATION = "calibration.json"


def record_run(base: Path, mode: str, results: List[dict]) -> None:
    """Append one run summary to the JSONL history ledger."""
    by_rule: Counter = Counter()
    for r in results:
        for rid, n in r.get("rule_counts", {}).items():
            by_rule[rid] += n
    entry = {
        "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "mode": mode,
        "files_with_findings": len(results),
        "total_findings": int(sum(by_rule.values())),
        "by_rule": dict(by_rule),
        "files": [{"path": r["file"], "rule_counts": r["rule_counts"]} for r in results],
    }
    with (base / HISTORY).open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(entry, ensure_ascii=False) + "\n")


def calibrate(base: Path) -> dict:
    """Derive calibration.json from accumulated scan history."""
    hist_path = base / HISTORY
    runs: List[dict] = []
    if hist_path.exists():
        for line in hist_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line:
                try:
                    runs.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    rule_totals: Counter = Counter()
    file_hits: Counter = defaultdict(int)
    for run in runs:
        for rid, n in run.get("by_rule", {}).items():
            rule_totals[rid] += n
        for f in run.get("files", []):
            file_hits[f["path"]] += 1
    # Recurring files: appear in many runs -> chronic exposure or stable FP source.
    recurring = sorted(
        ({"path": p, "runs_present": c} for p, c in file_hits.items() if c >= 2),
        key=lambda d: -d["runs_present"],
    )
    cal = {
        "schema": "flamehaven_sanitizer_calibration.v1",
        "runs_recorded": len(runs),
        "rule_totals": dict(rule_totals),
        "recurring_files": recurring[:50],
        "last_run": runs[-1]["ts"] if runs else None,
        "note": "Derived from scan_history.jsonl. recurring_files flag chronic "
                "exposure (fix the source) or stable false positives (consider "
                "an allowlist entry after human review).",
    }
    (base / CALIBRATION).write_text(
        json.dumps(cal, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return cal
