# UDID examples and M1 vector plan

These are **fictional, unsigned processed-record fixtures**. Keys, proof strings,
evidence references, transactions and identities are placeholders. Nothing was
purchased, paid, resolved from a network, or independently verified.

Read the [profile](../../../spec/udid/2.0.0-draft.1/core.md) and
[RFC 0005](../../../rfcs/0005-udid-v2-schema-and-vectors.md) first. A JSON record
passing these checks is not a verified UDID presentation.

| Example | Purpose |
| --- | --- |
| [DTB decision](valid/dtb-decision.json) | Complete fictional purchase determination derived from source Section 7.4. |
| [Merchant disclosure](valid/dtb-merchant-disclosure.json) | Private optional claims removed; required processed fields retained. The original digest is only a declaration pending the digest design. |
| [DTB settled form](valid/dtb-settled.json) | Same decision with `exp` removed and a fictional primary receipt added. Its countersignature is a placeholder. |
| [DTP multi-leg decision](valid/dtp-multi-leg-decision.json) | Funding, preferred disbursement and an alternative in the same group. Arc/Stripe/Visa labels mirror source C.13 without invoking those systems. |
| [DTP multi-leg settled form](valid/dtp-multi-leg-settled.json) | Two fictional receipts on distinct legs; the alternative has not been executed. |
| [Unavailable evaluator](valid/evaluator-unavailable.json) | Records an incomplete evaluation and requests review. It does not fabricate a negative or affirmative check. |
| [Extension info](valid/extension-info.json) | Proposed server declaration with a syntactically complete challenge. |

[manifest.json](manifest.json) lists every valid and invalid record and its expected
result. The fixture runner checks these expectations without regeneration.
`node tools/build-udid-examples.mjs` deliberately regenerates fictional examples;
review any resulting changes. The builder uses the source's full-claim digest rule
for full decision examples only. The unchanged digest in trimmed/settled examples
illustrates the unresolved conflict; no signature or digest validity is claimed.

## Appendix C vector inventory

[vector-plan.json](vector-plan.json) is the machine-readable M1 contract. Every
vector remains `planned`, with seed records, individual cases, expected outcomes,
and blocking design questions. Paths under `m1/` are planned artifact directories;
they do not claim files exist. The seven positive records above are not the seven
first vectors in that plan.

| Source vector | M1 behavior to demonstrate |
| --- | --- |
| 1 | EdDSA DTB with full disclosure verifies. |
| 2 | Merchant disclosure verifies without principal disclosure; commitment recomputes. |
| 3 | Signed-amount tampering and disclosure tampering yield the specified failures. |
| 4 | A different accepted payee fails payment binding. |
| 5 | A decision at or after expiry fails. |
| 6 | A locally supplied revoked status entry fails. |
| 7 | Another payment's holder-binding hash fails; redeemed presentations cannot replay. |
| 8 | An `upto` receipt exceeding the ceiling fails. |
| 9 | A valid countersigned receipt verifies after 24 hours and 400 days, without `exp`. |
| 10 | Local EIP-712 release, repeat redemption, wrong chain/contract and wrong deed behave as specified. |
| 11 | ES256 and ES256K issuer variants verify. |
| 12 | The specified VC projection verifies with a generic VC verifier. |
| 13 | Funding and disbursement receipts verify; a second alternative cannot execute. |

Supplemental cases cover unavailable/stale status, unknown keys, malformed JSON,
and ambiguous settlement outcomes. All M1 dependencies must be local fixtures,
mock adapters, or a local EVM. Real provider calls and real actions are forbidden.
Owner agreement is pending in the plan; neither a nomination nor a passing
record check is approval of the freeze.
