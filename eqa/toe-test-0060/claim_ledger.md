# TOE-TEST-0060 Claim Ledger

| Claim | Evidence class | Artifact location | Boundary |
|---|---|---|---|
| The position paper supplies a question about an abductive jump; 0060 supplies a bounded implementation crosswalk. | External position paper + derived crosswalk | [`analysis_result.json`](analysis_result.json) → `paper_anchor`, `paper_to_code_map` | It does not adopt or prove the paper’s structural-incapability thesis. |
| The upstream characterization test completed successfully. | Executable repository test | `verification_result.json → executed_check` | It proves the recorded test contract, not a product PASS. |
| The recorded before-image has 12 generated and 0 accepted candidates. | Source-controlled characterization observation | `verification_result.json → observations.char_011` | One fixture and one source snapshot only. |
| The biomedical profile has an empty feasible region under its shared overlap quantity. | Derived configuration constraint | `verification_result.json → observations.char_012` | A configuration fact, not an empirical biomedical claim. |
| No action-controllable world-model or intervention verifier was exercised. | Fixture-scope inspection | `analysis_result.json → paper_to_code_map[3]` | 0060 cannot evaluate the paper’s proposed solution. |
| The result does not establish an LLM-abduction or world-model thesis. | Explicit non-claim | `verification_result.json → claim_boundary` | ABSTAIN is intentional. |

## Provenance rule

All input identity is represented by content hash and repository revision in `verification_result.json`; source locations are labels, not private filesystem paths. `reproduction_receipt.json` records the replay command and explicitly reports whether the upstream worktree was clean.

## Editorial link

The companion newsletter draft may interpret the engineering lesson, but this ledger record is authoritative for the bounded executable result: [newsletter draft](../../writing/newsletter_llms_cant_jump_draft.md).

**Public paper anchor:** [Tom Zahavy, “Position: LLMs can't jump” (OpenReview)](https://openreview.net/forum?id=klU4737opt).
