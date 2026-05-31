# TOE-TEST-0029: 2D Dependency Boundary Map

Date: 2026-04-02  
Version: v4.10.0

## Goal

Extend inverse-fit target-space diagnostics from 1D drift maps to 2D boundary
maps.

## Scope

- Add `sweep_protein_inverse_fit_target_plane()`
- Add `POST /api/protein_inverse_fit_boundary_map`
- Return 2D grid points, extracted boundaries, and summary metadata
- Expose a minimal boundary-map runner in the frontend biological category

## Result

The 2D boundary map now reports:

- per-cell best driver/profile
- dominant entry
- dominant cluster
- family verdict
- extracted boundary transitions between neighboring cells

This is still a bounded inverse-fit governance diagnostic. It is not an
empirical phase boundary for real protein hardware.

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

`0028` solved `1D target sweep -> drift map`.  
`0029` solves `2D target sweep -> dependency boundary map`.

This makes it easier to see not only when the explanation changes, but where
those changes concentrate across a small target plane.
