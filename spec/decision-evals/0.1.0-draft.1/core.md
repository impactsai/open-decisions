# Decision Evals 0.1.0-draft.1

Status: proposed community draft. The [JSON Schema](../../../schemas/decision-evals/0.1.0-draft.1/contract.schema.json)
is the wire-shape authority. This prose supplies normative semantics. MUST and
MUST NOT express conformance requirements. Schema, semantics and implementation
must agree; conflicts are defects and affected records must fail closed.

## 1. Boundaries and records

The profile identifier is `decision-evals/0.1.0-draft.1`. Unknown versions,
methods and properties MUST be rejected. No provider, network, identity system,
wallet or vendor is required. Evaluation, determination, authorization, execution
and settlement remain distinct. This profile does not authenticate evidence,
labels, a reviewer or a claimed model revision.

The schema defines `subject`, `suite`, `run`, `artifact`, `report`, `card`,
`release`, `application`, `policy`, and their self-contained `bundle`. The
reference validator is `validateBundle`; individual shape validation does not
establish a complete bundle's conformance.

An evaluation subject identifies one immutable kit version, executable resources,
targets, allowed evaluator configurations, decision method and acceptance-policy
digest. Each target names exact labels, a positive label, adverse labels and the
fact or determination stage. Ordinal levels require an explicit numeric scale.
A deterministic calculation does not establish the truth of its inputs.

Configurations bind runtime/provider, resolved model revision, quantization,
inference settings, prompt template, renderer, ordering, batching, evidence
transforms and output mapping. An alias without a verifiable resolved revision
MUST NOT qualify for live use. Configuration provenance remains a declaration
until the relying operator independently accepts its evidence.

`native-probabilities`, `verbalized-probabilities`, `logits` and `score` are distinct
prediction kinds. The reference calibrators only consume exact probability
vectors. They MUST NOT invent probabilities from the other kinds. Probability
vectors contain every label exactly once, integer ppm in [0, 1000000], and sum
exactly to 1000000. The asserted label is retained even if calibration changes
which label has maximum mass.

## 2. Digest construction and immutable publication

Digests are lowercase SHA-256 hexadecimal over the bounded canonical JSON domain
used by the comparison profile: sorted object keys, supplied array order, safe
integers, no duplicate wire keys, lone surrogates, accessors or non-JSON values.
Resource digests identify retained bytes using the resource's documented format;
a raw rubric-byte digest MUST NOT be substituted with a parsed-object digest.
Artifact JSON digests use canonical JSON. URIs are identifiers, not proof.

The dependency graph is acyclic:

1. Finalize executable kit resources, configuration, targets and domain policy.
2. Digest the evaluation subject; freeze the benchmark suite against it.
3. Record runs, fitted mappings and acceptance reports.
4. Generate the model card with their exact digests.
5. Construct the release manifest binding the subject, final resources and card.

The model card file MUST be included as `model-card.json`. It never hashes its own
release envelope. Every executable resource in the subject MUST appear unchanged
in the release. Adding or changing executable resources requires a new subject.
For a comparison kit, `comparisonSubjectResources` removes ONLY each criterion's
`acceptedCalibrationDigests` before computing the executable-subject digest.
No prompt, evaluator, criterion, preference policy or numerical method is removed.
The final kit with accepted report digests is bound separately by the release.

Publishers MUST finalize protocol identifiers and form proofs before benchmarking.
A publication step that repins a rubric MUST invalidate its old release preflight.
Reports and cards are immutable; corrections create new release records.

## 3. Cases, labels, and splits

Suites declare four partitions: `development`, `fact-fit`, `determination-fit`,
and `acceptance`. They MUST all exist and be frozen before runs start. Group IDs
MUST NOT cross partitions. Identical evidence/input digests MUST NOT cross them
either. Authors MUST group related cases and near duplicates before splitting;
digest checks cannot detect semantic duplication or contamination in model training.

Each case declares population, stratum, variant and relationship: baseline,
meaning-preserving, meaning-changing, repeated, or failure. A target label records
its source, evidence digest, adjudication method, disagreement and indeterminacy.
Model judgments and previous decision receipts MUST NOT count as independent
reference labels. Synthetic data can exercise the tooling but MUST NOT establish
live calibration. Restricted evidence and labels may remain outside the public
kit under a declared access and retention policy; public fixtures are fictional.

Fitting uses one baseline observation per case group and target from its assigned
fit partition. All target classes must occur. Fact mappings are frozen before
fitting determination mappings; the latter bind upstream artifact digests.
Acceptance groups MUST be absent from every fit set. Development choices and
production ordering MUST be frozen before acceptance evaluation. Selecting the
best acceptance permutation after seeing results is prohibited.

## 4. Runs and benchmark coverage

Runs bind exact subject, suite, configuration and runner. Every scheduled
case/target has one observation, including `unattempted`. Results distinguish
`ok`, `unavailable`, `error`, `invalid` and `unattempted`. Non-success results
MUST NOT carry usable predictions. Successful predictions require request/output
digests and attempted-call counts. Secrets MUST NOT enter captured request bodies
or headers; retain authorized evidence separately from public reports.

Required suites exercise evidence, question and answer-label ordering, prompt
structure, paraphrases, repeated requests, missing/conflicting/stale evidence,
malformed output, failed providers and dependent computations. Meaning-changing
cases have their own labels and are not invariance tests. Case authors declare
which variants are required; the reviewed domain policy can add requirements.

Retries and partial batches are observable and consume the declared budget.
Benchmarking MUST NOT invoke authorization, payment or settlement adapters.
Provider runs are opt-in and isolated from ordinary conformance checks.

## 5. Reference calibration algorithms

