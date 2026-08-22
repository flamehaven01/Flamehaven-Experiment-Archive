# Flamehaven Knowledge Extractor v6.8.3a
## Provenance Closure — Freeze-Ready Instrumented Single-Pass Baseline

```yaml
SPEC:
  name: Flamehaven-Knowledge-Extractor
  version: "6.8.3a"
  schema: flamehaven-v2
  semantic_parent: "6.8.3"
  release_class: provenance-closure
  execution_model: single-pass
  purpose: source -> claim_graph -> auditable_knowledge
```

---

# 0. CONTROL

RFC semantics:

```text
MUST      required
MUST_NOT  forbidden
SHOULD    preferred unless a higher-precedence rule conflicts
MAY       optional
```

Precedence:

```text
INVARIANT
> SOURCE
> PROVENANCE
> CONTRACT
> COVERAGE
> RETRIEVAL
> COMPRESSION
> STYLE
```

Doctrine:

```text
ABSTAIN > FABRICATE
SOURCE_FORM > MODEL_REPAIR
STRUCTURE_FIRST > LINEAR_READ
PRESERVE_FIRST > RECONCILE_LATER
SEMANTICS > SERIALIZATION
NOT_RUN != RUN_NONE
CHECK != VERIFICATION
SOURCE != IR
CLAIM_CLASS != VALIDATION_STATE
RETRIEVAL_DECISION != RETRIEVAL_EXECUTION
RETRIEVAL_EXECUTION != MODEL_ASSERTION
CORRECT_CONTENT != VALID_PROVENANCE
MODEL_TEXT != RUNTIME_ATTESTATION
GRAPH_TAINT != SEMANTIC_INVALIDITY
```

[R-CTL-001] MUST treat model memory only as a parsing/query-construction aid, never as evidence.

[R-CTL-002] MUST_NOT allow factual correctness to compensate for invalid provenance.

[R-CTL-003] MUST apply the precedence order above whenever lower-level rules conflict.

---

# 1. EXECUTION STATE

Internal unless explicitly mapped to output:

```yaml
STATE:
  source_profile: []
  domain_profile: []
  coverage: {}
  external_claims: {}
  candidate_groups: {}
  contract_findings: {}
  retrieval_decision: null
  retrieval_events: {}
  supplemental: {}
  validation: {}
  provenance_taint: {}
```

Internal execution IR includes:

```text
coverage
candidate_groups
contract-scan scratch state
retrieval-decision logic
provenance-taint graph
```

[R-STA-001] MUST_NOT treat execution IR as source knowledge.

[R-STA-002] MUST preserve SOURCE_ACCESS independently of IR whenever a semantic decision depends on source meaning.

---

# 2. SOURCE / DOMAIN AXES

Orthogonal axes:

```text
source_profile := document morphology
domain_profile := semantic contract overlay
```

Source profiles:

```text
research-paper
technical-document
youtube-transcript
```

Domain profiles:

```text
bio
```

[R-PRO-001] MUST_NOT create combined profile names such as `bio-research-paper`.

Domain assignment precedence:

```text
explicit caller assignment
> automatic semantic assignment
> []
```

Auto-assign `bio` only when MATERIAL PRIMARY content depends on:

```text
biological entity
assay/readout
organism/cell/tissue/sample
biological sequence/structure
biological database/reference system
biological quantitative interpretation
```

[R-PRO-002] MUST_NOT assign `bio` from venue, journal, affiliation, title keyword, or incidental example alone.

[R-PRO-003] MUST_NOT create a knowledge claim solely to announce profile assignment.

---

# 3. SOURCE BOUNDARY

PRIMARY:

```text
canonical/supplied source material directly available to extraction
```

SUPPLEMENTAL:

```text
inspectable source obtained through an attested external retrieval event
```

PRIMARY is canonical only for what PRIMARY states.

[R-SRC-001] MUST_NOT reconstruct missing PRIMARY from model memory.

[R-SRC-002] MUST_NOT rewrite PRIMARY using SUPPLEMENTAL.

[R-SRC-003] MUST_NOT silently repair source defects.

[R-SRC-004] MUST_NOT use remembered citations, URLs, titles, authors, claims, or mappings as retrieved EXTERNAL evidence.

No usable PRIMARY:

```text
[UNKNOWN: no usable PRIMARY source supplied]
```

## 3.1 Source lexical preservation

Titles, identifiers, symbols, names, quoted terminology, and source-authored labels are source objects.

[R-SRC-005] MUST preserve those objects verbatim when materially reproduced.

[R-SRC-006] MUST_NOT classify awkward wording, duplicated-looking tokens, unusual grammar, unconventional spelling, or suspicious typography alone as typo/error/defect.

A correction may be asserted only from:

```text
authoritative corrected version
explicit erratum
unambiguous source-internal correction
```

[R-SRC-007] MUST preserve the original source form when no such correction evidence exists.

---

# 4. SINGLE-PASS LOGICAL PIPELINE

Execute logically:

```text
A ACQUIRE
B MAP
C EXTRACT_EXTERNAL
D FORM_GROUPS
E CONTRACT_SCAN
F DECIDE_RETRIEVAL
G EXECUTE_RETRIEVAL_IF_RUNTIME_ALLOWS
H SYNTHESIZE
I INLINE_CHECK
J COMPRESS
K SERIALIZE
```

Logical ordering does not imply independent inference calls.

[R-PIPE-001] MUST_NOT allow later phases to rewrite PRIMARY EXTERNAL claims except to split, narrow, or remove unsupported material.

[R-PIPE-002] MUST keep semantic extraction distinct from serialization.

---

# 5. MAP / COVERAGE

Research-paper material surfaces:

```text
problem
formalism
architecture
I/O/interfaces/state
algorithm/control
equations
thresholds/constants
experimental_setup
splits
controls
ablations
failure_modes
limitations
tables
figures
appendices
supplements
```

Coverage map is a hypothesis, not ground truth.

[R-COV-001] MUST_NOT interpret `coverage complete` as independently verified source completeness.

---

# 6. EXTRACTION PRIORITY

## research-paper

Tier A:

```text
formal_problem
architecture
interfaces/state
algorithm/control
material_equations
thresholds/constants
experimental_boundaries
controls
ablations
failure_modes
limitations
implementation_appendix
contract_relevant_repetitions
```

Tier B:

```text
results
metrics
baselines
datasets/splits
samples/seeds
models
generalization
assumptions
```

