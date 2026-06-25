# Playbook — EQA Lane (Equation-to-Artifact)

> Lane playbook, loaded **on_demand** when working on EQA runs (`eqa/toe-test-XXXX/`).
> Shared protocols (API build, OPSEC sanitizer, UI/UX SDK) live in [`playbook-common.md`](./playbook-common.md).
> DI namespace: `DI-EQA-*`. Index: [`verification-ledger-playbook.md`](./verification-ledger-playbook.md).

Equation-to-Artifact (EQA) — mathematical and physical proof-of-concept verification.

---

## 1.0 Gate Verdict Dispatch Protocol

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

## 1.1 Raw Data Management

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

**Archive boundary:** Runs 0001–0051 are grouped as a single `eqa-card-archive` card backed by `eqa/archive/manifest.json` (real TOE-TEST reports imported verbatim, paths sanitized). Do not create individual cards for archival runs unless the run requires standalone citation. The archive is **data-driven only** — never re-introduce procedurally generated ("synthetic") run data; the sanitizer `synthetic_marker` detector and CI gate enforce this. See [`eqa-reconstruction-standard.md`](./eqa-reconstruction-standard.md).

---

## 1.2 Report Authoring & Portal Wiring

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

> Note: registry-driven EQA cards are auto-generated from `js/eqa-registry.js` by `eqa-renderers.js` — see the New Experiment Protocol in [`playbook-common.md`](./playbook-common.md) §API.

---

## 1.3 Hardcoding Diagnosis

Scan `portal.js` and card HTML for the following patterns before publishing a new run:

| Value type | Acceptable location | Flag if found here |
|---|---|---|
| Run IDs (`toe-test-NNNN`) | String literals in routing maps | Hardcoded in conditional logic |
| SPAR / Omega scores | Read from `internal_data.json` at runtime | Literal numbers in JS chart logic |
| Threshold constants (0.75, 0.80, 0.85) | Single definition citing a DI | Scattered inline across handlers |
| File paths (`./eqa/...`) | `jsonPath` / `reportPaths` maps | Duplicated across multiple functions |
| Chart axis scales | Derived dynamically from data | Fixed to a specific run's range |

**Threshold provenance rule:** Any numeric threshold in `portal.js` must be traceable to a DI in the archive. If a threshold appears without a DI reference, add the DI first, then introduce the constant.

---

## 1.4 Scientific Credibility & Validity Review

Pre-publish checklist for every EQA card:

- [ ] **Precision** — All computations used `mpmath` ≥ 200-bit. Float64 prohibited (DI-EQA-001).
- [ ] **Gate verdict** — SPAR and Omega satisfy the dispatch table in §1.0 (DI-EQA-003).
- [ ] **Provenance** — `internal_data.json` is unedited run-engine output. No post-hoc score changes (DI-EQA-002).
- [ ] **SPAR breakdown** — Score decomposes into documented sub-criteria. Aggregate-only score is not publishable.
- [ ] **Reproducibility note** — `analysis_report.md` states exact software version, `mpmath` bit-width, and OS environment.
- [ ] **Citation** — PASS runs include: LaTeX source link + `CITATION.cff` + immutable Zenodo DOI.
- [ ] **Optional Layer runs** — Confirm `AEFSO_MANIFEST.json` exists, `toe_scope` field is populated, and the card badge reads `OPTIONAL LAYER` not `PASS`.

---

## 1.5 Insights, Analysis & Charts

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

## 1.6 UX/UI Considerations

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