`binary-isotonic-pav-v1` sorts integer score observations by score, aggregates
identical scores, and merges adjacent blocks while their exact rational positive
rates decrease. Each block produces a left-closed step-function knot. Rates round
to ppm, nearest with halves upward. The maximum observed score is included;
values outside observed support are unavailable, never extrapolated.

`categorical-isotonic-normalized-v1` fits one such map per label. Apply all maps
then normalize their nonnegative integer outputs to one million using exact
integer division. Allocate residual units by descending remainder, ties by
ascending label ID. A zero total is unavailable. Binary and multiclass artifacts
are distinct methods; passing binary checks cannot qualify the multiclass method.

`identity-v1` retains the original distribution. It still needs declared fitting
cases, applicability and held-out acceptance; identity is not an exemption.

Artifacts bind subject, configuration, target, labels, fit cases/groups and run,
population, strata, validity interval and upstream mappings. Runtime application
MUST reject mismatches and expired artifacts. Validity is [validFrom, validUntil).
Basis-point projection uses nearest rounding with halves upward and is explicitly
lossy. Source precision and the artifact reference remain in the audit record.

## 6. Measurements and acceptance

The reference report scores acceptance baselines once per independent group.
It additionally reports every variant and required stratum. Failures remain in
scheduled coverage denominators. Classification/calibration denominators include
only usable labelled outputs; separate counts prevent hiding service failures.

Brier is the sum of squared errors across the complete label vector (binary
range 0–2). Log loss uses natural logarithms; a zero probability for the observed
label is null with reason `zero-probability-for-observed-label`, never silently
clipped. Classwise ECE averages absolute calibration errors over labels using ten
fixed equal-width bins; 1000000 belongs to the final bin. Empty bins have null
means. Ordinal MAE is calculated only for declared levels. Confusion uses the
producer's asserted label. Coverage and selective error are reported separately.

False-approval rate conditions on reference adverse labels; false-rejection rate
conditions on the positive reference label. Neither can be measured without the
corresponding class. Metrics are integer millionths; unobservable values are null
with denominator zero or a specific reason. Cost without a complete declared
basis is null. Latency uses nearest-rank p50/p95 across attempts, including failures.

Rate intervals use the conservative bound
`ceil(1000000 * sqrt(log(40) / (2*n)))` about the observed rate, clipped to [0,1].
This is a per-metric two-sided 95% Hoeffding bound over independent case groups,
not a simultaneous guarantee over all gates. It remains nonzero at zero observed
errors. ECE, Brier, log loss and ordinal error are descriptive point estimates;
this draft does not fabricate confidence intervals for them.

Robustness counts each group once: whether any meaning-preserving/repeat answer
flips, whether all are correct, and the largest probability change. Meaning-changing
variants are scored separately. Agreement alone is not correctness.

Domain policy requires reviewed population, strata, perturbations, minimum groups,
ECE, error upper bounds, coverage and flip limits, plus runtime confidence floors.
Required strata and variants each satisfy their own gates. Absent data/policy or
independent review is `insufficient`; measured breaches are `failed`. Every target
and configuration needs a report. A model card permits live mode only when all
required reports pass. The relying operator separately accepts the release.

## 7. Runtime confidence and determination

Fact probability is the mapped distribution. Asserted-value confidence is its
mass at the asserted value, not necessarily the mass of `true`. These are
population-conditional empirical estimates, not proof of a particular fact.

For claims, take the minimum asserted-value confidence over the complete governed
fact dependency set as a predictor. It is not a probability bound and assumes no
independence. A separately fitted binary determination artifact maps that predictor
to agreement with independent reference determinations under the exact rubric.
The reference determination label is correctness under that rubric, not payment
success or an authorized action. No probabilistic dependencies means not estimated.

For comparisons, apply fact/assessment calibration before utility conversion.
Sole-first support is the predictor for a separately validated recommendation
reliability target, using independently labelled acceptable options under frozen
preferences. Rank support and sampling error remain separately named.

Missing information returns needs-information. Failed dependencies, unsupported
calibration, missing policy, suspension or confidence below either positive or
adverse decision thresholds returns review-required. A confidence gate cannot
turn a failed provider into a false fact or into automatic rejection. A caller
cannot override the accepted release, dependency set or policy.

The engine MUST bind the base result, applications, final gate and every governing
digest into its new receipt/trace profile. Existing wire versions retain their
original interpretation. A protocol requiring this profile MUST reject legacy
requests that would bypass its requirements.

## 8. Assurance and rollout

Schema/semantic/replay validity, label verification, reviewer authority, evidence
authenticity and action verification are separate statuses. Conformance tooling
performs the first three only and makes no network calls. Redacting an artifact
creates a new digest; a digest does not anonymize sensitive material.

Operational rollout requires representative independent labels, reviewed policy,
shadow evaluation and operator acceptance. Record drift and append-only suspension
or replacement events. Never silently refit, promote or rewrite prior decisions.
The [governance](../../../GOVERNANCE.md) maturity and review requirements apply.

### Staged run conformance

Each run declares `phase`: `development`, `fact-fit`, `determination-fit`, or `acceptance`. It MUST record cases outside that partition as unattempted. A calibration artifact MUST refer to the fitting run for its stage and MUST NOT become valid before that run completes. Determination fitting MUST start after the upstream fact artifacts become valid. Acceptance MUST start after the complete pipeline is frozen. A single run containing attempted cases across partitions is invalid.

For the reference claim pipeline, conformance recomputes each successful determination predictor from every upstream fact target on determination-fitting and acceptance cases. A missing or unsupported upstream prediction cannot produce a successful determination predictor. The reference comparison adapter additionally binds frozen preference scenarios through a `preferences.json` subject resource; it does not reinterpret rank support as correctness probability.
