export * from './contracts.js';
import type { Digest, ProfileVersion, Method } from './contracts.js';
export interface ExactRatio { numerator: string; denominator: string }
export interface ComparisonResult {
  profileVersion: ProfileVersion; kind: 'comparison-result'; method: Method; requestId: string;
  interpretation: 'model-conditional-scenario-support';
  inputs: { kitDigest: Digest; contextDigest: Digest; assessmentDigest: Digest; requestDigest: Digest };
  outcome: 'recommended' | 'review-required' | 'needs-information' | 'no-eligible-option' | 'no-robust-winner';
  selectedOptionId?: string; excludedOptionIds?: string[];
  issues: { optionId: string; criterionId: string; code: string; detail?: string }[];
  computation?: { mode: 'exact' | 'monte-carlo'; algorithm: 'finite-exact-v1' | 'xoshiro128ss-v1'; seedMaterialDigest: Digest; processedScenarios: number; samplingError: { confidencePpm: 950000; simultaneousSupportAndRegretErrorPpm: number } };
  tieSupport?: ExactRatio;
  rankings?: { optionId: string; soleFirstSupport: ExactRatio; rankSupport: { rank: number; support: ExactRatio }[]; expectedUtilityBp: ExactRatio; expectedRegretBp: ExactRatio }[];
  pairwise?: { optionA: string; optionB: string; aWins: ExactRatio; bWins: ExactRatio; tie: ExactRatio }[];
}
export function compare(input: unknown): Promise<ComparisonResult>;
