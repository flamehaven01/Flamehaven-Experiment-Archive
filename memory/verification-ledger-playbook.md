# Master MICA Playbook: Flamehaven Verification Ledger

This playbook governs the operation, maintenance, and verification guidelines for the three lanes of the **Flamehaven Verification Ledger**:
1. **Equation-to-Artifact (EQA)** — Mathematical and physical proof-of-concept verification.
2. **Biomolecular AI Validation** — Biomedical coordinate folds consensus and pipeline logic validation.
3. **Bioscience Compliance** — Compliance audits and safety review scans of biological repositories.

---

## 1. Equation-to-Artifact (EQA) Playbook Lane

### 1.0 Gate Verdict Dispatch Protocol

Every EQA run produces one of four gate outcomes. Handle each as follows:

| Verdict | SPAR / Omega Condition | Disposition |
|---|---|---|
| **PASS** | SPAR ≥ 80 AND Omega ≥ 0.85 | Promote to core lane. Publish card with full citation. |
| **GATE REJECTED** | SPAR < 80 OR Omega < 0.75 | Do **not** promote. Log MINOR/MAJOR REVISION verdict. Re-run after documented fixes. |
| **BLOCK / INHIBIT** | Governance gate violation | Halt pipeline. Apply `LawBinder` block rule. No re-promotion without explicit governance sign-off. |
| **OPTIONAL LAYER** | SPAR ≥ 80 but core promotion unmet | Classify as `optional_backend_representation_layer`. Do **not** promote to core. Keep alive in ledger. |

- **Omega bands**: GREEN ≥ 0.85 · AMBER [0.75, 0.85) · RED < 0.75
- **DEGRADED SIDECAR**: Namespace integrity failure — isolate immediately, block dependent pipelines, file follow-up re-verification scan.

---

### 1.1 Raw Data Management

**Directory layout:** Every run lives at `eqa/[run-id]/` from the repo root.

**Required files per run:**

| File | Role | Editability |
|---|---|---|
| `internal_data.json` | Machine-readable scores (SPAR, Omega, SR9, DI2, gate verdict) | ❌ Immutable after commit (DI-EQA-002) |
| `analysis_report.md` | Human-readable run narrative | ✅ Editable prose |
| `*_MANIFEST.json` | Multi-phase experiment control (AEFSO pattern) | ❌ Immutable |
| `*_SPAR_REVIEW_*.md` | Formal SPAR panel review record | ✅ Editable |
| `*_SYNTHESIS.md` | Post-run synthesis / missing-link analysis | ✅ Editable |

**`internal_data.json` canonical shape:**
```json
{
  "trace_id": "toe-test-NNNN",
  "subject": {
    "gate": "PASS | REJECTED | BLOCK | OPTIONAL_LAYER",
    "sidrce_omega": 0.000,
    "sr9_resonance": 0.000,
    "di2_drift": 0.000
  },
  "spar_review": {
    "verdict": "ACCEPT | MINOR REVISION | MAJOR REVISION | REJECT",
    "score": 0,
    "breakdown": {}
  }
}
```

**Score correction rule:** Never edit `internal_data.json` post-commit. If a score is wrong, create a new run with a new run-id and reference the corrected run from the original card.

**Archive boundary:** Runs 0001–0051 are grouped as a single `eqa-archive-0001~0051` card. Do not create individual cards for archival runs unless the run requires standalone citation.

---

### 1.2 Report Authoring & Portal Wiring

**Markdown reports** are fetched via `fetch()` and rendered by `parseMarkdownToHtml()` in `portal.js`. Use plain GitHub-flavored markdown — no custom HTML inside `.md` files (the internal renderer is not a full GFM parser).

**Wiring a new run (4 steps in `portal.js`):**

**Step 1 — Hash routing** in `handleHashNavigation()`:
```js
} else if (hash === 'toe-test-NNNN') {
  activeColl = 'toe';
  openRecordViewer('toe-test-NNNN', ...);
}
```

**Step 2 — jsonPath entry:**
```js
const jsonPath = {
  'toe-test-NNNN': './eqa/toe-test-NNNN/internal_data.json',
  ...
};
```

**Step 3 — Report fetch map:**
```js
const reportPaths = {
  'toe-test-NNNN': './eqa/toe-test-NNNN/analysis_report.md',
  ...
};
```

**Step 4 — Charts + Insights** — add entry in `getChartsForRecord()` and the insights panel switch block.

**Card placement:** Each run gets one `<div id="eqa-card-NNNN">` in `eqa.html` and `index.html`. Cards are ordered **descending by run code** (highest code at top). Archive card is always last.