Tier C:

```text
motivation
related_work
framing
generic_conclusion
```

Priority:

```text
Tier-A > Tier-B > Tier-C
```

## technical-document

Prefer:

```text
interface/API/config
runtime_behavior
constraint/invariant
architecture/workflow
failure
version-sensitive behavior
quantitative evidence
migration/tradeoff
canonical resource
```

## youtube-transcript

Prefer:

```text
thesis
mechanism
speaker claim
demonstration
quantitative claim
recommendation
resource
limitation
implementation/failure
```

[R-EXT-001] MUST keep source-authored recommendations EXTERNAL rather than reclassifying them as ADVISORY.

---

# 7. KNOWLEDGE VALUE GATE

Prefer:

```text
exact_trigger > broad_mechanism
mutation_semantics > action_name
interface > generic_architecture
constraint > narrative
literal_equation > paraphrase
ablation > headline
experimental_boundary > generalization
failure_condition > optimistic_summary
implementation_appendix > repeated_framing
```

[R-EXT-002] MUST remove redundant framing before dropping operational evidence.

---

# 8. CLAIM SCHEMA

Only four semantic claim classes are legal:

```text
EXTERNAL
DERIVED
ADVISORY
UNKNOWN
```

[R-CLM-001] MUST_NOT invent semantic classes such as INLINE_FLAG, CERTIFIED, VALIDATED_CLAIM, CONFLICT, FACT, or VERIFIED.

Validation/certification is orthogonal metadata.

## EXTERNAL

```text
C001 [EXTERNAL, origin: primary, loc: S1#...] claim
C002 [EXTERNAL, origin: supplemental, loc: R1#...] claim
```

EXTERNAL means attributable, not independently verified.

## DERIVED

```text
C003 [DERIVED, from: C001+C002, confidence: high] claim
```

## Contract DERIVED

```text
C004 [DERIVED,
      from: C001+C002,
      confidence: high,
      contract: <surface>/<label>,
      validation: L1/self_checked,
      group: G003] finding
```

Optional:

```text
cross: <secondary_surface>
```

## ADVISORY

```text
C005 [ADVISORY, basis: C003+C004, confidence: medium] recommendation
```

## UNKNOWN

```text
C006 [UNKNOWN] unresolved evidence/provenance/relation
```

Confidence:

```text
high
medium
low
```

[R-CLM-002] MUST attach `contract:` only to contract findings.

[R-CLM-003] MUST keep claim class separate from validation state.

---

# 9. CLAIM ID

IDs:

```text
C001...
```

[R-ID-001] MUST mint C-IDs monotonically and never reuse them.

[R-ID-002] MUST preserve an existing C-ID under UPDATE when proposition and provenance anchors remain materially unchanged.

Split:

```text
new IDs
supersedes: Cxxx
```

[R-ID-003] MUST use new IDs for semantic split children and record `supersedes`.

[R-ID-004] MUST retain an ID when narrowing does not materially change the proposition identity.

[R-ID-005] MUST_NOT create parallel validation namespaces such as `CF001-status` or `CF001-certification`.

---

# 10. RETRIEVAL ATOMICITY

Prefer one independently retrievable proposition.

Split when sub-statements have different independently queryable:

```text
semantic subjects
denominators
metrics
scopes
experimental conditions
downstream uses
contract roles
```

Multiple values may remain together only when they share:

```text
same entity
same experimental condition
same metric/statistic family
same locator context
natural joint-query semantics
```

[R-ATOM-001] MUST_NOT split merely because multiple numbers occur.

[R-ATOM-002] MUST split materially independent propositions when their retrieval/use semantics differ.

[R-ATOM-003] MUST_NOT combine source fact + model interpretation + recommendation in one claim.

---

# 11. LOCATORS

Priority:

```text
timestamp
exact heading
equation
table
appendix
paragraph
```

Examples:

```text
S1#Eq2
S1#Table8
S1#AppendixB.3
S1#H:"3.4 Latent Space Direct Organization"
```

Composite locator:

```text
S1#Table2+S1#Table7
```

[R-LOC-001] MUST_NOT invent a locator.

[R-LOC-002] MUST bind every EXTERNAL claim to a source locator.

---

# 12. MATERIAL EQUATION DUAL CHANNEL

Material equations include:

```text
objective
loss
reward
probability
normalization
update
state transition
significance
constraint
score
threshold
derived metric
```

For each material equation preserve two logically distinct channels.

## 12.1 source_form

```text
source_form := literal or closest transport-faithful representation
               available from the accessible source
```

Preserve:

```text
variables
operators
constants
indices
inequalities
suspicious notation
malformed notation
```

Fidelity:

```text
source_form_fidelity: exact|closest
```

[R-EQ-001] MUST include `source_form` for every material equation.

[R-EQ-002] MUST preserve malformed/suspicious notation rather than silently fixing it.

[R-EQ-003] MUST attach a locator to every material equation.

## 12.2 normalized_rendering

Optional readability view.

May normalize render-level features only:

```text
whitespace
Unicode/subscript presentation
LaTeX syntax
bracket rendering
visually recoverable index placement
```

[R-EQ-004] MUST_NOT add/remove operators, change denominators, inequalities, quantifiers, variable bindings, domains, or other mathematical semantics in `normalized_rendering`.

[R-EQ-005] MUST emit `normalized_rendering: UNKNOWN` or a separate DERIVED interpretation when normalization requires semantic inference.

`source_form` is evidence; `normalized_rendering` is a view.

---

# 13. CLOSED-WORLD DERIVATION

Permitted without external evidence:

```text
arithmetic(source values)
algebra(source forms)
exact numeric comparison
exact/string comparison
set comparison
ordering comparison
column alignment
source-internal definition comparison
source-internal semantic contradiction
explicit SI-prefix conversion
```

Not evidence:

```text
remembered mathematical convention
remembered biological convention
remembered model behavior
remembered database mapping
unstated domain convention
```

[R-DER-001] MUST_NOT use remembered convention/domain knowledge as source evidence.

[R-DER-002] MUST route convention-only suspicion to SUPPLEMENTAL retrieval or UNKNOWN.

---

# 14. CONTRACT CANDIDATE GROUPS

Group:

```text
source locations/claims potentially defining one shared contract
```

IDs:

```text
G001...
```

Minimum internal schema:

```yaml
id: G001
surface_hint: table_contract
members:
  - S1#Table2
  - S1#Table7
  - S1#Table8
triggers:
  - repeated_metric
  - repeated_entity
```

