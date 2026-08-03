# TOE-TEST-0060 Claim Ledger

| Claim | Evidence class | Artifact location | Boundary |
|---|---|---|---|
| The upstream characterization test completed successfully. | Executable repository test | `verification_result.json → executed_check` | It proves the recorded test contract, not a product PASS. |
| The recorded before-image has 12 generated and 0 accepted candidates. | Source-controlled characterization observation | `verification_result.json → observations.char_011` | One fixture and one source snapshot only. |
| The biomedical profile has an empty feasible region under its shared overlap quantity. | Derived configuration constraint | `verification_result.json → observations.char_012` | A configuration fact, not an empirical biomedical claim. |
| The result does not establish an LLM-abduction or world-model thesis. | Explicit non-claim | `verification_result.json → claim_boundary` | ABSTAIN is intentional. |

## Provenance rule

All input identity is represented by content hash and repository revision in `verification_result.json`; source locations are labels, not private filesystem paths. `reproduction_receipt.json` records the replay command and explicitly reports whether the upstream worktree was clean.

## Editorial link

The companion newsletter draft may interpret the engineering lesson, but this ledger record is authoritative for the bounded executable result: [newsletter draft](../../writing/newsletter_llms_cant_jump_draft.md).
