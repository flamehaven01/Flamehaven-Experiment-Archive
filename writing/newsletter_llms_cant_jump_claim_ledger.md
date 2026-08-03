# Pre-publication claim ledger — "When We Tried to Operationalize the Jump"

**Status:** Draft-supporting record. The canonical bounded experiment is [TOE-TEST-0060](../eqa/toe-test-0060/analysis_report.md); neither record supports a general claim about LLM ability.

## Purpose

Give editorial reviewers a compact provenance record for every quantitative statement in the newsletter draft. The executable source snapshot and its content-addressed receipt are in TOE-TEST-0060.

## Scope and source state

| Field | Value |
|---|---|
| Paper input | Local text copy; identity represented by SHA-256 below |
| Paper SHA-256 | `e29b95642f42746a992be36a12f9db25b1b37caf35bc3d021c726124633e2d02` |
| LOGOS HEAD at re-run | `e8c1357259a6b489eb36a71b3224dcd7317c65c8` |
| Worktree state | Dirty; 59 paths at inspection. Publication must use a clean or explicitly captured patch state. |
| Characterization baseline SHA-256 | `d943a0baa5fa402e1e7b401b293e3a3240b6b7b353d20363690493bb683598bd` |
| Test source SHA-256 | `6d66542287725e6ff427934f90d93e9fd73a4f498ea954d87b945d44a556b6e3` |
| Runner source SHA-256 | `68182a5e71ef99c51b6c5d30371bde0d1101995b987f3df89b2fca2ed6886089` |
| Config SHA-256 | `d95ba437d3baa5cb83ba522a7c33397666df75ef85ba06483d4ac2299bd47073` |
| Re-run environment | Captured by the executable TOE-TEST-0060 receipt |

## Reproduction command

```text
python eqa/toe-test-0060/run_dogfood.py --logos-root <logos-checkout> --paper-source <paper-text-copy>
```

Observed result on the stated worktree:

```text
collected 2 items
tests\characterization\test_char_missing_link_accept.py ..
2 passed
```

The tests are *inverted characterization contracts*: a remediation that changes the currently pinned defective behavior is expected to make the matching pre-remediation assertion fail and require an updated measured record.

## Evidence table

| Newsletter statement | Evidence | Classification | Boundary |
|---|---|---|---|
| Peirce-style deduction / induction / abduction framing | Paper Sections 1–4 | EXTERNAL | The paper's framework, not independently validated by this ledger. |
| Paper shifts from formal abduction to embodied/manipulative simulation | Paper Sections 1 and 4 | ANALYTIC INTERPRETATION | Editorial critique; reasonable readers may disagree. |
| Missing Link defines novelty as `1 - overlap` | `missing_link/runner.py`, `_estimate_novelty` | DERIVED FROM CODE | Exact source hash above. |
| Strict ranking requires omega, novelty, plausibility, and `grounding.status == clean` | `missing_link/runner.py`, `_rank` | DERIVED FROM CODE | The newsletter condenses list-comprehension syntax only. |
| Biomedical profile implies an empty region | `config/default.yaml` plus `tests/characterization/test_char_missing_link_accept.py` | MATHEMATICAL DERIVATION | Only when `novelty_overlap_mode=max`; \(n=1-o\), \(o\ge.92\), \(n\ge.10\). |
| General probe generated 12 candidates, accepted 0 | `docs/characterization_baseline.json`, `CHAR-011` | RECORDED EXECUTION | Specific evidence/query/configuration; not a model-capability benchmark. |
| Max grounding `.157894...`, threshold `.9`, omega `.444`, all 12 query restatements | `CHAR-011` | RECORDED EXECUTION | Do not generalize beyond this probe. |
| Cross-domain no-go verdict depends on `SIGN_BARRIER_MAP` | `nogo_missing_link_experiment.py` | DERIVED FROM CODE | This is a calibration/architecture finding, not a claim that all validation is tautological. |

## Non-claims

- This record does **not** prove that LLMs cannot abduct.
- It does **not** show that embodiment or a world model is necessary or sufficient for scientific discovery.
- It does **not** validate the Missing Link pipeline as a biomedical discovery system.
- It does **not** turn the bounded TOE-TEST-0060 configuration audit into a general scientific result.

## Follow-up gate after TOE-TEST-0060

Before the newsletter is published as an Equation to Artifact entry, obtain:

1. A clean LOGOS revision or an explicit patch bundle.
2. A public archival paper anchor in addition to the captured SHA-256.
3. The exact evidence input, domain profile, command, dependency versions, and raw outputs for an after-image.
4. A metric contract that separates novelty, coverage, max-single overlap, and any executable/intervention verifier.
5. A report containing both supported observations and non-claims.
6. A held-out or independently anchored benchmark before any capability claim.
