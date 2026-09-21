import * as validators from './validators.mjs';
import { canonicalJSON, digest, parseComparisonJSON } from '../comparison/contracts.mjs';
export { canonicalJSON, digest };
export const SPEC_VERSION = 'decision-evals/0.1.0-draft.1';
export const PPM = 1000000;
export class EvalsError extends Error {
  constructor(code, message) { super(message); this.name = 'EvalsError'; this.code = code; }
}
export function check(ok, code, message) { if (!ok) throw new EvalsError(code, message); }
export function unique(items, key = x => x) {
  const keys = items.map(key); check(new Set(keys).size === keys.length, 'DUPLICATE', 'Duplicate identifier');
}
export const same = (a, b) => canonicalJSON(a) === canonicalJSON(b);
export const snapshot = x => JSON.parse(canonicalJSON(x));
export const parseEvalsJSON = parseComparisonJSON;
export function validateRecord(name, value) {
  canonicalJSON(value);
  check(Object.hasOwn(validators, `v_${name}`), 'SCHEMA', 'Unknown record type');
  check(validators[`v_${name}`](value), 'SCHEMA', `${name}: ${JSON.stringify(validators[`v_${name}`].errors)}`);
  return value;
}
export function instant(value) {
  const n = Date.parse(value);
  check(Number.isFinite(n) && new Date(n).toISOString().replace('.000Z','Z') === value, 'TIME', 'Invalid UTC instant');
  return n;
}
export function distribution(value, labels) {
  unique(value, x => x.label); unique(labels);
  check(value.length === labels.length && value.every(x => labels.includes(x.label) && Number.isSafeInteger(x.ppm) && x.ppm >= 0 && x.ppm <= PPM) && value.reduce((s,x) => s+x.ppm,0) === PPM, 'DISTRIBUTION', 'Distribution must cover exact labels and sum to one million');
  return value;
}
export function validateSubject(value) {
  const s = validateRecord('subject', value);
  unique(s.resources, x=>x.id); unique(s.configurations, x=>x.id); unique(s.targets,x=>x.id);
  for (const t of s.targets) {
    unique(t.labels); unique(t.adverseLabels);
    check(t.labels.includes(t.positiveLabel) && t.adverseLabels.every(x=>t.labels.includes(x)), 'TARGET', 'Unknown label');
    if (t.ordinalLevels) { unique(t.ordinalLevels,x=>x.label); check(t.ordinalLevels.length===t.labels.length && t.ordinalLevels.every(x=>t.labels.includes(x.label)), 'TARGET', 'Ordinal levels must cover labels'); }
  }
  return s;
}
export async function validateSuite(value, subjectValue) {
  const subject=snapshot(validateSubject(subjectValue)), suite=snapshot(validateRecord('suite',value));
  check(suite.evaluationSubjectDigest===await digest(subject),'BINDING','Suite subject mismatch');
  instant(suite.frozenAt); unique(suite.cases,x=>x.id); unique(suite.requiredVariants);
  const groups=new Map(), evidence=new Map(), evidenceGroups=new Map(), targets=new Map(subject.targets.map(t=>[t.id,t]));
  for(const c of suite.cases) {
    check(!groups.has(c.groupId) || groups.get(c.groupId)===c.split,'LEAKAGE','A case group crosses splits'); groups.set(c.groupId,c.split);
    for(const d of [c.inputDigest,...c.evidenceDigests]) { check(!evidence.has(d) || evidence.get(d)===c.split,'LEAKAGE','Evidence or input crosses splits'); evidence.set(d,c.split); check(!evidenceGroups.has(d)||evidenceGroups.get(d)===c.groupId,'LEAKAGE','Related evidence must share a case group'); evidenceGroups.set(d,c.groupId); }
    unique(c.labels,x=>x.targetId);
    for(const l of c.labels) check(targets.has(l.targetId) && (l.value===null || targets.get(l.targetId).labels.includes(l.value)),'LABEL','Unknown target or label');
  }
  check(['development','fact-fit','determination-fit','acceptance'].every(p=>suite.cases.some(c=>c.split===p)),'SPLIT','All four partitions are required');
  return suite;
}
export async function validateRun(value, suiteValue, subjectValue) {
  const subject=snapshot(subjectValue), suiteInput=snapshot(suiteValue), run=snapshot(validateRecord('run',value));
  const suite=await validateSuite(suiteInput,subject);
  check(run.evaluationSubjectDigest===await digest(subject) && run.suiteDigest===await digest(suite),'BINDING','Run bindings differ');
  const configDigests=await Promise.all(subject.configurations.map(x=>digest(x)));
  const configuration=subject.configurations[configDigests.indexOf(run.configurationDigest)];
  check(configuration,'CONFIGURATION','Unknown evaluator configuration');
  check(instant(run.startedAt)>=instant(suite.frozenAt) && instant(run.completedAt)>=instant(run.startedAt),'TIME','Run predates suite freeze or ends before start');
  const cases=new Map(suite.cases.map(c=>[c.id,c])), targets=new Map(subject.targets.map(t=>[t.id,t]));
  unique(run.observations,o=>JSON.stringify([o.caseId,o.targetId]));
  const expected=suite.cases.reduce((n,c)=>n+c.labels.length,0);
  check(run.observations.length===expected,'COVERAGE','Every case target must have an observation, including unattempted');
  for(const o of run.observations) {
    const c=cases.get(o.caseId), t=targets.get(o.targetId);
    check(c && t && c.labels.some(l=>l.targetId===o.targetId) && o.configurationDigest===run.configurationDigest,'BINDING','Observation target or configuration differs');
    check(c.split===run.phase||o.status==='unattempted','PHASE','A run may attempt only its frozen partition');
    if(o.status==='ok') {
      check(o.prediction && o.issue===null && o.attempts>0 && o.renderedRequestDigest && o.rawOutputDigest,'OBSERVATION','Successful observations require provenance');
      check(o.prediction.kind===configuration.scoreKind && t.labels.includes(o.prediction.assertedLabel),'PREDICTION','Prediction kind or label differs');
      if(o.prediction.distribution) distribution(o.prediction.distribution,t.labels);
    } else check(o.prediction===null && o.issue!==null,'OBSERVATION','Failures cannot carry predictions');
    check(o.status!=='unattempted' || (o.attempts===0 && o.costMicroUsd===null),'OBSERVATION','Unattempted is not a free successful attempt');
  }
  return {run,suite,subject,configuration};
}
export function validateArtifact(value) {
  const a=validateRecord('artifact',value); unique(a.labels); unique(a.fitCaseIds); unique(a.fitGroupIds); unique(a.strata); unique(a.upstreamArtifactDigests);
  check(a.labels.includes(a.positiveLabel),'TARGET','Unknown positive label');
  check(instant(a.validUntil)>instant(a.validFrom),'TIME','Empty artifact validity');
  unique(a.mappings,m=>m.label);
  const expected=a.method==='identity-v1'?[]:a.method==='binary-isotonic-pav-v1'?[a.positiveLabel]:a.labels;
  check(a.mappings.length===expected.length && a.mappings.every(m=>expected.includes(m.label)) && (a.method!=='binary-isotonic-pav-v1'||a.labels.length===2),'METHOD','Wrong mapping count or labels');
  for(const m of a.mappings) {
    check(m.minimumPpm<=m.maximumPpm && m.knots[0].inputPpm===m.minimumPpm,'MAPPING','Invalid support');
    for(let i=0;i<m.knots.length;i++) check(m.knots[i].inputPpm<=m.maximumPpm && (i===0 || (m.knots[i].inputPpm>m.knots[i-1].inputPpm && m.knots[i].outputPpm>=m.knots[i-1].outputPpm)),'MAPPING','Knots must increase; outputs must be monotone');
  }
  return a;
}
// Reports refer to executable content, never to their own digest or to the final release.
export function comparisonSubjectResources(kitValue) {
  const kit=snapshot(kitValue);
  for(const criterion of kit.criteria??[]) delete criterion.acceptedCalibrationDigests;
  return kit;
}
