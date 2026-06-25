# MICA Playbook Index — Flamehaven Verification Ledger

This is the **router** for the ledger's operating guide. The full content is split per lane so a task only loads the island it touches (the `name: playbook` layer in `mica.yaml`, loaded always; lane files loaded `on_demand`).

The ledger has three verification lanes plus a methodology section, governed by one archive of domain-namespaced design invariants (`memory/verification-ledger.mica.archive.json`, `namespace_mode: domain_namespaced`).

---

## Which file to load

| Working on… | Load | DI namespace |
|---|---|---|
| **EQA** — math/physics proof reproduction (`eqa/toe-test-XXXX/`) | [`playbook-eqa.md`](./playbook-eqa.md) | `DI-EQA-*` |
| **BAV** — biomedical AI pipeline governance (`bav/exp-XXX/`) | [`playbook-bav.md`](./playbook-bav.md) | `DI-BAV/BIO/REX-*` |
| **BSC** — bioscience repo compliance scans (`stem-bio-ai/`) | [`playbook-bsc.md`](./playbook-bsc.md) | `DI-BSC-*` |
| **M&F** — methodology, templates, dashboards (`extra/`) | [`playbook-mf.md`](./playbook-mf.md) | `DI-SDK-*` |
| **Any lane** — API build, OPSEC sanitizer, UI/UX SDK, archive inspector, glossary | [`playbook-common.md`](./playbook-common.md) | `DI-API/SAN/SDK-*` |

**Rule of thumb:** lane file + `playbook-common.md` is all a single task needs. Publishing any experiment touches `playbook-common.md` (the API build + OPSEC gate apply to every lane).

---

## Lane map

1. **EQA** (Equation-to-Artifact) — does running an implementation reproduce a paper's claimed numerical results, at stated precision, under stated conditions? Gate on SPAR/Omega.
2. **BAV** (Biomolecular AI Validation) — does an entire biomedical AI *pipeline* (RExSyn + NNSL + LawBinder) deserve trust? Model disagreement is signal, not noise.
3. **BSC** (Bioscience Compliance) — static, zero-execution safety scans of public bioscience repos, mapped to MIT AIRI tiers (T0→T3).
4. **M&F** (Methodology & Frameworks / Extra) — reusable review templates, methodology blueprints, auditor dashboards. Not experiment runs.

---

## Companion memory (not lane playbooks)

- [`credibility-architecture.md`](./credibility-architecture.md) — provenance classing, understatement posture, reproduction anchors, citable metadata (Pillars 1-2-3).
- [`eqa-reconstruction-standard.md`](./eqa-reconstruction-standard.md) — append-only, point-of-use reconstruction standard for the 0001–0051 EQA archive.
- `verification-ledger.mica.archive.json` — design-invariant registry (the `DI-*` rules cited throughout; loaded always).

---

## Maintenance

- Adding/editing a rule: put it in the lane file (or `playbook-common.md` if cross-lane), cite the governing `DI-*`. Add the DI to the archive first if it doesn't exist.
- Keep this index slim — it is loaded every session. Detail belongs in the lane files.
- MICA package contract: `mica.yaml` (`mica_spec: 0.2.8`). Lane playbooks are `loading_hint: on_demand`; this index + the archive + credibility-architecture are `always`.
