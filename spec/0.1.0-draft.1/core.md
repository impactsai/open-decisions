# Open Decisions Core 0.1.0-draft.1

Status: **community draft**, 20 September 2026. Normative unless explicitly marked
informative. This is a proposal maintained in this repository, not an external
standards body's specification.

The uppercase words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY have their BCP 14
meanings ([RFC 2119](https://www.rfc-editor.org/rfc/rfc2119),
[RFC 8174](https://www.rfc-editor.org/rfc/rfc8174)).

## 1. Purpose and boundaries

Open Decisions describes a decision and the records needed to examine it across
systems. It standardizes exchange and replay of recorded evaluations; it does not
standardize a universal answer to a domain question.

A conforming decision MUST distinguish:

1. **Evidence:** information with a source, observation time, and digest.
2. **Evaluation:** a result for one criterion, option, and scenario, produced by
   a named evaluator using a specified method.
3. **Determination:** application of a declared decision method to that snapshot.
4. **Authorization:** a separate actor's permission for a specific action.
5. **Execution:** an executor's report of an attempted action.
6. **Settlement:** an observer's report of the downstream outcome.

An affirmative determination MUST NOT itself be treated as authorization,
execution, settlement, or proof that the evidence is true. This applies equally
to a human evaluator, deterministic service, and AI model.

## 2. Conformance and wire contract

The [JSON Schema](../../schemas/0.1.0-draft.1/bundle.schema.json) defines the exact
wire shape. The schemas and this prose are jointly normative: passing JSON
Schema alone is insufficient. A discrepancy is a specification defect; consumers
MUST fail closed on affected records until it is resolved.

The exchange document is a JSON object with `specVersion: "0.1.0-draft.1"`.
Unknown versions, unknown method identifiers, and unknown properties outside an
`extensions` object MUST be rejected for conformance to this version.

Each record type is addressable through the schema's `$defs` JSON Pointer, for
example `#/$defs/evaluation`. The root describes a self-contained **bundle**:

| Field | Required | Meaning |
| --- | --- | --- |
| `protocol` | Yes | Versioned purpose, criteria, method, evidence policy, authority declaration |
| `request` | Yes | Immutable options, evidence manifest, scenarios, context policy |
| `evaluations` | Yes | Zero or more immutable criterion results; incomplete coverage is representable |
| `decision` | Yes | Issuer, input digest, time bounds, and computed result |
| `action` | No | Exact proposed action, selected option, executor, expiry, idempotency key |
| `authorization` | No | Separate grant or denial bound to the exact action |
| `execution` | No | One execution attempt bound to action and authorization |
| `settlement` | No | One settlement observation bound to a successful execution |
| `integrity` | Yes | Digest of all other bundle fields |
| `extensions` | No | Namespaced, advisory data |

This first envelope carries at most one action, authorization, execution attempt,
and settlement observation. Multi-action workflows, retry histories, and
settlement event streams require a future profile. They MUST NOT be squeezed
into these records as if they represented one attempt.

## 3. Identity, references, and immutable snapshots

Record IDs MUST be absolute URIs. URNs, HTTPS identifiers, and DIDs are possible;
no identity network is required. An identifier does not authenticate its owner.
IDs of the protocol, request, evaluations, decision, and lifecycle records MUST
be unique within a bundle. Evidence IDs MUST be unique within the manifest.

Option, scenario, and criterion IDs are separate local namespaces, using the
schema's restricted ASCII syntax. IDs within each namespace MUST be unique.
Exactly one evaluation MAY address each `(scenarioId, optionId, criterionId)`.
Multiple competing evaluator outputs require an explicit aggregation method
before producing that evaluation; array order MUST NOT choose a winner.

An internal `reference` contains `{id, digest}`. Both fields MUST match the
referenced record. All evaluations bind the complete request; that request binds
the complete protocol. The decision binds `{protocol, request, evaluations}`.
Changes to a policy, preference, evidence manifest, or option therefore require
new evaluations or explicitly reissued records. Old results MUST NOT silently
attach to a revised request.

Requests and decisions MAY use `supersedes` to refer to an earlier immutable
record. The new record MUST have a different ID. This bundle cannot establish
whether an external prior record exists or which revision a party currently
accepts. Deployments MUST maintain their own revision and revocation checks.

A conforming producer MUST capture a coherent snapshot before evaluation. It
MUST NOT mutate that snapshot while concurrent actors evaluate or issue it.
Concurrent revisions are separate records; publication or authorization MUST
check the expected revision atomically. The reference checker is read-only.

## 4. Protocol

A protocol declares `id`, `version`, title, purpose, criteria, a supported method,
evidence policy, and authority. The reference profiles are
[`threshold-gates-v1`](profiles/threshold-gates.md) and
[`weighted-scenarios-v1`](profiles/weighted-scenarios.md).

Each criterion has a stable ID, question, role, value type, and `method` reference
containing an ID, version, and digest. The method identifies the rubric,
normalization, or evaluator procedure. It MUST document what evidence supports
the result, how units become utility (where applicable), and material limits.
A new rubric or transform is a new method version and digest.

`authority.determiner` names the accountable decision issuer.
`authority.basis` references the claimed mandate.
`authority.reviewContact` provides a route to request review or contest the
result. These are declarations, not verified credentials. Consumers MUST verify
identity, mandate, scope, expiry, and revocation under their own trust policy
before relying on a determination for consequential action.

`evidencePolicy.requiredEvidenceIds` lists evidence needed for this request.
Missing entries force `needs_information`, even if some criteria have results.
Version 0.1 uses exact evidence IDs; portable evidence-slot templates and protocol
registries are future work. A protocol's `version` label is descriptive; its
content digest identifies the exact bytes of its canonical JSON representation.

## 5. Request and evidence

A request states purpose, mode (`simulation` or `live`), options, evidence,
scenarios, and `contextPolicy`. A threshold request contains one option (the
subject of eligibility). A ranking request contains the alternatives considered.
The record does not claim that its option set is exhaustive.

An evidence item includes ID, SHA-256 digest, media type, source URI, observation
time, optional expiry, access classification, and description. Its digest binds
the **exact retained source bytes**. It is not automatically a hash of extracted
text, a rendered page, or a downloaded file's current content. If a transform is
used, the protocol's criterion method MUST describe it and retain sufficient
provenance for examination. Evidence digests MUST NOT be silently recomputed
from a changing URL.

`access` is `public`, `restricted`, or `withheld`. Evidence bodies need not be
embedded or public. A digest is not anonymization; low-entropy values and public
identifiers can reveal private information. Producers SHOULD use restricted
storage and opaque IDs. They MUST NOT include credentials or unrelated personal
memory in a bundle. A disclosure with redactions is a new artifact and MUST NOT
retain a full artifact's digest as though its bytes were unchanged.

`contextPolicy` records the claimed disclosure basis, allowed recipient URIs,
and retention deadline. Every evaluator and the determiner MUST be listed.
This metadata does not enforce access or deletion. Services MUST separately
enforce consent or other applicable authority, purpose limitation, and retention.
`disclosures` records known economic or other interests by actor; an empty list
states that no such interests have been disclosed, not that independence has
been proven. Material conflicts SHOULD be visible to the decision's recipient.

Evidence MUST have been observed no later than the request snapshot. An evidence
expiry MUST be later than its observation. Requests MAY contain missing or expired
required evidence so that the decision can explicitly request more information.

## 6. Scenarios, preferences, and uncertainty

A scenario has a local ID, positive integer `massBp`, and criterion weights.
Scenario masses MUST sum to 10000. This is a supplied finite joint scenario set:
its construction and interpretation MUST be documented in the protocol's purpose
or referenced method. It is not an implicit Monte Carlo sampler.

Preferences and evidence uncertainty MAY vary together across scenarios. Each
scenario/option/criterion result is explicit. Implementations MUST NOT assume
independence between criteria, options, weights, or evaluations merely because
they are separate fields. Ranking weights are attached to the scenario, not
inferred from model confidence.

A probability that a criterion holds, a preference weight, a utility rating,
and the scenario mass supporting an option's first place are different quantities.
They MUST NOT be substituted for each other without a documented transformation.
Scenario support MUST NOT be displayed as the probability that a recommendation
is objectively correct.

This version supports no arbitrary continuous distributions or automatic
value-of-information calculation. A sampled implementation can export a finite
scenario set, but MUST document sampling, dependence assumptions, model and
sampler versions, seed, and approximation error through a referenced method.
The checker replays the supplied scenarios, not their generation.

## 7. Evaluation

Each evaluation names its target, request reference, evidence IDs, evaluator,
method, and completion time. Evaluator `kind` is `deterministic`, `model`, or
`human`. It is a source declaration and does not establish independence or skill.

`status` has exactly these meanings:

| Status | Payload | Decision behavior |
| --- | --- | --- |
| `complete` | `value` required, `issue` forbidden | Available to the method |
| `unavailable` | `issue` required, `value` forbidden | Needs information |
| `error` | `issue` required, `value` forbidden | Review; never false or approval |

A complete value is one of:

| `kind` | Payload | Meaning |
| --- | --- | --- |
| `boolean` | `value` | Determinate criterion result |
| `probability` | `probabilityBp`, `calibration` | Reported probability of the criterion proposition |
| `utility` | `utilityBp` | Cardinal utility under the declared transform |

Basis-point values are integers from 0 to 10000 inclusive. This limited domain
avoids floating-point threshold disagreement. Utilities MUST use documented
anchors; an ordinal rubric label MUST NOT be treated as a cardinal number without
an explicit transform. Choice distributions, ordinal distributions, measurements,
and extraction outputs can be source evidence; they are not native value types
in this draft.

Calibration is either `uncalibrated` or `reported` with a digest-bound report.
An affirmative `live` decision using any probability value MUST have a reported
calibration reference for each probability. The report MUST describe the relevant
population, labels, method/version, measurements, and limitations. Mere presence
of a reference does not verify adequacy or calibration. Deployments MUST establish
suitable thresholds and escalation policies for their actual consequences.

The completion time MUST be at or after request creation and no later than the
decision. Evidence references MUST resolve within the request. The evaluator's
method MUST exactly match the criterion's declared method. Evaluations MUST NOT
carry unrelated targets or duplicate target triples.

## 8. Decision, replay, and explanation

A decision names its issuer, creation and expiry times, `inputDigest`, and result.
Its issuer MUST equal the protocol's declared determiner. Its creation MUST follow
all inputs and precede its expiry. An affirmative decision MUST NOT outlive any
required or referenced evidence with an expiry.

`inputDigest` is computed over the object with exactly three members:
`{protocol, request, evaluations}`. Evaluation array order is retained. A changed
array order changes the digest even when the replayed result is equivalent.

`result` MUST exactly equal the chosen profile's output, including reason codes,
selected option when present, and ranking details. Unknown reason codes cannot be
substituted into a reference-profile result. Reproducibility here means applying
the same deterministic method to the same **recorded** evaluations. It does not
mean that a hosted model will produce the same evaluations on another call.

Narrative explanations MAY be carried as advisory extensions or separate derived
artifacts. They SHOULD cite criteria, evidence, and method behavior. They MUST NOT
change the recorded result or present generated explanations as observed evidence.
No private model reasoning or chain of thought is required.

A `review` or `needs_information` result is a completed determination requiring
further work. A new evaluation or preference response produces a new snapshot and
decision, not an in-place overwrite. Human overrides require their own authority
and a revised or separately linked record; changing the result while claiming
unchanged profile conformance is invalid.

## 9. Consequences and time bounds

An `action` MAY accompany only an `eligible` or `recommended` result. It MUST bind
the exact decision and selected option. It declares a type URI, complete
parameters, executor, mode, positive validity interval, and idempotency key.
The action's interval MUST be contained within decision validity.

Parameters are application-defined JSON and entirely covered by the action
digest. This standard does not determine whether an amount, beneficiary, order,
or resource is permitted. An application profile MUST define those semantics and
authorization limits. Monetary quantities SHOULD use integer minor units encoded
as decimal strings with explicit currency and scale rules; floats are unsuitable
for financial authorization.

An `authorization` binds the exact action, issuer, executor, grant or denial,
validity interval, and authority-evidence reference. Its interval MUST be inside
action validity. Its executor MUST match the intended executor. An execution
requires a **separate granted** authorization record, even if the issuer happens
to be the decision issuer. The record itself is not an authenticated capability.

An `execution` binds both action and authorization. Its executor MUST match both.
It MUST start at or after authorization creation and strictly before its expiry;
completion MUST be at or after start. It records `succeeded`, `failed`, or
`unknown` and an external receipt reference. Unknown outcomes MUST NOT be retried
blindly. The executor MUST enforce durable idempotency, prevent double spending,
and recheck revocation and actual authority at execution time. These are live
integration duties, not checks performed by this offline validator.

A `settlement` observation binds a successful execution, observation time,
reporting issuer, and external evidence reference. States are `pending`,
`settled`, `failed`, and `reversed`. The observation MUST follow execution
completion. A `settled` string is a claim that requires independent verification;
it is not a ledger proof. Later reversals require new external history or a
future event-stream profile, not alteration of a previously published record.

Request, action, execution, and settlement modes MUST agree. Simulation MUST be
prominently disclosed to a human viewer. Re-signing or relabeling a simulation
MUST NOT be presented as evidence of live execution.

Historical validity and current actionability are different. The offline checker
compares recorded times; it does not ask whether an old authorization is currently
valid. Consumers MUST check current expiry, revision, revocation, target binding,
and trusted authority before acting.

## 10. Serialization and integrity

Core JSON MUST reject duplicate object keys, lone Unicode surrogates, non-finite
numbers, and integers outside the IEEE 754 safe-integer range. The reference wire
reader limits input to 4 MiB and 64 levels of nesting. Implementations MAY impose
smaller resource limits but MUST document them as operational limits, not schema
changes. Larger artifacts SHOULD be referenced rather than embedded.

Internal record digests use UTF-8 bytes of
[RFC 8785 JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785)
serialization, then SHA-256, represented as `sha256:` followed by 64 lowercase
hex characters. Object key order is immaterial; array order is material. There
are no defaulted or silently removed fields. External evidence digests bind
retained raw bytes as specified in Section 5.

`integrity.algorithm` is `sha-256-jcs`. `integrity.digest` hashes the complete
bundle with the top-level `integrity` member omitted. All extensions and lifecycle
records are included. There is no circular self-hash.

A matching hash does not authenticate its creator. An attacker can fabricate a
new internally consistent bundle. Signed proof formats and key trust are outside
this core draft; see [the proof-profile proposal](../../rfcs/0002-signed-proofs.md).
Consumers MUST NOT label the reference checker's digest checks as signature or
authority verification.

## 11. Extensions and interoperability

`extensions` keys MUST be absolute URIs controlled or documented by their authors.
They are advisory only and MUST NOT modify core calculation, constraints,
authorization, or safety semantics. Consumers MAY ignore their meaning but MUST
preserve their bytes when forwarding a digest-bound record. Required new semantics
need a new supported method, profile, or version; they cannot hide in extensions.

No API transport is prescribed. HTTP, files, MCP tools, event streams, and
credential envelopes MAY transport these records. A wrapper MUST preserve the
version and record identity and MUST disclose which conformance checks it ran.
No blockchain, hosted gateway, registry, token, or commercial service is required.

## 12. Security and human recourse

Evidence and provider output MUST be treated as untrusted data. They MUST NOT
change executable instructions, authorization scopes, or tool permissions.
Deterministic arithmetic, identity verification, signature verification, and
settlement checks SHOULD use dedicated implementations rather than semantic
model judgments. Automatic evidence retrieval MUST protect against SSRF and
credential disclosure and respect access classifications.

Record consumers MUST distinguish declared provenance from verified provenance,
source authenticity from truth, and calibrated model behavior from domain
assurance. Review routes MUST remain accessible for adverse decisions. A human
review process SHOULD permit correction of evidence, preferences, and method
errors, and preserve the prior record for the appropriate authorized audience.

A deployment claiming conformance MUST identify its supported version, method,
and conformance class. Core conformance does not establish legal, clinical,
financial, or regulatory suitability.