Triggers include:

```text
same/repeated equation symbol
same metric name
same parameter
same identifier/entity
same dataset/split
same total/components
same table entity
main-text <-> appendix reference
formula <-> implementation constant
raw <-> normalized representation
definition <-> later definition
ranking statement <-> table
broad claim <-> quantified qualification
```

[R-GRP-001] MUST form groups from both source structure and extracted EXTERNAL claims.

[R-GRP-002] MUST treat a group as a seed, not a fence.

Group expansion may follow direct adjacency:

```text
explicit cross-reference
same identifier
same metric
same symbol
same parameter
same table/entity binding
same quantified proposition
```

[R-GRP-003] MUST_NOT perform unrestricted anomaly hunting unrelated to a material group trigger.

---

# 15. CONTRACT SCAN OBLIGATION

For each material candidate group:

```text
1 inspect all known members
2 bind entity/scope/definition
3 compare source-stated conditions
4 test relation compatibility
5 calibrate qualification vs conflict
6 assign outcome
7 emit every material non-compatible result
```

Outcomes:

```text
compatible
compatible_after_explicit_transformation
scale_or_normalization_difference
unresolved_tension
hard_conflict
probable_source_or_table_defect
UNKNOWN
```

[R-CON-001] MUST emit a Contract DERIVED claim or UNKNOWN for every material non-compatible outcome.

[R-CON-002] MUST_NOT treat extraction of both members as equivalent to relation testing.

---

# 16. UNIVERSAL CONTRACT CHECKS

Compare:

```text
equation <-> equation
equation <-> prose
equation <-> significance criterion
definition <-> definition
main <-> appendix
formula <-> implementation
dynamic rule <-> fixed value
normalized <-> raw
sample <-> aggregate
table <-> table
table <-> prose
total <-> components
metric <-> reported scale
ranking <-> source values
parameter <-> reproduction setting
broad statement <-> quantified qualification
```

Generic surfaces:

```text
implementation_contract
definition_contract
table_contract
numeric_contract
mathematical_contract
```

---

# 17. CONTRACT LABEL CALIBRATION

`compatible_after_explicit_transformation`:

```text
forms reconcile under an explicit source-bounded transformation
```

`scale_or_normalization_difference`:

```text
scale/normalization differs; raw forms remain preserved
```

`unresolved_tension`:

```text
statements differ materially but evidence does not establish incompatibility
```

`probable_source_or_table_defect`:

```text
positive source-internal structural evidence exists
```

Examples:

```text
duplicated sequence
misplaced column
contradictory equation structure
impossible source-internal mapping
self-contradictory terminology in the same binding frame
```

[R-CON-003] MUST_NOT repair the source while reporting a contract finding.

`hard_conflict` is allowed only after §18.

---

# 18. HARD-CONFLICT RELATION GATE

Before `hard_conflict`, establish:

```text
entity binding
operational-definition binding
condition/time binding
unit/scale binding when material
scope_relation
quantifier_relation
modality_relation when material
proposition polarity
```

Scope relation:

```text
same
subset
superset
overlap
disjoint
unknown
```

Quantifier relation:

```text
same
entails
counterexample
compatible
unknown
```

Modality relation:

```text
same
stronger
weaker
incompatible
unknown
```

Polarity relation:

```text
same
opposed
unknown
```

Then test joint satisfiability under source-stated semantics.

[R-CON-004] MUST permit `hard_conflict` only when no jointly satisfying interpretation remains under the established bindings.

[R-CON-005] MUST_NOT require identical quantifiers/scopes when a subset/counterexample relation is sufficient to prove contradiction.

[R-CON-006] MUST_NOT escalate broad rhetorical wording plus rare quantified exceptions directly to `hard_conflict` when source qualification can coherently narrow the broad form.

Escalation preference:

```text
QUALIFICATION
> UNRESOLVED_TENSION
> HARD_CONFLICT
```

[R-CON-007] MUST_NOT use this preference to suppress a genuine contradiction once relation bindings prove incompatibility.

Example A:

```text
"strategy is locked"
+
2.08% observed strategy-state changes
```

Normally -> qualification such as `revision is rare rather than literally absent`, unless the source explicitly defines the first proposition as exceptionless over the identical operational frame.

Example B:

```text
All X satisfy P.
x1 ∈ X and x1 does not satisfy P.
```

If predicate/condition/membership bindings hold, `hard_conflict` is permitted via `scope_relation=subset`, `quantifier_relation=counterexample`, `polarity_relation=opposed`.

---

# 19. SURFACE SELECTION

[R-SRF-001] MUST assign exactly one primary contract surface per finding.

Secondary dimensions may use:

```text
cross: <surface>
```

[R-SRF-002] MUST_NOT duplicate a finding solely to encode multiple surfaces.

Generic fallback:

```text
implementation_contract
> definition_contract
> table_contract
> numeric_contract
> mathematical_contract
```

BIO uses the most specific applicable BIO surface first.

---

# 20. CROSS-VALUE BINDING

Before comparing values verify compatible:

```text
entity
dataset
metric
split
target
seed/sample scope
post-processing
unit
scale
condition
```

Preserve distinctions:

```text
best != mean
one_seed != method
subset != full
raw != normalized
representative_run != all_runs
experimental_value != required_threshold
```

[R-BIND-001] MUST_NOT infer comparability from name/value similarity alone.

---

# 21. INTEGER IDENTITY

Evaluate only when:

```text
same entity
+
same accounting frame
+
components stated or materially implied as partition/breakdown
```

Explicit exhaustive partition + nonzero mismatch:

```text
hard_conflict permitted
```

Implied but non-exhaustive partition:

```text
unresolved_tension
```

Different scope/unsupported partition:

```text
do not sum merely because arithmetic is possible
```

[R-NUM-001] MUST_NOT suppress integer/cardinality discrepancies with relative numeric thresholds.

[R-NUM-002] MUST emit every valid material integer-identity discrepancy individually.

---

# 22. CONTINUOUS NUMERIC MATERIALITY

For approximate/continuous values emit discrepancy when any:

```text
relative difference >= 0.1%
ranking changes
significance changes
threshold crossing changes
categorical interpretation changes
structural evidence exists
```

[R-NUM-003] MUST_NOT apply this relative threshold to integer identity.

---

# 23. BIO OVERLAY

When `bio` is active scan:

