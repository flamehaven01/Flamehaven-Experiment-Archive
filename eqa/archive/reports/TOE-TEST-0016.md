# TOE-TEST-0016

**Title**: Protein ODMR / Decoherence Witness Refinement  
**Date**: 2026-04-02  
**Engine**: Flamehaven-TOE v4.10.0  
**Result**: PASS  
**Grade**: A

## Objective

TOE-TEST-0015 established the first executable biological-to-quantum bridge:

- biological sidecar trajectory,
- channel map,
- qubit evolution,
- result-aware SPAR.

The next step was to make the readout more physical. This test upgrades the
protein spin-qubit sidecar from a generic contrast report to an ODMR /
decoherence witness with explicit spectral observables.

## Changes

### 1. Witness model

`src/toe/bio_quantum/protein_spin_qubit.py` now derives:

- effective `T2*` from coherence decay,
- ODMR linewidth (`HWHM`, `FWHM`),
- detuning sweep around a configurable center frequency,
- dip depth,
- decoherence area,
- witness verdict: `resolved`, `marginal`, or `weak`.

The witness is not a full NV-center simulator. It is a bounded, explicit
readout surrogate that turns biological channel modulation into observables
that resemble ODMR-style diagnostics.

### 2. API surface

`POST /api/protein_spin_qubit` now accepts:

- `base_frequency_ghz`
- `detuning_span_ghz`
- `detuning_points`

and returns a nested `odmr_witness` block with the fields above.

### 3. SPAR alignment

`run_bio_sidecar_review("protein_spin_qubit", result)` now includes:

- `P4`: ODMR witness resolution

This means the biological SPAR layer is no longer only checking:

- monotonic decoherence,
- contrast bounds,
- driver-map presence

but also whether a physically interpretable readout witness was actually
produced.

## Mathematical interpretation

The witness logic is:

1. estimate `T2*` from the log-slope of normalized coherence decay,
2. translate `T2*` into linewidth via `FWHM ~ 1 / (pi T2*)`,
3. synthesize a Lorentzian dip over a detuning window,
4. measure dip depth and integrated decoherence area.

This does not claim a complete condensed-matter spin Hamiltonian. It provides a
controlled intermediate layer between:

- abstract noise-channel evolution
- and an experimentally legible spectral readout.

That is a stronger bridge than the v0015 contrast-only surface.

## Verification

Targeted regression:

```bash
python -m pytest -q tests/unit/test_protein_spin_qubit.py tests/unit/test_bio_sidecar_review.py tests/integration/test_api_e2e.py -k "protein_spin_qubit or bio_sidecar_review"
```

Observed result:

- `11 passed, 34 deselected`

Frontend:

```bash
cd dashboard
npm run build
```

Observed result:

- build passed

## Findings

- The bridge is now stronger because the output is no longer just "noise got
  worse"; it is a structured witness with linewidth and dip geometry.
- The remaining gap is still larger-scale biology-to-readout calibration.
  The witness is explicit, but it is still a surrogate model rather than a
  protein-specific Hamiltonian derived from experiment.
- This is nevertheless a meaningful advance because it turns the bio-quantum
  bridge into something closer to an instrument model.

## Conclusion

TOE-TEST-0016 upgrades the first bio-quantum bridge from channel-level
plausibility to readout-level plausibility.

The resulting chain is now:

- biological dynamics
- channel mapping
- qubit evolution
- ODMR / decoherence witness
- result-aware SPAR
- API + frontend exposure

This remains a sidecar, not a core string-vacuum theorem. But it is a cleaner
and more physical bridge than the previous iteration.
