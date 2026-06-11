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

**Archive boundary:** Runs 0001–0051 are grouped as a single `eqa-card-archive` card backed by `eqa/archive/manifest.json` (real TOE-TEST reports imported verbatim, paths sanitized). Do not create individual cards for archival runs unless the run requires standalone citation. The archive is **data-driven only** — never re-introduce procedurally generated ("synthetic") run data; the sanitizer `synthetic_marker` detector and CI gate enforce this.

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

### 2.1 BAV Ledger Cards (thesis: model disagreement is signal; the pipeline's job is honest governance)

BAV governs the RExSyn + NNSL pipeline, **not** drug discovery. Five live cards + an archive, all data-driven (DI-BAV-001..004):

| Card | Theme | Data source (`bav/`) | Note |
|---|---|---|---|
| EXP-028 | Honesty test (calibrated yet honestly abstains) | `exp-028/post_overlay_report.json` | honesty-test |
| EXP-031 | Multi-model disagreement / drift → KEEP_OBSERVER | `exp-031/arm-{a,b,c}` + real AF2/AF3 | Eureka |
| EXP-032 | Adaptive gate (legacy-replay anchor, PASS/BLOCK) | `exp-032/` (6 payloads + benchmark + go_no_go) | Trinity P1 |
| EXP-033 | Pipeline-level p_e2e chain | `exp-033/governance_multiaxis.json` | EXP-033 |
| EXP-034 | Path separation (GO vs HOLD) | `exp-034/` (multiaxis + stage_gate + benchmark) | EXP-034 |
| archive | EXP-001~030 foundational (expandable summaries) | `bav/archive/manifest.json` | (close-only) |

**Inspector tabs (all 5 populated, DI-BAV-003):** Insights → Analysis (zero-dep bio charts: pae-heatmap, contact-map, plddt-track, drift grouped-bar) → Integrity (provenance: mode, guard SR9>=0.70/DI2<=0.30, Go/No-Go, SHA-256) → Verified Rules (governance gate fail/go) → Live Report (expert markdown generated from payload) → Raw JSON.

**Canonical-path rule:** EXP-032 uses the **legacy-replay** parity anchor (the only accepted path, EXP-034); the diagnostic current-regeneration path is never shown as accepted. Card order is recent-first (EXP-034 → 028) with archive last; Inspect icon is the magnifying glass for lane consistency.

---

## 3. Bioscience Compliance Playbook Lane
- **Compliance Scans**: Audits must search for clinical hazard surfaces and map outcomes against standard risk repositories.
- **Report Generation**: Scans must generate standalone HTML, Markdown, and JSON results under `stem-bio-ai/[repo]/[date]/`.
- **Portal Integration**: Every card must present circular gauge metrics, stage-by-stage rating bars, and detailed Selection & Evaluation briefs.

### 3.1 Regulatory Reference Registry

**Source of truth:** `STEM-BIO-AI/docs/regulatory_basis_registry.v1.json` — auto-generated by `STEM-BIO-AI/tools/update_regulatory_registry.py`. Do not edit the JSON manually.

**Active frameworks** (as of Jun 2026):

| ID | Display label | Source |
|---|---|---|
| `eu_ai_act_2024_1689` | EU AI Act (Regulation (EU) 2024/1689) | `STEM-BIO-AI/references/_registry_entries/` |
| `fda_qmsr` | FDA QMSR | same |
| `fda_mlmd_transparency_2024` | FDA ML-MD Transparency (2024) | same |
| `fda_pccp_2025` | FDA PCCP (2025) | same |
| `imdrf_samd_clinical_eval_2017` | IMDRF SaMD Clinical Eval (2017) | same |
| `imdrf_gmlp_2025` | IMDRF GMLP (2025) | same |
| `ich_m15_midd_2026` | **ICH M15 MIDD (Step 4, Jan 2026)** | `STEM-BIO-AI/references/M15 General Principles...md` |

> **Step vs Sep rule:** ICH adoption milestones must be written **"Step 4, Jan 2026"** — not "Step 4" alone — to prevent misreading as "Sep 4" (September 4). This is enforced via `display_label` in the YAML entry.

**Regulatory update workflow (cross-repo):**

