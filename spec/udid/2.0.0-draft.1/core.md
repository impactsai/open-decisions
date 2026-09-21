# UDID v2 processed records

Status: **proposed community draft, 2.0.0-draft.1**, 21 September 2026.
This optional Open Decisions profile is a candidate for review. It is not a frozen
standard, registered x402 extension, signed-token implementation, or certification.

A Universal Decision and Impact Determination (UDID) records a determination
about a proposed purchase or payout. Applications need to distinguish that
determination from permission to act and from evidence that money actually moved.
This profile supplies a common JSON shape for examining those records.

The profile originates in IXO's September 2026 product specification. Anyone can
implement it without an IXO service, account, chain, model, wallet, or commercial
agreement. The existing Open Decisions core and comparison profiles remain
independent; using UDID is optional. See [RFC 0005](../../../rfcs/0005-udid-v2-schema-and-vectors.md)
for source differences, unresolved choices, and the review process.

## 1. Scope and identifiers

The JSON Schemas define wire shape; this document defines the additional record
semantics. Uppercase MUST, MUST NOT, SHOULD, and MAY use the meanings in
[RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and
[RFC 8174](https://www.rfc-editor.org/rfc/rfc8174).

| Document | Local schema | `$id` |
| --- | --- | --- |
| Claim set after disclosures have been processed | [processed-claim-set.schema.json](../../../schemas/udid/2.0.0-draft.1/processed-claim-set.schema.json) | `https://raw.githubusercontent.com/impactsai/open-decisions/main/schemas/udid/2.0.0-draft.1/processed-claim-set.schema.json` |
| Server's proposed `udid` extension declaration | [udid-info.schema.json](../../../schemas/udid/2.0.0-draft.1/udid-info.schema.json) | `https://raw.githubusercontent.com/impactsai/open-decisions/main/schemas/udid/2.0.0-draft.1/udid-info.schema.json` |

These URLs identify repository artifacts. Availability on `main` requires merge;
a release freeze requires a reviewed tag/commit and pinned schema bytes. A URL
does not imply that an outside registry has accepted the profile. Validators MUST
load pinned local schema bytes and MUST NOT fetch a schema named by input data.

The [candidate schema lock](../../../schemas/udid/2.0.0-draft.1/schema-lock.json)
records SHA-256 of each exact schema file, including its final newline. Tests
check these bytes; the lock is a review aid, not a signature or owner approval.

Select `udid/2.0.0-draft.1` explicitly when checking these records. The source
credential-type value `vct: "https://ixo.world/udid/v2"` and extension
`version: "2"` are retained for source compatibility. They do not distinguish
future revisions of this draft. A consumer MUST select the supported draft out
of band; it MUST NOT guess compatibility from `vct` alone.

The source's proposed schema identifiers, `https://ixo.world/schemas/udid/v2.json`
and `https://ixo.world/schemas/x402/udid-info-v2.json`, are historical references,
not aliases registered by this repository. Moving schema hosting to this community
repository is an explicit review decision, tracked as `SCHEMA-IDENTIFIERS` in RFC
0004. This change does not claim control of those external URLs.

## 2. What is a processed record?

The input is a JSON object after an SD-JWT implementation has applied the supplied
disclosures. It is not a compact JWT, a raw issuer payload, an x402 envelope, or
a W3C credential projection. `_sd`, `_sd_alg`, and `...` markers MUST NOT remain
anywhere in this object, including extensions. Passing this schema does not prove
that the preceding disclosure processing or signature verification happened.

Unknown fields MUST be rejected. Claim sets MAY carry advisory data under
`extensions` with absolute URI keys. Such data MUST NOT change the determination,
authority, binding, or verification requirements. The extension `info` object is
closed and has no generic extension map. An unknown profile, credential type,
extension version, decision type, outcome, or payment scheme MUST be rejected.

JSON MUST satisfy the [core serialization rules](../../0.1.0-draft.1/core.md#10-serialization-and-integrity):
no duplicate keys, lone surrogates, unsafe integers, or non-finite numbers. The
reference wire reader allows at most 4 MiB and 64 nesting levels. It rejects
invalid UTF-8. Amounts are canonical nonnegative integer decimal strings, with
no sign, leading zeros (except `"0"`), decimal point, or exponent. They can exceed
JavaScript's safe integer range; compare them as integers, never floating point.

## 3. Claim set

The top-level required fields are `iss`, `jti`, `iat`, `vct`, `dig`, `sub`, `dec`,
`act`, `rub`, and `aut`, plus exactly one lifecycle form below.

| Fields | Meaning and boundary |
| --- | --- |
| `iss`, `jti`, `sub` | Claimed issuer DID, decision identifier (`urn:udid:` plus an uppercase ULID), and subject reference. These strings authenticate nobody. |
| `iat`, `nbf`, `exp` | Nonnegative safe-integer Unix seconds. `iat` is issuance of the original decision. Optional `nbf` cannot precede it. |
| `vct`, `vct#integrity`, `dig` | Credential type, optional schema-integrity declaration, and syntactically valid SHA-256 decision digest. Digest computation and schema-integrity verification are not implemented here; see Section 7. |
| `aud`, `cnf`, `status` | Optional recipient URI(s), public holder JWK, and status-list reference. Presence does not verify recipient binding, possession, key trust, freshness, or revocation. |
| `dec` | `DecisionToBuy` or `DecisionToPay`, outcome, reasons, optional confidence and review metadata. A score does not establish calibration or truth. |
| `act` | Proposed payment conditions and deadline. This is a determination's binding declaration, not an executable authorization. |
| `rub`, `aut` | Rubric identifier/version/reference and declared authority invocation, delegation root, command, policy digest, optional principal and agent. These references are unverified. |
| `evl`, `evd`, `clm` | Optional recorded checks, evidence references and credential references. They carry no raw evidence or credentials. |
| `lnk`, `imp`, `explanation` | Optional protocol links, impact assertions and user explanation. They neither prove impact nor change the determination. |
| `prf`, `stl` | Optional proof-shaped data and settlement assertions. Their signatures and external facts require separate verification. |

Every typed nested object is defined by the schema. Reference strings labelled
`cid`, `invocation`, or `delegationRoot` are opaque at this layer; a deployment
claiming content-address verification MUST use a separate supported codec and
digest check. No CID resolution occurs. DID syntax is checked without resolving
or requiring any DID network. The bounded `cnf.jwk` shape accepts public Ed25519,
P-256, or secp256k1 coordinates; no private key fields or remote key URLs are
accepted. Curve membership and usable key material are not established.

`evl.checks[].result` is `pass`, `fail`, `error`, or `unavailable`. Here `fail`
means a completed check found its condition false; `error` means the check failed
to run. `approved` MUST NOT accompany `error` or `unavailable`. A recorded `fail`
does not by itself invalidate a determination because this profile cannot know
whether that check is a required gate. The rubric and decision policy need their
own evaluation. Check IDs and evidence IDs MUST each be unique within their list.

The optional impact object uses strings for `quantity`, `period`, and coarse
`location`; no arithmetic or domain assurance is inferred. Schemes and fields
without a precise source type are bounded draft proposals, enumerated in RFC 0005.
Implementers MUST NOT assume compatibility with unexamined existing UDID tokens.

## 4. Forms, payment legs, and local consistency

**Decision form:** `exp` is required and `stl` is forbidden. The start of validity
is `nbf` if present, otherwise `iat`. The record MUST satisfy
`start < exp <= act.validUntil`. A deadline later than `exp` permits representation
of a deferred-settlement proposal; this checker does not approve that policy.

**Settled form:** a nonempty `stl` array is required and `exp` is forbidden.
`act.validUntil` retains the action deadline. This is a receipt assertion: no
expiry field means the record can be retained, not that its signatures or
authority can be trusted forever. Reversals and revocation annotations need a
separately versioned history; this draft rejects undeclared addenda.

An action MUST contain exactly one of `pay` and `legs`. A Decision to Buy MUST use
`pay`, include its `payer`, and include `aut.agent`. A Decision to Pay MAY use
either a single payment or a nonempty list of legs. Each multi-leg entry requires
a unique `id`, a `role`, and complete scheme/network/asset/amount/payee binding.
For a single payment, an omitted `id` means `primary` for references only; validators
MUST NOT insert that default into the record.

Each leg with `role: "alternative"` MUST have a `group`. A group MAY also be on a
preferred funding or disbursement leg. At most one member of any group may appear
in a given `stl` array. A deployment needs durable, atomic reservation and redemption
across requests to enforce that rule in operation; array checks cannot do so.
`rail` and `network` identify the chosen integration; no particular rail is required.

For every `stl` entry the checker MUST enforce:

1. The referenced leg exists and appears only once in the receipt.
2. Network, asset and payee match exactly. If the leg binds a payer, the receipt
   supplies the same payer. Optional receipt scheme/payer cannot contradict the leg.
3. Amount equals the declared amount, except `upto`, where it is at most that ceiling.
   Equality for other source schemes is this draft's conservative record rule;
   partial captures and batching need a separate supported binding annex.
4. `start <= settledAt <= act.validUntil` and the decision outcome is `approved`
   or `partial_success`. Missing legs may remain unsettled; a nonempty receipt
   MUST NOT be displayed as completion of every leg.

Where both are present, `act.resource.urlHash` and `lnk.x402.resourceUrlHash` MUST
agree. EIP-712 proof entries MUST reference an existing leg with network
`eip155:<chainId>`. This only checks internal references, not an EIP-712 signature
or a contract's behavior. Exact action-kind mappings, current status, execution,
FX conversion between different assets, and payment requirements supplied by an
external party remain outside this checker.

## 5. The proposed extension declaration

The `info` schema validates only the server declaration: `version`, `required`,
`decisionType`, nonempty unique `issuers`, `verifier`, and `challenge` are required.
Optional fields are `kb`, `bind`, `disclose`, `rubric`, and `decideUrl`.

`challenge` is `v1.<nonnegative decimal timestamp>.<16–64 lowercase hex characters>`.
The separators are literal dots. This grammar fixes the double-escaped regex in
the source Appendix B. Grammar cannot prove freshness, randomness or nonce use.

Omitting `kb` means holder binding is required by the proposed protocol. The
schema's `default: true` is an annotation; validators MUST NOT modify input.
An empty or omitted `bind` MUST NOT weaken mandatory payment bindings. `disclose`
is a requested disclosure list; it MUST NOT weaken required processed fields.
The exact minimum-disclosure contract is unresolved (RFC 0005).

`required: false` does not mean a supplied invalid token is valid. A runtime
must explicitly distinguish an absent optional extension from failed verification.
A server-supplied `verifier` URL is not trusted authority, and need not be called.
An implementation MAY verify locally with its own pinned trust material.

## 6. Offline record checks and future verification

```sh
npm ci --ignore-scripts
npm run check
npm run validate:udid -- udid/2.0.0-draft.1 claim-set examples/udid/2.0.0-draft.1/valid/dtb-decision.json
npm run validate:udid -- udid/2.0.0-draft.1 info examples/udid/2.0.0-draft.1/valid/extension-info.json
```

The library exports `validateUdidRecord(input, { profile, kind })` from
`open-decisions/udid`. `input` is strict JSON text or a plain JSON value;
`kind` is exactly `claim-set` or `info`. The validator is read-only and never
fetches evidence, keys, schemas, status lists or payment services.

The report's `recordValid` covers schema and the local semantics above only.
`verification: "not_performed"` is always present, alongside the list of checks
not performed. Successful record validation MUST NOT be used as the output of a
UDID token verifier or as a payment permission. CLI exit codes are 0 for a valid
record, 1 for an invalid record/input, and 2 for incorrect command usage.

The checker receives one record at a time. It does not establish that a settled
form preserves an earlier signed decision or that two records with the same
`jti` are consistent; decision lineage requires a separate check.

The [vector plan](../../../examples/udid/2.0.0-draft.1/vector-plan.json) preserves
Appendix C's 13 numbered vectors, their variants, expected outcomes, source error
codes, and generation dependencies. All signed-token vectors remain **planned for
M1**. Existing JSON examples test record shape and consistency only. The planned
suite must run from local keys, fixed clocks, signed status snapshots, mock
settlement responses and a local EVM. It MUST NOT invoke live providers or execute
real payments. Failed dependencies require explicit failure, never invented success.

## 7. Freeze and verification blockers

The source digest definition hashes processed claims excluding `dig`, `prf`, and
`stl`. A merchant disclosure removes other claims; converting a decision to a
receipt removes `exp`. Both change the hash input, although the source requires
the same `dig`. This is a source contradiction, not an implementation choice to
hide. The reference checker deliberately makes no decision-digest assertion.

Until reviewers resolve the digest input, disclosure minimums, countersignature
payload and lifecycle policies in [RFC 0005](../../../rfcs/0005-udid-v2-schema-and-vectors.md),
implementers MUST NOT claim complete UDID v2 or R-VER-1 conformance from this draft.
A successful signature would establish who signed particular bytes, not whether
the underlying evidence is true, the outcome is correct, the signer may authorize
payment, or the payment settled.

Review, publication, immutable versioning, and independent implementation gates
follow [Open Decisions governance](../../../GOVERNANCE.md). Neither a source
product milestone nor this repository's tests establishes community consensus.
