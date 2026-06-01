# 📋 Changelog

All notable changes to the **Flamehaven Verification Ledger** platform will be documented in this file.

---

## [1.11.2] - 2026-06-01

Fixed broken mobile layout (the main page did not load — only the menu layer showed).

### 📱 Mobile / responsive
- **Root cause**: `sidebar.css` (loaded after `layout.css`) re-declared base `.sidebar { position: sticky }` and `.sb-toggle { display: none }`, which overrode the `@media (max-width:768px)` rules by source order — so on phones the sidebar stayed in flow (covering/pushing the page) and the hamburger never appeared.
- **Fix**: new `css/responsive.css`, loaded **last** on `index.html` + `eqa.html`, with authoritative mobile rules: off-canvas drawer `.sidebar` (hidden until opened, slides in via `.mobile-open`), a working **top-left hamburger** (`.sb-toggle`), single-column content reflow, icon-only top-nav links, and footer/card grid adjustments.
- Verified at 375px: main page loads full-width at top, hamburger toggles the drawer + backdrop, report viewer fits, no horizontal overflow — on both `index.html` and `eqa.html`.

---

## [1.11.1] - 2026-06-01

Wired the minted whole-ledger Zenodo DOI.

- **DOI `10.5281/zenodo.20483364`** added to `CITATION.cff` (top-level `doi`), `codemeta.json` (`identifier`), the schema.org `Dataset` JSON-LD (`identifier`), the README **DOI badge** + Citation line, and the footer "Trust & Licensing".
- ORCID iD still pending (slot in place); JOSS/arXiv deferred. Pillar 3b otherwise complete.

---

## [1.11.0] - 2026-06-01

Repository presentation + CI for external readers, and the Zenodo archival path.

### 🧪 CI / CD
- New **`CI`** workflow (`ci.yml`): JS syntax check (`portal.js`, `chart-engine.js`), the `promotional_language` detector tests, and JSON/metadata validity — deterministic, no network, no LLM.
- **OPSEC Gate** workflow now installs from `sanitizer/requirements.txt` (added; PyYAML).

### 📛 README badges
- Removed the generic "GitHub Repo" badge; added functional badges: **CI** status, **OPSEC Gate** status, **Python 3.12**, and **dual-license** (code MIT / data CC BY-NC 4.0). A Zenodo **DOI** badge is staged (commented) and enabled once the DOI is minted.

### 📦 Archival (Zenodo)
- A whole-ledger Zenodo DOI is minted from a GitHub **release** (webhook enabled; `.zenodo.json` supplies the metadata, license cc-by-nc-4.0, Erdos component DOI linked). The minted DOI and an ORCID iD are wired into CITATION / codemeta / footer + the DOI badge on receipt — no placeholder identifiers until then.

---

## [1.10.0] - 2026-05-31

Credibility architecture — **Pillar 3a: scientific-artifact metadata** (the in-repo, no-external-dependency part). Makes the ledger machine-readable and citable as a serious artifact rather than a personal page.

### 🪪 Metadata
- **`CITATION.cff`** (CFF 1.2.0) — citable metadata; organizational author with a commented ORCID slot; the real Erdos reproduction DOI as a related reference; a commented whole-ledger DOI slot.
- **`codemeta.json`** — software metadata (SPDX MIT) for the repository code.
- **schema.org `Dataset` JSON-LD** embedded in `index.html` + `eqa.html` for indexing / citation.

### ⚖️ License clarified (dual)
- Resolved the LICENSE-vs-footer conflict: **repository code = MIT** (`LICENSE`); **verification runs / evidence artifacts = CC BY-NC 4.0**. Made it consistent across LICENSE, footer, README, CITATION (data → `CC-BY-NC-4.0`), codemeta (software → MIT), and the Dataset JSON-LD.

### 🚧 Limitations made explicit
- Footer + README now state plainly that internal metrics (SR9/DI2/Omega) are advisory and not externally validated, and that the reports do not imply certification, clinical efficacy, or deployment approval.

