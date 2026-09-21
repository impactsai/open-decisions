import { writeFileSync } from 'node:fs';
import { PROFILE_VERSION, METHOD, digest, manifestOf } from '../comparison/contracts.mjs';

const evaluator = { kind: 'measurement', id: 'fixture', methodVersion: 'v1' };
const kit = {
  profileVersion: PROFILE_VERSION, kind: 'comparison-kit', id: 'fictional-buy', kitVersion: 'v1',
  title: 'Fictional devices: price and suitability', method: METHOD,
  evidenceSlots: [{ id: 'specification', description: 'Fictional supplied specifications, not verified product claims' }],
  criteria: [
    { id: 'eligible', role: 'constraint', evaluator, requiredEvidenceSlots: ['specification'], scale: { kind: 'boolean' }, minSatisfactionPpm: 1000000 },
    { id: 'price', role: 'preference', evaluator, requiredEvidenceSlots: ['specification'], scale: { kind: 'numeric', minimum: 0, maximum: 1000, direction: 'minimize', unit: 'fictional-units' }, weightBounds: { minBp: 0, maxBp: 10000 } },
    { id: 'fit', role: 'preference', evaluator, requiredEvidenceSlots: ['specification'], scale: { kind: 'categorical', levels: [{ id: 'low', utilityBp: 0 }, { id: 'high', utilityBp: 10000 }] }, weightBounds: { minBp: 0, maxBp: 10000 } },
  ],
  weightOrders: [], limits: { maxOptions: 32, maxSamples: 100000, maxExactScenarios: 10000, maxWork: 20000000 },
  recommendation: { minSoleFirstPpm: 750000, minLeadPpm: 100000, maxExpectedRegretBp: 2000, requireValidatedModels: true },
};
const context = {
  profileVersion: PROFILE_VERSION, kind: 'evaluation-context', id: 'fictional-device-evidence', kitDigest: await digest(kit),
  options: await Promise.all(['A', 'B', 'C'].map(async id => ({ id, label: `Fictional device ${id}`, evidence: [{ slotId: 'specification', digest: await digest({ fictional: id }) }] }))),
};
const assessments = {
  profileVersion: PROFILE_VERSION, kind: 'assessment-set', contextDigest: await digest(context),
  assessments: context.options.flatMap(option => kit.criteria.map(c => ({
    optionId: option.id, criterionId: c.id, evaluator, evidence: option.evidence,
    status: 'ok', calibration: { status: 'unvalidated' },
    outcomes: c.id === 'eligible' ? [{ id: 'observed', value: option.id !== 'C', massPpm: 1000000 }] :
      c.id === 'price' ? [{ id: 'observed', value: option.id === 'A' ? 200 : 500, massPpm: 1000000 }] :
      option.id === 'A' ? [{ id: 'high', value: 'high', massPpm: 800000 }, { id: 'low', value: 'low', massPpm: 200000 }] :
      [{ id: 'high', value: 'high', massPpm: 1000000 }],
  }))),
};
const request = {
  profileVersion: PROFILE_VERSION, kind: 'comparison-request', id: 'fictional-comparison',
  contextDigest: await digest(context), assessmentDigest: await digest(assessments),
  weights: [{ id: 'balanced', massPpm: 1000000, weights: [{ criterionId: 'price', weightBp: 5000 }, { criterionId: 'fit', weightBp: 5000 }] }],
  dependence: { kind: 'independent', justification: 'Fictional fixture has only one uncertain cell' }, computation: { mode: 'exact' },
};
writeFileSync(new URL('../examples/comparison/fictional-buy.json', import.meta.url), JSON.stringify({ kit, context, assessments, request }, null, 2) + '\n');
writeFileSync(new URL('../examples/comparison/manifest.json', import.meta.url), JSON.stringify(await manifestOf(kit), null, 2) + '\n');