```text
unit_contract
identifier_contract
assay_contract
replicate_contract
statistical_contract
confidence_contract
version_contract
naming_contract
leakage_contract
```

## Applicability gate

[R-BIO-001] MUST_NOT create a BIO finding from missing metadata alone.

A BIO finding requires material relevance to:

```text
claim binding
comparison
interpretation
reproduction
generalization
validation
```

### identifier_contract

Bind when material:

```text
identifier system
accession
species
ortholog/paralog
isoform
construct
mutation/variant
chain
complex composition
```

[R-BIO-002] MUST_NOT treat name match alone as identity equivalence.

SUPPLEMENTAL identity resolution:

```text
PRIMARY EXTERNAL: original terminology
SUPPLEMENTAL EXTERNAL: retrieved authoritative mapping
DERIVED: mapping relation
```

[R-BIO-003] MUST_NOT silently rewrite PRIMARY terminology using supplemental identity mappings.

### assay_contract

Check:

```text
assay modality
biological system
sample type
endpoint
exposure
time point
unit
transform
```

Same entity != comparable measurement.

### replicate_contract

Distinguish:

```text
biological replicate
technical replicate
repeated measurement
donor/sample count
statistical unit
```

`measurement_count != independent_n`

### statistical_contract

Bind:

```text
experimental unit
replicate type
n
estimand
effect size
test
multiple-testing family
correction
raw/adjusted statistic
threshold
CI
```

### confidence_contract

Metric-name equality != semantic equivalence.

Bind:

```text
tool/model
version/weights
metric definition
scale
aggregation level
residue/chain/interface/complex scope
reference frame
alignment subset
evaluation dataset/version
```

### leakage_contract

Check material:

```text
duplicate
near duplicate
sequence identity
homolog
ortholog
structural template
shared component
donor/sample
batch
temporal overlap
database snapshot
benchmark cutoff
```

[R-BIO-004] MUST_NOT infer proven leakage solely because a leakage control is unreported.

---

# 24. MODALITY / SCOPE

Preserve universally:

```text
may != will
supports != proves
association != causation
reduces != prevents
best != typical
one_seed != method
subset != full
experimental_choice != requirement
mechanism != ablation
source explanation != independently validated explanation
suspicion != confirmed defect
rare != never
dominant != universal
```

BIO additionally:

```text
in_vitro != in_vivo
in_silico != experimentally_validated
binding != functional_activity
technical_replicate != biological_replicate
cell_line != primary_cell
one_species != conserved
high_pLDDT != correct_structure
high_confidence != validated_complex
docking_score != measured_affinity
nominal_p != adjusted_p
statistical_significance != biological_significance
sequence_identity != functional_equivalence
```

[R-SCP-001] MUST preserve modality and scope distinctions when extracting or deriving claims.

---

# 25. QUALIFICATION SCAN

Compare broad/repeated formulations across:

```text
Abstract
Introduction
Results
Discussion
Conclusion
Appendix
Tables
```

[R-QUAL-001] MUST preserve source statements separately rather than silently reconciling them.

[R-QUAL-002] MUST emit a descriptive DERIVED qualification when later/more specific source evidence materially narrows a broad statement.

Examples:

```text
best run != typical run
one dataset != universal behavior
rare exceptions != zero exceptions
high technical metric != biological usefulness
```

---

# 26. DERIVED ENTAILMENT

Every material DERIVED element requires support for:

```text
number/range
entity
mechanism
comparison
causality
scope
threshold
mathematical relation
normalization
necessity
generalization
independence
experimental boundary
```

[R-DER-003] MUST bind every material DERIVED claim to `from:` support.

If unsupported:

```text
add EXTERNAL support
or narrow
or split
or remove
or UNKNOWN
```

[R-DER-004] MUST_NOT use confidence as a substitute for evidence.

---

# 27. DERIVED / ADVISORY BOUNDARY

DERIVED is descriptive/analytical.

New normative language normally implies ADVISORY:

```text
should
must
recommend
use
avoid
prefer
consider
deploy
require
ought
```

[R-ADV-001] MUST scan DERIVED claims for new normative language before output.

[R-ADV-002] MUST rewrite analytical DERIVED claims descriptively when normative wording is accidental.

[R-ADV-003] MUST classify genuinely new prescriptions as ADVISORY.

[R-ADV-004] MUST keep source-authored recommendations EXTERNAL.

---

# 28. RETRIEVAL DECISION

Set:

```text
decision: not_needed
```

only if all:

```text
no material external quantitative attribution
no material cited paper/repo/dataset/spec/docs requiring inspection
no version-sensitive external behavior
no central claim materially benefits from authoritative clarification
```

Otherwise:

```text
decision: required
```

Default budget:

```yaml
retrieval_budget:
  queries: 3
  supplemental_sources: 5
```

Preferred source order:

```text
original paper
official standard/spec
official docs
first-party repo
benchmark/dataset docs
reputable technical analysis
practitioner source
community
```

[R-RET-001] MUST keep retrieval decision separate from retrieval execution.

[R-RET-002] MUST_NOT infer that retrieval occurred merely because retrieval is required.

---

# 29. RETRIEVAL EVENT AUTHORITY

A retrieval event exists only when attested by:

```text
execution runtime
tool transcript
explicit runtime-supplied retrieval receipt
```

[R-RET-003] MUST_NOT allow the generator to invent, infer, reconstruct, or self-attest a retrieval event.

[R-RET-004] MUST_NOT allow the generator to mint a valid RET-ID from model text alone.

State schema:

```yaml
external_retrieval:
  decision: not_needed|required
  execution: not_run|performed|unavailable
  event_count: 0
  supplemental_count: 0
```

Legal states:

```text
decision=not_needed
  -> execution=not_run
  -> event_count=0
  -> supplemental_count=0

decision=required + execution=not_run
  -> event_count=0
  -> supplemental_count=0

decision=required + execution=unavailable
  -> event_count=0
  -> supplemental_count=0

execution=performed
  -> decision=required
  -> event_count>=1
```

[R-RET-005] MUST_NOT allow illegal state combinations such as performed+event_count=0, not_run+supplemental_count>0, unavailable+supplemental_count>0, or not_needed+R-source.

---

# 30. RUNTIME ATTESTATION TRUST ROOT

L0 retrieval validation inputs:

```text
artifact
runtime_attestation_set
```

Optional/conditional:

```text
canonical_source_index
prior_execution_ledger
```

Threat model:

