# TOE-TEST-0026: Dependency Confidence and Conflict

Date: 2026-04-02  
Version: v4.10.0

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_dependency_conflict`.
>
> - It adds bounded confidence/conflict scoring to inverse-fit dependency
>   summaries.
> - Exclude it from verification-run counts. This is a governance diagnostic
>   over sidecar inference, not a core-physics verification result.

## Goal

Extend inverse-fit citation dependency disclosure so the result not only lists
dominant entries, but also reports bounded confidence/conflict scores and an
overall dependency verdict.

## Scope

- Add confidence/conflict scoring to inverse-fit dependency summaries
- Aggregate coefficient entries into cluster-level dependency summaries
- Add SPAR `I8` conflict-ceiling check
- Surface dependency verdict and top-cluster confidence/conflict in the
  frontend

## Result

`protein_inverse_fit` best candidates now carry:

- `ranked_entries[*].confidence_score`
- `ranked_entries[*].conflict_score`
- `ranked_entries[*].support_status`
- `cluster_summary[*].confidence_score`
- `cluster_summary[*].conflict_score`
- `cluster_summary[*].verdict`
- `overall_verdict`

This is still a bounded governance heuristic. It is intended to show where the
diagnostic explanation is stable, bounded, or fragile, not to assert a unique
physical derivation.

## Verification

```powershell
python -m pytest -q `
  tests\unit\test_protein_inverse_fit.py `
  tests\integration\test_api_e2e.py `
  -k "protein_inverse_fit"
```

Observed result:

- `5 passed, 42 deselected`

Frontend build:

```powershell
cd dashboard
npm run build
```

Observed result:

- build passed

## Interpretation

`0025` solved `winner -> dominant citation entries`.  
`0026` solves `winner -> how stable or conflicted that dependency bundle is`.

This lowers the risk that an inverse-fit result is read as stronger than its
current support actually warrants.
