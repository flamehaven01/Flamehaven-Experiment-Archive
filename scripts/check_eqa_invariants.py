#!/usr/bin/env python3
"""EQA ledger invariant checks (R3.1).

Two schema-scoped gates over the EQA records. Each is conditional on the record's
schema_id, so records on other schemas are skipped, not failed.

QSOT-Harness records (schema ``compliance.qsot_v2.*``):
  R0.1  kd_value == convergence.best_value; best/last recorded
  R0.2  deprecated KD booleans absent; raw_kd_negative_in_optimized_basis present
  R2.1  TTM threshold provenance fields present
  R1.1  every *_verify carries policy_reason_code
  R1.2  every *_verify.physics carries riemann_source; Riemann==Ricci -> labeled copy
  R2.2  every audit review carries coverage_rate_source + semantics
  R3.3  ledger_revision present with run_type/revision/supersedes/provenance_note,
        and supersedes.new hash + reproduction_receipt hash == the artifact's
        canonical-LF SHA-256

QSOT2 math-consistency records (schema ``qsot2.math_consistency.experiment_result.v1``):
  Q2    claim_boundary is exactly the lean 4-field qsot2 boundary (keys + values)
  Q3    governance keys absent (evidence_classes / audit_context / calibration /
        scientific_audit_reviews) -- the lean schema must stay lean
  Q4    checks total + verdict pinned to the recorded run; summary tally consistent
        with the per-check statuses; no FAIL under a non-FAIL verdict
  Q5    reproduction_receipt.output_hash_sha256 == the artifact's canonical-LF SHA-256

Run:  python scripts/check_eqa_invariants.py
Exit: 0 = all satisfied, 1 = one or more violations.
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EQA = ROOT / "eqa"
TOL = 1e-12
QSOT_V2_SCHEMA_PREFIX = "compliance.qsot_v2"

QSOT2_SCHEMA = "qsot2.math_consistency.experiment_result.v1"
QSOT2_CLAIM_BOUNDARY = {
    "external_physical_validation_provided": False,
    "first_principles_derivation_provided": False,
    "mathematical_consistency_scope_only": True,
    "phenomenological_model": True,
}
QSOT2_FORBIDDEN_KEYS = (
    "evidence_classes",
    "audit_context",
    "calibration",
    "scientific_audit_reviews",
)
QSOT2_EXPECTED_CHECK_TOTAL = 35
QSOT2_EXPECTED_VERDICT = "DEGRADED_PASS"


def _canon_lf_sha256(path: Path) -> str:
    """SHA-256 over canonical LF bytes (provenance is anchored to LF, not CRLF)."""
    return hashlib.sha256(path.read_bytes().replace(b"\r\n", b"\n")).hexdigest()


def check_record(rec_dir: Path) -> list:
    """Return a list of violation strings for one toe-test-* record (empty = ok)."""
    errs = []
    vr_path = rec_dir / "verification_result.json"
    if not vr_path.exists():
        return errs
    vr = json.loads(vr_path.read_text(encoding="utf-8"))
    if not str(vr.get("schema_id", "")).startswith(QSOT_V2_SCHEMA_PREFIX):
        return errs  # QSOT-v2 invariants apply only to QSOT-Harness records
    obs = vr.get("observations", {})

    def E(msg):
        errs.append(rec_dir.name + ": " + msg)

    # R0.1 / R0.2 -- KD reporting integrity.
    for key in ("kd_flat", "kd_desitter"):
        kd = obs.get(key)
        if not isinstance(kd, dict):
            continue
        conv = kd.get("convergence", {})
        if "best_value" not in conv:
            E(key + ".convergence.best_value missing (R0.1)")
        elif abs(kd.get("kd_value", 1e9) - conv["best_value"]) > TOL:
            E(key + ".kd_value != convergence.best_value (R0.1)")
        for dep in ("is_negative", "contextuality_proxy"):
            if dep in kd:
                E(key + " carries deprecated field '" + dep + "' (R0.2)")
        if "raw_kd_negative_in_optimized_basis" not in kd:
            E(key + " missing raw_kd_negative_in_optimized_basis (R0.2)")

    # R2.1 -- TTM threshold provenance.
    for key in ("memory_kernel", "memory_kernel_model_trajectory"):
        mk = obs.get(key)
        if isinstance(mk, dict):
            for fld in ("threshold_formula", "threshold_ricci_norm", "threshold_curvature_engaged"):
                if fld not in mk:
                    E(key + "." + fld + " missing (R2.1)")

    # R1.1 / R1.2 -- policy reason + toy-curvature provenance in verify blocks.
    for key, v in obs.items():
        if not (key.endswith("_verify") and isinstance(v, dict)):
            continue
        if "policy_reason_code" not in v:
            E(key + ".policy_reason_code missing (R1.1)")
        phys = v.get("physics", {})
        if "riemann_source" not in phys:
            E(key + ".physics.riemann_source missing (R1.2)")
        rn, rc = phys.get("riemann_norm"), phys.get("ricci_norm")
        if rn is not None and rc is not None and rn > TOL and abs(rn - rc) <= TOL:
            if phys.get("riemann_source") != "copied_from_ricci_proxy":
                E(key + ": riemann==ricci but riemann_source != copied_from_ricci_proxy (R1.2)")

    # R2.2 -- coverage_rate provenance in audit reviews.
    reviews = obs.get("scientific_audit_reviews", {})
    if isinstance(reviews, dict):
        for bg, entry in reviews.items():
            if isinstance(entry, dict) and "coverage_rate" in entry:
                for fld in ("coverage_rate_source", "coverage_rate_semantics"):
                    if fld not in entry:
                        E("scientific_audit_reviews." + bg + "." + fld + " missing (R2.2)")

    # R3.3 -- ledger_revision integrity + hash consistency.
    ar_path = rec_dir / "analysis_result.json"
    actual = _canon_lf_sha256(vr_path)
    if ar_path.exists():
        ar = json.loads(ar_path.read_text(encoding="utf-8"))
        lr = ar.get("ledger_revision")
        if lr is None:
            E("analysis_result.ledger_revision missing (R3.3)")
        else:
            for fld in ("run_type", "revision", "supersedes", "provenance_note"):
                if fld not in lr:
                    E("ledger_revision." + fld + " missing (R3.3)")
            sup = lr.get("supersedes", {})
            for fld in ("previous_output_hash_sha256", "new_output_hash_sha256"):
                if fld not in sup:
                    E("ledger_revision.supersedes." + fld + " missing (R3.3)")
            new_hash = sup.get("new_output_hash_sha256")
            if new_hash and new_hash != actual:
                E("ledger_revision.supersedes.new_output_hash_sha256 != artifact hash " + actual + " (R3.3)")
        rr = ar.get("reproduction_receipt", {})
        if rr.get("output_hash_sha256") and rr["output_hash_sha256"] != actual:
            E("reproduction_receipt.output_hash_sha256 != artifact hash " + actual)
    return errs


def check_qsot2_record(rec_dir: Path) -> list:
    """Return a list of violation strings for one qsot2 math-consistency record."""
    errs = []
    vr_path = rec_dir / "verification_result.json"
    if not vr_path.exists():
        return errs
    vr = json.loads(vr_path.read_text(encoding="utf-8"))
    if vr.get("schema_id") != QSOT2_SCHEMA:
        return errs  # qsot2 invariants apply only to the lean math-consistency schema

    def E(msg):
        errs.append(rec_dir.name + ": " + msg)

    # Q2 -- claim boundary is exactly the lean 4-field qsot2 boundary.
    cb = vr.get("claim_boundary")
    if cb != QSOT2_CLAIM_BOUNDARY:
        E("claim_boundary != lean 4-field qsot2 boundary (Q2): " + json.dumps(cb, sort_keys=True))

    # Q3 -- governance keys must be absent (the lean schema stays lean).
    for k in QSOT2_FORBIDDEN_KEYS:
        if k in vr:
            E("governance key '" + k + "' present in lean schema (Q3)")

    # Q4 -- check total + verdict pinned; summary tally consistent; no stray FAIL.
    checks = vr.get("checks", {})
    if not isinstance(checks, dict):
        E("checks is not a dict (Q4)")
        checks = {}
    if len(checks) != QSOT2_EXPECTED_CHECK_TOTAL:
        E("checks total %d != expected %d (Q4)" % (len(checks), QSOT2_EXPECTED_CHECK_TOTAL))
    if vr.get("verdict") != QSOT2_EXPECTED_VERDICT:
        E("verdict %r != expected %r (Q4)" % (vr.get("verdict"), QSOT2_EXPECTED_VERDICT))
    n_pass = sum(1 for v in checks.values() if v == "PASS")
    n_fail = sum(1 for v in checks.values() if v == "FAIL")
    n_skip = sum(1 for v in checks.values() if v == "SKIPPED")
    n_deg = sum(1 for v in checks.values() if v == "DEGRADED_PASS")
    if n_fail:
        E("FAIL check(s) present under verdict %s (Q4)" % vr.get("verdict"))
    summ = vr.get("summary")
    if isinstance(summ, dict):
        expected = {"total": len(checks), "pass": n_pass, "fail": n_fail,
                    "skipped": n_skip, "degraded_pass": n_deg}
        for fld, exp in expected.items():
            if fld in summ and summ[fld] != exp:
                E("summary.%s %r != actual %d (Q4)" % (fld, summ[fld], exp))

    # Q5 -- reproduction receipt hash consistency.
    ar_path = rec_dir / "analysis_result.json"
    actual = _canon_lf_sha256(vr_path)
    if ar_path.exists():
        ar = json.loads(ar_path.read_text(encoding="utf-8"))
        rh = ar.get("reproduction_receipt", {}).get("output_hash_sha256")
        if not rh:
            E("reproduction_receipt.output_hash_sha256 missing (Q5)")
        elif rh != actual:
            E("reproduction_receipt.output_hash_sha256 != artifact hash " + actual + " (Q5)")
    return errs


def main() -> int:
    records = sorted(p.parent for p in EQA.glob("toe-test-*/verification_result.json"))
    checked = 0
    qsot2_checked = 0
    all_errs = []
    for rec in records:
        vr = json.loads((rec / "verification_result.json").read_text(encoding="utf-8"))
        schema = str(vr.get("schema_id", ""))
        if schema.startswith(QSOT_V2_SCHEMA_PREFIX):
            checked += 1
        elif schema == QSOT2_SCHEMA:
            qsot2_checked += 1
        all_errs.extend(check_record(rec))
        all_errs.extend(check_qsot2_record(rec))

    print("=== EQA invariant check (R3.1) ===")
    print("QSOT-v2 records checked: %d" % checked)
    print("QSOT2 math-consistency records checked: %d" % qsot2_checked)
    if all_errs:
        print("VIOLATIONS: %d" % len(all_errs))
        for e in all_errs:
            print("  - " + e)
        return 1
    print("All invariants satisfied.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
