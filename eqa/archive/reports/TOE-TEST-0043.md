# TOE-TEST-0043 -- Endpoint-Level Node Selection

Date: 2026-04-02
Engine: Flamehaven-TOE v4.10.0
Scope: Meta verification refinement for heavy API surfaces

## Objective

Reduce the cost of day-to-day delta verification without weakening the release
backstop. The specific problem was that changes in `src/toe/api/routers/physics.py`
or `src/toe/bio_quantum/protein_inverse_fit.py` still pulled
`tests/integration/test_api_e2e.py` as a whole file, which kept orchestrated
delta runs in the multi-minute range.

## Patch

`src/toe/testing/meta_verify.py` was updated so the delta manifest selects
precise pytest node IDs for the heaviest physics/bio-quantum API surfaces.

Bounded node groups were added for:

- Waddington endpoints
- Fisher-ageing endpoints
- Protein spin-qubit / inverse-fit / report endpoints
- Bio governance / evidence / bridge endpoints

The file-level `physics_api` rule now expands into endpoint-level node IDs
instead of selecting `tests/integration/test_api_e2e.py` wholesale.

## Verification

### Unit verification

`PYTHONPATH=src python -m pytest -q tests/unit/test_meta_verify.py tests/unit/test_meta_orchestrate.py`

Result:

- `5 passed`

### Real orchestration check

Change set used:

- `src/toe/api/routers/physics.py`
- `src/toe/bio_quantum/protein_inverse_fit.py`

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

Observed result after the patch:

- selected tests: `40`
- pytest result: `205 passed, 6 deselected in 66.43s`
- post-analysis: `status=ok`, `analysis_mode=lightweight_static`, `quality_grade=B`

## Comparison to previous behavior

Before endpoint-level selection, the same orchestrated flow still retained the
entire `tests/integration/test_api_e2e.py` file via the delta manifest.

Previous observed result:

- pytest result: `233 passed, 6 deselected in 196.92s`

Improvement:

- runtime reduced from about `196.92s` to `66.43s`
- the selected API surface stayed bounded to relevant endpoint nodes

## Interpretation

This patch does not replace full regression or release validation. It narrows
routine delta verification so that the day-to-day loop is governed by affected
surfaces rather than whole heavy integration files.

The release backstop remains:

- full `pytest`
- `--run-slow`
- release-grade suites

## Verdict

`PASS`

The endpoint-level selection rule materially reduces day-to-day verification
cost while preserving explicit coverage of the changed physics/bio-quantum API
surface.