### 🔤 Also
- Relabeled the BSC `Scanner (MIT)` button to `Scanner (source)` (tooltip: *open-source, MIT-licensed*) so it no longer reads as if MIT (the institution) built the scanner. The footer's genuine **MIT AI Risk Repository** link is unchanged.
- MICA sync: `mica.yaml` -> 1.10.0; added design invariants **DI-CRED-001..004** (provenance classing, understatement posture, reproduction anchors, citable metadata + dual license); registered `credibility-architecture.md` as a memory layer; refreshed scope.

### ⏭️ Pending (3b — external)
- **Zenodo DOI — turnkey ready**: added `.zenodo.json` so a whole-ledger DOI is minted automatically when the repo is connected to Zenodo and a GitHub release is created (license cc-by-nc-4.0; the Erdos component DOI linked as `isSupplementedBy`). The minted DOI is then wired into CITATION.cff + codemeta + footer.
- **ORCID iD** — awaiting the actual iD string; will be added to `.zenodo.json` creators + CITATION.cff + JSON-LD on receipt. No placeholder iD is committed.
- **JOSS / arXiv** — deferred (arXiv endorsement requirement; AI-assisted manuscripts are hard to post). No submission badge is shown until a real submission exists.

---

## [1.9.0] - 2026-05-31

Credibility architecture — **Pillar 2 of 3: independent reproduction anchors**. Each lane resolves to something an outside party can check without trusting any Flamehaven metric.

### 🔁 Reproduction anchors
- **EQA** — unchanged: card 0055 already links the public MIT repo (`Flamehaven-Labs/openai-erdos-eq22-reproduction`) + Zenodo DOI `10.5281/zenodo.15487327`.
- **BSC** — both audit cards now carry a `Scanner (MIT)` link to the public scanner `github.com/flamehaven01/STEM-BIO-AI` (PyPI `stem-ai`). The `report.json` already records the target repo remote + commit + scanner version, so a third party reproduces the deterministic tier (`pip install stem-ai`; clone the target @ the recorded commit; `stem scan --level 3`). Output artifacts were not modified.
- **BAV** — a payload scan found only **EXP-031** carries a foldable input (52-aa sequence) + external structural metrics (pLDDT/PAE/pTM across AF3/AF2). It ships `bav/exp-031/reproduce/`: `input.fasta` (SHA-256 anchored), `models.json` (per-arm validators + recorded adapter versions + shared seed + AF3 model version), `reference_run.json` (recorded AF2/AF3 metrics + per-arm pipeline pLDDT/drift + determinism signatures), and a `README` with the public re-fold procedure. A `Reproduce` link on the EXP-031 card points to it.

### 🔬 Honesty
- **Re-runnable, not bit-exact**: AF3/AF2/Chai-1/Boltz-2 are non-deterministic (version/hardware/MSA/seed); the scaffold hashes the *input* only and asks for a *regime-level* comparison, never a numeric match. The SR9/DI2 governance overlay is explicitly excluded from the external structural check.
- **No fabricated scaffolds**: EXP-005/028/032/033/034 (governance / honesty / methodology, no foldable input) are marked non-re-runnable rather than given invented reproduction recipes.

### ⏭️ Next
- Pillar 3 (scientific-artifact metadata + DOI/ORCID/JOSS).

---

## [1.8.0] - 2026-05-31

Credibility architecture — **Pillar 1 of 3 complete**: a design spec for treating internal metrics honestly, an enforced understatement posture on the public surface, and provenance labelling so an outside reader sees external facts first and internal heuristics as clearly-marked advisory. Principle: **verify facts, not scores** — authority is borrowed from external anchors (public repos, DOIs, standard metrics) or earned through reproducibility, never asserted for self-built metrics.

