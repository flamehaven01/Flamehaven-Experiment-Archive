# TOE-TEST-0030: Boundary Summarization and Hotspot Extraction

Date: 2026-04-02  
Version: v4.10.0

## Goal

Add a compact interpretation layer on top of the 2D dependency boundary map so
the system can summarize where the current explanation is locally stable and
where it changes sharply.

## Scope

- Add hotspot extraction from boundary-contact counts
- Add stable-island and fragile-strip summaries
- Add an overall `boundary_regime`
- Surface the summary in the frontend biological category

## Result

The 2D boundary map summary now reports:

- `boundary_regime`
- `hotspot_count`
- `stable_island_count`
- `fragile_cell_count`
- `dominant_hotspots`
- `stable_islands`
- `fragile_strip`

This remains a bounded interpretation layer. It is intended to help humans
read the current dependency map; it is not a claim about physical phase
regions.

## Verification

```powershell
python -m pytest -q `
  tests\unit\test_protein_inverse_fit.py `
  tests\integration\test_api_e2e.py `
  -k "protein_inverse_fit"
```

Observed result:

- `9 passed, 42 deselected`

Frontend build:

```powershell
cd dashboard
npm run build
```

Observed result:

- build passed

## Interpretation

`0029` solved `2D target sweep -> dependency boundary map`.  
`0030` solves `2D map -> compact hotspot / stable-island interpretation`.

This makes the boundary map easier to read without promoting it into a stronger
physical claim.
