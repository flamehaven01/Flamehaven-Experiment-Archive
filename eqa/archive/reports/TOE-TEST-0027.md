# TOE-TEST-0027: Dependency Family Consistency

Date: 2026-04-02  
Version: v4.10.0

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_dependency_consensus`.
>
> - It adds family-level consensus/stability analysis across inverse-fit
>   candidates.
> - Exclude it from verification-run counts. Its stable value is bounded
>   governance over candidate-family interpretation, not a new EQA run.

## Goal

Extend inverse-fit governance from single-candidate dependency traceability to
top-k family stability analysis.

## Scope

- Add `dependency_family_consistency` to inverse-fit results
- Measure dominant cluster and entry consensus across the current top-k
  candidate family
- Add SPAR `I9` for family-level instability
- Surface family consistency in the frontend biological category

## Result

`protein_inverse_fit` now reports:

- `dependency_family_consistency.top_k`
- `dependency_family_consistency.dominant_cluster_ids`
- `dependency_family_consistency.dominant_entry_ids`
- `dependency_family_consistency.cluster_consensus_ratio`
- `dependency_family_consistency.entry_consensus_ratio`
- `dependency_family_consistency.verdict`

This is a bounded governance summary. It indicates whether the present
diagnostic explanation is stable across the current candidate family, not
whether the underlying biology is uniquely identified.

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

`0026` solved `single winner -> confidence/conflict`.  
`0027` solves `candidate family -> stability/consensus`.

This further reduces the risk that a single good fit is mistaken for a robust
family-level explanation.