### 🧭 Design spec
- **`memory/credibility-architecture.md`**: provenance classes (`EXTERNAL` / `DERIVED` / `ADVISORY-RULE-BASED` / `ADVISORY-HEURISTIC`); honest demotion of SR9/DI2/Omega/SPAR to advisory; external-anchor inventory; reproduction-anchor plan (incl. AlphaFold non-determinism → tolerance bands, not bit-exact claims); a Zenodo-DOI-gated metadata phase. Records its own limitations (what it does NOT achieve).

### 🔇 Tone discipline (Pillar 1a)
- **`promotional_language` sanitizer detector**: config-driven term list + public-surface scope (`index.html`, `eqa.html`, `README.md`) + HTML/MD content extraction so CSS/attributes/code never false-flag; ambiguous technical words (e.g. "best") excluded by design. CI gate, with a 7-case acceptance test (`sanitizer/tests/test_promotional.py`).
- **Public-surface tone purge**: the ledger no longer describes itself as "authoritative" or claims "absolute" auditing integrity; BSC "(Authoritative Release)" framing removed. Register is now factual/methods-section.

### 🏷️ Provenance classing (Pillar 1b)
- **4-class metric chips in the inspector**: every named scientific/governance metric is tagged `EXTERNAL` (e.g. AlphaFold pLDDT/PAE — third-party-defined), `DERIVED` (e.g. `p_e2e` — recomputable), or `ADVISORY` (SR9/DI2/Omega/SPAR — Flamehaven internal, not externally validated). Implemented as one module-level `metricCard()` + `provClassOf()`/`provChip()` to which the per-renderer helpers delegate (single source of truth; also de-duplicates the old per-function `metric` copies).
- **ADVISORY-HEURISTIC subordination**: SR9/DI2/Omega are moved out of the main metric grid into a **collapsed "Pipeline internals · advisory" section** (closed by default), below the external/derived facts and verdicts. The main view of every BAV card now reads as external facts + grade + governance verdict; the internal resonance scores are present for audit but never a headline. Each still carries a grey "ADVISORY — not externally validated" chip + tooltip.
- **Glossary**: the dashboard Metrics glossary now leads with a class legend and tags each term (SR9/DI2/NNSL/RExSyn = ADVISORY, LawBinder = RULE, p_e2e = DERIVED, pLDDT/PAE/pTM + Brier/ECE = EXTERNAL).

### 🔒 OPSEC
- Collapsed a workspace path leak (`local_path` absolute path) in the yorkeccak/bio BSC `report.json` to `[workspace]/...` (was present in a local, un-pushed commit; caught by the sanitizer gate before publication).

### ⏭️ Next
- Pillar 2 (independent reproduction anchors: EQA done, BSC link to STEM-BIO-AI, BAV scaffold) and Pillar 3 (scientific-artifact metadata + DOI/ORCID/JOSS) — tracked as future releases.

---

## [1.7.0] - 2026-05-31

Replaced the fabricated EQA calibration registry with the real TOE-TEST foundational-run reports, and rebuilt the archive inspector to match.