```text
This contract prevents generator-authored fabrication of retrieval provenance.
It does not certify a malicious or compromised execution runtime.
```

[R-ATT-001] MUST obtain `runtime_attestation_set` from the execution harness/runtime through a channel the generator cannot author.

[R-ATT-002] MUST give the generator read-only access or no write access to `runtime_attestation_set`.

Minimum runtime attestation:

```yaml
runtime_attestation:
  runtime_ref: "<runtime-controlled opaque event ID>"
  event_type: retrieval
  execution: performed
  query: "..."
  returned_sources:
    - runtime_source_ref: "<runtime-controlled source ID>"
```

[R-ATT-003] MUST treat artifact text alone as insufficient proof of runtime attestation.

---

# 31. RETRIEVAL LEDGER / CANONICAL SUPPLEMENTAL PATH

Canonical source collections:

```text
source_set.primary
source_set.supplemental
```

[R-RET-006] MUST_NOT create a second top-level supplemental source collection.

Retrieval event:

```yaml
retrieval_ledger:
  - id: RET001
    authority: runtime
    execution: performed
    runtime_ref: "<runtime-controlled opaque event ID>"
    query: "..."
    source_ids: [R1]
```

Supplemental source:

```yaml
source_set:
  supplemental:
    - id: R1
      retrieval_event: RET001
      runtime_source_ref: "<runtime-controlled source ID>"
      type: research-paper
      title: "..."
      url: "..."
      reason: "..."
```

[R-RET-007] MUST bind every R-source to exactly one valid RET event unless the runtime explicitly supports multi-event provenance.

[R-RET-008] MUST bind every R-source to a `runtime_source_ref` returned by the runtime attestation associated with its RET event.

[R-RET-009] MUST_NOT treat a bibliographic reference appearing inside PRIMARY as an R-source until separately retrieved.

Source metadata authority:

```text
runtime_source_ref := provenance-authoritative source identity
R.type / R.title / R.url / R.reason := descriptive artifact metadata
```

Display metadata does not establish provenance identity. If a runtime attestation also exposes canonical metadata or a content digest, an L0 implementation MAY compare those fields; absent such an attested binding, `runtime_source_ref` remains authoritative for source identity.

---

# 32. SUPPLEMENTAL REFERENTIAL INTEGRITY

Canonical chain:

```text
origin:supplemental claim
  -> loc:Rn
  -> source_set.supplemental[Rn]
  -> retrieval_event:RETn
  -> RET.runtime_ref
  -> runtime_attestation_set
  -> R.runtime_source_ref
  -> attestation.returned_sources
```

[R-RET-010] MUST require every edge in this chain.

[R-RET-011] MUST mark supplemental provenance invalid when any edge is missing.

[R-RET-012] MUST allow SUPPLEMENTAL to clarify/challenge PRIMARY but never overwrite PRIMARY.

---

# 33. RETRIEVAL CARDINALITY / DERIVED TELEMETRY

Authoritative collections:

```text
retrieval_ledger
source_set.supplemental
```

Derived telemetry:

```text
event_count := COUNT(unique valid RET.id in retrieval_ledger)
supplemental_count := COUNT(unique R.id in source_set.supplemental)
```

[R-RET-013] MUST treat these counts as L0-derived telemetry rather than generator authority.

[R-RET-014] MUST recompute counts deterministically when declared counts are present.

[R-RET-015] MUST fail cardinality validation when declared counts differ from recomputed counts.

[R-RET-016] MUST resolve every RET.source_ids entry to an existing R-ID.

[R-RET-017] MUST require every R-ID to reference a valid RET-ID and to appear in that RET's source_ids.

Multiple supplemental sources from one event are legal:

```text
RET001 -> [R1, R2, R3]
```

Therefore event_count and supplemental_count need not be equal.

---

# 34. PROVENANCE TAINT PROPAGATION

If an evidence node loses provenance validity:

```text
invalid R-source
  -> dependent supplemental EXTERNAL tainted
  -> declared descendants tainted
  -> semantic revalidation required
```

L0 authority:

```text
declared dependency graph traversal only
```

L1+ authority:

```text
semantic support sufficiency after taint
```

[R-TAINT-001] MUST allow L0 to identify graph descendants requiring revalidation.

[R-TAINT-002] MUST_NOT allow L0 to decide that remaining evidence semantically supports the proposition.

L0 output example:

```yaml
requires_revalidation:
  - C023
  - C041
  - C052
```

Semantic revalidation may:

```text
retain
narrow
remove invalid support
UNKNOWN
omit
```

[R-TAINT-003] MUST_NOT retain a proposition unchanged when it materially requires invalid evidence unless semantic revalidation establishes sufficient remaining support.

---

# 35. VALIDATION AUTHORITY

```text
L0 deterministic structural/provenance checks
L1 same-pass self-check
L2 independent same-model replay
L3 different-model/runtime semantic audit
L4 executable/domain validator
```

[R-VAL-001] MUST_NOT allow L1 to authorize `verified`.

L2 is independent execution, not independent epistemic authority.

[R-VAL-002] MUST_NOT allow L2 to certify locator entailment, scope preservation, modality preservation, contract label selection, or surface selection.

[R-VAL-003] MUST require L3 or applicable L4 for those judgments.

---

# 36. L0 CHECKER INTERFACE / SUBCHECK LEDGER

Interface:

```text
L0_VALIDATE(
  artifact,
  runtime_attestation_set,
  canonical_source_index?,
  prior_execution_ledger?
)
```

Trust ownership:

```text
artifact:
  untrusted generator output

runtime_attestation_set:
  trusted for runtime-event truth within stated threat model

canonical_source_index:
  trusted source-location index when supplied

prior_execution_ledger:
  trusted previous execution state when UPDATE
```

Subcheck states:

```text
pass
fail
not_run
not_applicable
```

Overall states:

```text
pass
fail
partial
```

Rules:

```text
fail
  iff any applicable required executed check fails

pass
  iff every applicable required check for supplied inputs ran and passed

partial
  iff no executed required check failed
  AND >=1 applicable required check was not_run
```

[R-L0-001] MUST_NOT emit a bare `L0 PASS` without a subcheck ledger.

[R-L0-002] MUST_NOT equate overall pass with execution of checks whose prerequisite inputs were absent.

Example:

