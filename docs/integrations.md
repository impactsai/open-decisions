# Integration boundaries

Informative guidance, checked against primary documentation on 20 September 2026.
No live integration is shipped or claimed by this repository.

## Jev and Cloudflare

Cloudflare documents Jev requests as `state` plus typed `questions`, with `noul`,
`choice`, and `score` outputs. A Noul carries its probability directly; it does
not have a separate confidence field in the documented example.
[Cloudflare Jev documentation](https://developers.cloudflare.com/ai/models/typesafe/jev/).

A prospective adapter should:

1. Prepare minimal, authorized state from the evidence snapshot.
2. Map criterion questions and rubric versions to the provider request.
3. Archive request/response evidence and identify the resolved model version,
   provider, transformations, and quantization in the criterion method record.
4. Convert supported results to the core type using that declared transform;
   preserve raw precision in restricted evidence if appropriate.
5. Emit `error` or `unavailable` when evaluation fails. Never manufacture a zero
   probability, successful result, or authority grant to cover an error.

| Provider result | Possible core representation | Required boundary |
| --- | --- | --- |
| Noul | `probability` with documented basis-point quantization | Report calibration separately; do not invent confidence |
| Choice | Source evidence for a declared transform | Core has no native categorical distribution type yet |
| Score distribution | Source evidence for an explicit cardinal utility transform | Do not assume ordinal levels are equally spaced |
| Provider error | Evaluation `error` with an issue | Profile requests review |

Keep arithmetic, dates, threshold application, authority verification, and
execution in appropriate deterministic services. A Cloudflare gateway is an
optional transport/operations choice; it changes none of these trust boundaries.
The existing fixtures contain supplied values, not actual Jev responses.

## IXO Decisions and evaluation oracles

An IXO adapter could map a rubric and mandate into `protocol`, a claim and evidence
manifest into `request`, oracle observations into `evaluations`, and the engine
result into `decision`. An existing runtime should only claim a reference profile
when its semantics match exactly. Other engine methods need separate profiles.

DIDs can identify actors and CIDs can be source identifiers. Neither is required
by Open Decisions, and neither alone proves authentic or adequate evidence. UCAN
or another capability mechanism can establish external scoped authority, but the
core's authorization record is not itself a UCAN. Credential, signature, chain,
and settlement verification remain the integrating runtime's responsibility.
There is no asserted UDID or IXO credential-format compatibility in this draft.

## Consumer agents and Muse

Muse's public platform page describes connector submission, review, directory
publication, and a Link payment relationship. That page does not define a wire
contract for this proposed integration.
[Muse Connector Platform](https://muse.ai/platform).

A proposed consumer connector can discover options, ask for a user's relevant
preferences, and call a decision service with a minimal request. It can render the
recorded result and ask for action approval. A connector must obtain the host's
actual API and permission contract before implementation; this repository does
not invent Muse tool names, scopes, billing APIs, or approval guarantees.

A useful decision card would display:

- The recommendation or request for review, including a visible simulation label.
- Options, hard constraints, preferences, and the evidence used.
- Scenario support with its assumptions and unresolved limitations.
- Why the recorded method returned that result, and how to request review.
- A separate action approval control bound to concrete parameters and expiry.

A host's personal memory is not the decision service's database. Send only
necessary, disclosed context. Surface economic interests. Merchant commissions
must not secretly enter a preference or utility transformation. The service can
return a decision without receiving payment credentials or action authority.

## Signing and action adapters

No signing, credential, payment, wallet, or settlement adapter ships here.
An action service needs independently trusted identity, mandate validation,
revocation, current freshness, atomic duplicate prevention, and verification of
external receipts. Use the proposed [signed-proof RFC](../rfcs/0002-signed-proofs.md)
to contribute an interoperable binding rather than inventing incompatible proof
fields in the core.