### 🔬 EQA Lane — real data replaces synthetic registry (P0 credibility)
- **Removed the synthetic "Calibration Registry (51 runs)"**: an external evaluator demonstrated the 0001–0051 registry was hallucinated (procedurally generated `prime = 101 + n*4`, `field_degree = 2^(2+n%4)`, synthetic-tagged hash labels, P=105 falsely labelled prime, FAIL-checks shown with PASS verdicts). Deleted `CALIBRATION_TOPICS`, `renderHistoricalRuns`, `openHistoricalRunInspector`, `handleHistoricalRunSearch`, `buildCalibCharts`, and every `eqa-calib-*` code path (~250 lines).
- **Imported the real archive**: `eqa/archive/manifest.json` + 51 verbatim reports under `eqa/archive/reports/` from Flamehaven-TOE/TOE-TEST (string-theory / topology physics, quantum-biology & protein spin-qubit, and verification-methodology layers). 23 carry real dates, grades surfaced where the source states them.
- **Korean source content rendered in English (no redaction)**: the two reports containing Korean were made fully English from the source rather than `[redacted]` — 0001 (English report + redundant Korean duplicate) by extracting its existing English section, and 0004 (Korean-primary) by faithful translation that preserves every numeric value, table, data block, and reference. All 51 runs now render their verbatim report.
- **Generalized archive inspector** (`renderBavArchiveInspector` → `renderArchiveInspector`): one inspector now serves both BAV (`bav-arch-`) and EQA (`eqa-arch-`) records — recent-first list, real run date / grade cards, the verbatim source report rendered inline, governance/provenance tabs, and Raw JSON. No fabricated values.
- **Cards rebuilt** in `index.html` + `eqa.html`: data-driven `#eqa-archive-list` (counts derived from the manifest, not asserted) replaces the hand-rolled registry; removed dead `[JSON]/[Report]/[Repo]/[Paper]` placeholder buttons.

### 🔒 OPSEC / Credibility
- **Sanitizer `synthetic_marker` detector**: flags any bracketed synthetic-fabrication tag on all file types (CI gate, exit 1) to prevent the registry regression from recurring.

---

## [1.6.0] - 2026-05-31

BAV depth (6th card + inspectable archive), an OPSEC/credibility sanitizer, and a repo-wide credibility cleanup.

### 🧬 BAV Lane
- **EXP-005~007 Upadacitinib truthful-null card**: real NNSL outputs for three lipid carriers (SLN 0.278, NLC 0.227, Liposomal Gel 0.258), all rejected by the SR9 gate (>= 0.80) — "the value of not building". Fills the skipped 005-007 numbering.
- **Engine Overview card**: RExSyn (Ω 0.665, observer-first) / NNSL (Ω 0.919) / LawBinder context + remaining notes.
- **Archive made usable**: foundational runs (EXP-001~030) now surface real extracted metrics (SR9/coherence) and render their full source reports inline in the inspector; data-less rows close as `no record` (no fabrication). 15 inspectable / 11 closed.

### 🔒 OPSEC / Credibility (P0, CI-enforced)
- **Sanitizer v1.2** (`sanitizer/`, DI-SAN-001..007): config-driven detectors (paths, locale, IP/email/secret, pseudo-science slop), scan-history + calibration, and a GitHub Actions gate that blocks publication on any leak.
- **Disclosure patch**: scrubbed local-workspace absolute paths / username / Korean folder names across 27+ files; removed a leaked binary PDF.
- **Credibility patch**: removed pseudo-scientific symbol-soup credentials and grandiose personal attribution; neutralized `Sovereign` claim-slop (codename slugs kept as identifiers); stripped dangling `[workspace]/` path references from display + data; added a **Metrics & Engines glossary** (SR9/DI2/NNSL/Ω/p_e2e/AlphaFold metrics).

### 📚 MICA v1.6.0
- Main archive: + DI-BAV-001..004 (BAV lane), DI-OPS-001 (OPSEC-before-publish), DI-OPS-002 (external-credibility-no-slop). di_count -> 22.
- Sanitizer MICA v1.2.0 (DI-SAN-007 credibility). Playbook gains §4.1 archive inspectability and §5 OPSEC/Credibility + glossary.

---

## [1.5.0] - 2026-05-30

Built out the **Biomolecular AI Validation (BAV)** lane from a 0-base placeholder into a live, data-driven governance ledger, and added an OPSEC sanitizer.

