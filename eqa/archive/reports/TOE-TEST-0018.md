# TOE-TEST-0018

**Title**: Protein Architecture -> Hamiltonian Coefficient Calibration  
**Date**: 2026-04-02  
**Engine**: Flamehaven-TOE v4.10.0  
**Result**: PASS  
**Grade**: A

## Objective

After TOE-TEST-0017, the protein spin-qubit sidecar already had:

- biological dynamics,
- channel mapping,
- effective Hamiltonian,
- explicit readout operator,
- ODMR witness,
- SPAR review.

The missing piece was calibration. Hamiltonian coefficients still came only
from driver-level dynamics. This step adds a direct protein-architecture layer
so that structural assumptions influence the Hamiltonian and readout
coefficients explicitly.

## Implementation

New module:

- `src/toe/bio_quantum/protein_architecture.py`

It defines:

- `ProteinArchitectureProfile`
- `ProteinArchitectureCalibration`
- `list_architecture_profiles()`
- `get_architecture_profile()`
- `calibrate_architecture(profile)`

Profiles added:

- `engineered_fluorescent_scaffold`
- `cryptochrome_like_fold`
- `minimal_peptide_sensor`

The calibration uses six structural axes:

- chromophore rigidity
- aromatic packing
- radical stability
- solvent exposure
- readout efficiency
- microwave accessibility

and turns them into:

- `frequency_scale`
- `rabi_scale`
- `transverse_scale`
- `readout_gain`
- `decoherence_bias`

These scaling factors are then injected into:

- the effective Hamiltonian
- the readout operator

inside `src/toe/bio_quantum/protein_spin_qubit.py`.

## API / frontend

`POST /api/protein_spin_qubit` now accepts:

- `architecture_profile`

and returns:

- `architecture_profile`
- `architecture_calibration`
- `hamiltonian_model`
- `readout_operator`
- `odmr_witness`

The dashboard biological category now exposes the architecture selector and
shows the resulting calibration values.

## Verification

```bash
python -m pytest -q tests/unit/test_protein_architecture.py tests/unit/test_protein_spin_qubit.py tests/unit/test_bio_sidecar_review.py tests/integration/test_api_e2e.py -k "protein_spin_qubit or protein_architecture or bio_sidecar_review"
```

Observed result:

- `16 passed, 34 deselected`

Observed calibration separation for the Waddington driver:

- `engineered_fluorescent_scaffold`
  - `frequency_scale ≈ 1.230`
  - `readout_gain ≈ 1.252`
  - `decoherence_bias ≈ 0.778`
  - `Rabi ≈ 0.1209 GHz`
- `cryptochrome_like_fold`
  - `frequency_scale ≈ 1.1175`
  - `readout_gain ≈ 1.045`
  - `decoherence_bias ≈ 0.9085`
  - `Rabi ≈ 0.0878 GHz`
- `minimal_peptide_sensor`
  - `frequency_scale ≈ 0.939`
  - `readout_gain ≈ 0.9455`
  - `decoherence_bias ≈ 1.089`
  - `Rabi ≈ 0.0742 GHz`

## Findings

- The bridge is now architecture-sensitive rather than only driver-sensitive.
- Structural assumptions now propagate into the Hamiltonian coefficients and
  readout contrast.
- The strongest default architecture remains the engineered fluorescent
  scaffold, which is consistent with the prior bridge diagnosis that engineered
  protein spin qubits are the strongest currently admissible path.

## Conclusion

TOE-TEST-0018 closes the first explicit calibration layer for the protein
spin-qubit sidecar:

- biological driver
- protein architecture profile
- Hamiltonian/readout calibration
- effective Hamiltonian
- readout operator
- ODMR witness
- SPAR review

This does not yet derive coefficients from experiment. But it does replace a
single generic bridge with a structured, profile-dependent calibration model,
which is the correct next step toward stronger physical plausibility.