```yaml
l0_validation:
  overall: partial
  checks:
    schema:
      status: pass
    id_graph:
      status: pass
    retrieval_state:
      status: pass
    retrieval_attestation:
      status: pass
    runtime_source_binding:
      status: pass
    retrieval_cardinality:
      status: pass
    provenance_graph:
      status: pass
    locator_existence:
      status: not_run
      reason: canonical_source_index_absent
    update_ledger:
      status: not_applicable
```

---

# 37. FAILURE CODES

L0 structural/provenance:

```text
FAIL_SCHEMA
FAIL_ID_GRAPH
FAIL_LOCATOR_MISSING
FAIL_ARITHMETIC
FAIL_RETRIEVAL_STATE
FAIL_RETRIEVAL_EVENT_MISSING
FAIL_RET_SOURCE_UNRESOLVED
FAIL_SUPPLEMENTAL_EVENT_UNRESOLVED
FAIL_RUNTIME_SOURCE_UNRESOLVED
FAIL_SUPPLEMENTAL_LOCATOR
FAIL_RETRIEVAL_CARDINALITY
FAIL_PROVENANCE_TAINT
FAIL_SERIALIZATION
```

Semantic:

```text
FAIL_EQUATION_FIDELITY
FAIL_LOCATOR_ENTAILMENT
FAIL_SCOPE_INFLATION
FAIL_MODALITY_STRENGTHENED
FAIL_DERIVED_CLOSURE
FAIL_ADVISORY_BASIS
FAIL_CONTRACT_LABEL
FAIL_SURFACE_SELECTION
FAIL_BINDING
FAIL_TIER_A_OMISSION
FAIL_CONTRACT_OMISSION
FAIL_QUALIFICATION_OMISSION
FAIL_DOMAIN_ASSIGNMENT
FAIL_PROFILE_ASSIGNMENT
FAIL_PROVENANCE_CLASS
```

[R-FAIL-001] MUST define `target`, `minimum_certifying_authority`, and `repairability` for every implemented failure code.

[R-FAIL-002] MUST classify retrieval referential-integrity failures as L0 regardless of whether claim content happens to be factually correct.

---

# 38. CONTRACT SCAN STATUS

```yaml
contract_scan:
  execution: not_run|partial|complete
  authority: L1|L2|L3|L4
  coverage: unverified|independently_audited

contract_findings:
  status: not_evaluated|none|present
```

Legal:

```text
not_run -> not_evaluated
partial -> not_evaluated|present
complete -> none|present
```

`execution: complete` means prescribed scan executed against discovered groups.

[R-CON-008] MUST_NOT interpret `execution: complete` as proof that all true source contracts were discovered.

L1 completion normally:

```text
coverage: unverified
```

---

# 39. INLINE CHECK

Before serialization check:

```text
claim IDs unique
source IDs unique
PRIMARY locators legal
material equations represented
source_form present for material equations
candidate groups formed
every material discovered group relation tested
integer identity executed
hard-conflict relation gate applied
contract labels legal
DERIVED support closure
normative DERIVED rewritten/reclassified
ADVISORY basis closure
scope/modality preserved
PRIMARY/SUPPLEMENTAL separation preserved
retrieval decision/execution state legal
every R-ID bound to RET-ID
every RET-ID externally attested
every R.runtime_source_ref bound to returned source identity
every supplemental claim resolves through R->RET->runtime source chain
provenance taint marked for revalidation
BIO applicability respected
```

[R-INL-001] MUST label this check L1/self_checked, never verified.

---

# 40. REPAIR AUTHORITY / CONVERGENCE

Validator judges; repair modifies.

Repair may:

```text
fix
split
narrow
convert UNKNOWN
omit unsupported claim
```

[R-REP-001] MUST_NOT allow validator to rewrite the artifact.

[R-REP-002] MUST_NOT allow repair to overturn a binding validator verdict.

[R-REP-003] MUST_NOT allow repair to raise validation authority or restore failed wording unchanged.

Escalation path:

```text
lower-authority verdict
-> higher-authority validator
```

Limits:

```yaml
max_repair_cycles_per_claim: 2
max_repair_calls_per_artifact: 3
```

[R-REP-004] MUST terminate unresolved repair after the configured limit.

Terminal options:

```text
unsupported EXTERNAL -> UNKNOWN or omit
unsupported DERIVED -> UNKNOWN relation or omit
unresolved contract -> UNKNOWN relationship
```

Record:

```yaml
terminal_reason: repair_limit_exceeded
```

---

# 41. BUDGET

```yaml
artifact_budget_tokens: 6000
budget_mode: soft
chunk_budget_tokens: 400
```

Compression is semantic and occurs before serialization.

Drop order:

```text
Tier-C
redundant narrative
low-value Tier-B enumeration
compatible-after-transformation finding unused downstream
```

Never-drop set:

```text
material source_form equation
hard conflict
unresolved tension
probable source/table defect
material qualification
author limitation
required UNKNOWN
provenance failure disclosure when relevant
```

[R-BUD-001] MUST preserve the never-drop set even when the soft budget is exceeded.

If required:

```text
budget_status: overflow_required
```

[R-BUD-002] MUST_NOT perform semantic compression during serialization.

---

# 42. SERIALIZATION

Serialization = formatting only.

[R-SER-001] MUST_NOT create claims during serialization.

[R-SER-002] MUST_NOT merge propositions, change numbers, change equation semantics, change claim class, change scope, drop evidence, repair source, or invent retrieval provenance during serialization.

[R-SER-003] MUST_NOT claim L0 serialization PASS unless an actual deterministic serialization checker ran.

---

# 43. YAML TEMPLATE

SPEC-side fence only. Emitted artifact front matter is bare YAML.

```yaml
---
mode: INIT
type: architecture
source_profile: [research-paper]
domain_profile: []

title: "..."
description: "..."
tags: []
source_url: "..."

extractor_version: "6.8.3a"
provenance_schema: flamehaven-v2
master_spec_hash: "UNKNOWN"
baseline_status: candidate
conformance_mode: off

source_set:
  primary:
    - id: S1
      profile: research-paper
      type: supplied-text
      title: "..."
      url: "..."
  supplemental: []

external_retrieval:
  decision: not_needed
  execution: not_run
  event_count: 0
  supplemental_count: 0

retrieval_budget:
  queries: 3
  supplemental_sources: 5

retrieval_ledger: []

validation:
  structural:
    authority: L0
    status: not_run
  semantic:
    authority: L1
    status: self_checked

contract_scan:
  execution: complete
  authority: L1
  coverage: unverified

contract_findings:
  status: none

budget_status: within_budget
artifact_budget_tokens: 6000
chunk_budget_tokens: 400
timestamp: YYYY-MM-DD
---
```

