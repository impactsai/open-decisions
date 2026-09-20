# Conformance

Normative for 0.1.0-draft.1. A conformance statement MUST name the version and
method(s) tested. The unqualified phrase “Open Decisions certified” MUST NOT be
used: this draft establishes no certification authority or certification mark.

## Classes

| Class | Required behavior | What it does not establish |
| --- | --- | --- |
| Schema reader | Parses the restricted JSON domain and checks the published schema, including formats | Referential integrity or correct results |
| Bundle validator | Schema plus cross-record identity, digests, method compatibility, coverage configuration, chronology, modes, and lifecycle links | Evidence truth, authentic identity, or live authority |
| Profile replayer | Bundle validation plus exact deterministic result comparison for each claimed method | Re-running an evaluator or validating its methodology |
| Producer | Emits valid bundles and satisfies the normative evidence, privacy, snapshot, review, and deployment duties | Those duties cannot all be inferred from a bundle |

The reference checker implements the first three classes for both methods.
A product MUST state which external trust checks it additionally performs.
Conformance to a structural class does not imply conformance to all operational
producer duties. Cryptographic signature verification is not implemented in this
draft. Third-party implementations MUST NOT claim it based on a digest match.

## Running the suite

```sh
npm ci --ignore-scripts
npm run check
npm run validate -- examples/valid/pay-simulation.json
```

`npm run check` runs behavior tests, then every positive and negative fixture,
then local Markdown link checks. A positive fixture MUST validate and replay.
A negative fixture MUST fail with its manifest's expected diagnostic code.
The CLI exits 0 for conforming bundles, 1 for invalid/unreadable input, and 2 for
invalid invocation. It makes no network calls and performs no actions.

`npm run validate` reports separate `schema`, `semantics`, `replay`, and
`integrity` booleans. A false check can mean failed **or not reached**; consult
`errors` for diagnostics. `verification` always explicitly says `not_performed`
for evidence, authority, signatures, execution, and settlement.

Tests use literal expected arithmetic and boundary outcomes as well as the
stored fixtures. `tools/build-examples.mjs` is an authoring utility, not an
independent oracle: regenerating fixtures does not prove an algorithm correct.
The fixed SHA-256 test vector and manually computed ranking expectations are
independent checks. No second-language implementation has yet been validated.

## Coverage map

| Rule family | Executable coverage in `test/conformance.test.mjs` |
| --- | --- |
| Wire domain and strict schema | Unknown version/method/property; invalid timestamps; basis-point limits; duplicates and escaped duplicate JSON keys; unsafe numbers; Unicode; resource depth |
| Immutable snapshot | Protocol/request digest binding; changed request; duplicate IDs and target triples; wrong method/evidence/option; input immutability |
| Privacy declaration | Undeclared recipient rejection; namespaced extensions bound by digest |
| Threshold policy | Exact acceptance/rejection boundaries; error precedence; missing and stale evidence; overlapping gates |
| Ranking policy | Independent 79/21 arithmetic; scenario and weight sums; hard constraints; ties; support boundary; integer rounding |
| Lifetime and authority declarations | Issuer match; decision/evidence lifetimes; uncalibrated live probabilities; grant/denial; executor binding and expiry |
| Consequence separation | Action prohibited after review; separate authorization; failed/unknown execution; settlement prerequisite; simulation/live separation |
| Integrity and command line | Fixed canonical digest vector; retained evidence bytes; content mutation; CLI exit codes |

The checker cannot discover fabricated evidence, hidden commercial interests,
invalid credentials, model miscalibration, prompt injection in a provider, actual
retention violations, double execution, or false settlement claims. These are
integration and operational assurance responsibilities, not successful results
of this conformance suite.

## Independent implementation report

An implementation seeking listing in a future registry SHOULD submit:

- Implementation name, source revision, license, and runtime.
- Supported draft version, conformance classes, and method IDs.
- Results for every fixture, plus independently written edge-case tests.
- Limits, unsupported features, numeric behavior, and interpretation differences.
- The exact external trust checks performed and their trust anchors.
- Maintainer contact and disclosed affiliations or commercial interests.

Release maturity and interoperability evidence are governed by
[GOVERNANCE.md](../../GOVERNANCE.md), not by the reference implementation alone.