### 🧬 BAV Lane (live, no hardcoding)
- **5 experiment cards + archive**: EXP-028 (honesty test), EXP-031 (multi-model disagreement → KEEP_OBSERVER), EXP-032 (adaptive gate, legacy-replay anchor), EXP-033 (pipeline-level p_e2e), EXP-034 (path separation). Archive EXP-001~030 with expandable per-experiment summaries + Upadacitinib truthful-null note.
- **All values live-fetched** from verbatim run payloads under `bav/` (DI-BAV-001); removed fabricated placeholder numbers and the THREE.js/WebGL CDN scene.
- **Bio chart SDK** (`chart-engine.js`): zero-dependency `pae-heatmap`, `contact-map`, `plddt-track` + multi-model drift (DI-BAV-004).
- **Inspector tabs fully populated** (DI-BAV-003): Integrity (provenance/SHA-256), Verified Rules (governance gate fail/go: SR9/DI2 guard, p_e2e, stage gates G1-G5), and a **Live Report** tab generating an expert markdown report from the payload (GFM tables added to `parseMarkdownToHtml`).
- Dashboard reframed to the governance thesis; recent-first card order; magnifying-glass Inspect icon; sidebar/badge consistency.

### 🔒 Security / OPSEC
- **Ledger sanitizer** (`sanitizer/`): MICA-governed tool (DI-SAN-001..006) that scrubs local-workspace absolute paths and locale tokens, flags IP/email/secret exposure, accumulates a scan-history DB + calibration, and runs as a CI gate (`.github/workflows/opsec-sanitize.yml`). Sanitized 27 ledger files; removed a leaked binary PDF.

### 📚 MICA v1.5.0
- Added DI-BAV-001..004 (live governance cards, disagreement-is-signal, governance gate fail/go, bio SDK + live report). di_count 16 → 20, session_count 6.

---

## [1.4.0] - 2026-05-29

Social share unification, Methodology & Frameworks portal cleanup, and viewer frame polish.

### 🔗 Social Share Unification (DI-SDK-004)
- **Viewer frame header**: FB / LI / X / Email / Copy Link 5-icon set added to all report viewer headers. Applies universally without modifying individual HTML source files.
- **Footer**: "Copy archive URL" button replaced with FB / LI / X / Email / Copy Link 5-icon set.
- **BioClaw report.html**: Brand bar (fh-brand-bar) and all associated CSS/JS fully removed — social share now handled by viewer frame only.
- **X (Twitter)**: Added as 4th icon across all share surfaces.
- **Copy Link**: Added to viewer frame header with green checkmark feedback (1.8s).

### 📁 Methodology & Frameworks
- **effective_html_template.html**: New blank audit report scaffold (604 lines, zero dependencies). Replaces pr_action_plan_v3.html.
- **Sidebar**: Split into Templates / Frameworks / Practical Code sub-categories with 13px inline SVG icons.
- **pr_action_plan_v3.html**: Removed (superseded by effective_html_template).

### 🎨 UI Polish
- **Footer padding**: `padding-bottom` reduced 40px → 24px, `margin-top` retained at 80px.
- **extras-category-header SVG**: Explicit `width="13" height="13"` on all 3 category icons (Templates/Frameworks/Practical Code) to prevent browser default size fallback.

### 📚 MICA v1.4.0
- Added DI-SDK-004 (social-share-frame-pattern).
- `operation_meta`: update_count 6, session_count 5, last_updated 2026-05-29.

---

## [1.3.0] - 2026-05-29

BSC lane UX polish, compliance sandbox refactor to data-driven architecture, and portal consistency improvements.

### 🧬 BSC Lane Improvements
- **Read Article button**: Added per-report flamehaven.space article links for yorkeccak/bio and BioClaw. Visible on card and in report viewer sidebar. Opens in new tab.
- **Inspect button**: Renamed JSON inspector card button from "JSON" → "Inspect" with magnifying glass icon. Order: Open Report → Inspect → Read Article → PDF → MD → JSON.
- **Stats row — dynamic**: Reports/T1/T2/Avg Score now computed from DOM (`data-coll`, `data-tier`, `data-score`). Hardcoded literals removed (DI-BSC-002).
- **Collections stat removed**: Replaced with **Avg Score (N/100)** — Collections always = 1 in BSC single-lane space; meaningless and misleading.

