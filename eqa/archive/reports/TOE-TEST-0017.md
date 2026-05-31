# TOE-TEST-0017

**Title**: Protein-Specific Hamiltonian + Readout Operator Model  
**Date**: 2026-04-02  
**Engine**: Flamehaven-TOE v4.10.0  
**Result**: PASS  
**Grade**: A

## Objective

TOE-TEST-0016 upgraded the bio-quantum bridge to an ODMR / decoherence witness.
This step goes further: the witness is no longer generated from a generic
surrogate dip alone, but from an explicit protein-side effective Hamiltonian
and an explicit readout operator.

The goal is not a protein-chemistry complete model. The goal is to replace a
purely heuristic spectral surface with:

1. a direct effective Hamiltonian,
2. a direct readout operator,
3. driven qubit evolution over detuning,
4. spectral observables derived from that evolution.

## Implementation

`src/toe/bio_quantum/protein_spin_qubit.py` now constructs:

### Effective Hamiltonian

`H_eff = 0.5 * (Δ σ_z + Ω_R σ_x + λ_bio σ_y)`

where:

- `Δ` is detuning around the biologically shifted center frequency,
- `Ω_R` is an effective Rabi frequency,
- `λ_bio` is a biological transverse coupling term.

The returned `hamiltonian_model` includes:

- `zero_field_splitting_ghz`
- `biological_shift_ghz`
- `rabi_frequency_ghz`
- `transverse_coupling_ghz`
- `drive_time_ns`

### Readout operator

A diagonal fluorescence-style readout operator is constructed:

`M_readout = diag(bright_level, dark_level)`

This converts the driven density matrix into a scalar readout signal through
`signal = Tr(M_readout rho_detuned)`.

The returned `readout_operator` includes:

- `bright_level`
- `dark_level`
- `contrast_scale`
- `operator_matrix`

### Driven detuning sweep

For each detuning point:

1. build `U(detuning) = exp(-i 2π H_eff t_drive)`,
2. evolve the biologically decohered qubit,
3. evaluate the readout operator,
4. collect the spectral signal.

The ODMR witness is then extracted from the resulting signal curve rather than
injected as an external Lorentzian.

## SPAR impact

`run_bio_sidecar_review("protein_spin_qubit", result)` now checks:

- `P1` decoherence monotonicity
- `P2` ODMR contrast bounds
- `P3` biological driver map
- `P4` ODMR witness resolution
- `P5` explicit Hamiltonian/readout model presence

This is a stronger bridge than prior stages because the sidecar now exposes
the internal measurement model to governance.

## Observed behavior

Default runs currently produce explicit Hamiltonian and readout models but a
mostly **weak** ODMR witness.

This is not treated as a failure. It means:

- the mathematical bridge now exists explicitly,
- but the default biological driver strengths do not yet yield a strong
  experimentally legible spectral dip.

This is the correct result to record. It identifies the next calibration gap:

> mapping real protein architecture and environmental structure into Hamiltonian
> coefficients strong enough to produce a resolved readout.

## Verification

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

## Conclusion

TOE-TEST-0017 closes a major modeling step:

- channel map only  -> not enough
- witness only      -> better
- Hamiltonian + readout + witness -> stronger, inspectable bridge

The protein path is now no longer just "biological noise affects a qubit."
It is:

- biological dynamics
- channel modulation
- effective Hamiltonian
- explicit readout operator
- detuning sweep
- witness extraction
- SPAR review

The remaining missing link is not structural anymore. It is calibration:
how to derive stronger protein-specific Hamiltonian coefficients from real
biological architecture.
