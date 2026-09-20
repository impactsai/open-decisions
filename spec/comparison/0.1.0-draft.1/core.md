# Comparison kits — community draft 0.1.0-draft.1

This proposed profile is not an adopted or certified standard. Its wire authority
is the [JSON Schema](../../../schemas/comparison/0.1.0-draft.1/contract.schema.json).
The profile identifier is `comparison/0.1.0-draft.1`; the only method is
`smaa-weighted-sum-v1`. Unknown versions, methods, algorithms, and fields MUST fail
closed. This is a separate profile from the original decision bundle specification.

## Work order and bindings

A kit MUST declare evidence slots, constraint and preference criteria, exactly
pinned evaluator identities and methods, utility scales, weight bounds and orders,
resource limits, and recommendation policy. Model evaluators additionally pin the
provider, actual model revision, prompt digest, and output mapping digest. A
provider MUST record the actual model, including any fallback; a mismatched model
cannot satisfy the work order. A mapping digest identifies the documented rule
for turning provider output into typed outcomes, including probability rounding.

Numeric values are integers in the declared unit (for example cents), within fixed
utility anchors. A numeric scale maps linearly to 0–10000 utility basis points;
rounding is nearest with half upward, calculated using integer arithmetic.
Values outside anchors MUST be rejected, never clipped. Categorical utility is
declared per level. Boolean preference utility is false=0, true=10000. Utility
anchors MUST NOT be inferred from the currently available options.

An evaluation context binds the kit digest, option identities and labels, and
evidence digests by declared slot. All required slots MUST exist per option.
It contains no user weights. An assessment set binds its context digest and MUST
cover exactly every option/criterion pair, including failed or unavailable cells.
Each cell repeats the exact evaluator and required evidence references. Missing,
extra, duplicated, or mismatched cells MUST fail validation.

Each successful assessment provides one or more named outcomes. A point value is
a single outcome with mass 1000000. Positive integer masses MUST sum to 1000000
parts per million (ppm). Unsupported values, zero or negative mass, and duplicate
outcome IDs MUST be rejected. A model assessment MUST include its raw-output
digest and explicit calibration status. A validated calibration declaration MUST
reference a report digest in the criterion's `acceptedCalibrationDigests` allowlist.
An absent or empty allowlist accepts no validated model declaration. A mismatched
report MUST fail validation. Its presence is not verification of the report or of
the model's performance. Kit publishers remain responsible for accepting its scope.

A manifest publishes the kit digest and assessment tasks. An oracle MUST validate
it against the expected kit digest from its trusted caller, and MUST NOT treat a
self-declared digest as proof of the manifest's origin. The engine's compiler is
the authority for translating the kit into tasks; the oracle need not parse kits.

A request binds both context and assessment-set digests. A preference-only revision
MAY reuse those bindings; changed evidence or kit MUST invalidate them. Hashes use
SHA-256 over canonical JSON (sorted UTF-16 object keys, arrays in supplied order,
JSON scalar encoding, no whitespace). All numbers MUST be safe integers; lone
surrogates, duplicate wire keys, non-JSON values, and unsafe integers are invalid.
The portable object API cannot recover duplicate keys erased by a caller's JSON
parser; a transport accepting raw text MUST reject duplicates before parsing.

## Preference and dependence model

Each preference scenario MUST cover every preference criterion once, sum to 10000
weight basis points, obey kit bounds, and satisfy every higher-or-equal order.
Preference-scenario masses MUST sum to 1000000. Equal weights are a fixed point
model, not an implicit uniform prior. Zero weights are allowed only within bounds.

The request MUST declare independence with a justification, or provide explicit
joint scenarios. Independence means the product distribution over assessment
cells and preference scenarios. It MUST NOT be assumed silently. Joint scenarios
MUST select one named outcome from every assessment cell and one weight scenario;
their masses MUST sum to 1000000 and reproduce every declared marginal exactly.
Thus correlations can change ranks without changing individual assessments.
This draft does not infer correlations or invent a prior from bounds.

