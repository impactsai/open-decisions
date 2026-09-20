# Sources and relationship to other work

Primary references checked on **20 September 2026**. These sources inform the
proposal; none endorses Open Decisions.

| Source | Relevance | What is not claimed |
| --- | --- | --- |
| [JSON Schema 2020-12](https://json-schema.org/draft/2020-12) | Machine-readable structure and validation dialect | Schema validity cannot verify semantic truth |
| [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785) | Deterministic JSON serialization for internal digests | A digest is not an authenticated signature |
| [W3C PROV overview](https://www.w3.org/TR/prov-overview/) | Vocabulary and prior work for provenance | This draft is not a PROV serialization or conformance profile |
| [OMG Decision Model and Notation](https://www.omg.org/spec/DMN/) | Existing work on decision models and logic | No DMN parser or round-trip mapping is implemented |
| [Cloudflare Jev documentation](https://developers.cloudflare.com/ai/models/typesafe/jev/) | A typed semantic evaluator that could produce inputs | Provider probabilities do not confer authority or prove truth |
| [Muse Connector Platform](https://muse.ai/platform) | A possible consumer distribution surface | No connector API compatibility or directory acceptance has been established |
| [Ajv JSON Schema documentation](https://ajv.js.org/json-schema.html) | Reference validation with the 2020-12 dialect | Ajv is an implementation dependency, not required by the standard |

The research conversation “Research Jev For IXO” supplied the motivating
architectural questions: bounded evaluation, explicit preferences, deterministic
policy, professional methods, and accountable action. Its commercial projections
and product-specific claims are not incorporated as normative facts.

Open Decisions aims to package evidence, preferences, evaluation results,
determination, and consequence links across systems. Existing decision-model,
provenance, credential, capability, and payment specifications should be reused
through explicitly reviewed profiles rather than silently redefined here.
