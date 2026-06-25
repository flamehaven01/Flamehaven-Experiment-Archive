# Playbook — Common (cross-lane protocols)

> Shared across ALL lanes (EQA / BAV / BSC / M&F), loaded **on_demand**.
> Lane-specific rules: [`playbook-eqa.md`](./playbook-eqa.md) · [`playbook-bav.md`](./playbook-bav.md) · [`playbook-bsc.md`](./playbook-bsc.md) · [`playbook-mf.md`](./playbook-mf.md).
> Index: [`verification-ledger-playbook.md`](./verification-ledger-playbook.md). DI namespaces: `DI-API-*`, `DI-SAN-*`, `DI-SDK-*`.

Contains: the Public API build pipeline (§API), the OPSEC/PII sanitizer gate (§OPSEC), the UI/UX SDK toolkit (§SDK), archive inspectability, and the external-facing metrics glossary.

---

## §SDK — Verification UI/UX SDK & Toolkit Guidelines

Any visualization, dynamic sandbox, 3D consensus coordinate display, or telemetry parser in EQA, BAV, or BSC must align with the **Flamehaven Verification UI/UX SDK**:

- **Visual Tokens**: Always use pre-defined visual tokens (gradients, forest green for PASS, amber for WARN, serious red for FAIL) rather than raw generic primary colors.
- **Steerable comparative sandboxes**: Place the naive baseline/unmapped panel on the left (Red Accent) and the steered/compliant lock panel on the right (Purple Accent) to display the comparative effect of governance controls.
- **Interactive JSON Inspector**: All telemetry JSON datasets must be bridged to the tabbed Ledger Inspector (Insights, Integrity, Verified Rules, Raw JSON) without modifying raw files.
- **3D Coordinate Helices (Three.js / Zero-Dependency Canvas)**: Use 3D coordinate particle scenes for molecular backbones or geometric lattices. If external scripts/CDNs are blocked by local containment policies, strictly use the **Zero-Dependency 3D Projection Canvas** fallback (pure HTML5 canvas + 3D-to-2D projection math) to prevent runtime network exploits.
- **Frequency Graphs (Plotly)**: Render feature distributions, error profiles, or risk frequencies cleanly in dark mode layouts.
- **Global Scope Protection**: Any JS event handler or interactive UI function called inline from HTML markup must be explicitly bound to the global `window` object in `js/portal.js`. This keeps inline handler execution immune to module scoping and deferred loading.
- **Inline-handler quoting (DI-SDK)**: When building an inline `onclick="fn(args)"` string, interpolate args as **single-quoted** JS string literals (with apostrophe/backslash escaping), never `JSON.stringify`. Double quotes terminate the double-quoted attribute → the handler compiles to an incomplete call → `Uncaught SyntaxError: Unexpected end of input`, reported misleadingly at the host HTML's EOF line, not the `.js`. Function-ref handlers (`el.onclick = function(){...}`) are inherently safe.
- **Strict HTML Tag Balancing**: All custom dashboard layouts, ledger lists, and structural container blocks must keep balanced start/end tags. A missing closing element can nest unrelated dashboards inside hidden containers and break rendering.
- **Fixed-Position Tooltips**: Sidebar tooltip overlays must be injected into `document.body` and positioned via `position: fixed` + JS `clientX/clientY`. CSS `position: absolute` tooltips are silently clipped by the sidebar's `overflow: hidden` scroll context.
- **Social Share Frame Pattern (DI-SDK-004)**: Social share buttons (FB / LI / X / Email / Copy Link) belong in the portal viewer frame header and footer — never embedded inside individual HTML report files. Individual report HTMLs must not contain `fh-brand-bar` or equivalent share UI.
- **Cache-buster rule**: any change to a `js/*.js` file must bump the `?v=X.Y.Z` query on all script tags in `index.html` (and `eqa.html` where applicable), or browsers serve stale cached JS.

