import {
  PROFILE_VERSION, METHOD, digest, manifestOf, requireCondition,
  sorted, unique, utilityBp, validateAssessments, validateKit, validateShape,
} from './contracts.mjs';

const PPM = 1000000;
const cellId = a => `${a.optionId}/${a.criterionId}`;
const sumMass = xs => xs.reduce((s, x) => s + x.massPpm, 0);

function validateWeights(kit, request) {
  const criteria = kit.criteria.filter(c => c.role === 'preference');
  unique(request.weights, w => w.id, 'weight scenario');
  requireCondition(sumMass(request.weights) === PPM, 'MASS', 'Preference mass must sum to 1000000');
  for (const scenario of request.weights) {
    unique(scenario.weights, w => w.criterionId, 'criterion weight');
    const weights = new Map(scenario.weights.map(w => [w.criterionId, w.weightBp]));
    requireCondition(weights.size === criteria.length && criteria.every(c => weights.has(c.id)), 'WEIGHTS', 'Weights must cover every preference criterion exactly');
    requireCondition(scenario.weights.reduce((s, w) => s + w.weightBp, 0) === 10000, 'WEIGHTS', 'Weights must sum to 10000');
    requireCondition(criteria.every(c => weights.get(c.id) >= c.weightBounds.minBp && weights.get(c.id) <= c.weightBounds.maxBp) && kit.weightOrders.every(o => weights.get(o.higher) >= weights.get(o.lower)), 'WEIGHTS', 'Weights violate kit bounds or orders');
  }
}

function validateJoint(request, cells) {
  if (request.dependence.kind !== 'joint') return;
  const scenarios = request.dependence.scenarios;
  unique(scenarios, s => s.id, 'joint scenario');
  requireCondition(sumMass(scenarios) === PPM, 'MASS', 'Joint scenario mass must sum to 1000000');
  const weights = new Map(request.weights.map(w => [w.id, 0]));
  const marginals = new Map(cells.map(c => [cellId(c), new Map(c.outcomes.map(o => [o.id, 0]))]));
  for (const scenario of scenarios) {
    requireCondition(weights.has(scenario.weightScenarioId), 'JOINT', 'Unknown joint weight scenario');
    weights.set(scenario.weightScenarioId, weights.get(scenario.weightScenarioId) + scenario.massPpm);
    unique(scenario.selections, cellId, 'joint cell');
    requireCondition(scenario.selections.length === cells.length, 'JOINT', 'Joint scenario must cover every assessment cell');
    for (const s of scenario.selections) {
      const marginal = marginals.get(cellId(s));
      requireCondition(marginal?.has(s.outcomeId), 'JOINT', 'Unknown joint cell or outcome');
      marginal.set(s.outcomeId, marginal.get(s.outcomeId) + scenario.massPpm);
    }
  }
  requireCondition(request.weights.every(w => weights.get(w.id) === w.massPpm) && cells.every(c => c.outcomes.every(o => marginals.get(cellId(c)).get(o.id) === o.massPpm)), 'JOINT', 'Joint scenarios do not reproduce assessment and preference marginals');
}

function normalize({ kit, context, assessments, request }) {
  const scale = s => s.kind === 'categorical' ? { ...s, levels: sorted(s.levels) } : s;
  return {
    kit: { ...kit, evidenceSlots: sorted(kit.evidenceSlots), criteria: sorted(kit.criteria).map(c => ({ ...c, scale: scale(c.scale), requiredEvidenceSlots: [...c.requiredEvidenceSlots].sort(), ...(c.acceptedCalibrationDigests ? { acceptedCalibrationDigests: [...c.acceptedCalibrationDigests].sort() } : {}) })), weightOrders: sorted(kit.weightOrders, o => `${o.higher}/${o.lower}`) },
    context: { ...context, kitDigest: undefined, options: sorted(context.options).map(o => ({ ...o, evidence: sorted(o.evidence, e => e.slotId) })) },
    assessments: { ...assessments, contextDigest: undefined, assessments: sorted(assessments.assessments, cellId).map(a => ({ ...a, evidence: sorted(a.evidence, e => e.slotId), outcomes: sorted(a.outcomes) })) },
    weights: sorted(request.weights).map(w => ({ ...w, weights: sorted(w.weights, x => x.criterionId) })),
    dependence: request.dependence.kind === 'independent' ? request.dependence : { ...request.dependence, scenarios: sorted(request.dependence.scenarios).map(s => ({ ...s, selections: sorted(s.selections, cellId) })) },
  };
}