Unavailable assessments produce `needs-information`; evaluation errors produce
`review-required`. No failed dependency is imputed as zero or false, and no partial
ranking is returned. Successful unvalidated model assessments may support an
exploratory calculation, but MUST block an automatic recommendation.

## Numerical method and recommendation

Constraints are evaluated before preference ranking. An option is excluded when
the mass of true outcomes on any constraint is below that constraint's declared
minimum. A minimum of 1000000 requires satisfaction in every modeled outcome.
These are marginal eligibility gates; a lower minimum is not a joint chance
constraint. Excluded options never regain eligibility through utility scores.

For each scenario and eligible option, utility is the integer sum of
`weightBp × utilityBp` (0–100000000). A rank is one plus the number of options with
strictly higher utility (competition ranking). All equal best options share rank
one; tied mass is reported separately and MUST NOT become a unique winner by ID.
Each result reports sole-first support, rank support, expected utility, expected
regret against the best eligible option in that scenario, and pairwise wins/ties.

Exact mode integrates supplied joint scenarios or enumerates the bounded product
distribution. Accumulators use arbitrary-precision integers. Reports preserve
exact ratios as decimal integer numerator/denominator strings; presentation
rounding MUST NOT affect comparisons or gates.

Monte Carlo uses `xoshiro128ss-v1` and unbiased integer draws by rejection from a
32-bit word. The 128-bit initial state comes from the first 16 bytes of a SHA-256
digest over the canonical normalized kit, context, assessments, weights and
dependence model. Request ID and sample count are excluded, allowing stable prefixes.
All algorithmically unordered collections are sorted by ID before hashing and
sampling. An all-zero state is replaced with [1,0,0,0]. The seed material digest,
algorithm, sample count, and input digests MUST be reported. No clock or live
provider may enter the computation.

The four state words decode consecutive eight-character hexadecimal chunks as
unsigned integers (most significant byte first). Sampling visits the selected
weight scenario first, then eligible options by ID and preference criteria by ID;
outcomes are ordered by outcome ID. Singleton distributions consume no random
word. Joint mode draws one joint scenario by ID instead. Draws at or above
`floor(2^32 / 1000000) * 1000000` are rejected; the remaining word modulo 1000000
selects the first cumulative mass strictly above it. The step is the standard
xoshiro128** transition with rotation/multiplication constants 7, 5, 9, 9, 11.
The seed document excludes binding digests from context and assessments, since
those retain original wire ordering; normalized kit contents are included instead.
Constraint and excluded-option outcomes remain in the seed document but are not
sampled in independent mode. Exact mode integrates those irrelevant dimensions
out analytically. Collection ordering within input digests remains significant.

Monte Carlo reports a simultaneous 95% Hoeffding error bound for the sole-first
support and normalized expected regret of all eligible options. For `k` eligible
options and `n` draws, the bound is
`ceil(1000000 * sqrt(log(4*k / 0.05) / (2*n)))`, capped at 1000000 ppm.
It covers sampling error only under ideal
independent draws, not model error, preference misspecification, PRNG assurance,
or calibration error. Recommendation uses conservative support and lead bounds,
plus a conservative Hoeffding bound on expected regret. Exact mode has no sampling
error. A unique candidate must meet minimum sole-first support, minimum lead over
every competitor, and maximum expected regret, and have no unvalidated model
assessment. Otherwise the policy returns `no-robust-winner` or `review-required`.
No eligible option yields `no-eligible-option`. Outputs are model-conditional
scenario support, never a claim that a choice is objectively correct.

## Limits and trust boundary

Object inputs are bounded to 4 MiB canonical JSON, depth 32, and two million
visited values. Hosts MAY impose smaller transport limits. Kits cap options,
samples, exact scenarios, and estimated work; limits MUST be checked before the
scenario loop. Sampling is bounded computation, not permission to spend on models.

The implementation makes no network requests, emits no signed credential, and
does not authorize, execute, or settle an action. Schema validity, calibration
metadata, digests, rank support, and recommendation are not authenticity or trust
claims. Live evaluation and authority checks belong outside this profile.
