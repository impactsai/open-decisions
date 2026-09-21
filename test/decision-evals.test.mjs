import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as e from '../evals/index.mjs';
const fixture=()=>JSON.parse(readFileSync(new URL('../examples/decision-evals/fictional-kit.json',import.meta.url),'utf8'));
const at='2026-09-22T00:00:00Z';
test('fictional bundle replays and remains experimental even with an accepted digest',async()=>{
 const b=fixture();await e.validateBundle(b);
 assert.equal((await e.preflightRelease(b,{at})).allowed,true);
 const r=await e.preflightRelease(b,{at,mode:'live',acceptedReleaseDigest:await e.digest(b.release)});
 assert.equal(r.allowed,false);assert(r.reasons.includes('validation-not-passed'));
 assert(b.reports.every(r=>r.summary.independentGroups===0));
});
test('PAV pools violations with exact rational averages and never extrapolates',()=>{
 assert.deepEqual(e.fitPav([[100,1],[200,0],[300,1]]),{minimumPpm:100,maximumPpm:300,knots:[{inputPpm:100,outputPpm:500000},{inputPpm:300,outputPpm:1000000}]});
 const a=fixture().artifacts[0],p={kind:'native-probabilities',distribution:[{label:'true',ppm:900000},{label:'false',ppm:100000}],assertedLabel:'true'};
 assert.equal(e.mapDistribution(a,p).reason,'unsupported-score-range');
 assert.deepEqual(e.normalizeMass([{label:'c',ppm:1},{label:'b',ppm:1},{label:'a',ppm:1}]),[{label:'a',ppm:333334},{label:'b',ppm:333333},{label:'c',ppm:333333}]);
 assert.equal(e.normalizeMass([{label:'a',ppm:0}]),null);
});
test('probability true differs from confidence in an asserted false value',async()=>{
 const b=fixture(),a=b.artifacts[0],p={kind:'native-probabilities',distribution:[{label:'true',ppm:200000},{label:'false',ppm:800000}],assertedLabel:'false'};
 const application=await e.applyCalibration({artifact:a,prediction:p,evaluationSubjectDigest:a.evaluationSubjectDigest,configurationDigest:a.configurationDigest,targetId:a.targetId,population:a.population,stratum:a.strata[0],at});
 assert.equal(application.distribution.find(p=>p.label==='true').ppm,0);assert.equal(application.assertedValueConfidencePpm,1000000);
 const expired=await e.applyCalibration({artifact:a,prediction:p,evaluationSubjectDigest:a.evaluationSubjectDigest,configurationDigest:a.configurationDigest,targetId:a.targetId,population:a.population,stratum:a.strata[0],at:a.validUntil});assert.equal(expired.status,'not_estimated');
});
test('invalid distributions and raw logits cannot silently become probabilities',()=>{
 const a=fixture().artifacts[0];
 assert.throws(()=>e.mapDistribution(a,{kind:'native-probabilities',assertedLabel:'true',distribution:[{label:'true',ppm:999999},{label:'false',ppm:0}]}),/exact labels/);
 assert.equal(e.mapDistribution(a,{kind:'logits',values:[{label:'true',decimal:'2.5'}],assertedLabel:'true'}).status,'not_estimated');
});
test('unknown schemas, methods, keys and duplicate wire keys fail closed',async()=>{
 for(const mutate of [b=>b.specVersion='future',b=>b.extra=true,b=>b.artifacts[0].method='magic']){const b=fixture();mutate(b);await assert.rejects(e.validateBundle(b));}
 assert.throws(()=>e.parseEvalsJSON('{"a":1,"a":2}'),/Duplicate/);
 assert.throws(()=>e.validateRecord('__proto__',{}),/Unknown/);
});
test('split leakage is rejected even across different case group IDs',async()=>{
 const b=fixture();b.suite.cases.find(c=>c.split==='acceptance').evidenceDigests=b.suite.cases.find(c=>c.split==='fact-fit').evidenceDigests;
 await assert.rejects(e.validateSuite(b.suite,b.subject),/crosses splits/);
});
test('missing observations and contradictory failure payloads are rejected',async()=>{
 let b=fixture();b.runs[0].observations.pop();await assert.rejects(e.validateRun(b.runs[0],b.suite,b.subject),/Every case/);
 b=fixture();b.runs[0].observations.find(o=>o.status==='ok').status='error';await assert.rejects(e.validateRun(b.runs[0],b.suite,b.subject),/Failures cannot/);
});
test('report and fitted-artifact tampering fails replay, even if rehashed',async()=>{
 let b=fixture();b.reports[0].calibrated.accuracy.valuePpm=0;await assert.rejects(e.validateBundle(b),/does not reproduce/);
 b=fixture();b.artifacts[0].mappings[0].knots[0].outputPpm=10;await assert.rejects(e.validateBundle(b),/does not reproduce/);
});
test('zero observed errors have a nonzero bound and no negative labels is unmeasurable',()=>{
 const m=e.rateMetric(0,100);assert(m.upperPpm>0);
 const b=fixture(),t=b.subject.targets[0],r={label:'true',prediction:{assertedLabel:'true',distribution:[{label:'true',ppm:1000000},{label:'false',ppm:0}]}};
 assert.equal(e.scoreRows([r],t).metrics.falseApproval.valuePpm,null);
 assert.equal(e.rateMetric(0,0).valuePpm,null);
});
test('failed provider attempts remain in coverage and cost denominators',async()=>{
 const b=fixture(),run=b.runs[2];for(const o of run.observations.filter(o=>o.caseId.startsWith('acceptance-0'))){o.status='error';o.prediction=null;o.issue='provider-timeout';o.costMicroUsd=100;}
 run.suiteDigest=await e.digest(b.suite);
 const report=await e.createReport({subject:b.subject,suite:b.suite,run,artifact:b.artifacts[0],targetId:'fact',population:'fictional-pilot'});
 assert.equal(report.summary.error,2);assert.equal(report.raw.coverage.valuePpm,750000);assert.equal(report.costMicroUsd,null);
});
test('facts and determination reliability fail closed independently',async()=>{
 const b=fixture(),o=b.runs[0].observations[0];
 const common={bundle:b,configurationDigest:o.configurationDigest,population:'fictional-pilot',stratum:'fictional',at,mode:'experimental',requiredTargetIds:['fact'],determinationTargetId:'determination'};
 const r=await e.evaluateConfidence({...common,predictions:[{targetId:'fact',status:'unavailable'}]});
 assert.equal(r.gate.status,'needs-information');assert.equal(r.determinationReliability.status,'not_estimated');
 await assert.rejects(e.evaluateConfidence({...common,predictions:[]}),/exact governed dependency/);
 assert.equal(e.determinationPredictor([],[]).status,'not_estimated');
});
test('resource replacement cannot inherit a valid model card',async()=>{
 const b=fixture();b.release.resources[0].digest='0'.repeat(64);await assert.rejects(e.validateBundle(b),e=>e.code==='BINDING');
});
test('no network is needed for conformance and fitting',async()=>{
 const old=globalThis.fetch;globalThis.fetch=()=>{throw new Error('Network forbidden');};
 try{await e.validateBundle(fixture());}finally{globalThis.fetch=old;}
});