```
1. Convert PDF → MD                STEM-BIO-AI/references/<id>.md       (user)
2. Create/update YAML              STEM-BIO-AI/references/_registry_entries/<id>.yaml
3. Run update script               python STEM-BIO-AI/tools/update_regulatory_registry.py
4. If new requirement_id needed    update STEM-BIO-AI/stem_ai/regulatory_traceability.py
5. Re-run BSC scanner              reports in flamehaven-audit-reports/stem-bio-ai/ auto-update
```

**Deprecation:** set `status: superseded` + `superseded_by: <new_id>` in the YAML. Never delete — old reports reference the ID. Re-run the script.

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
- **Social Share Frame Pattern (DI-SDK-004)**: Social share buttons (FB / LI / X / Email / Copy Link) must be placed in the portal viewer frame header and footer — never embedded inside individual HTML report files. This applies universally to all reports without requiring per-file modification. Individual report HTMLs must not contain `fh-brand-bar` or equivalent share UI.

### 4.1 Archive Inspectability (data-driven, both lanes)
- A single function `renderArchiveInspector(runId, d, panels)` serves **both** archives, routed by run-id prefix: `bav-arch-<id>` (lane `bav`) and `eqa-arch-<id>` (lane `eqa`). It reads the manifest entry, fetches the verbatim report (`report_path` at top level or under `metrics`), and renders it **inline in the Insights panel** so the actual content is visible, not a filename.
- **BAV** archive rows are expandable / inspector-linked only when real data exists (an SR9 metric or a showable report); data-less rows render dimmed as `no record`. Reports live in `bav/archive/reports/` (sanitized).
- **EQA** archive rows are populated by `renderEqaArchive()` from `eqa/archive/manifest.json`, ordered most-recent first; each shows the real run date / grade (only where the source states them) and opens the verbatim `eqa/archive/reports/TOE-TEST-NNNN.md`. **Korean policy**: the ledger is English, but Korean source content is **converted to English, not `[redacted]`** — bilingual reports (English body + Korean duplicate) keep their English section; Korean-primary reports are faithfully translated, preserving every number / table / data block / reference. Titles are filename-derived (always English) or set from the translated heading. A metadata-only stub is the last resort only when no faithful English rendering is possible.
- **Never fabricate** archive data. Banner counts are derived from the manifest at render time, not asserted.

---

## 6. Public API (v1) Architecture

The ledger exposes a static, read-only JSON API served via GitHub Pages. All files in `api/v1/` are pre-generated; there is no backend.

### 6.0 Inverted Data Layer (DI-API-001)

**Rule:** the API spec is the source of truth. Payloads conform to the spec — never the reverse.

Every experiment's `manifest.json` carries an `api_summary` block. The generator `scripts/build_api.py` reads those blocks only — it contains zero per-experiment extraction logic. The script does not grow as new experiments are added.

### 6.1 `api_summary` Canonical Schema

Required in every `manifest.json`:

```json
"api_summary": {
  "title":         "Short experiment title",
  "verdict":       "PASS | FAIL | HOLD | BLOCK | DEGRADED | ACCEPT | ABSTAIN | REJECTED | NULL | T1 | T2",
  "verdict_label": "Human-readable label",
  "date":          "YYYY-MM-DD",
  "brief":         "One-sentence summary (shown in runs.json index)",
  "summary":       "2-3 sentence narrative (shown in detail file)",
  "findings":      ["Finding 1", "Finding 2"],
  "metrics": {
    "sr9": 0.953,
    "di2": 0.164,
    "p_e2e": 0.563,
    "balanced_accuracy": 1.0
  },
  "external_anchors": [
    { "label": "Zenodo DOI", "url": "https://doi.org/..." }
  ]
}
```

`external_anchors` is optional. `metrics{}` keys are free-form — include what is meaningful for the experiment's lane.

**Manifest locations by lane:**

| Lane | Manifest path |
|---|---|
| EQA | `eqa/toe-test-XXXX/manifest.json` |
| BAV | `bav/exp-XXX/manifest.json` |
| BSC | `stem-bio-ai/manifest.json` → `reports[].api_summary` |

### 6.2 New Experiment Protocol (3 steps)

```
1. Register in js/eqa-registry.js  or  js/bav-registry.js
   — add one { id: "...", jsonPath: "...", ... } entry

2. Create manifest.json in the experiment directory
   — include api_summary block (§6.1)

3. python scripts/build_api.py
   — regenerates api/v1/ files; commit the result

No changes to build_api.py required. Ever.
```

