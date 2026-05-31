# TOE-TEST-0032: Portable Report Diff Layer

## Goal

Compare two portable protein inverse-fit reports directly instead of inspecting separate report payloads by hand.

## Scope

- Add a dedicated diff endpoint for portable inverse-fit reports
- Summarize best-candidate, dependency, drift, and boundary deltas
- Keep the output bounded and export-friendly

## Implementation

- Added `POST /api/protein_inverse_fit_report_diff`
- Added `ProteinInverseFitReportDiffRequest`
- Added `toe.api.reports.protein_inverse_fit_report_diff(...)`
- Frontend biological category now exposes a compare-reports action

## Diff Artifact

- Best-candidate changed or not
- Dependency verdict changed or not
- Family consistency changed or not
- Boundary regime changed or not
- Boundary / hotspot / stable-island / fragile-cell deltas
- Drift-transition delta

## Verification

```bash
python -m pytest -q tests\integration\test_api_e2e.py -k "protein_inverse_fit"
cd dashboard
npm run build
```

## Result

Portable inverse-fit diagnostics now support compact side-by-side comparison. This remains a bounded explanation diff, not an empirical statement about real protein systems.
