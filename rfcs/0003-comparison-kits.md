# RFC 0003: Comparison kits and a shared stochastic MCDA kernel

Status: proposed community draft. No adoption or certification is implied.

The claim-oriented threshold profile cannot express uncertain option assessments,
preference uncertainty, or correlated scenarios. Adding these to boolean claim
facts would obscure their meaning. This RFC proposes an independently versioned
[comparison profile](../spec/comparison/0.1.0-draft.1/core.md), its strict
[schema](../schemas/comparison/0.1.0-draft.1/contract.schema.json), and a portable
implementation exported as `open-decisions/comparison`.

The existing `0.1.0-draft.1` core and reference profiles keep their semantics.
The package advances to `0.2.0-draft.1`; comparison records identify themselves as
`comparison/0.1.0-draft.1`. They are not old-core bundles and cannot be passed to
the old validator. A later conversion profile must describe any loss of precision.

The engine owns compilation of the evaluation work order. Oracles produce typed
assessments against it. One shared numerical implementation owns utility conversion,
scenario integration, ranking, regret, and the recommendation policy. A model such
as Jev can supply a declared distribution but cannot choose final policy outcomes.

Frozen evaluation context is independent of preference weights. A new request can
reuse unchanged assessments while selecting another admissible preference model.
Any evidence, option, kit, evaluator, or utility change requires a new context.

The first method supports finite discrete assessment and weight distributions,
explicit joint scenarios, exact integration, and seeded Monte Carlo. Continuous
priors, inferred dependence, live provider adapters, decision revision storage,
signed comparison receipts, action authorization, and skill UI are separate work.

Review must include the schema, normative prose, portable validator, numeric
boundary tests, and consumers of the manifest together. The normal governance
review period applies before adoption or merge of normative changes.
