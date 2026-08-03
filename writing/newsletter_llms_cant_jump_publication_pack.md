# Publication pack — “We Tried to Operationalize the Jump”

This is an editorial handoff, not evidence. It keeps publication mechanics out of the bounded TOE-TEST-0060 result.

## Canonical links

| Surface | URL / source |
|---|---|
| Paper | https://openreview.net/forum?id=klU4737opt |
| Public ledger record | https://flamehaven01.github.io/Flamehaven-Verification-Ledger/eqa.html#toe-test-0060 |
| Public ledger API | https://flamehaven01.github.io/Flamehaven-Verification-Ledger/api/v1/runs/toe-test-0060.json |
| Draft source | `writing/newsletter_llms_cant_jump_draft.md` |
| Claim ledger | `writing/newsletter_llms_cant_jump_claim_ledger.md` |

When the newsletter has a canonical `flamehaven.space/writing/...` URL, add it to the 0060 card/report as an editorial companion. Do not substitute that URL for the raw-result or reproduction links.

## Visual insertion plan

1. **After “Where the admission contract broke”** — add a minimal feasible-region figure:
   - x-axis: `max_single` overlap;
   - constraints: `>= 0.92` and `<= 0.90`;
   - label: “empty feasible region in the recorded biomedical profile.”
   - source caption: `TOE-TEST-0060 · CHAR-012 · configuration fact, not capability result`.

2. **After “Why the ledger is part of the scientific work”** — add a screenshot of the live TOE-TEST-0060 inspector:
   - include the Analysis crosswalk and Verified Rules tabs;
   - retain the visible `ABSTAIN` label;
   - do not crop out the non-claim boundary.

3. **Optional timeline figure** — use only the four public source links listed in the newsletter table. Caption it “public implementation history, not a priority claim.”

## Release gate

- Replace the draft-status line with the canonical newsletter URL.
- Add that public URL to the 0060 editorial companion only after publication.
- Run the ledger sanitizer and API drift check if any ledger-facing Markdown changes.
- Create a version tag/release only after the article URL and visual assets are final; 0060 currently has no release tag of its own.
