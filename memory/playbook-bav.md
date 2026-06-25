# Playbook — BAV Lane (Biomolecular AI Validation)

> Lane playbook, loaded **on_demand** when working on BAV experiments (`bav/exp-XXX/`).
> Shared protocols (API build, OPSEC sanitizer, UI/UX SDK) live in [`playbook-common.md`](./playbook-common.md).
> DI namespace: `DI-BAV-*`, `DI-BIO-*`, `DI-REX-*`. Index: [`verification-ledger-playbook.md`](./verification-ledger-playbook.md).

Biomolecular AI Validation — validating whether an entire biomedical AI **pipeline** (RExSyn reasoning + NNSL resonance + LawBinder governance) deserves trust, not whether one model looks confident. Model disagreement is treated as signal.

---

## 2.0 Pipeline Operating Rules

- **Consensus Checking**: Run multi-model consensus validation (AF3, AF2, Boltz-2, Chai-1) to evaluate biological 3D coordinate folds.
- **Intake Restrictions**: All reasoning solver packets must enter through the `logos_toe_pipeline.py` intake gate, enforcing strict `LawBinder` block/inhibit rules on non-compliant candidates.
- **Adapter Constraints**: Do not import `sentence_transformers` or heavy logic libraries directly into front-end request paths to prevent import-time latency issues. Use FastAPI HTTP routes.

---

## 2.1 BAV Ledger Cards

Thesis: model disagreement is signal; the pipeline's job is honest governance.

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

> Registry-driven BAV cards are auto-generated from `js/bav-registry.js` by `bav-renderers.js`. Adding an experiment: see the New Experiment Protocol in [`playbook-common.md`](./playbook-common.md) §API, plus the BAV metrics glossary there.
