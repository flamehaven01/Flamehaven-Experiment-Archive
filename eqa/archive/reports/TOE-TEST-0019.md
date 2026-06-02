# TOE-TEST-0019

**Title**: Protein Calibration Evidence Dataset  
**Date**: 2026-04-02  
**Engine**: Flamehaven-TOE v4.10.0  
**Result**: PASS  
**Grade**: A

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_evidence_dataset`.
>
> - It adds evidence metadata and ranking structure to protein calibration
>   profiles.
> - Exclude it from verification-run counts. This is an evidence-traceability
>   layer for sidecar calibration, not a new EQA verification run.

## Objective

TOE-TEST-0018 made the protein spin-qubit bridge architecture-sensitive.
The remaining problem was evidentiary traceability: coefficients existed and
varied by architecture, but the reason those profiles existed was not yet
carried as explicit data.

This step adds an evidence-aware calibration dataset so the bridge is now:

- profile-sensitive
- coefficient-sensitive
- evidence-sensitive

## Implementation

New dataset layer in:

- `src/toe/bio_quantum/protein_architecture.py`

Added data structures:

- `ProteinCalibrationEvidence`
- `ProteinArchitectureProfile`
- `ProteinArchitectureCalibration`

Each architecture profile now carries:

- `evidence_level`
- `source_kind`
- `proxy_type`
- `support_summary`
- `confidence`

Current profiles:

1. `engineered_fluorescent_scaffold`
2. `cryptochrome_like_fold`
3. `minimal_peptide_sensor`

The API now exposes:

- `GET /api/protein_architecture_profiles`

which returns:

- `profile`
- `calibration`

for each architecture entry.

## SPAR implication

Protein-sidecar SPAR now includes:

- `P6 calibration evidence quality`

This means the biological SPAR layer is no longer only checking whether a
Hamiltonian/readout exists. It also checks whether the calibration path is
supported by stronger or weaker evidence classes.

## Verification

```bash
python -m pytest -q tests/unit/test_protein_architecture.py tests/unit/test_protein_spin_qubit.py tests/unit/test_bio_sidecar_review.py tests/integration/test_api_e2e.py -k "protein_spin_qubit or protein_architecture or bio_sidecar_review or protein_architecture_profiles"
```

Observed result:

- `17 passed, 34 deselected`

Frontend:

```bash
cd dashboard
npm run build
```

Observed result:

- build passed

## Findings

The calibration dataset now exposes a meaningful ordering:

- `engineered_fluorescent_scaffold`
  - strongest evidence class
  - strongest readout gain
  - lowest decoherence bias
- `cryptochrome_like_fold`
  - plausible mechanistic proxy
  - intermediate coefficients
- `minimal_peptide_sensor`
  - adverse/stress baseline
  - weakest readout gain
  - highest decoherence bias

This matches the qualitative bridge diagnosis already present in earlier
TOE-TEST entries: engineered protein spin-qubit architectures remain the
strongest currently admissible path.

## Conclusion

TOE-TEST-0019 turns the protein bridge into an evidence-aware calibration
system:

- architecture profile
- evidence metadata
- derived calibration coefficients
- Hamiltonian/readout model
- ODMR witness
- SPAR evidence-quality review

This is the correct next step before any inverse-fit or literature-grounded
coefficient tuning phase.
