# Master MICA Playbook: Flamehaven Verification Ledger

This playbook governs the operation, maintenance, and verification guidelines for the three lanes of the **Flamehaven Verification Ledger**:
1. **Equation-to-Artifact (EQA)** — Mathematical and physical proof-of-concept verification.
2. **Biomolecular AI Validation** — Biomedical coordinate folds consensus and pipeline logic validation.
3. **Bioscience Compliance** — Compliance audits and safety review scans of biological repositories.

---

## 1. Equation-to-Artifact (EQA) Playbook Lane
- **Numerical Audits**: All theoretical models must pass arbitrary-precision checks (minimum 200-bit) using `mpmath`. No float64 assumptions are allowed.
- **Ledger Ingestion**: Run results must be committed to the `eqa/` directory in their unedited, raw form (`analysis_result.json` and `ANT_MANIFEST.json`).
- **Citation Protocol**: Every published EQA card must include verified links to the LaTeX paper source, standard `CITATION.cff` metadata, and an immutable Zenodo DOI registry.

### EQA Gate Verdict Dispatch Protocol

Every EQA run produces one of four gate outcomes. Handle each as follows:

| Verdict | SPAR / Omega Condition | Disposition |
|---|---|---|
| **PASS** | SPAR ≥ 80 AND Omega ≥ 0.85 | Promote to core lane. Publish card with full citation. |
| **GATE REJECTED** | SPAR < 80 OR Omega < 0.75 | Do **not** promote. Log MINOR/MAJOR REVISION verdict. Re-run after documented fixes. |
| **BLOCK / INHIBIT** | Governance gate violation | Halt pipeline. Apply `LawBinder` block rule. No re-promotion without explicit governance sign-off. |
| **OPTIONAL LAYER** | SPAR ≥ 80 but insufficient for core | Classify as `optional_backend_representation_layer`. Publish card with AEFSO-pattern label. Do **not** promote to core. Keep alive in ledger. |

- **Omega bands**: GREEN ≥ 0.85 · AMBER [0.75, 0.85) · RED < 0.75
- **DEGRADED SIDECAR**: Namespace integrity failure — isolate immediately, block dependent pipelines, file a follow-up re-verification scan before any output is consumed.

---

## 2. Biomolecular AI Validation Playbook Lane
- **Consensus Checking**: Run multi-model consensus validation (AF3, AF2, Boltz-2, Chai-1) to evaluate biological 3D coordinate folds.
- **Intake Restrictions**: All reasoning solver packets must enter through the `logos_toe_pipeline.py` intake gate, enforcing strict `LawBinder` block/inhibit rules on non-compliant candidates.
- **Adapter Constraints**: Do not import `sentence_transformers` or heavy logic libraries directly into front-end request paths to prevent import-time latency issues. Use FastAPI HTTP routes.

---

## 3. Bioscience Compliance Playbook Lane
- **Compliance Scans**: Audits must search for clinical hazard surfaces and map outcomes against standard risk repositories.
- **Report Generation**: Scans must generate standalone HTML, Markdown, and JSON results under `stem-bio-ai/[repo]/[date]/`.
- **Portal Integration**: Every card must present circular gauge metrics, stage-by-stage rating bars, and detailed Selection & Evaluation briefs.

---

## 4. Verification UI/UX SDK & Toolkit Guidelines
Any future visualization, dynamic sandbox, 3D consensus coordinate display, or telemetry parser in EQA, BIV, or BRC must align with the **Flamehaven Verification UI/UX SDK**:
- **Visual Tokens**: Always utilize pre-defined visual tokens (gradients, forest green for PASS, amber for WARN, serious red for FAIL) rather than raw generic primary colors.
- **Steerable comparative sandboxes**: Place the naive baseline/unmapped panel on the left (Red Accent) and the steered/compliant lock panel on the right (Purple Accent) to display the dynamic comparative effect of governance controls.
- **Interactive JSON Inspector**: All telemetry JSON datasets must be bridged to the tabbed Ledger Inspector (Insights, Integrity, Verified Rules, Raw JSON) without modifying raw files.
- **3D Coordinate Helices (Three.js / Zero-Dependency Canvas)**: Use 3D coordinate particle scenes for displaying molecular backbones or geometric lattices dynamically. If external scripts or CDNs are blocked by local containment policies, strictly employ the **Zero-Dependency 3D Projection Canvas** fallback (utilizing pure HTML5 canvas and 3D-to-2D projection math) to prevent runtime network exploits.
- **Frequency Graphs (Plotly)**: Render feature distributions, error profiles, or risk frequencies cleanly with Plotly in dark mode layouts.
- **Global Scope Protection**: Any JS event handler or interactive UI function called inline from the HTML markup must be explicitly bound to the global `window` object in `js/portal.js`. This guarantees that inline handler execution remains immune to module scoping restrictions and deferred loading policies.
- **Strict HTML Tag Balancing**: All custom dashboard layouts, ledger lists, and structural container blocks must maintain balanced start and end tags. A missing closing element can compromise downstream browser DOM tree parsing, which may inadvertently nest unrelated dashboards inside hidden containers and cause rendering failure.
- **Fixed-Position Tooltips**: Sidebar tooltip overlays must be injected into `document.body` and positioned via `position: fixed` + JS `clientX/clientY` coordinates. CSS `position: absolute` tooltips are silently clipped by the sidebar's `overflow: hidden` scroll context and will not render.
