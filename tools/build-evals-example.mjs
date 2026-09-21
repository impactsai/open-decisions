import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { SPEC_VERSION as specVersion, digest, fitCalibration, createReport, createModelCard, validateBundle } from '../evals/index.mjs';
export async function buildFictionalBundle({kit={id:'urn:example:dtp',version:'1.0.0-experimental.1'},resources,intendedUse='Illustrate protocol conformance without making real decisions.'}={}) {
 const hash=await digest({fictional:true});
 const configuration={id:'fictional-model',evaluatorKind:'model',runtime:'fixture-only',modelRevision:'fictional-1',revisionResolved:true,quantization:'none',inferenceSettingsDigest:hash,promptTemplateDigest:hash,rendererDigest:hash,orderingDigest:hash,batchingDigest:hash,evidenceTransformDigest:hash,outputMappingDigest:hash,scoreKind:'native-probabilities'};
 const subject={specVersion,kind:'evaluation-subject',kit,resources:resources??[{id:'rubric.json',digest:hash}],configurations:[configuration],targets:[{id:'fact',stage:'fact',labels:['false','true'],positiveLabel:'true',adverseLabels:['false']},{id:'determination',stage:'determination',labels:['incorrect','correct'],positiveLabel:'correct',adverseLabels:['incorrect']}],decisionMethod:{id:'minimum-asserted-confidence-v1',digest:hash},acceptancePolicyDigest:null};
 const cases=[];
 for(const split of ['development','fact-fit','determination-fit','acceptance'])for(let i=0;i<4;i++)for(const variant of ['baseline','reordered']){
  const groupId=`${split}-${i}`;
  cases.push({id:`${groupId}-${variant}`,groupId,split,population:'fictional-pilot',stratum:'fictional',variant,relation:variant==='baseline'?'baseline':'meaning-preserving',inputDigest:await digest({groupId,variant}),evidenceDigests:[await digest({groupId})],labels:subject.targets.map(t=>({targetId:t.id,value:t.labels[i%2],source:'synthetic',sourceDigest:hash,adjudicationMethod:'fictional hand-written fixture',disagreement:false}))});
 }
 const suite={specVersion,kind:'benchmark-suite',id:'urn:example:four-partitions',evaluationSubjectDigest:await digest(subject),frozenAt:'2026-09-21T00:00:00Z',cases,requiredVariants:['baseline','reordered'],limitations:['Fictional fixtures only; no population validation.']};
 const configurationDigest=await digest(configuration),runs=[];
 for(const [i,phase] of ['fact-fit','determination-fit','acceptance'].entries()){
  const observations=cases.flatMap(c=>c.labels.map(l=>{
   const attempted=c.split===phase;
   const prediction=l.targetId==='fact'?{kind:'native-probabilities',distribution:subject.targets[0].labels.map(label=>({label,ppm:label===l.value?800000:200000})),assertedLabel:l.value}:{kind:'native-probabilities',distribution:[{label:'incorrect',ppm:0},{label:'correct',ppm:1000000}],assertedLabel:'correct'};
   return {caseId:c.id,targetId:l.targetId,configurationDigest,status:attempted?'ok':'unattempted',prediction:attempted?prediction:null,issue:attempted?null:'partition-not-selected',renderedRequestDigest:attempted?c.inputDigest:null,rawOutputDigest:attempted?hash:null,attempts:attempted?1:0,elapsedMs:0,costMicroUsd:null,costBasis:'offline-fictional'};
  }));
  runs.push({specVersion,kind:'benchmark-run',phase,id:`urn:example:run:${phase}`,evaluationSubjectDigest:await digest(subject),suiteDigest:await digest(suite),configurationDigest,runner:{id:'open-decisions/evals',digest:hash},startedAt:`2026-09-21T0${i*2+1}:00:00Z`,completedAt:`2026-09-21T0${i*2+2}:00:00Z`,mode:'offline',observations});
 }
 const options={subject,suite,population:'fictional-pilot',strata:['fictional'],validUntil:'2026-12-21T00:00:00Z'};
 const fact=await fitCalibration({...options,run:runs[0],targetId:'fact',validFrom:runs[0].completedAt});
 const determination=await fitCalibration({...options,run:runs[1],targetId:'determination',validFrom:runs[1].completedAt,upstreamArtifactDigests:[await digest(fact)]});
 const artifacts=[fact,determination],reports=await Promise.all(artifacts.map(artifact=>createReport({subject,suite,run:runs[2],artifact,targetId:artifact.targetId,population:'fictional-pilot'})));
 const card=await createModelCard({subject,suite,runs,reports,artifacts,intendedUse,limitations:['Synthetic examples are not calibration evidence for real populations.'],createdAt:'2026-09-21T07:00:00Z',validUntil:'2026-12-21T00:00:00Z'});
 const release={specVersion,kind:'kit-release',kit:subject.kit,evaluationSubjectDigest:await digest(subject),modelCardDigest:await digest(card),resources:[...subject.resources,{id:'model-card.json',digest:await digest(card)}],createdAt:card.createdAt};
 return validateBundle({specVersion,kind:'evals-bundle',subject,suite,runs,artifacts,reports,policy:null,modelCard:card,release});
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const bundle=await buildFictionalBundle();
 writeFileSync(new URL('../examples/decision-evals/fictional-kit.json',import.meta.url),JSON.stringify(bundle,null,2)+'\n');
 writeFileSync(new URL('../examples/decision-evals/model-card.json',import.meta.url),JSON.stringify(bundle.modelCard,null,2)+'\n');
}