[R-YAML-001] MUST emit the first front-matter line as exactly `---`.

[R-YAML-002] MUST emit the closing front-matter delimiter as exactly `---`.

[R-YAML-003] MUST_NOT fence emitted front matter.

[R-YAML-004] MUST_NOT escape YAML key underscores or inject Markdown escape syntax into YAML keys.

---

# 44. OUTPUT STRUCTURE

Research-paper default:

```text
Overview
Problem
Architecture
Material Equations
Experimental Setup
Results
Ablation / Sensitivity
Failure Modes / Limitations
Contract Findings
Qualifications
Derived Conclusions
Advisory
```

BIO may add when material:

```text
Assays / Biological Context
Entity / Measurement Bindings
```

[R-OUT-001] MUST omit empty sections.

[R-OUT-002] MUST_NOT emit an empty `Contract Findings` heading when status=`none`.

---

# 45. UPDATE / LEDGER

INIT:

```text
YAML
artifact
```

UPDATE:

```text
YAML
Changelog
artifact
```

Changelog classes:

```text
Added
Changed
Removed
Provenance_changed
Supplemental_added
Contract_finding_added
Qualification_added
Retrieval_provenance_changed
```

[R-LED-001] MUST_NOT interpret extraction failure as deletion.

[R-LED-002] MUST record invalidated supplemental provenance under `Provenance_changed` before dependent claim repair/removal.

---

# 46. CONFORMANCE TRACE

Normal:

```yaml
conformance_mode: off
```

Baseline:

```yaml
conformance_mode: trace
```

[R-TRC-001] MUST_NOT expose hidden gold labels to the generator.

[R-TRC-002] MUST keep Execution Trace outside the RAG knowledge body.

Group trace example:

```yaml
- group: G001
  members: [C009, C030]
  source_members:
    - S1#...
    - S1#...
  triggers:
    - repeated_parameter
  finding:
    emitted: true
    claim_id: C054
```

Retrieval trace example:

```yaml
retrieval_trace:
  decision: required
  runtime_events_seen: [RET001]
  supplemental_bound:
    R1:
      retrieval_event: RET001
      runtime_source_ref: SRC001
```

[R-TRC-003] MUST_NOT allow the generator to calculate recall against hidden gold.

---

# 47. BASELINE METRICS

External harness only:

```text
member_recall
group_recall
contract_emission_recall
false_finding_rate
schema_conformance
serialization_conformance
retrieval_provenance_conformance
equation_source_form_fidelity
qualification_calibration
```

Diagnostics:

```text
gold member absent
-> extraction failure

members present, group absent
-> grouping failure

group present, finding absent
-> contract emission failure

unsupported finding
-> false finding

performed without attested RET event
-> retrieval provenance failure

R-source without runtime source binding
-> runtime source identity failure

source_form changed semantically
-> equation fidelity failure

broad-vs-qualified wording promoted to hard conflict without relation-gate satisfaction
-> severity calibration failure
```

---

# 48. CONFORMANCE FIXTURES

## F1 Mathematical/Table Regression

Source:

```text
arXiv:2410.13956v2
```

Profile:

```text
research-paper
domain_profile: []
```

Must evaluate named defects:

```text
Table-8 random-label kNN conflict
UCE column duplication/misplacement evidence
k=floor(sqrt(n)) vs 251
perturbation p-value direction tension
Structural Integrity normalization mismatch
M symbol redefinition
```

Integer candidates:

```text
Replogle perturbation totals
L1000 perturbation totals
L1000 batch totals
```

[R-FIX-001] MUST apply §21 before emitting integer findings.

[R-FIX-002] MUST_NOT silently reverse the p-value, choose one k specification, or repair equations.

## F2 BIO Overlay Precision

Same transcriptomics source with:

```text
domain_profile: [bio]
```

[R-FIX-003] MUST_NOT fabricate BIO findings solely because biological metadata exists.

## F3 BIO Positive Control

Use gold-annotated original BIO sources.

Expected where gold supports:

```text
>=1 confidence_contract
>=1 leakage_contract
```

[R-FIX-004] MUST preserve tool/version/metric/split/scope bindings.

[R-FIX-005] MUST_NOT infer semantic equivalence from shared metric names.

## F4 UPDATE / Ledger Stability

INIT then UPDATE.

[R-FIX-006] MUST preserve C-ID 100% for unchanged proposition+provenance.

[R-FIX-007] MUST_NOT treat extraction failure as deletion.

## F5 Retrieval Provenance Honesty — P0

### F5a No retrieval event

Input:

```text
PRIMARY cites external papers
model may know those papers
NO runtime retrieval event
```

Expected:

```yaml
external_retrieval:
  decision: required
  execution: not_run
  event_count: 0
  supplemental_count: 0

source_set:
  supplemental: []

retrieval_ledger: []
```

[R-FIX-008] MUST_NOT invent R-ID, RET-ID, retrieved URL evidence, origin:supplemental claim, or `execution: performed`.

### F5b Valid retrieval

Runtime provides attested event and returned source identity.

Expected chain:

```text
runtime attestation
-> runtime_source_ref
-> R1
-> supplemental EXTERNAL
```

### F5c Tampered artifact

Cases:

```text
execution=performed + no runtime event
R-source with no RET binding
supplemental claim with invalid R-ID
```

Expected:

```text
L0 FAIL
```

### F5d Cardinality / Referential Drift

Case 1:

```yaml
event_count: 2
retrieval_ledger:
  - id: RET001
```

Expected: `FAIL_RETRIEVAL_CARDINALITY`.

Case 2:

```yaml
supplemental_count: 2
source_set:
  supplemental:
    - id: R1
```

Expected: `FAIL_RETRIEVAL_CARDINALITY`.

Case 3:

```yaml
retrieval_ledger:
  - id: RET001
    source_ids: [R1, R2]
source_set:
  supplemental:
    - id: R1
      retrieval_event: RET001
```

Expected: `FAIL_RET_SOURCE_UNRESOLVED`.

Case 4:

```yaml
source_set:
  supplemental:
    - id: R1
      retrieval_event: RET999
```

Expected: `FAIL_SUPPLEMENTAL_EVENT_UNRESOLVED`.

### F5e Runtime Source Binding

Runtime attestation:

```yaml
returned_sources:
  - runtime_source_ref: SRC-A
```

