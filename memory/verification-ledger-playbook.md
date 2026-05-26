# Master MICA Playbook: Flamehaven Verification Ledger

This playbook governs the operation, maintenance, and verification guidelines for the three lanes of the **Flamehaven Verification Ledger**:
1. **Equation-to-Artifact (EQA)** — Mathematical and physical proof-of-concept verification.
2. **RExSyn Bio Governance** — Biomedical pipeline structure and logic validation.
3. **STEM-BIO-AI** — Code audits and compliance review scans of biological repositories.

---

## 1. Equation-to-Artifact (EQA) Playbook Lane
- **Numerical Audits**: All theoretical models must pass arbitrary-precision checks (minimum 200-bit) using `mpmath`. No float64 assumptions are allowed.
- **Ledger Ingestion**: Run results must be committed to the `eqa/` directory in their unedited, raw form (`analysis_result.json` and `ANT_MANIFEST.json`).
- **Citation Protocol**: Every published EQA card must include verified links to the LaTeX paper source, standard `CITATION.cff` metadata, and an immutable Zenodo DOI registry.

---

## 2. RExSyn Bio Governance Playbook Lane
- **Consensus Checking**: Run multi-model consensus validation (AF3, AF2, Boltz-2, Chai-1) to evaluate biological 3D coordinate folds.
- **Intake Restrictions**: All reasoning solver packets must enter through the `logos_toe_pipeline.py` intake gate, enforcing strict `LawBinder` block/inhibit rules on non-compliant candidates.
- **Adapter Constraints**: Do not import `sentence_transformers` or heavy logic libraries directly into front-end request paths to prevent import-time latency issues. Use FastAPI HTTP routes.

---

## 3. STEM-BIO-AI Playbook Lane
- **Compliance Scans**: Audits must search for clinical hazard surfaces and map outcomes against standard risk repositories.
- **Report Generation**: Scans must generate standalone HTML, Markdown, and JSON results under `stem-bio-ai/[repo]/[date]/`.
- **Portal Integration**: Every card must present circular gauge metrics, stage-by-stage rating bars, and detailed Selection & Evaluation briefs.
