# TOE-TEST-0024: Coefficient-Level Citation Entries

Date: 2026-04-02  
Version: v4.10.0

## Goal

Refine biological calibration grounding from profile-level citation clusters to
coefficient-level citation entries so each calibration term can be traced to a
bounded support item.

## Scope

- Governance registry: add `CitationEntry` objects
- Protein grounding: attach metric-to-entry mapping inside
  `literature_grounding`
- API exposure:
  - `GET /api/bio_governance_registry`
  - `GET /api/protein_calibration_grounding`
- Regression coverage for governance, architecture calibration, and API

## Result

Implemented coefficient-level citation entries for:

- `engineered_fluorescent_scaffold`
  - `frequency_scale -> scaffold_frequency_scale`
  - `rabi_scale -> scaffold_rabi_scale`
  - `readout_gain -> scaffold_readout_gain`
  - `decoherence_bias -> scaffold_decoherence_bias`
- `cryptochrome_like_fold`
  - `frequency_scale -> cryptochrome_frequency_scale`
  - `transverse_scale -> cryptochrome_transverse_scale`
  - `readout_gain -> cryptochrome_readout_gain`
  - `decoherence_bias -> cryptochrome_decoherence_bias`
- `minimal_peptide_sensor`
  - `frequency_scale -> minimal_frequency_scale`
  - `rabi_scale -> minimal_rabi_scale`
  - `readout_gain -> minimal_readout_gain`
  - `decoherence_bias -> minimal_decoherence_bias`

This keeps the current model explicitly bounded. The entries are still proxy or
stress-test anchors where appropriate; they are not direct experimental
constants.

## Verification

Targeted regression:

```powershell
python -m pytest -q `
  tests\unit\test_bio_governance.py `
  tests\unit\test_protein_architecture.py `
  tests\integration\test_api_e2e.py `
  -k "bio_governance or protein_architecture or protein_calibration_grounding or bio_governance_registry"
```

Observed result:

- `11 passed, 41 deselected`

## Interpretation

`0023` solved `profile -> source family`.  
`0024` solves `coefficient -> bounded citation entry`.

This reduces the risk that architecture coefficients look like free-floating
numbers with only vague provenance.
