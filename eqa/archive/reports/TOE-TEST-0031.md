# TOE-TEST-0031: Boundary Compression and Report Export

## Goal

Package the current protein inverse-fit diagnostic stack into a portable review artifact instead of requiring direct inspection of separate inverse-fit, drift-map, and boundary-map payloads.

## Scope

- Add a dedicated API endpoint for compact inverse-fit report packaging
- Export a bounded Markdown report and JSON artifact
- Keep the result outside the main TOE history/export path
- Preserve current scope labeling: diagnostic, not empirical identification

## Implementation

- Added `POST /api/protein_inverse_fit_report`
- Added `ProteinInverseFitReportRequest`
- Added `toe.api.reports.protein_inverse_fit_report(...)`
- Frontend biological category now exposes a portable report action and report preview

## Artifact Contents

- Target witness metrics
- Best candidate summary
- Citation dependency verdict
- Family consistency verdict
- Drift-map summary
- Boundary-map summary
- Compact JSON artifact block
- Explicit scope note

## Verification

```bash
python -m pytest -q tests\integration\test_api_e2e.py -k "protein_inverse_fit"
cd dashboard
npm run build
```

## Result

The current bio-quantum inverse-fit branch now has a portable report layer. This does not add new physical evidence; it compresses the current bounded diagnostic state into a review-friendly artifact.