### 6.3 Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/v1/runs.json` | All-lane run index; count, id, lane, verdict, brief, detail_url |
| `GET /api/v1/runs/{id}.json` | Full detail: summary, key_metrics, findings, evidence_links |
| `GET /api/v1/metrics/bav.json` | BAV metrics table (SR9, DI2, p_e2e, balanced_accuracy per experiment) |
| `GET /api/v1/schema.json` | Vocabulary: 3 lane descriptions, 11 verdict codes, 6 metric definitions |

Base URL: `https://flamehaven01.github.io/Flamehaven-Verification-Ledger`

### 6.4 CI Drift Gate (DI-API-002)

`.github/workflows/ci.yml` runs `python scripts/build_api.py --check` on every push and PR. If committed `api/v1/` files differ from what `build_api.py` would generate from current manifests, the build **fails**.

**Rule:** never edit `api/v1/` files directly. Always edit `manifest.json` → run `build_api.py` → commit both.

### 6.5 Integration Test

`tests/test_api.py` — 54 checks in two phases:

| Phase | Checks | Coverage |
|---|---|---|
| 1 (local) | 41 | File existence, JSON validity, schema structure, verdict spot-checks, external_anchors, detail_url cross-ref, required fields on all 14 detail files |
| 2 (live HTTP) | 13 | GitHub Pages HTTP 200/404, valid JSON parse for 6 endpoint samples |

```
python tests/test_api.py           # local only (fast, no network)
python tests/test_api.py --live    # local + HTTP (requires deployed GitHub Pages)
python tests/test_api.py --save    # writes tests/results.json (gitignored)
```

When adding a new experiment, add its ID to `EXPECTED_IDS` in `test_api.py` and add a verdict spot-check to `checks[]` in `phase_local()`.

---

## 5. OPSEC, PII & Credibility (P0, CI-enforced)

Every published file MUST pass the MICA-governed sanitizer (`sanitizer/`, governed by `sanitizer/sanitizer.mica.archive.json`, DI-SAN-001..007) before publish. A CI gate (`.github/workflows/opsec-sanitize.yml`) runs it on every push / PR and fails the build on any leak.

- **No local-workspace paths** (DI-SAN-001): absolute paths (drive / home / workspace codenames `Sanctum`/`STRUCTURA` / username) are collapsed to `[workspace]/<basename>`; dangling `[workspace]/...` references must not be displayed as data (strip metadata lines; reduce internal fields to basename).
- **No locale-PII** (DI-SAN-002): Hangul / locale-revealing folder names are redacted.
- **No pseudo-scientific slop** (DI-SAN-007): symbol-soup credentials (e.g. `CLI <zigzag/sigma/therefore>`), grandiose personal attribution lines, and `Sovereign` used as a **claim** qualifier (grade / threshold / asset framing) are prohibited and CI-flagged. Experiment **codename slugs** (e.g. `EXP-012-SOVEREIGN-ORIGIN`) are retained as historical identifiers — names are not claims.
- **No fabricated data** (`synthetic_marker` detector): any bracketed synthetic-fabrication tag is CI-flagged on all file types. Ledger content must trace to real artifacts — procedurally generated "registries" are prohibited (see the 0001–0051 calibration-registry removal in 1.7.0).
- **Define, don't mystify**: internal metric acronyms (SR9, DI2, NNSL, Ω, p_e2e) are kept but must carry an external-readable definition / glossary so any outside researcher can read the ledger.

### 5.1 Metrics Glossary (external-facing)
- **SR9** (Scientific Resonance): cross-domain consistency across chemistry / genomics / proteomics (guard >= 0.70).
- **DI2** (Dimensional Integrity): reasoning drift / internal contradiction (guard <= 0.30, lower better).
- **NNSL**: semantic-resonance verification engine computing SR9 / DI2.
- **RExSyn**: hypothesis-synthesis engine (observer-first).
- **LawBinder**: fail-closed governance gate (escalates when uncertain).
- **p_e2e**: end-to-end reliability = capture x transfer x model x clinical.
- **pLDDT / PAE / pTM**: standard AlphaFold confidence metrics.