### 🔧 Compliance Sandbox Refactor (DI-BSC-001)
- **Data-driven `steerCompliance`**: Removed all hardcoded scores (`isYork` binary flag, literals 75/70/48/60/38/50). All values now read from `inspector.jsonData` (live report.json).
- **`COMPLIANCE_POLICIES` map**: Each policy is a pure function `(data) => result`. Adding a new policy = one map entry, zero existing code changes.
- **Standard Prior cognitive fix**: Label changed to "Full Audit Score:", metric now shows `Δ −N from S1 naive` to explain governance weighting reduction. Note explains 70→60 drop.
- **`metricLabel` field**: Per-policy label ("Full Audit Score" / "Compliance Verdict" / "Steered Score & Verdict") replaces hardcoded template string.
- **Simulation label**: Sandbox header now reads "Compliance Engine · Simulation".
- **Gauge arc dynamic**: `fillDash` computed as `213.6 * score/100` from JSON, not hardcoded per report.

### 🎨 Portal Consistency
- **Folder initial state**: BSC and Methodology folders now start closed (removed hardcoded `open` class on `sb-children`, `sb-files`, and button).
- **Folder badge green**: All folder badges now use consistent green style (`#10b981`).
- **Folder icon encoding**: CSS `content` emoji replaced with Unicode escapes (`\1F4C1`/`\1F4C2`) to prevent cp949 render corruption.
- **Copy Link (viewer)**: Removed redundant "Copy Link" button from viewer sidebar; social share row handles distribution.
- **Card Copy Link**: Reduced to icon-only (`dl-copy-btn`, no text label).
- **Button order unified**: All `viewer-btn` elements use base style (no `primary` override) for visual consistency.

### 📚 MICA v1.3.0
- Added DI-BSC-001 (data-driven compliance sandbox) and DI-BSC-002 (BSC stats dynamic count).
- `operation_meta`: update_count 5, session_count 4, last_updated 2026-05-29.

---

## [1.2.0] - 2026-05-28

EQA lane expansion adding two new verification cards (0052, 0056/AEFSO), portal UX improvements (sidebar ordering, emoji icons, mobile backdrop), tooltip architecture rework, and a full EQA operations playbook in the master MICA package.

### ➕ New EQA Content
- **TOE-TEST-0052 — GTE Pedagogy Hypothesis**: Gate REJECTED verdict card. SPAR 73/100, SIDRCE Omega 0.697 (RED band). Wired to inspector with SPAR sub-score bar and Omega gauge. Raw data: `eqa/toe-test-0052/internal_data.json` + `analysis_report.md`.
- **TOE-TEST-0056 — AEFSO Optional Backend Representation Layer**: 7-phase experiment card. SPAR ACCEPT WITH BOUNDS. Classified `optional_backend_representation_layer`; DO NOT PROMOTE TO CORE, KEEP ALIVE. Wired with phase progression chart. Raw data: `eqa/toe-test-0056/AEFSO_MANIFEST.json` + decision/synthesis/review documents.

### 📐 Navigation & Sidebar
- **Descending run-code ordering**: EQA sidebar and card list reordered 0056 → 0055 → 0054 → 0053 → 0052 → archive (code-order, not time-order).
- **Sidebar rename**: `openai-erdos-eq22 (0055)` → `eqa-test-0055 (openai-erdos)` for run-code-first consistency.
- **📁/📂 Emoji folder icons**: Replaced SVG path chevron with `::before` content-toggling emoji (📁 closed / 📂 open on `.open` class).

### 📱 Mobile Responsiveness
- **`#sb-backdrop` overlay**: Added `position: fixed` backdrop div with `blur(1px)` behind the mobile sidebar. Tap backdrop to close (`closeSidebar()`).
- **Slide distance corrected**: `left: -260px` → `-280px` to fully hide the 260px-wide sidebar off-screen; added `box-shadow` on slide-in.
- **`closeSidebar()` helper**: Unified close path exported to `window`; used by backdrop click, nav link clicks, and file entry clicks on mobile.

