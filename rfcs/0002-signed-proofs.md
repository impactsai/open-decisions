# RFC 0002: Signed proofs and external trust binding

- Status: **Draft proposal; not implemented**
- Target version: Undecided
- Review opened / closes: Not yet scheduled

## Problem

A canonical digest lets a consumer compare content to an expected value. It does
not authenticate who issued it, whether that issuer has a mandate, or whether the
mandate remains valid. Interoperable signatures need much more than a `signature`
string added to a JSON object.

## Requirements for a future profile

A proposal must choose an established proof format and specify:

1. Exactly which payload is signed, its canonicalization, domain/type binding,
   algorithm allowlist, and treatment of unknown critical fields.
2. How signer identity binds to key material without trusting a key supplied by
   the same untrusted artifact.
3. Key rotation, revocation, trust anchors, time semantics, and offline limits.
4. The difference between a cryptographically valid signature, a trusted issuer,
   a scoped mandate, and verified evidence.
5. How action authorization binds parameters, executor, resource, amount/limits,
   expiry, replay protection, and idempotency.
6. Cross-implementation test vectors, tampering tests, algorithm-confusion tests,
   wrong-key and wrong-audience rejection, and stale/revoked authority handling.
7. Privacy behavior and whether selective disclosure changes the signed artifact.

JWS, COSE, verifiable credentials, and scoped capability formats are candidates
for investigation. This RFC selects none. Merely wrapping a core bundle in one
of them does not establish Open Decisions signature-profile conformance.

## Current behavior

The core checker reports `signatures: "not_performed"` and
`authority: "not_performed"`. It must continue to do so until a reviewed profile
and implementation provide actual verification. Integrations may perform their
own explicitly described checks, without claiming this unimplemented profile.
