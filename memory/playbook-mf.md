# Playbook — M&F Lane (Methodology & Frameworks)

> Lane playbook, loaded **on_demand** when working on the Extra / Methodology & Frameworks section (`extra/`).
> Shared protocols (UI/UX SDK, OPSEC sanitizer) live in [`playbook-common.md`](./playbook-common.md).
> DI namespace: `DI-SDK-*` (shared UI/UX). Index: [`verification-ledger-playbook.md`](./verification-ledger-playbook.md).

Methodology & Frameworks (a.k.a. the **Extra** lane) surfaces reusable review templates, methodology blueprints, and independent-auditor dashboards — not experiment runs. Example live artifact: the Agent Review Dashboard (PR Action Plan) at `extra/pr_action_plan_v3.html`.

---

## M&F.0 Registry-Driven Section Pattern

The section is **not** hardcoded in `index.html`. Entries come from `js/extra-registry.js` (`EXTRA_REGISTRY`) and are rendered into the sidebar and main-content lists by `js/extra-renderers.js`.

`EXTRA_REGISTRY` has three category arrays:

| Category | Purpose |
|---|---|
| `templates` | Blank reusable templates (e.g. HTML Effectiveness Template) |
| `frameworks` | Methodology blueprints / review frameworks |
| `practicalCode` | Runnable / copy-paste practical code artifacts |

**To add an entry:** push one object to the appropriate category array. The renderer picks it up automatically — `index.html` is never edited.

**Entry shape:**
```js
{
  id: 'effective-html-template',
  name: 'HTML Effectiveness Template',
  nameTitle: 'HTML Effectiveness Template — Blank reusable template based on html-effectiveness framework',
  meta: 'html-effectiveness framework \xb7 Blank reusable \xb7 9 document types \xb7 Zero dependencies',
  tier: 'v1',
  viewerArgs: [
    'effective-html-template',                 // id
    './extra/effective_html_template.html',    // report (html)
    '', '', '',                                // reportMd, reportJson, reportPdf (empty if none)
    'HTML Effectiveness Template',             // viewerTitle
    'Blank template \xb7 html-effectiveness framework \xb7 9 document types', // viewerEyebrow
  ],
}
```

- `viewerArgs` is the positional argument list passed to `openReportViewer(...)`. Leave a slot as `''` when that format (MD / JSON / PDF) does not exist — empty download buttons are suppressed.
- ASCII-safety: use `\xb7` for the `·` separator in `meta` / eyebrow strings (matches the BSC/EQA registry convention).
- Artifacts live under `extra/`. They must pass the OPSEC sanitizer like any published file (see [`playbook-common.md`](./playbook-common.md) §OPSEC).

---

## M&F.1 Inline-Handler Safety

Any inline `onclick` that interpolates registry data into a double-quoted attribute must use single-quoted JS string literals, never `JSON.stringify`. See the BSC lane note (DI-SDK inline-onclick) — the same EOF `Unexpected end of input` trap applies to every registry-driven section.