### 🔧 Tooltip Architecture
- **Folder-level only**: Removed all file-level `data-tip` attributes (too granular — 13 attributes stripped from `eqa.html` + `index.html`).
- **`position: fixed` JS engine**: Folder description tooltips (EQA / BAV / BSC / Methodology) now render via a JS-injected `#sb-tip` div on `document.body`, reading `.sb-tooltip` span `innerHTML`. Bypasses `overflow: hidden` sidebar clipping that silently suppressed CSS-only `position: absolute` tooltips.
- **`#sb-tip` CSS**: Updated to multi-line HTML support (`max-width: 240px`, `white-space: normal`, `<strong>` colour rule).

### 📚 MICA Memory Package
- **New DIs (archive.json)**: DI-EQA-003 `gate-rejection-spar-threshold`, DI-EQA-004 `optional-layer-classification`, DI-EQA-005 `degraded-sidecar-isolation`, DI-SDK-003 `fixed-position-overflow-bypass`. Total DI count: 13.
- **EQA Operations Playbook (§1.1–1.6)**: Full operations guide added to `verification-ledger-playbook.md` covering raw data management, portal wiring (4-step), hardcoding diagnosis table, scientific validity pre-publish checklist, insights/charts convention, and UX/UI guidelines.
- **mica.yaml**: Added `metadata` block (version, last_updated, eqa_run_range, di_count, session_count). Description updated to reference full run range TOE-TEST-0001~0056+.
- **README + CHANGELOG**: EQA section expanded, repository tree updated, Active Audits section restructured into EQA / BSC / Methodology subsections.

---

## [1.1.1] - 2026-05-27

Internal code quality pass addressing DRY violations, a rendering performance bottleneck, separation of concerns for CSS, and a data-transparency label in the fallback inspector — no user-facing behaviour changes.

### ♻️ Refactoring & Code Quality
- **CALIBRATION_TOPICS constant (P0)**: Extracted the 16-item mathematical calibration topic array (previously duplicated verbatim in 4 separate functions) into a single module-level `const CALIBRATION_TOPICS`. Eliminated ~150 lines of redundant code and eliminated the risk of topic-list drift between `renderInspectorData`, `getFallbackReportText`, `getFallbackDataset`, and `renderHistoricalRuns`.
- **Unified ledger filter (P1)**: Consolidated `filterEqLedger`/`filterBavLedger` and `applyEqFilters`/`applyBavFilters` into a single `filterLedger(lane, status, btn)` + `applyLedgerFilters(lane)` pair backed by a `LANE_CFG` map. Public API wrappers preserved for backward compatibility with inline HTML handlers.
- **CSS separation of concerns (P2)**: Removed the runtime `document.createElement('style')` injection block from `portal.js` and moved all rules (`@keyframes cardFadeIn`, `.eq-filter-pill`, `.eq-slot-btn`, `.inspector-tab`) to `css/components.css` where they belong.

### ⚡ Performance
- **Batch reflow (P3a)**: Replaced the per-card `c.offsetHeight` forced synchronous layout inside the card sort loop (N reflows) with a single `void document.body.offsetHeight` between two linear passes — eliminates O(N) layout thrashing on every filter/sort operation.

### 🔒 Data Integrity
- **Synthetic hash labelling (P3b)**: Fallback SHA256 manifest entries generated for calibration sandbox runs are now prefixed with a synthetic-marker tag to make their simulation-only status unambiguous in the Cryptographic File Manifest tab. (Superseded in 1.7.0 — the synthetic calibration registry was removed entirely; see below.)

### 🛠️ Build Script
- **Status-driven lane scanning (P4)**: Replaced the hardcoded `laneKey === 'stem-bio-ai'` filter in `build-ledger-summary.mjs` with `laneDefinitions[laneKey].status === 'active'`. Future lanes are automatically included once their `status` is set to `'active'` — no manual filter edits required.