function randomWords(hex) {
  const state = [0, 8, 16, 24].map(offset => Number.parseInt(hex.slice(offset, offset + 8), 16) >>> 0);
  if (state.every(x => x === 0)) state[0] = 1;
  const rotl = (x, k) => ((x << k) | (x >>> (32 - k))) >>> 0;
  return () => {
    const result = Math.imul(rotl(Math.imul(state[1], 5), 7), 9) >>> 0;
    const t = state[1] << 9;
    state[2] ^= state[0]; state[3] ^= state[1]; state[1] ^= state[2]; state[0] ^= state[3];
    state[2] ^= t; state[3] = rotl(state[3], 11);
    return result;
  };
}
function drawIndex(items, random) {
  if (items.length === 1) return 0;
  // 2^32 is not divisible by 10^6. Reject the remainder before reducing modulo.
  const ceiling = Math.floor(0x100000000 / PPM) * PPM;
  let word;
  do { word = random(); } while (word >= ceiling);
  let target = word % PPM;
  for (let i = 0; i < items.length; i++) {
    target -= items[i].massPpm;
    if (target < 0) return i;
  }
  throw new Error('Validated mass invariant failed');
}
function ratio(numerator, denominator) {
  let a = numerator, b = denominator;
  while (b) [a, b] = [b, a % b];
  return { numerator: String(numerator / a), denominator: String(denominator / a) };
}