---

### 1.3 Hardcoding Diagnosis

Scan `portal.js` and card HTML for the following patterns before publishing a new run:

| Value type | Acceptable location | Flag if found here |
|---|---|---|
| Run IDs (`toe-test-NNNN`) | String literals in routing maps | Hardcoded in conditional logic |
| SPAR / Omega scores | Read from `internal_data.json` at runtime | Literal numbers in JS chart logic |
| Threshold constants (0.75, 0.80, 0.85) | Single definition citing a DI | Scattered inline across handlers |
| File paths (`./eqa/...`) | `jsonPath` / `reportPaths` maps | Duplicated across multiple functions |
| Chart axis scales | Derived dynamically from data | Fixed to a specific run's range |

**Threshold provenance rule:** Any numeric threshold in `portal.js` must be traceable to a DI in `archive.json`. If a threshold appears without a DI reference, add the DI first, then introduce the constant.

---

### 1.4 Scientific Credibility & Validity Review

Pre-publish checklist for every EQA card:

- [ ] **Precision** — All computations used `mpmath` ≥ 200-bit. Float64 prohibited (DI-EQA-001).
- [ ] **Gate verdict** — SPAR and Omega satisfy the dispatch table in §1.0 (DI-EQA-003).
- [ ] **Provenance** — `internal_data.json` is unedited run-engine output. No post-hoc score changes (DI-EQA-002).
- [ ] **SPAR breakdown** — Score decomposes into documented sub-criteria. Aggregate-only score is not publishable.
- [ ] **Reproducibility note** — `analysis_report.md` states exact software version, `mpmath` bit-width, and OS environment.
- [ ] **Citation** — PASS runs include: LaTeX source link + `CITATION.cff` + immutable Zenodo DOI.
- [ ] **Optional Layer runs** — Confirm `AEFSO_MANIFEST.json` exists, `toe_scope` field is populated, and the card badge reads `OPTIONAL LAYER` not `PASS`.

---

### 1.5 Insights, Analysis & Charts

**Chart function convention** — every run type implements a `build[Type]Charts(data)` function:
```js
function buildSparCharts(data) {
  // Returns array of chart config objects
  // data = parsed internal_data.json
  return [
    { type: 'bar',    title: 'SPAR Sub-scores', ... },
    { type: 'donut',  title: 'Verdict Summary', ... },
  ];
}
```

**Register in `getChartsForRecord(runId, data)`:**
```js
if (runId === 'toe-test-NNNN') return buildSparCharts(data);
```

**Minimum charts by run type:**

| Run type | Required charts |
|---|---|
| SPAR-evaluated (gate run) | SPAR sub-score bar · Omega gauge or score indicator |
| AEFSO / Optional Layer | Phase progression bar · Verdict donut |
| Archive batch | Aggregate score distribution histogram |

**Insights panel must contain:**
1. One-sentence verdict summary
2. Key metric highlights (Omega band + SPAR score + gate outcome)
3. What the run tested and why it matters
4. External link if applicable (Zenodo, arXiv)

**Chart engine:** `chart-engine.js` — pure SVG, zero dependencies. Available: `bar`, `donut`, `scatter`, `grouped-bar`. Never load external charting CDNs.

---

### 1.6 UX/UI Considerations

**Sidebar ordering:** Descending by run code (highest at top). Archive batch always last in its folder.

**Verdict color tokens:**

| Verdict | Color | Hex |
|---|---|---|
| PASS | Green | `#10b981` |
| OPTIONAL LAYER / AMBER | Amber | `#eab308` |
| REJECTED / RED | Red | `#ef4444` |
| BLOCK / INHIBIT | Blue | `#3b82f6` |
| ARCHIVE / INACTIVE | Grey | `#6b7280` |

**Dot indicators** on `.sb-file` elements must match the card's primary verdict color.

**Inspector tabs** — all 4 must be wired for every run:
`Insights` → `Integrity` → `Verified Rules` → `Raw JSON`
If a tab has no content, render `<p class="empty-state">No data.</p>` — never omit the tab itself.

**Card gate badge:** Display verdict (`PASS`, `REJECTED`, `OPTIONAL LAYER`, `BLOCK`) as a styled badge in the card header using the token colors above.

**Mobile (≤ 768px):** Sidebar is `position: fixed; left: -280px`. Toggle via `.mobile-open` class + `#sb-backdrop` backdrop overlay. The sidebar must not block main content on initial load.

**Tooltips:** Folder-level only (DI-SDK-003). Use `position: fixed` JS engine reading `.sb-tooltip` span content. No file-level tooltips — too granular.

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
