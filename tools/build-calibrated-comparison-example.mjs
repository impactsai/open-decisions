import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {buildFictionalBundle} from './build-evals-example.mjs';
import * as e from '../evals/index.mjs';
export async function buildFictionalComparison(){
 const comparison=JSON.parse(readFileSync(new URL('../examples/comparison/fictional-buy.json',import.meta.url),'utf8'));
 const b=await buildFictionalBundle({kit:{id:'urn:example:connectivity-dtb',version:'0.1.0-experimental.1'},intendedUse:'Fictional connectivity DTB comparison integration; no partner validation.'});
 const config=b.subject.configurations[0],evaluator={kind:'model',id:'fixture-model',methodVersion:'v1',provider:config.runtime,model:'fictional',modelVersion:config.modelRevision,promptDigest:config.promptTemplateDigest,mappingDigest:config.outputMappingDigest};
 comparison.kit.id='fictional-connectivity';comparison.kit.title='Fictional connectivity choices: price and suitability';
 comparison.kit.criteria.find(c=>c.id==='fit').evaluator=evaluator;
 for(const a of comparison.assessments.assessments.filter(a=>a.criterionId==='fit')){a.evaluator=evaluator;a.rawOutputDigest=await e.digest({fictional:a.optionId});a.outcomes=[{id:'high',value:'high',massPpm:800000},{id:'low',value:'low',massPpm:200000}];}
 const executableDigest=await e.digest(e.comparisonSubjectResources(comparison.kit));
 b.subject.resources=[{id:'comparison-executable.json',digest:executableDigest},{id:'preferences.json',digest:await e.digest(comparison.request.weights)}];
 b.subject.decisionMethod={id:'sole-first-support-v1',digest:await e.digest({method:'sole-first-support-v1',fictional:true})};
 Object.assign(b.subject.targets[0],{id:'fit',labels:['low','high'],positiveLabel:'high',adverseLabels:['low']});
 const subjectDigest=await e.digest(b.subject);b.suite.evaluationSubjectDigest=subjectDigest;
 for(const c of b.suite.cases){const l=c.labels[0];l.targetId='fit';l.value=l.value==='true'?'high':'low';}
 for(const run of b.runs){run.evaluationSubjectDigest=subjectDigest;run.suiteDigest=await e.digest(b.suite);for(const o of run.observations.filter(o=>o.targetId==='fact')){o.targetId='fit';if(o.prediction){o.prediction.assertedLabel=o.prediction.assertedLabel==='true'?'high':'low';for(const p of o.prediction.distribution)p.label=p.label==='true'?'high':'low';}}}
 const common={subject:b.subject,suite:b.suite,population:'fictional-pilot',strata:['fictional'],validUntil:b.modelCard.validUntil};
 const fact=await e.fitCalibration({...common,run:b.runs[0],targetId:'fit',validFrom:b.runs[0].completedAt});
 const determination=await e.fitCalibration({...common,run:b.runs[1],targetId:'determination',validFrom:b.runs[1].completedAt,upstreamArtifactDigests:[await e.digest(fact)]});b.artifacts=[fact,determination];
 b.reports=await Promise.all(b.artifacts.map(artifact=>e.createReport({subject:b.subject,suite:b.suite,run:b.runs[2],artifact,targetId:artifact.targetId,population:common.population})));
 b.modelCard=await e.createModelCard({subject:b.subject,suite:b.suite,runs:b.runs,reports:b.reports,artifacts:b.artifacts,intendedUse:b.modelCard.intendedUse,limitations:['Fictional model responses and labels; not a partner-approved connectivity methodology.'],createdAt:b.modelCard.createdAt,validUntil:b.modelCard.validUntil});
 comparison.kit.criteria.find(c=>c.id==='fit').acceptedCalibrationDigests=await Promise.all(b.reports.filter(r=>r.targetId==='fit').map(e.digest));
 comparison.context.kitDigest=await e.digest(comparison.kit);comparison.assessments.contextDigest=await e.digest(comparison.context);comparison.request.contextDigest=comparison.assessments.contextDigest;comparison.request.assessmentDigest=await e.digest(comparison.assessments);
 b.release={...b.release,evaluationSubjectDigest:subjectDigest,modelCardDigest:await e.digest(b.modelCard),resources:[...b.subject.resources,{id:'comparison-kit.json',digest:await e.digest(comparison.kit)},{id:'model-card.json',digest:await e.digest(b.modelCard)}]};
 await e.validateBundle(b);
 return {profileVersion:e.CALIBRATED_COMPARISON_VERSION,evidence:b,comparison,executableDigest,configurationDigest:await e.digest(config),determinationTargetId:'determination',population:common.population,stratum:'fictional',at:'2026-09-22T00:00:00Z',mode:'experimental'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const b=await buildFictionalComparison();
 writeFileSync(new URL('../examples/decision-evals/calibrated-comparison.json',import.meta.url),JSON.stringify(b,null,2)+'\n');
 writeFileSync(new URL('../examples/decision-evals/expected-comparison.json',import.meta.url),JSON.stringify(await e.compareCalibrated(b),null,2)+'\n');
}
