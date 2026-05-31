# TOE-TEST-0020

**Title**: Protein Inverse Fit and Witness Tuning  
**Date**: 2026-04-02  
**Engine**: Flamehaven-TOE v4.10.0  
**Result**: PASS  
**Grade**: A

## Objective

TOE-TEST-0019 established an evidence-aware calibration dataset for the protein
spin-qubit bridge. The next missing layer was inverse use:

- given target `T2*`
- target linewidth
- target dip depth
- target contrast

which driver / protein architecture / admissible tuning combination best
matches the desired ODMR witness?

This step adds that inverse-fit layer.

## Implementation

New module:

- `src/toe/bio_quantum/protein_inverse_fit.py`

The inverse-fit path reuses the existing forward model:

1. choose admissible drivers
2. choose admissible protein architecture profiles
3. sweep a bounded calibration-tuning lattice
4. run the forward protein sidecar
5. compare predicted witness metrics to the target
6. rank candidates by normalized residual objective

New API:

- `POST /api/protein_inverse_fit`

New response surface:

- ranked candidates
- best candidate
- target metrics
- search-space metadata
- SPAR inverse-fit review

## SPAR implication

Biological sidecar SPAR now includes a dedicated inverse-fit review:

- `I1` inverse-fit objective quality
- `I2` witness resolvability
- `I3` calibration evidence support
- `I4` tuning regularity
- `I5` residual ceiling

This means inverse-fit is no longer just an optimization convenience. It is
governed as an admissible or cautionary inference path.

## Verification

```bash
python -m pytest -q tests/unit/test_protein_architecture.py tests/unit/test_protein_spin_qubit.py tests/unit/test_protein_inverse_fit.py tests/unit/test_bio_sidecar_review.py tests/integration/test_api_e2e.py -k "protein_spin_qubit or protein_architecture or protein_inverse_fit or bio_sidecar_review or protein_architecture_profiles"
```

Observed result:

- `23 passed, 34 deselected`

Frontend:

```bash
cd dashboard
npm run build
```

Observed result:

- build passed

## Findings

The inverse-fit layer does what it should:

- exact forward-generated targets are recovered by the same admissible
  `driver/profile` pair
- the default tuning point remains available in the lattice, so the inverse-fit
  does not force unnecessary coefficient distortion
- evidence strength still matters because candidates inherit the underlying
  architecture evidence class

The bridge is now usable in both directions:

- forward: biological state -> channel -> Hamiltonian -> readout -> witness
- inverse: target witness -> ranked architecture / driver / tuning candidates

## Conclusion

TOE-TEST-0020 upgrades the protein bridge from a forward simulator into a
diagnostic inference surface. This is the correct next step before any larger
literature-grounded calibration dataset or architecture-to-readout inverse
problem.
