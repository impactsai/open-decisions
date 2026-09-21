export * from './types';
import type { Subject, Suite, Run, Artifact, Prediction, Application, Policy, Report, Card, Bundle, Configuration, Target, Metrics, Bin } from './types';
export const SPEC_VERSION: 'decision-evals/0.1.0-draft.1';
export const PPM: 1000000;
export class EvalsError extends Error { code: string; constructor(code: string, message: string); }
export function check(condition: unknown, code: string, message: string): asserts condition;
export function canonicalJSON(value: unknown): string;
export function snapshot<T>(value: T): T;
export function same(a: unknown, b: unknown): boolean;
export function parseEvalsJSON(text: string): unknown;
export function digest(value: unknown): Promise<string>;
export function instant(value: string): number;
export function unique<T>(items: T[], key?: (item: T) => unknown): void;
export function validateRecord(name: string, value: unknown): unknown;
export function validateSubject(value: unknown): Subject;
export function validateSuite(value: unknown, subject: Subject): Promise<Suite>;
export function validateRun(value: unknown, suite: Suite, subject: Subject): Promise<{ run: Run; suite: Suite; subject: Subject; configuration: Configuration }>;
export function validateArtifact(value: unknown): Artifact;
export function validateBundle(value: unknown): Promise<Bundle>;
export function distribution(value: Array<{label: string; ppm: number}>, labels: string[]): Array<{label: string; ppm: number}>;
export function fitPav(points: Array<[number, number]>): { minimumPpm: number; maximumPpm: number; knots: Array<{inputPpm: number; outputPpm: number}> };
export function normalizeMass(values: Array<{label: string; ppm: number}>): Array<{label: string; ppm: number}> | null;
export function fitCalibration(input: { subject: Subject; suite: Suite; run: Run; targetId: string; method?: Artifact['method']; population: string; strata: string[]; validFrom: string; validUntil: string; upstreamArtifactDigests?: string[] }): Promise<Artifact>;
export function mapDistribution(artifact: Artifact, prediction: Prediction): {status:'estimated';distribution:Array<{label:string;ppm:number}>} | {status:'not_estimated';reason:string};
export function applyCalibration(input: {artifact:Artifact; prediction:Prediction; evaluationSubjectDigest:string; configurationDigest:string; targetId:string; population:string; stratum:string; at:string; upstreamArtifactDigests?:string[]}):Promise<Application>;
export function determinationPredictor(applications: Application[], requiredTargetIds: string[]): {status:'estimated';predictorPpm:number} | {status:'not_estimated';reason:string};
export function ppmToBasisPoints(ppm: number): number;
export function createReport(input: { subject: Subject; suite: Suite; run: Run; artifact?: Artifact | null; policy?: Policy | null; targetId: string; population: string }): Promise<Report>;
export function createModelCard(input: {subject:Subject;suite:Suite;runs:Run[];reports:Report[];artifacts:Artifact[];policy?:Policy|null;intendedUse:string;limitations:string[];createdAt:string;validUntil:string}):Promise<Card>;
export function preflightRelease(bundle: Bundle, options: {at:string;mode?:'experimental'|'live';acceptedReleaseDigest?:string|null;suspended?:boolean}):Promise<{allowed:boolean;mode:'experimental'|'live';reasons:string[];releaseDigest:string}>;
export type RuntimePrediction = {targetId:string;status:'ok';prediction:Prediction} | {targetId:string;status:'error'|'unavailable'};
export interface ConfidenceInput {bundle:Bundle;configurationDigest:string;population:string;stratum:string;at:string;mode:'experimental'|'live';requiredTargetIds:string[];determinationTargetId:string;predictions:RuntimePrediction[];acceptedReleaseDigest?:string|null;suspended?:boolean;comparisonSupportPpm?:number}
export interface ConfidenceResult {specVersion:typeof SPEC_VERSION;kind:'confidence-result';releaseDigest:string;configurationDigest:string;applications:Application[];determinationReliability:{status:'estimated'|'not_estimated';valuePpm:number|null;reasons:string[];application:Application|null};gate:{status:'eligible'|'review-required'|'needs-information';reasons:string[]}}
export function evaluateConfidence(input: ConfidenceInput): Promise<ConfidenceResult>;
export function comparisonSubjectResources<T>(kit: T): T;
export function rateMetric(count:number,n:number,reason?:string):import('./types').Metric;
export function scoreRows(rows:Array<{label:string;prediction:Extract<Prediction,{distribution:unknown}>}>,target:Target,scheduled?:number):{metrics:Metrics;bins:Bin[];confusion:Report['confusion']};
export const CALIBRATED_COMPARISON_VERSION: 'calibrated-comparison/0.1.0-draft.1';
export interface CalibratedComparisonInput {profileVersion:typeof CALIBRATED_COMPARISON_VERSION;evidence:Bundle;comparison:import('../comparison/contracts').ComparisonBundle;executableDigest:string;configurationDigest:string;determinationTargetId:string;population:string;stratum:string;at:string;mode:'experimental'|'live';acceptedReleaseDigest?:string|null;suspended?:boolean}
export interface CalibratedComparisonResult {profileVersion:typeof CALIBRATED_COMPARISON_VERSION;baseResult:import('../comparison/index').ComparisonResult|null;applications:Array<{optionId:string;criterionId:string;application:Application}>;reliability:Application|null;gate:{status:'eligible'|'review-required'|'needs-information';reasons:string[]}}
export function compareCalibrated(input:CalibratedComparisonInput):Promise<CalibratedComparisonResult>;
