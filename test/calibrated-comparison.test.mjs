import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildFictionalBundle} from '../tools/build-evals-example.mjs';
import * as e from '../evals/index.mjs';
async function fixture(){
 const comparison=JSON.parse(readFileSync(new URL('../examples/comparison/fictional-buy.json',import.meta.url),'utf8'));
 const executableDigest=await e.digest(e.comparisonSubjectResources(comparison.kit));
 const evidence=await buildFictionalBundle({resources:[{id:'comparison-executable.json',digest:executableDigest},{id:'preferences.json',digest:await e.digest(comparison.request.weights)}]});
 evidence.release.resources.push({id:'comparison-kit.json',digest:await e.digest(comparison.kit)});
 return {profileVersion:e.CALIBRATED_COMPARISON_VERSION,evidence,comparison,executableDigest,configurationDigest:evidence.runs[0].configurationDigest,determinationTargetId:'determination',population:'fictional-pilot',stratum:'fictional',at:'2026-09-22T00:00:00Z',mode:'experimental'};
}
test('comparison rank support stays distinct from unestimated reliability',async()=>{
 const input=await fixture(),out=await e.compareCalibrated(input);
 assert.equal(out.baseResult.selectedOptionId,'A');assert.equal(out.gate.status,'review-required');
 assert.equal(out.reliability.status,'not_estimated');
 assert(out.baseResult.rankings[0].soleFirstSupport);
});
test('comparison wrapper rejects unknown versions, keys, executable and preference drift',async()=>{
 for(const change of [x=>x.profileVersion='future',x=>x.extra=true,x=>x.comparison.kit.title='changed',x=>x.comparison.request.weights[0].massPpm=999999]){
  const input=await fixture();change(input);await assert.rejects(e.compareCalibrated(input));
 }
});
test('only calibration allowlists are excluded from comparison subject projection',async()=>{
 const input=await fixture(),kit=input.comparison.kit;
 kit.criteria[0].acceptedCalibrationDigests=['a'.repeat(64)];
 assert.equal(await e.digest(e.comparisonSubjectResources(kit)),input.executableDigest);
 kit.recommendation.minLeadPpm++;
 assert.notEqual(await e.digest(e.comparisonSubjectResources(kit)),input.executableDigest);
});
test('model distributions are calibrated before utility, while experimental recommendations stay held',async()=>{
 const input=JSON.parse(readFileSync(new URL('../examples/decision-evals/calibrated-comparison.json',import.meta.url),'utf8'));
 const expected=JSON.parse(readFileSync(new URL('../examples/decision-evals/expected-comparison.json',import.meta.url),'utf8'));
 const result=await e.compareCalibrated(input);assert.deepEqual(result,expected);
 assert.equal(result.applications.length,3);assert(result.applications.every(x=>x.application.status==='estimated'));
 assert.equal(result.applications[0].application.distribution.find(p=>p.label==='high').ppm,1000000);
 assert.equal(result.gate.status,'review-required');assert.equal(result.baseResult.outcome,'review-required');
 input.comparison.assessments.assessments.find(a=>a.evaluator.kind==='model').calibration={status:'validated',reportDigest:input.comparison.kit.criteria.find(c=>c.id==='fit').acceptedCalibrationDigests[0]};
 input.comparison.request.assessmentDigest=await e.digest(input.comparison.assessments);
 await assert.rejects(e.compareCalibrated(input),/raw unvalidated/);
});
