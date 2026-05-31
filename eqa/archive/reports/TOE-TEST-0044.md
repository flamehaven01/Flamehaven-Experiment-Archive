# TOE-TEST-0044 -- Surface-to-Node Minimization

Date: 2026-04-02
Engine: Flamehaven-TOE v4.10.0
Scope: Meta-verify selector refinement

## Objective

`0043` already moved heavy API verification from whole-file selection to
endpoint-level pytest nodes. The remaining issue was that a broad router change
such as `src/toe/api/routers/physics.py` still pulled the full `physics_api`
node bundle even when the same delta also included a narrower surface like
`protein_inverse_fit`.

The goal of `0044` was to let the selector prefer the narrow surface when both
were present.

## Patch

`src/toe/testing/meta_verify.py` now treats `physics_api` as a broad fallback.
When the same change set also includes any of these narrower surfaces:

- `waddington_sidecar`
- `fisher_ageing_sidecar`
- `protein_inverse_fit`
- `protein_reports`
- `protein_spin_qubit`
- `protein_calibration`
- `bio_governance`

the broad `physics_api` endpoint bundle is suppressed and only the narrow
surface nodes are retained.

## Verification

### Unit verification

`PYTHONPATH=src python -m pytest -q tests/unit/test_meta_verify.py tests/unit/test_meta_orchestrate.py`

Result:

- `6 passed`

### Real delta manifest check

Change set used:

- `src/toe/api/routers/physics.py`
- `src/toe/bio_quantum/protein_inverse_fit.py`

Observed selected set after the patch:

- `30` required tests
- only protein/report endpoint nodes remained from `test_api_e2e.py`
- unrelated Waddington, Fisher, and bio-governance nodes were removed

### Orchestrated run

Command:

```bash
toe-meta \
  --repo-root . \
  --changed-path src/toe/api/routers/physics.py \
  --changed-path src/toe/bio_quantum/protein_inverse_fit.py \
  --orchestrate \
  --post-analyze \
  --format json
```

Observed result:

- selected tests: `30`
- pytest result: `195 passed, 6 deselected in 76.06s`
- post-analysis: `status=ok`, `analysis_mode=lightweight_static`, `quality_grade=B`

## Interpretation

The selector is now narrower and more defensible. A change in the router no
longer automatically forces unrelated endpoint nodes into the delta run if the
same delta already identifies a more precise affected surface.

The runtime did not fall much below the `0043` level because the remaining
selected protein interaction/report nodes are still expensive. In other words:

- selector overreach was reduced
- the next bottleneck is now the heavy node content itself

## Verdict

`PASS`

`0044` successfully reduces broad-surface over-selection and clarifies that the
next optimization target is the heavy interaction/report node family rather than
the selector itself.
