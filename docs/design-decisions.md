# Foundational design decisions

These notes explain the first draft's structure. The normative requirements live
in the [core specification](../spec/0.1.0-draft.1/core.md).

## 1. Standardize the record before the service

The durable unit is an immutable bundle of protocol, request, evaluations, and
decision. Adapters, hosted APIs, professional oracle services, and interfaces can
use that unit without sharing infrastructure. No HTTP or MCP interface is imposed
before independent implementers establish the exchange semantics.

The dominant access paths determine the data model:

| Actor | Needs to read or do | Structural consequence |
| --- | --- | --- |
| Evaluator | Assess one criterion against a frozen request | Target triple and exact request digest |
| Decision engine | Apply a method to all declared inputs | Versioned protocol and explicit evaluations |
| User | Understand the result and ask for review | Reason codes, recorded alternatives, review contact |
| Auditor | Recompute without contacting a model | Archived evaluation values and deterministic profiles |
| Authorizer | Approve a concrete action | Separate action with full parameter digest |
| Executor | Check permission and avoid duplicates | Exact action/authorization references and idempotency key |
| Settlement observer | Report a later external event | Separate observation and external evidence reference |

## 2. Models provide judgments; policy and authority stay explicit

Semantic evaluators can disagree or fail. Their results need identities, method
versions, evidence references, and uncertainty. A model response cannot rewrite
the governing method or grant its own authority. Switching a model does not
silently preserve calibration.

## 3. Small executable profiles establish interoperability

A general decision-expression language would introduce a sandbox, compiler,
resource model, numeric semantics, and a much larger security burden. The first
two methods are intentionally finite and specified completely. Implementers can
independently check outcomes before proposing broader expressivity.

Thresholds support claim eligibility. Weighted scenarios support choice under
stated assumptions. Neither is mandated for every future domain. New methods
must be named and specified; they cannot smuggle required semantics through
advisory extensions.

## 4. Uncertainty has more than one meaning

A criterion probability is not a cardinal utility. Utility is not importance.
Importance is not confidence. Rank support is not the probability of truth.
Explicit joint scenarios preserve correlated preferences and evaluations without
claiming that separate model outputs are statistically independent.

The draft exports supplied scenarios rather than implementing Monte Carlo or
value-of-information. This gives deterministic replay now and leaves those
methods open to a separately reviewed profile.

## 5. Hashes support binding, not belief

Canonical JSON gives records a stable content digest. That creates a way to bind
inputs and spot altered artifacts relative to a trusted digest. It cannot prove
who issued a bundle or whether a statement is true. Signed proofs need explicit
key resolution, scope, and revocation rules; they have their own RFC.

Evidence bodies stay outside the core envelope. Public verifiability should not
force publication of private claims or personal agent memory.

## 6. Revisions isolate concurrent actors

An evaluator works against a frozen request. An updated preference, rubric, or
evidence manifest creates another request. Old evaluations fail binding checks
against the new request. Executors still need atomic revision checks and durable
idempotency in their own systems; an offline bundle cannot implement a shared
transaction lock.

## 7. An initial proposal is not community consensus

The repository can provide useful foundations today. A community standard also
needs independent implementations, public review, and a governance process that
admits competing ideas. Version 1.0 must be earned through interoperability and
review; neither the repository name nor its origin establishes adoption.