---

## [1.1.0] - 2026-05-27

This release introduces comprehensive visual, search, and navigation upgrades across all dashboards, establishes perfect button layout symmetry, implements dynamic historical calibration registry details, and resolves a critical rendering hotfix for the Bioscience Compliance (BSC) dashboard.

### 🔴 Critical Hotfixes
- **BSC Dashboard Recovery**: Fixed a missing closing `</div>` tag for the BAV dashboard in `index.html`. This tag imbalance caused the browser's DOM parser to nest downstream components (including the BSC collection section and score guide) inside the hidden BAV container on page load, rendering them invisible. Restoring the tag fully restores the BSC dashboard.
- **Card EQA-TEST-0055 Tag Cleanup**: Repaired mangled button tag markup on EQA Card 55 to prevent HTML parser collisions.

### 📐 Visual & Symmetry Upgrades
- **EQA Button Uniformity**: Standardized all Equation-to-Artifact (EQA) cards to a uniform 4-button configuration (`[JSON]`, `[Report]`, `[Repo]`, and `[Paper]`).
  - Active buttons feature sleek glassmorphic hover animations.
  - Inactive archive buttons (`EQA-ARCHIVE-0001`) are elegantly disabled and blurred (`.disabled` class, `0.4` opacity, `not-allowed` cursor).
- **Arrow Character Cleanup**: Completely removed arrow characters (`↗`) from all `[Report]`, `[Repo]`, and `[Paper]` action buttons for modern typographic consistency.
- **Symmetrical 2x2 Landing Grid**: Upgraded the portal landing page (`.portal-intro-grid`) from a 1x3 structure to a symmetrical 2x2 grid by adding a **Methodology & Frameworks** card pointing dynamically to `#extras`.
- **Premium Sidebar Tooltips**: Removed plain `?` circle helpers from folder buttons and refactored the sidebar CSS to display gilded hover tooltips on folder name hover.

### 🔍 Unified Localized Search
- **Part-Specific Search Bars**: Added independent glassmorphic search inputs with real-time on-keyup filters to the EQA ledger list, BAV ledger list, and Methodology ledger list.
- **Dynamic Math Filters**: The new filters index and search within respective collections only, significantly improving performance and usability.

### 📄 Historical Calibration registry & Math Proof Inspector
- **Dynamic 51-Run Registry**: Built an interactive scrollable list in `EQA-ARCHIVE-0001` dynamically generating 51 historical math calibration runs covering Dirichlet L-functions, Euler-Mascheroni lattices, genus class fields, and Galois extension degrees.
- **Default Proof Focusing**: Configured `openJsonInspector` to dynamically detect calibration run clicks, rename the Raw JSON tab to `📄 Calibration Proof`, and focus on it by default on load.
- **Beautiful HTML Mathematical Briefs**: Implemented a lightweight, robust Markdown-to-HTML engine in `js/portal.js` that transforms raw scientific markdown reports into highly styled mathematical briefs with grid telemetry panels.
- **One-Click Clipboard Copying**: Integrated a dynamic copy button that copies the raw mathematical brief to the clipboard with temporary success toast text states.

### 🔒 Core Scoping & Architecture Protection
- **Global Window Bindings**: Explicitly exported all top-level UI interaction handlers (e.g. `openJsonInspector`, `closeJsonInspector`, `switchInspectorTab`, `toggleGuide`, `filterTier`, `filterColl`, `handleSearch`, `handleSort`) to the browser `window` scope in `js/portal.js` to guarantee module scoping immunity.
- **Reflow-Safe Smooth Scrolling**: Wrapped inspector scrolling logic inside `requestAnimationFrame` + `setTimeout` locks to prevent scrolling before browser DOM tree layout reflows complete.

---

*For older records or detailed analyst evidence logs, please refer to the corresponding directories under `stem-bio-ai/` or `eqa/`.*
