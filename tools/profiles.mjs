function key(scenarioId, optionId, criterionId) {
  return JSON.stringify([scenarioId, optionId, criterionId]);
}

export { key as evaluationKey };

// Called only after snapshot shape, method, and reference validation.
export function replayValidated({ protocol, request, evaluations }, at) {
  const byKey = new Map(evaluations.map(e => [key(e.scenarioId, e.optionId, e.criterionId), e]));
  const evidence = new Map(request.evidence.map(e => [e.id, e]));
  // Targets are unique and known after validation; count establishes coverage
  // without allocating the Cartesian product for an incomplete request.
  const matrix = evaluations;
  const expectedCount = request.scenarios.length * request.options.length * protocol.criteria.length;
  if (matrix.some(e => e?.status === 'error')) return { outcome: 'review', reasons: ['evaluator_error'] };
  if (protocol.evidencePolicy.requiredEvidenceIds.some(id => !evidence.has(id)) ||
      matrix.length !== expectedCount || matrix.some(e => e.status === 'unavailable')) {
    return { outcome: 'needs_information', reasons: ['missing_evaluation_or_evidence'] };
  }
  const usedEvidence = new Set([...protocol.evidencePolicy.requiredEvidenceIds, ...matrix.flatMap(e => e.evidenceIds)]);
  if ([...usedEvidence].some(id => evidence.get(id).expiresAt && Date.parse(evidence.get(id).expiresAt) <= Date.parse(at))) {
    return { outcome: 'needs_information', reasons: ['stale_evidence'] };
  }
  if (protocol.method.id === 'threshold-gates-v1') {
    const [scenario] = request.scenarios;
    const [option] = request.options;
    const gates = protocol.method.gates.map(g => {
      const value = byKey.get(key(scenario.id, option.id, g.criterionId)).value;
      const probability = value.kind === 'boolean' ? (value.value ? 10000 : 0) : value.probabilityBp;
      return probability >= g.acceptMinBp ? 'pass' : probability <= g.rejectMaxBp ? 'fail' : 'review';
    });
    if (gates.includes('fail')) return { outcome: 'not_eligible', reasons: ['requirement_failed'] };
    if (gates.includes('review')) return { outcome: 'review', reasons: ['threshold_gap'] };
    return { outcome: 'eligible', reasons: ['requirements_met'], selectedOptionId: option.id };
  }
  if (protocol.method.id !== 'weighted-scenarios-v1') throw new Error('Unsupported method');
  const constraints = protocol.criteria.filter(c => c.role === 'constraint');
  // Hard constraints must hold in every declared scenario, before compensation by utility.
  const excludedOptionIds = request.options.filter(o => request.scenarios.some(s => constraints.some(c =>
    !byKey.get(key(s.id, o.id, c.id)).value.value))).map(o => o.id).sort();
  const eligible = request.options.filter(o => !excludedOptionIds.includes(o.id));
  if (!eligible.length) return { outcome: 'no_viable_option', reasons: ['constraints_failed'], rankings: [], tieMassBp: 0, excludedOptionIds };
  const totals = new Map(eligible.map(o => [o.id, { optionId: o.id, soleFirstMassBp: 0, weighted: 0n }]));
  let tieMassBp = 0;
  for (const scenario of request.scenarios) {
    const scores = eligible.map(o => ({ id: o.id, score: scenario.weights.reduce((sum, weight) =>
      sum + BigInt(weight.weightBp) * BigInt(byKey.get(key(scenario.id, o.id, weight.criterionId)).value.utilityBp), 0n) }));
    const max = scores.reduce((best, item) => item.score > best ? item.score : best, -1n);
    const winners = scores.filter(item => item.score === max);
    if (winners.length === 1) totals.get(winners[0].id).soleFirstMassBp += scenario.massBp;
    else tieMassBp += scenario.massBp;
    for (const item of scores) totals.get(item.id).weighted += BigInt(scenario.massBp) * item.score;
  }
  const rankings = [...totals.values()].map(({ weighted, ...row }) => ({
    ...row, meanUtilityBp: Number((weighted + 50000000n) / 100000000n)
  })).sort((a, b) => b.soleFirstMassBp - a.soleFirstMassBp || b.meanUtilityBp - a.meanUtilityBp || (a.optionId < b.optionId ? -1 : 1));
  const best = rankings[0];
  const lead = best.soleFirstMassBp - (rankings[1]?.soleFirstMassBp ?? 0);
  const robust = best.soleFirstMassBp >= protocol.method.minimumTopShareBp && lead >= protocol.method.minimumLeadBp;
  return {
    outcome: robust ? 'recommended' : 'review',
    reasons: [robust ? 'scenario_support_met' : 'insufficient_scenario_support'],
    ...(robust ? { selectedOptionId: best.optionId } : {}), rankings, tieMassBp, excludedOptionIds
  };
}
