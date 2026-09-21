import { SPEC_VERSION, PPM, check, digest, instant, snapshot, unique, validateRecord } from './contracts.mjs';
import { applyCalibration, determinationPredictor } from './calibration.mjs';
import { preflightRelease, validateBundle } from './reports.mjs';
export async function evaluateConfidence(input) {
  const args=snapshot(input),b=await validateBundle(args.bundle);
  const {configurationDigest,population,stratum,at,mode,requiredTargetIds,determinationTargetId}=args;
  unique(requiredTargetIds);unique(args.predictions,p=>p.targetId);
  check(args.predictions.length===requiredTargetIds.length&&args.predictions.every(p=>requiredTargetIds.includes(p.targetId)),'COVERAGE','Predictions must cover the exact governed dependency set');
  const config=b.modelCard.configurations.find(c=>c.configurationDigest===configurationDigest);check(config,'CONFIGURATION','Unknown runtime configuration');
  const scope={evaluationSubjectDigest:await digest(b.subject),configurationDigest,population,stratum,at};
  const reasons=[],applications=[];
  const artifactFor=targetId=>{
    const found=b.artifacts.filter(a=>a.targetId===targetId&&a.configurationDigest===configurationDigest&&a.population===population&&a.strata.includes(stratum));
    check(found.length<=1,'AMBIGUOUS','More than one mapping applies');return found[0];
  };
  for(const p of args.predictions){
    const target=b.subject.targets.find(t=>t.id===p.targetId);check(target?.stage==='fact','TARGET','Expected fact target');
    const artifact=artifactFor(p.targetId);
    if(p.status==='ok'){const configs=await Promise.all(b.subject.configurations.map(digest));check(p.prediction.kind===b.subject.configurations[configs.indexOf(configurationDigest)].scoreKind,'CONFIGURATION','Prediction kind differs from tested configuration');}
    if(p.status!=='ok'||!artifact){applications.push({specVersion:SPEC_VERSION,kind:'calibration-application',...Object.fromEntries(['evaluationSubjectDigest','configurationDigest'].map(k=>[k,scope[k]])),targetId:p.targetId,artifactDigest:null,inputDigest:await digest(p),status:'not_estimated',distribution:null,assertedValueConfidencePpm:null,reasons:[p.status==='unavailable'?'missing-information':p.status!=='ok'?'failed-dependency':'missing-artifact']});continue;}
    applications.push(await applyCalibration({...scope,artifact,prediction:p.prediction,targetId:p.targetId}));
  }
  const predictor=args.comparisonSupportPpm===undefined?determinationPredictor(applications,requiredTargetIds):{status:'estimated',predictorPpm:args.comparisonSupportPpm};
  if(args.comparisonSupportPpm!==undefined)check(Number.isInteger(args.comparisonSupportPpm)&&args.comparisonSupportPpm>=0&&args.comparisonSupportPpm<=PPM,'VALUE','Invalid comparison support');
  const target=b.subject.targets.find(t=>t.id===determinationTargetId);check(target?.stage==='determination'&&target.labels.length===2,'TARGET','A binary determination target is required');
  let determinationReliability={status:'not_estimated',valuePpm:null,reasons:['failed-dependency'],application:null};
  const artifact=artifactFor(determinationTargetId);
  if(artifact&&predictor.status==='estimated'&&applications.every(a=>a.status==='estimated')){
    const prediction={kind:'native-probabilities',distribution:target.labels.map(label=>({label,ppm:label===target.positiveLabel?predictor.predictorPpm:PPM-predictor.predictorPpm})),assertedLabel:target.positiveLabel};
    const application=await applyCalibration({...scope,artifact,prediction,targetId:target.id,upstreamArtifactDigests:[...new Set(applications.map(a=>a.artifactDigest))]});
    determinationReliability={status:application.status,valuePpm:application.assertedValueConfidencePpm,reasons:application.reasons,application};
  }
  const preflight=await preflightRelease(b,{at,mode,acceptedReleaseDigest:args.acceptedReleaseDigest??null,suspended:args.suspended??false});
  reasons.push(...preflight.reasons);
  if(mode!=='live')reasons.push('experimental-only');
  if(applications.some(a=>a.status!=='estimated'))reasons.push('fact-confidence-unavailable');
  if(determinationReliability.status!=='estimated')reasons.push('determination-reliability-unavailable');
  if(b.policy){
    if(applications.some(a=>a.assertedValueConfidencePpm<b.policy.minimumFactConfidencePpm))reasons.push('low-fact-confidence');
    if(determinationReliability.valuePpm!==null&&determinationReliability.valuePpm<b.policy.minimumDeterminationReliabilityPpm)reasons.push('low-determination-reliability');
  }else reasons.push('missing-domain-policy');
  const missing=applications.some(a=>a.reasons.includes('missing-information'));
  return {specVersion:SPEC_VERSION,kind:'confidence-result',releaseDigest:preflight.releaseDigest,configurationDigest,applications,determinationReliability,gate:{status:reasons.length?(missing?'needs-information':'review-required'):'eligible',reasons:[...new Set(reasons)]}};
}