/** No providers, clock, storage, network, identity, or action execution. */
export async function compare(input) {
  const bundle = structuredClone(validateShape('bundle', input));
  const { kit, context, request } = bundle;
  validateKit(kit);
  requireCondition(context.options.length <= kit.limits.maxOptions, 'LIMIT', 'Option limit exceeded');
  const manifest = await manifestOf(kit);
  requireCondition(manifest.kitDigest === context.kitDigest, 'BINDING', 'Context kit digest mismatch');
  const assessments = await validateAssessments(bundle.assessments, context, manifest);
  const [contextDigest, assessmentDigest, requestDigest] = await Promise.all([digest(context), digest(assessments), digest(request)]);
  requireCondition(request.contextDigest === contextDigest && request.assessmentDigest === assessmentDigest, 'BINDING', 'Request input digest mismatch');
  validateWeights(kit, request);
  if (request.computation.mode === 'monte-carlo') requireCondition(request.computation.samples <= kit.limits.maxSamples, 'LIMIT', 'Sample limit exceeded');
  const base = {
    profileVersion: PROFILE_VERSION, kind: 'comparison-result', method: METHOD, requestId: request.id,
    interpretation: 'model-conditional-scenario-support',
    inputs: { kitDigest: manifest.kitDigest, contextDigest, assessmentDigest, requestDigest },
  };
  const failed = sorted(assessments.assessments.filter(a => a.status !== 'ok'), cellId);
  if (failed.length) return { ...base, outcome: failed.some(a => a.status === 'error') ? 'review-required' : 'needs-information', issues: failed.map(a => ({ optionId: a.optionId, criterionId: a.criterionId, code: a.status, detail: a.detail })) };
  const cells = sorted(assessments.assessments, cellId).map(c => ({ ...c, outcomes: sorted(c.outcomes) }));
  validateJoint(request, cells);
  const cellMap = new Map(cells.map(c => [cellId(c), c]));
  const constraints = kit.criteria.filter(c => c.role === 'constraint');
  const excluded = sorted(context.options).filter(o => constraints.some(c => cellMap.get(`${o.id}/${c.id}`).outcomes.filter(v => v.value === true).reduce((s,v) => s + v.massPpm, 0) < c.minSatisfactionPpm)).map(o => o.id);
  const options = sorted(context.options).filter(o => !excluded.includes(o.id));
  const unvalidatedModels = cells.filter(c => c.evaluator.kind === 'model' && c.calibration.status !== 'validated').map(c => ({ optionId: c.optionId, criterionId: c.criterionId, code: 'unvalidated-model' }));
  if (!options.length) return { ...base, outcome: unvalidatedModels.length ? 'review-required' : 'no-eligible-option', excludedOptionIds: excluded, issues: unvalidatedModels };
  const criteria = sorted(kit.criteria.filter(c => c.role === 'preference'));
  const dimensions = options.flatMap(o => criteria.map(c => cellMap.get(`${o.id}/${c.id}`)));
  const weights = sorted(request.weights).map(w => ({ ...w, weights: sorted(w.weights, x => x.criterionId) }));
  const joint = request.dependence.kind === 'joint' ? sorted(request.dependence.scenarios) : null;
  let scenarioCount = joint ? joint.length : weights.length;
  if (!joint && request.computation.mode === 'exact') for (const d of dimensions) {
    scenarioCount *= d.outcomes.length;
    requireCondition(scenarioCount <= kit.limits.maxExactScenarios, 'LIMIT', 'Exact product exceeds scenario budget; request Monte Carlo explicitly');
  }
  const count = request.computation.mode === 'exact' ? scenarioCount : request.computation.samples;
  requireCondition(request.computation.mode !== 'exact' || count <= kit.limits.maxExactScenarios, 'LIMIT', 'Exact scenario limit exceeded');
  // Include CDF scans and pairwise reporting, not just multiplication of utility cells.
  const stepWork = dimensions.reduce((s,d) => s + d.outcomes.length, 0) + options.length ** 2 + weights.length + (joint ? cells.length + joint.length : 0);
  requireCondition(count * stepWork <= kit.limits.maxWork, 'LIMIT', 'Computation work budget exceeded');

  const normalized = normalize({ ...bundle, assessments });
  delete normalized.context.kitDigest; delete normalized.assessments.contextDigest;
  const seedDigest = await digest(normalized);
  const random = randomWords(seedDigest);
  const totals = options.map(() => ({ sole: 0n, ranks: options.map(() => 0n), utility: 0n, regret: 0n }));
  const pairs = [];
  for (let a = 0; a < options.length; a++) for (let b = a + 1; b < options.length; b++) pairs.push({ a, b, wins: 0n, losses: 0n, ties: 0n });
  let total = 0n, tied = 0n, processed = 0;
  const scales = criteria.map(c => c.scale);
  function accumulate(weight, values, mass) {
    const scores = options.map((_, i) => criteria.reduce((sum, _c, j) => sum + weight.weights[j].weightBp * utilityBp(scales[j], values[i * criteria.length + j]), 0));
    const best = Math.max(...scores), winners = scores.filter(s => s === best).length;
    total += mass; processed++;
    if (winners > 1) tied += mass;
    for (let i = 0; i < scores.length; i++) {
      const t = totals[i], score = scores[i];
      if (score === best && winners === 1) t.sole += mass;
      const rank = scores.filter(s => s > score).length;
      t.ranks[rank] += mass;
      t.utility += BigInt(score) * mass;
      t.regret += BigInt(best - score) * mass;
    }
    for (const p of pairs) {
      if (scores[p.a] > scores[p.b]) p.wins += mass;
      else if (scores[p.a] < scores[p.b]) p.losses += mass;
      else p.ties += mass;
    }
  }
  function fromJoint(s, mass) {
    const selected = new Map(s.selections.map(v => [cellId(v), v.outcomeId]));
    const values = dimensions.map(d => d.outcomes.find(o => o.id === selected.get(cellId(d))).value);
    accumulate(weights.find(w => w.id === s.weightScenarioId), values, mass);
  }
  if (request.computation.mode === 'exact') {
    if (joint) for (const s of joint) fromJoint(s, BigInt(s.massPpm));
    else {
      const values = dimensions.map(d => d.outcomes[0].value);
      const uncertain = dimensions.map((d, index) => ({ ...d, index })).filter(d => d.outcomes.length > 1);
      function enumerate(i, mass, w) {
        if (i === uncertain.length) { accumulate(w, values, mass); return; }
        for (const o of uncertain[i].outcomes) {
          values[uncertain[i].index] = o.value; enumerate(i + 1, mass * BigInt(o.massPpm), w);
        }
      }
      for (const w of weights) enumerate(0, BigInt(w.massPpm), w);
    }
  } else for (let i = 0; i < count; i++) {
    if (joint) fromJoint(joint[drawIndex(joint, random)], 1n);
    else {
      const weight = weights[drawIndex(weights, random)];
      const values = dimensions.map(d => d.outcomes[drawIndex(d.outcomes, random)].value);
      accumulate(weight, values, 1n);
    }
  }
  // Union bound over sole-first support AND normalized regret for every option.
  const errorPpm = request.computation.mode === 'exact' ? 0 : Math.min(PPM, Math.ceil(Math.sqrt(Math.log(4 * options.length / 0.05) / (2 * count)) * PPM));
  const ranked = totals.map((t, i) => ({ optionId: options[i].id, ...t }));
  const policy = kit.recommendation;
  const qualified = ranked.filter(t => {
    const supportOK = t.sole * BigInt(PPM) >= total * BigInt(policy.minSoleFirstPpm + errorPpm);
    const leadOK = ranked.every(other => other === t || (t.sole - other.sole) * BigInt(PPM) >= total * BigInt(policy.minLeadPpm + 2 * errorPpm));
    const regretOK = t.regret * BigInt(PPM) + total * 100000000n * BigInt(errorPpm) <= total * BigInt(policy.maxExpectedRegretBp) * 10000n * BigInt(PPM);
    return supportOK && leadOK && regretOK;
  });
  const outcome = unvalidatedModels.length ? 'review-required' : qualified.length === 1 ? 'recommended' : 'no-robust-winner';
  return {
    ...base, outcome, ...(outcome === 'recommended' ? { selectedOptionId: qualified[0].optionId } : {}),
    excludedOptionIds: excluded, issues: unvalidatedModels,
    computation: { mode: request.computation.mode, algorithm: request.computation.mode === 'exact' ? 'finite-exact-v1' : request.computation.algorithm, seedMaterialDigest: seedDigest, processedScenarios: processed, samplingError: { confidencePpm: 950000, simultaneousSupportAndRegretErrorPpm: errorPpm } },
    tieSupport: ratio(tied, total),
    rankings: ranked.map(t => ({ optionId: t.optionId, soleFirstSupport: ratio(t.sole, total), rankSupport: t.ranks.map((n, i) => ({ rank: i + 1, support: ratio(n, total) })), expectedUtilityBp: ratio(t.utility, total * 10000n), expectedRegretBp: ratio(t.regret, total * 10000n) })),
    pairwise: pairs.map(p => ({ optionA: options[p.a].id, optionB: options[p.b].id, aWins: ratio(p.wins, total), bWins: ratio(p.losses, total), tie: ratio(p.ties, total) })),
  };
}