test('unknown asserted labels and duplicate application targets fail closed', async () => {
  const b=fixture();
  assert.throws(()=>e.mapDistribution(b.artifacts[0],{kind:'native-probabilities',assertedLabel:'absent',distribution:[{label:'true',ppm:800000},{label:'false',ppm:200000}]}));
  assert.throws(()=>e.normalizeMass([{label:'a',ppm:-1}]));
});

test('fitting and acceptance phases cannot be collapsed or reordered', async () => {
 const b=fixture();
 await assert.rejects(e.fitCalibration({subject:b.subject,suite:b.suite,run:b.runs[2],targetId:'fact',population:'fictional-pilot',strata:['fictional'],validFrom:b.runs[2].completedAt,validUntil:b.modelCard.validUntil}),/separate fitting run/);
 const r=structuredClone(b.runs[0]);r.phase='acceptance';await assert.rejects(e.validateRun(r,b.suite,b.subject),/frozen partition/);
 await assert.rejects(e.fitCalibration({subject:b.subject,suite:b.suite,run:b.runs[0],targetId:'fact',population:'fictional-pilot',strata:['fictional'],validFrom:b.runs[0].startedAt,validUntil:b.modelCard.validUntil}),/before its fit run/);
});
test('the frozen determination mapping produces a separately named reliability estimate',async()=>{
 const b=fixture(),o=b.runs[2].observations.find(o=>o.status==='ok'&&o.targetId==='fact');
 const result=await e.evaluateConfidence({bundle:b,configurationDigest:o.configurationDigest,population:'fictional-pilot',stratum:'fictional',at,mode:'experimental',requiredTargetIds:['fact'],determinationTargetId:'determination',predictions:[{targetId:'fact',status:'ok',prediction:o.prediction}]});
 assert.equal(result.applications[0].assertedValueConfidencePpm,1000000);
 assert.equal(result.determinationReliability.valuePpm,500000);
 assert.equal(result.gate.status,'review-required');
});
test('categorical fitting is a separate method and missing classes prevent fitting',async()=>{
 const b=fixture(),t=b.subject.targets[0];Object.assign(t,{labels:['a','b','c'],positiveLabel:'a',adverseLabels:['c']});
 b.suite.evaluationSubjectDigest=await e.digest(b.subject);
 for(const c of b.suite.cases)c.labels[0].value=t.labels[Number(c.groupId.split('-').at(-1))%3];
 const run=b.runs[0];run.evaluationSubjectDigest=b.suite.evaluationSubjectDigest;run.suiteDigest=await e.digest(b.suite);
 for(const o of run.observations.filter(o=>o.status==='ok'&&o.targetId==='fact')){
  const label=b.suite.cases.find(c=>c.id===o.caseId).labels[0].value;
  o.prediction={kind:'native-probabilities',assertedLabel:label,distribution:t.labels.map(id=>({label:id,ppm:id===label?800000:100000}))};
 }
 const args={subject:b.subject,suite:b.suite,run,targetId:'fact',method:'categorical-isotonic-normalized-v1',population:'fictional-pilot',strata:['fictional'],validFrom:run.completedAt,validUntil:b.modelCard.validUntil};
 const artifact=await e.fitCalibration(args);assert.equal(artifact.mappings.length,3);
 const p=run.observations.find(o=>o.status==='ok'&&o.targetId==='fact').prediction;
 assert.equal(e.mapDistribution(artifact,p).distribution.find(x=>x.label===p.assertedLabel).ppm,1000000);
 for(const c of b.suite.cases.filter(c=>c.split==='fact-fit'))if(c.labels[0].value==='c')c.labels[0].value='a';
 run.suiteDigest=await e.digest(b.suite);await assert.rejects(e.fitCalibration(args),/Every target label/);
});

test('synthetic fitting labels cannot satisfy live validation even when mappings replay',async()=>{
 const b=fixture();await e.validateBundle(b);
 assert(b.reports.every(r=>r.checks.find(c=>c.id==='independent-fit-labels').status==='insufficient'));
});
