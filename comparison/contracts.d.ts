export type Digest = string;
export type ProfileVersion = 'comparison/0.1.0-draft.1';
export type Method = 'smaa-weighted-sum-v1';
export type Evaluator = { kind: 'measurement' | 'human'; id: string; methodVersion: string } | {
  kind: 'model'; id: string; methodVersion: string; provider: string; model: string;
  modelVersion: string; promptDigest: Digest; mappingDigest: Digest;
};
export type Scale = { kind: 'boolean' } | {
  kind: 'numeric'; minimum: number; maximum: number; direction: 'maximize' | 'minimize'; unit: string;
} | { kind: 'categorical'; levels: { id: string; utilityBp: number }[] };
export type Criterion = { id: string; evaluator: Evaluator; requiredEvidenceSlots: string[]; acceptedCalibrationDigests?: Digest[] } & (
  { role: 'constraint'; scale: { kind: 'boolean' }; minSatisfactionPpm: number } |
  { role: 'preference'; scale: Scale; weightBounds: { minBp: number; maxBp: number } }
);
export interface EvidenceSlot { id: string; description: string }
export interface ComparisonKit {
  profileVersion: ProfileVersion; kind: 'comparison-kit'; id: string; kitVersion: string;
  title: string; method: Method; evidenceSlots: EvidenceSlot[]; criteria: Criterion[];
  weightOrders: { higher: string; lower: string }[];
  limits: { maxOptions: number; maxSamples: number; maxExactScenarios: number; maxWork: number };
  recommendation: { minSoleFirstPpm: number; minLeadPpm: number; maxExpectedRegretBp: number; requireValidatedModels: true };
}
export interface EvidenceRef { slotId: string; digest: Digest }
export interface EvaluationContext {
  profileVersion: ProfileVersion; kind: 'evaluation-context'; id: string; kitDigest: Digest;
  options: { id: string; label: string; evidence: EvidenceRef[] }[];
}
export interface ManifestTask { criterionId: string; evaluator: Evaluator; scale: Scale; requiredEvidenceSlots: string[]; acceptedCalibrationDigests?: Digest[] }
export interface ComparisonManifest {
  profileVersion: ProfileVersion; kind: 'comparison-manifest'; kitDigest: Digest; method: Method;
  evidenceSlots: EvidenceSlot[]; tasks: ManifestTask[];
}
export interface Outcome { id: string; value: boolean | number | string; massPpm: number }
export type Assessment = {
  optionId: string; criterionId: string; evaluator: Evaluator; evidence: EvidenceRef[];
} & ({ status: 'ok'; outcomes: Outcome[]; calibration: { status: 'unvalidated' } | { status: 'validated'; reportDigest: Digest }; rawOutputDigest?: Digest } |
  { status: 'unavailable' | 'error'; detail: string });
export interface AssessmentSet {
  profileVersion: ProfileVersion; kind: 'assessment-set'; contextDigest: Digest; assessments: Assessment[];
}
export interface WeightScenario {
  id: string; massPpm: number; weights: { criterionId: string; weightBp: number }[];
}
export interface JointScenario {
  id: string; massPpm: number; weightScenarioId: string;
  selections: { optionId: string; criterionId: string; outcomeId: string }[];
}
export interface ComparisonRequest {
  profileVersion: ProfileVersion; kind: 'comparison-request'; id: string;
  contextDigest: Digest; assessmentDigest: Digest; weights: WeightScenario[];
  dependence: { kind: 'independent'; justification: string } | { kind: 'joint'; justification: string; scenarios: JointScenario[] };
  computation: { mode: 'exact' } | { mode: 'monte-carlo'; algorithm: 'xoshiro128ss-v1'; samples: number };
}
export interface ComparisonBundle { kit: ComparisonKit; context: EvaluationContext; assessments: AssessmentSet; request: ComparisonRequest }
export const PROFILE_VERSION: ProfileVersion;
export const METHOD: Method;
export class ComparisonError extends Error { code: string; constructor(code: string, message: string) }
export function canonicalJSON(value: unknown): string;
export function parseComparisonJSON(text: string): unknown;
export function digest(value: unknown): Promise<Digest>;
export function validateShape(name: 'kit' | 'context' | 'assessments' | 'manifest' | 'request' | 'bundle' | 'result', value: unknown): unknown;
export function validateKit(value: unknown): ComparisonKit;
export function manifestOf(value: unknown): Promise<ComparisonManifest>;
export function validateManifest(value: unknown, expectedKitDigest: Digest): ComparisonManifest;
export function validateContext(value: unknown, manifest: ComparisonManifest): EvaluationContext;
export function validateAssessments(value: unknown, context: EvaluationContext, manifest: ComparisonManifest): Promise<AssessmentSet>;
export function utilityBp(scale: Scale, value: boolean | number | string): number;
