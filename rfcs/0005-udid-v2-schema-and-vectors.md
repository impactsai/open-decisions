# RFC 0005: UDID v2 schemas and conformance-vector plan

- Status: proposed community draft; freeze pending review.
- Origin: IXO Decisions engineering brief; Open Decisions community proposal.
- Target: optional `udid/2.0.0-draft.1` profile; core and comparison unchanged.
- Tracking: [IXO-4658](https://linear.app/ixo-world/issue/IXO-4658/freeze-udid-v2-json-schema-and-publish-the-conformance-test-vector).
- Protocol and gateway reviewer: Shaun Conway, self-nominated for both roles;
  agreement with these artifacts is pending. No approval has been recorded.
- Independent implementer review: not yet obtained.
- Public review opened / closes: not announced. Allow at least 14 calendar days
  after the complete proposal and fixtures are publicly available.

## Problem

Implementers cannot build interoperable verifiers from an abridged schema and
illustrative tokens with shortened hashes and keys. The source also leaves
important conflicts between disclosure, digest identity and settled receipts.
Publishing an unqualified freeze would encode those conflicts without review.

This proposal publishes strict JSON Schemas, a standalone
[record specification](../spec/udid/2.0.0-draft.1/core.md), fictional complete JSON
examples, local validation, and an executable inventory of all 13 M1 vector plans.
It supplies a reviewable schema candidate while keeping cryptographic work and
agreement visible as pending work. It does not implement the downstream SDK issue.

## Source and public derivation

The baseline is **IXO Decisions Technical Specification v1.0, 4 September 2026**,
Section 7 and Appendices A–C (with Sections 8 and 12 for binding context).
[Source document](https://linear.app/ixo-world/document/technical-specification-ixo-decisions-c661bfa066c5).
That document may require workspace access. The normative profile and vector plan
here are self-contained; contributors do not need access to it to implement or
review the proposed records.

The DTB example is derived from source Section 7.4, the settled example completes
the Section 7.6 fragment with its decision claims, and the multi-leg DTP example
is constructed from Sections 7.5/12 and Appendix C.13 (the source supplies no full
multi-leg JSON example). Ellipses, production identities and real merchant data
are replaced with fictional material. Source-style hashes and signatures are
clearly separated from cryptographic test vectors. The profile carries no raw
evidence, credentials or model reasoning.

The implementation uses JSON Schema
[Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core).
[RFC 9901](https://www.rfc-editor.org/rfc/rfc9901.html) defines disclosure
processing; [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785) defines canonical
JSON serialization. Those references do not resolve the product-specific digest
input or make the proposed `udid` extension registered.

## Changes to the abridged source

All changes below are proposals for this explicitly selected draft. They are not
silent corrections to the meaning of tokens already in use.

| Area | Proposal and rationale |
| --- | --- |
| Schema identifiers | Publish under versioned Open Decisions repository paths; retain the source `vct` and extension version but do not alias the source's external schema URLs. Pin a reviewed release's bytes. |
| Unknown data | Close all specified objects. Only URI-named advisory claim-set extensions accept other JSON. Reject residual SD markers at every depth. |
| DTB conditions | Require exactly `act.pay` with `payer`, and `aut.agent`, implementing source Section 7.5 and the prose following Appendix A. |
| Forms and time | Require exactly decision `exp` or settled `stl`, and positive bounded intervals. `iat` is retained from the original decision; receipts can record only settlement within the action deadline. |
| Leg references | Require multi-leg IDs and roles, unique IDs, a group for alternatives, implicit single-leg reference `primary`, and exact settled-leg binding. Non-`upto` amounts require equality. |
| Typed fields | Expand all named nested properties. Use nonnegative safe-integer times, canonical integer amount strings, nonempty references, URI audiences, unique lists and a ULID without overflow. Reject private holder keys; allow only bounded public Ed25519/P-256/secp256k1 JWK shapes. Proofs have format checks only. |
| Incomplete evaluations | Define `pass`, `fail`, `error`, `unavailable`; errors/unavailable checks cannot support `approved`. The source had not enumerated the check result vocabulary. |
| Previously untyped optional data | Bound reviewers to URI arrays, impact quantity/period/location to strings, settlement references to `upstream`/`orderId`/`stripe`/`visa` strings, and holder confirmation to inline `cnf.jwk`. Additional representations need review and a new draft. |
| Source scheme list | Explicitly support `exact`, `upto`, `auth-capture`, `batch-settlement`, `payout`, `transfer`, `charge`, `oct`, `release` as record labels. No live scheme implementation is implied. Unknown methods fail closed. |
| Challenge grammar | Correct literal-dot escaping, reject leading-zero timestamps, and require 16–64 lowercase hex characters. All patterned tokens require an absolute end of string, including rejection of trailing newlines. Keep omitted `kb` as required by protocol, without inserting a schema default. |
| Unsupported annotations | Do not allow a post-settlement change to `aut.revokedAfterSettlement` or an undefined `stl.reversal` addendum. Both conflict with immutable decision claims or lack a complete wire contract. Define versioned status/history separately. |

The schema checks field shape. DID/CID truth, currency scale, model calibration,
cryptography, evaluation replay, issuer trust and authority remain separate.

## Open questions and disposition

| ID | Conflict or missing contract | Required disposition before the affected M1 vector can be frozen |
| --- | --- | --- |
| `DIGEST-DISCLOSURE` | Sections 7.3/7.7 hash the processed claims; Appendix C.2 removes `aut.principal` but requires the same digest to recompute. | Define a disclosure-independent commitment and exact preimage. Compare signed undisclosed commitment material, a separate stable decision projection, or audience-specific artifacts. Record privacy effects and expected bytes. |
| `DIGEST-SETTLED` | R-FORM-1 removes `exp` but retains `dig`; the stated digest exclusions do not exclude `exp`. | Define which original decision fields are committed and retained. Do not simply drop `exp` from hashing without reviewing deadline binding and migration. |
| `DISCLOSURE-MINIMUM` | Section 8's merchant request lists `rub.id`, but Appendix A requires `rub.version`, `rub.cid`, and full `aut` references. | State whether the list adds disclosures to mandatory visible fields, or define a distinct presentation schema. Current record schema keeps Appendix A's required fields. |
| `COUNTERSIGNATURE` | Section 7.6 says sign the leg plus `jti` and `dig`, while the leg contains its own `proof`. The merge shape and detached-JWS conventions are unspecified. | Publish the exact proof-free payload, canonical bytes, protected header, algorithm, and signature encoding. Avoid circular self-signing. |
| `SETTLEMENT-POLICY` | Deferred settlement skips `exp` at settle, while receipt checks require `settledAt <= act.validUntil`; per-scheme timing and long-term status policies are incomplete. | Define evidence for timely acceptance versus later settlement and retained issuer/settler keys. Clarify revocation after settlement without rewriting historical decisions. |
| `ERROR-PRECEDENCE` | Appendix C.3 expects `udid_digest_mismatch` for tampered disclosures, but an SD-JWT processor may reject the disclosure before decision-digest verification. | Specify mutations and error normalization/precedence so implementations compare the same failure. |
| `EIP712-ANNEX` | The source struct does not finish the test encoding, rubric-CID extraction and local registry/escrow setup. | Pin exact typed data, hash inputs, domain, low-s policy, fictional keys, local EVM state and expected reverts. |
| `VC-PROJECTION` | Appendix C.12 names a VC 2.0 projection without a complete projection contract or verification fixture. | Define the projection, securing format, contexts and field mapping before claiming generic-verifier interoperability. |
| `SCHEMA-IDENTIFIERS` | Appendix A/B URLs are outside this repository; the requested target is Open Decisions. | Approve community-hosted versioned IDs, or arrange explicit owner-managed redirects and byte pinning. No automatic remote dereference. |

The draft leaves these questions unresolved. In particular, a valid record always
reports decision-digest, signature, authority and settlement verification as
`not_performed`. Source-digest regression tests demonstrate the two preimage
conflicts; they do not manufacture a resolution.

## Authority, privacy, and community stewardship

Evaluation, determination, authorization, execution and settlement are distinct.
An affirmative UDID outcome constrains a proposed action; a separate authorized
party must permit it. A countersigned receipt is a source assertion until verified
against the settling party and external facts. The source's phrase “authorises
exactly one payment” is interpreted here as one payment binding, not a substitute
for authority. No hosted model or gateway inherits an operator's authority.

Selective disclosure needs a reviewed commitment design: hashing omitted private
claims can enable guessing and correlation. Do not put raw evidence, credentials,
personal memories or confidential trace content into community fixtures. All
examples in this proposal are fictional and explicitly described as simulation.

The user nominated Shaun Conway to review as both protocol and gateway owner;
this nomination is not artifact agreement. Independent implementer review and
community review remain separate gates under [governance](../GOVERNANCE.md).
Anyone may submit counterexamples or an independently authored implementation.
All repository artifacts retain the existing MIT license.

## Conformance, migration, and freeze checklist

The [machine-readable vector plan](../examples/udid/2.0.0-draft.1/vector-plan.json)
contains IDs 1–13 and all source variants. Their signed fixtures are planned for
M1; no passing SDK, Verify service, Python implementation, contract release or
external payment test is claimed. Local record fixtures and tests are runnable now.

Before calling IXO-4658 frozen, record the protocol and gateway owner's approval
of exact schema bytes and the vector plan, resolve or explicitly defer each open
question with affected conformance claims blocked, publish the artifacts, and pin
the reviewed commit or tag. M1 then supplies exact presentations, preimages, public
keys, fixed contexts, status snapshots, local state transitions and expected errors.
Run each case independently in the TypeScript SDK, Python SDK and verification
service. Never use a live payment provider from conformance tests.

This profile does not migrate core/comparison records, existing UDID v1 payloads,
or unversioned producer output. Do not relabel such records. Any future change to
accepted documents or semantics gets a new draft identifier and migration notes;
the next draft must explicitly state how these proposed source identifiers and
digest limitations are handled.
