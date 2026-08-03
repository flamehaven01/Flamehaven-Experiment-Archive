#!/usr/bin/env python3
"""Freeze the bounded Missing Link characterization dogfood record.

This is deliberately a *configuration-contract* experiment, not a benchmark of
general LLM abduction.  It executes the upstream characterization test and
serializes the measured before-image together with enough source provenance to
make its limits inspectable.

Example (from a checkout of this ledger):
  python eqa/toe-test-0060/run_dogfood.py \
    --logos-root <logos-checkout> --paper-source <paper-text-copy>
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent
TEST_REL = Path("tests/characterization/test_char_missing_link_accept.py")
BASELINE_REL = Path("docs/characterization_baseline.json")
CONFIG_REL = Path("config/default.yaml")
RUNNER_REL = Path("missing_link/runner.py")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def git_value(root: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", *args], cwd=root, text=True, capture_output=True, check=True
    )
    return result.stdout.strip()


def write_json(path: Path, value: dict[str, Any]) -> None:
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--logos-root", type=Path, required=True)
    parser.add_argument("--paper-source", type=Path, required=True)
    parser.add_argument("--out-dir", type=Path, default=ROOT)
    args = parser.parse_args()

    logos_root = args.logos_root.resolve()
    paper_source = args.paper_source.resolve()
    out_dir = args.out_dir.resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    required = [logos_root / TEST_REL, logos_root / BASELINE_REL,
                logos_root / CONFIG_REL, logos_root / RUNNER_REL, paper_source]
    missing = [str(p) for p in required if not p.is_file()]
    if missing:
        parser.error("required input missing: " + ", ".join(missing))

    command = [sys.executable, "-m", "pytest", str(TEST_REL), "-q"]
    test_run = subprocess.run(command, cwd=logos_root, text=True, capture_output=True)
    if test_run.returncode != 0:
        sys.stderr.write(test_run.stdout + test_run.stderr)
        return test_run.returncode

    baseline = json.loads((logos_root / BASELINE_REL).read_text(encoding="utf-8"))
    char011 = baseline["observations"]["CHAR-011"]["measured"]
    char012 = baseline["observations"]["CHAR-012"]["measured"]
    if char011["candidates_accepted"] != 0 or char012["feasible_region"] != "empty":
        raise RuntimeError("characterization no longer matches the declared before-image")

    passed_match = re.search(r"(\d+)\s+passed", test_run.stdout)
    if not passed_match:
        raise RuntimeError("pytest completed but did not report a passed-test count")
    dirty_entries = [line for line in git_value(logos_root, "status", "--porcelain").splitlines() if line]
    result: dict[str, Any] = {
        "schema_id": "flamehaven.eqa.missing_link_dogfood.v1",
        "experiment_id": "toe-test-0060",
        "run_type": "non_run_artifact",
        "artifact_class": "executable_acceptance_contract_audit",
        "verdict": "ABSTAIN",
        "verdict_label": "Abstain — configuration defect reproduced",
        "claim_boundary": {
            "configuration_contract_reproduced": True,
            "general_llm_abduction_capability_claimed": False,
            "biomedical_discovery_claimed": False,
            "paper_thesis_proven": False,
            "world_model_necessity_or_sufficiency_claimed": False,
        },
        "source_snapshot": {
            "logos_git_head": git_value(logos_root, "rev-parse", "HEAD"),
            "logos_worktree_clean": len(dirty_entries) == 0,
            "logos_dirty_path_entries": len(dirty_entries),
            "source_paths_are_labels_only": True,
        },
        "executed_check": {
            "command": "python -m pytest tests/characterization/test_char_missing_link_accept.py -q",
            "exit_code": test_run.returncode,
            "characterization_assertions_passed": True,
            "assertions_passed_count": int(passed_match.group(1)),
            "stdout_summary": f"{passed_match.group(1)} passed",
        },
        "source_hashes": {
            "dogfood_runner_sha256": sha256(Path(__file__)),
            "paper_text_copy_sha256": sha256(paper_source),
            "characterization_baseline_json_sha256": sha256(logos_root / BASELINE_REL),
            "characterization_test_sha256": sha256(logos_root / TEST_REL),
            "default_config_sha256": sha256(logos_root / CONFIG_REL),
            "missing_link_runner_sha256": sha256(logos_root / RUNNER_REL),
        },
        "observations": {
            "char_011": char011,
            "char_012": char012,
        },
        "interpretation": {
            "what_the_execution_shows": "The shipped characterization contract reproduces a 0-acceptance before-image and a biomedical threshold collision under this source snapshot.",
            "why_verdict_is_abstain": "The source worktree is not a clean public release, and this contract probe does not evaluate general LLM abductive ability or scientific discovery quality.",
            "remediation_measurement_rule": "A repair must update the characterization contract and publish an after-image that attributes movement separately for grounding, omega, and candidate novelty.",
        },
        "limitations": [
            "The paper is represented by a content hash of a local text copy, not a public archival anchor.",
            "This record reproduces a repository configuration and test contract; it is not an independent replication.",
            "Passing the characterization test confirms the recorded defect before-image, not an accepted hypothesis or a model capability result.",
        ],
    }
    result_path = out_dir / "verification_result.json"
    write_json(result_path, result)
    receipt = {
        "schema_id": "flamehaven.eqa.reproduction_receipt.v1",
        "experiment_id": "toe-test-0060",
        "result_path": "verification_result.json",
        "result_sha256": sha256(result_path),
        "replay_command": "python eqa/toe-test-0060/run_dogfood.py --logos-root <logos-checkout> --paper-source <paper-text-copy>",
        "upstream_test_command": result["executed_check"]["command"],
        "source_revision": result["source_snapshot"]["logos_git_head"],
        "source_worktree_clean": result["source_snapshot"]["logos_worktree_clean"],
        "reproducibility_status": "source-identifiable but not bit-reproducible from a clean public release",
    }
    write_json(out_dir / "reproduction_receipt.json", receipt)
    print(f"wrote {result_path.name} and reproduction_receipt.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