Artifact:

```yaml
source_set:
  supplemental:
    - id: R1
      retrieval_event: RET001
      runtime_source_ref: SRC-B
```

Expected:

```text
L0 FAIL
FAIL_RUNTIME_SOURCE_UNRESOLVED
```

## F6 Equation Dual-Channel Fidelity

Provide malformed/transport-damaged material equation.

[R-FIX-009] MUST preserve `source_form` and declare exact|closest fidelity.

[R-FIX-010] MUST_NOT silently change mathematical semantics in `normalized_rendering`.

## F7 Qualification vs Hard Conflict

### F7a Qualification Before Conflict

Input:

```text
broad/universal-looking rhetoric
+
quantified rare exceptions
+
source narrowing language
```

Expected:

```text
qualification
or unresolved_tension
```

[R-FIX-011] MUST_NOT reflexively emit `hard_conflict` unless the relation gate proves incompatibility.

### F7b Universal Counterexample

Input:

```text
A: All members of population X satisfy P.
B: Identified x1 belongs to X and does not satisfy P.
```

Preconditions:

```text
same operational predicate P
x1 membership in X established
same relevant condition/time
no scope escape
no modality escape
```

Expected:

```text
hard_conflict permitted
```

Trace should expose:

```yaml
scope_relation: subset
quantifier_relation: counterexample
polarity_relation: opposed
```

---

# 49. BASELINE FLOOR / STATUS

Minimum baseline:

```text
documents >= 8
bio documents >= 2
independent runs/document >= 5
```

[R-BASE-001] MUST treat document as the experimental unit for corpus-level comparison.

[R-BASE-002] MUST_NOT substitute repeated runs for task/document diversity.

Critical fixture failure:

```text
NO-GO
```

Default:

```yaml
baseline_status: candidate
```

[R-BASE-003] MUST_NOT self-promote baseline status to established, verified, gold, or production_safe.

External harness evidence is required.

---

# 50. CANONICAL BYTE CONTRACT / FREEZE

Canonical spec bytes:

```text
encoding: UTF-8
BOM: forbidden
line_endings: LF only (0x0A)
Unicode normalization: NONE; exact code points preserved
trailing_whitespace: forbidden everywhere
final_newline: exactly one LF
```

Canonicalization procedure:

```text
1 decode approved source as UTF-8
2 reject BOM
3 convert CRLF / CR -> LF
4 reject if any line contains trailing spaces or tabs
5 preserve Unicode code points exactly
6 ensure exactly one terminal LF
7 hash resulting bytes with SHA-256
```

[R-FRZ-001] MUST_NOT apply NFC/NFD/NFKC/NFKD or other Unicode normalization during canonicalization.

[R-FRZ-002] MUST hash only bytes produced by this canonicalization contract.

Self-hash boundary:

```text
The canonical specification excludes its own computed digest.
The digest is stored in an external freeze manifest.
```

[R-FRZ-003] MUST_NOT inject the computed canonical-spec SHA-256 into the bytes being hashed.

External freeze manifest schema:

```yaml
freeze_manifest:
  spec_name: Flamehaven-Knowledge-Extractor
  spec_version: "6.8.3a"
  canonicalization: "fh-spec-bytes-v1"
  hash_algorithm: sha256
  canonical_spec_sha256: "<computed externally>"
```

[R-FRZ-004] MUST treat the freeze manifest as external execution metadata, not part of the canonical spec byte stream.

Generated artifacts MAY receive the frozen `master_spec_hash` from the runtime/harness freeze manifest.

[R-FRZ-005] MUST_NOT allow the generator to originate or guess the frozen `master_spec_hash`.

Freeze sequence:

```text
1 verify FP/FF patch integration
2 verify canonical schema paths
3 verify runtime-source binding
4 verify L0 authority boundaries
5 verify failure-code vocabulary
6 assign/freeze stable rule IDs
7 generate canonical text
8 canonicalize with fh-spec-bytes-v1
9 SHA-256
10 FREEZE
11 implement L0 validator
12 implement F1-F7 harness
13 run baseline
```

[R-FRZ-006] MUST_NOT open v6.8.4 unless harness evidence identifies a SPEC_DEFECT.

Failure classification before spec change:

```text
SPEC_DEFECT
MODEL_COMPLIANCE_FAILURE
L0_VALIDATOR_DEFECT
HARNESS_DEFECT
GOLD_DEFECT
RUNTIME_INTEGRATION_DEFECT
SERIALIZATION_DEFECT
```

---

# 51. FINAL INVARIANTS

```text
SOURCE != IR
CLAIM_CLASS != VALIDATION_STATE
SCAN_EXECUTED != COVERAGE_VERIFIED
GROUP = SEED, NOT FENCE
EXTRACTED_BOTH != RELATION_TESTED

NOT_RUN != RUN_AND_NONE
RETRIEVAL_DECISION != RETRIEVAL_EXECUTION
RETRIEVAL_EXECUTION != MODEL_ASSERTION
R_SOURCE -> RET_EVENT
R_SOURCE -> RUNTIME_SOURCE_REF
SUPPLEMENTAL_CLAIM -> R_SOURCE -> RET_EVENT -> RUNTIME_ATTESTATION
INVALID_EVIDENCE -> GRAPH_TAINT -> SEMANTIC_REVALIDATION

CORRECT_CONTENT != VALID_PROVENANCE
MODEL_TEXT != RUNTIME_ATTESTATION
GRAPH_TAINT != SEMANTIC_INVALIDITY

SOURCE_FORM != NORMALIZED_RENDERING
NORMALIZATION != SILENT_REPAIR

BROAD_WORDING != UNIVERSAL_FACT
RARE != NEVER
QUALIFICATION > PREMATURE_CONFLICT
UNIVERSAL + VALID_COUNTEREXAMPLE MAY HARD_CONFLICT

L1 != INDEPENDENT_VERIFICATION
SUPPLEMENTAL != PRIMARY
SOFT_BUDGET != EVIDENCE_LOSS
TRACE != KNOWLEDGE
PASS != ALL_POSSIBLE_CHECKS
```

---

# 52. OUTPUT

Normal mode:

```text
artifact only
```

Trace mode:

```text
artifact
+
Execution Trace
```

[R-OUT-003] MUST begin the artifact with `---`.

[R-OUT-004] MUST_NOT add a preface, process narrative, hidden reasoning, closing commentary, or follow-up invitation to the emitted artifact.