### Archive Inspectability (data-driven, both lanes)
- A single function `renderArchiveInspector(runId, d, panels)` serves **both** archives, routed by run-id prefix: `bav-arch-<id>` (lane `bav`) and `eqa-arch-<id>` (lane `eqa`). It reads the manifest entry, fetches the verbatim report (`report_path` at top level or under `metrics`), and renders it **inline in the Insights panel** so the actual content is visible, not a filename.
- **BAV** archive rows are expandable / inspector-linked only when real data exists (an SR9 metric or a showable report); data-less rows render dimmed as `no record`. Reports live in `bav/archive/reports/` (sanitized).
- **EQA** archive rows are populated by `renderEqaArchive()` from `eqa/archive/manifest.json`, ordered most-recent first; each shows the real run date / grade (only where the source states them) and opens the verbatim `eqa/archive/reports/TOE-TEST-NNNN.md`. **Korean policy**: the ledger is English, but Korean source content is **converted to English, not `[redacted]`** — bilingual reports keep their English section; Korean-primary reports are faithfully translated, preserving every number / table / data block / reference. Titles are filename-derived (always English) or set from the translated heading. A metadata-only stub is the last resort only when no faithful English rendering is possible.
- **Never fabricate** archive data. Banner counts are derived from the manifest at render time, not asserted.

---

## §API — Public API (v1) Architecture

The ledger exposes a static, read-only JSON API served via GitHub Pages. All files in `api/v1/` are pre-generated; there is no backend.

### Inverted Data Layer (DI-API-001)

**Rule:** the API spec is the source of truth. Payloads conform to the spec — never the reverse.

Every experiment's `manifest.json` carries an `api_summary` block. The generator `scripts/build_api.py` reads those blocks only — zero per-experiment extraction logic. The script does not grow as new experiments are added. The schema vocabulary lives in `scripts/api_schema_static.json` (the **source** for `api/v1/schema.json`) — never edit the generated `api/v1/schema.json` directly.

### `api_summary` Canonical Schema

Required in every `manifest.json`:

```json
"api_summary": {
  "title":         "Short experiment title",
  "verdict":       "PASS | FAIL | HOLD | BLOCK | DEGRADED | DEGRADED_PASS | ACCEPT | ABSTAIN | REJECTED | NULL | T0 | T1 | T2",
  "verdict_label": "Human-readable label",
  "date":          "YYYY-MM-DD",
  "brief":         "One-sentence summary (shown in runs.json index)",
  "summary":       "2-3 sentence narrative (shown in detail file)",
  "findings":      ["Finding 1", "Finding 2"],
  "metrics": {
    "cross_domain_consistency": 0.953,
    "reasoning_deviation": 0.164,
    "end_to_end_reliability": 0.563,
    "balanced_accuracy": 1.0
  },
  "external_anchors": [
    { "label": "Zenodo DOI", "url": "https://doi.org/..." }
  ]
}
```

`external_anchors` is optional (emitted into the detail file for EQA, BAV, AND BSC). `metrics{}` keys are free-form — include what is meaningful for the experiment's lane.

**Manifest locations by lane:**

| Lane | Manifest path |
|---|---|
| EQA | `eqa/toe-test-XXXX/manifest.json` |
| BAV | `bav/exp-XXX/manifest.json` |
| BSC | `stem-bio-ai/manifest.json` → `reports[].api_summary` |

### New Experiment Protocol

```
1. Register in js/eqa-registry.js or js/bav-registry.js (BSC: add to stem-bio-ai/manifest.json reports[])
   — add one { id: "...", jsonPath: "...", ... } entry

2. Register an inspector renderer in js/eqa-renderers.js (EQA_RENDERERS[id])
   — at minimum { insights: fn(data, esc), charts: fn(data) }.
   — integrity/analysis may be null (generic manifest + checks fallback applies).
   — REQUIRED: the Inspector opens on the Insights tab, which reads
     EQA_RENDERERS[id].insights. With no entry, insightHtml = '' and the record
     shows an EMPTY SHELL on JSON click (the toe-test-0058/0059 regression, fixed
     2026-06-19 in 69f22c5). For a markdown Verification Note in the Raw tab, also
     add the id to the reportText branch in portal-inspector.js (renderInspectorData).
   — BSC inspector wiring: see playbook-bsc.md §3.1 (3 branches in portal-inspector.js).

3. Create manifest.json in the experiment directory
   — include api_summary block (above)

4. python scripts/build_api.py
   — regenerates api/v1/ files; commit the result. No changes to build_api.py required. Ever.
```

### Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/v1/runs.json` | All-lane run index; count, id, lane, verdict, brief, detail_url |
| `GET /api/v1/runs/{id}.json` | Full detail: summary, key_metrics, findings, evidence_links |
| `GET /api/v1/metrics/bav.json` | BAV metrics table (cross_domain_consistency, reasoning_deviation, end_to_end_reliability, balanced_accuracy per experiment) |
| `GET /api/v1/schema.json` | Vocabulary: 3 lane descriptions, 13 verdict codes, 6 metric definitions |

Base URL: `https://flamehaven01.github.io/Flamehaven-Verification-Ledger`

### CI Drift Gate (DI-API-002)

`.github/workflows/ci.yml` runs `python scripts/build_api.py --check` on every push and PR. If committed `api/v1/` files differ from what `build_api.py` would generate from current manifests, the build **fails**.

**Rule:** never edit `api/v1/` files directly. Always edit `manifest.json` (or `api_schema_static.json`) → run `build_api.py` → commit both.

### Integration Test

`tests/test_api.py` — two phases (local file checks + live HTTP). When adding a new experiment, add its ID to `EXPECTED_IDS` and a verdict spot-check to `checks[]` in `phase_local()`.

```
python tests/test_api.py           # local only (fast, no network)
python tests/test_api.py --live    # local + HTTP (requires deployed GitHub Pages)
python tests/test_api.py --save    # writes tests/results.json (gitignored)
```

---

## §OPSEC — OPSEC, PII & Credibility (P0, CI-enforced)

Every published file MUST pass the MICA-governed sanitizer (`sanitizer/`, governed by `sanitizer/sanitizer.mica.archive.json`, DI-SAN-001..007) before publish. A CI gate (`.github/workflows/opsec-sanitize.yml`) runs `python sanitizer/sanitize_ledger.py --root . --no-history` on every push / PR and **fails the build on ANY fixable leak OR any detect-flag finding**.

**To sanitize a folder before publish:** `python sanitizer/sanitize_ledger.py --root <folder> --apply --no-history` (fix-mode: paths/locale). Then re-run a full-repo dry-run (`--root .`) to confirm `Files: 0 | fixable: 0 | flagged(detect): 0`.

- **No local-workspace paths** (DI-SAN-001): absolute paths (drive / home / workspace codenames `Sanctum`/`STRUCTURA` / username) are collapsed to `[workspace]/<basename>` (e.g. `target.local_path: "[workspace]/doctobert"`); dangling `[workspace]/...` references must not be displayed as data.
- **No locale-PII** (DI-SAN-002): Hangul / locale-revealing folder names are redacted. (Note: "structural"/"infrastructure" are English words, not the `STRUCTURA` codename — not leaks.)
- **No pseudo-scientific slop** (DI-SAN-007): symbol-soup credentials, grandiose attribution lines, and `Sovereign` used as a **claim** qualifier are CI-flagged. Experiment **codename slugs** (e.g. `EXP-012-SOVEREIGN-ORIGIN`) are retained — names are not claims.
- **No fabricated data** (`synthetic_marker`): any bracketed synthetic-fabrication tag is CI-flagged on all file types. Ledger content must trace to real artifacts.
- **ipv4 detector**: pip version pins (`pkg==1.2.3.4`) are NOT IPs — the detector uses a `(?<![=.\d])` lookbehind so version strings in dependency listings don't false-positive. Real standalone IPs are still flagged.
- **Define, don't mystify**: internal metric acronyms (SR9, DI2, NNSL, Ω, p_e2e) are kept but must carry an external-readable definition (glossary below).

### Metrics Glossary (external-facing)
- **SR9** (Scientific Resonance) / `cross_domain_consistency`: cross-domain consistency across chemistry / genomics / proteomics (guard >= 0.70).
- **DI2** (Dimensional Integrity) / `reasoning_deviation`: reasoning drift / internal contradiction (guard <= 0.30, lower better).
- **NNSL**: semantic-resonance verification engine computing SR9 / DI2.
- **RExSyn**: hypothesis-synthesis engine (observer-first).
- **LawBinder**: fail-closed governance gate (escalates when uncertain).
- **p_e2e** / `end_to_end_reliability`: end-to-end reliability = capture x transfer x model x clinical.
- **pLDDT / PAE / pTM**: standard AlphaFold confidence metrics.
