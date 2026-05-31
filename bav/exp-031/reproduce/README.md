# EXP-031 — independent re-run scaffold

This folder lets a third party **re-run the structural layer** of EXP-031 on public
tools and compare against what we recorded. It is **re-runnable, not bit-exact**:
AlphaFold3 / AF2 / Chai-1 / Boltz-2 are non-deterministic across model version,
hardware (GPU/CPU, CUDA), MSA depth and seed, so a re-fold will **not** match our
numbers exactly. Compare the confidence *regime*, not the digits.

## Files
- `input.fasta` — the verbatim 52-aa input sequence (all three arms share it).
- `models.json` — which predictors/validators each arm ran, the recorded adapter
  versions, the shared random seed, and the AF3 model version.
- `reference_run.json` — the values **we recorded** (AF2 pLDDT/pTM/PAE for arm A,
  AF3 pTM/ranking, and pipeline-level pLDDT/drift per arm) plus each arm's
  determinism signature. Labelled a *reference run*, not a fixed expected output.

## Inputs (verbatim)
- Sequence: `input.fasta` (SHA-256 recorded in `reference_run.json` / `models.json`).
- Ligand: aspirin, SMILES `CC(=O)OC1=CC=CC=C1C(=O)O`.
- Shared random seed: `20260208`.

## Re-fold on public tools
1. Fold `input.fasta` with a public predictor — e.g. ColabFold (AF2) or the
   AlphaFold3 server (`https://alphafoldserver.com`). Optionally add the ligand.
2. Read the predictor's own confidence outputs: per-residue **pLDDT**, **PAE**,
   global **pTM**.
3. Compare to `reference_run.json` at the **regime** level:
   - global confidence is **low** (pTM well below 0.5);
   - the N-terminal stretch behaves like a disordered signal-peptide region;
   - PAE is high off-diagonal (little confident inter-residue geometry).
   A re-run within that regime corroborates the recorded structural layer even
   though exact pLDDT/PAE values differ.

## What this does and does not show
- **External, checkable**: pLDDT / PAE / pTM are AlphaFold metrics (DeepMind/EBI
  definitions). This scaffold exercises that externally-owned layer independently
  of any Flamehaven metric.
- **Internal, advisory**: SR9 / DI2 / `final_drift` and the trinity consensus are
  Flamehaven heuristics. They are **not** part of this external check and are not
  reproduced here; they are shown elsewhere only as advisory signals.

## Other EXP runs
Only EXP-031 ships a re-run scaffold: it is the only experiment whose payload
contains a foldable input sequence plus external structural metrics. EXP-005 /
028 / 032 / 033 / 034 are governance / honesty / methodology experiments with no
protein-folding input to re-run, so no scaffold is provided for them (rather than
a fabricated one).
