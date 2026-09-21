import { compare, manifestOf, validateAssessments, digest as comparisonDigest } from '../comparison/index.mjs';
import { PPM, check, comparisonSubjectResources, digest, snapshot, same, validateRecord } from './contracts.mjs';
import { applyCalibration } from './calibration.mjs';
import { validateBundle, preflightRelease } from './reports.mjs';
export const CALIBRATED_COMPARISON_VERSION='calibrated-comparison/0.1.0-draft.1';
export async function compareCalibrated(input) {
  const args=snapshot(validateRecord('calibratedComparison',input));check(args.profileVersion===CALIBRATED_COMPARISON_VERSION,'VERSION','Unknown calibrated comparison version');
  const evidence=await validateBundle(args.evidence),b=args.comparison,manifest=await manifestOf(b.kit);
  check(evidence.subject.resources.some(r=>r.id==='comparison-executable.json'&&r.digest===args.executableDigest),'BINDING','Comparison executable is not in the evaluation subject');
  check(await digest(comparisonSubjectResources(b.kit))===args.executableDigest,'BINDING','Comparison kit differs from benchmark');
  const finalKitDigest=await digest(b.kit);
  check(evidence.release.resources.some(r=>r.id==='comparison-kit.json'&&r.digest===finalKitDigest),'BINDING','Final comparison kit is not bound by release');
  const weightsDigest=await digest(b.request.weights);
  check(evidence.subject.resources.some(r=>r.id==='preferences.json'&&r.digest===weightsDigest),'BINDING','Preferences differ from benchmark');
  const raw=await validateAssessments(b.assessments,b.context,manifest);
  check(b.request.contextDigest===await comparisonDigest(b.context)&&b.request.assessmentDigest===await comparisonDigest(raw),'BINDING','Raw comparison request does not bind the supplied assessment set');
  const applications=[],reasons=[],calibrated=snapshot(raw);
  for(const a of calibrated.assessments){
    if(a.evaluator.kind!=='model')continue;
    if(a.status!=='ok'){reasons.push(a.status==='unavailable'?'missing-information':'failed-dependency');continue;}
    check(a.calibration.status==='unvalidated','DOUBLE_CALIBRATION','Provide raw unvalidated model assessments');
    const matches=evidence.artifacts.filter(x=>x.configurationDigest===args.configurationDigest&&x.targetId===a.criterionId&&x.stage==='fact'&&x.population===args.population&&x.strata.includes(args.stratum));
    if(matches.length!==1){reasons.push('mapping-missing-or-ambiguous');continue;}
    const artifact=matches[0],configDigests=await Promise.all(evidence.subject.configurations.map(digest)),config=evidence.subject.configurations[configDigests.indexOf(artifact.configurationDigest)];
    check(config&&config.modelRevision===a.evaluator.modelVersion&&config.runtime===a.evaluator.provider&&config.promptTemplateDigest===a.evaluator.promptDigest&&config.outputMappingDigest===a.evaluator.mappingDigest,'CONFIGURATION','Comparison evaluator differs from benchmark');
    const target=evidence.subject.targets.find(t=>t.id===a.criterionId);
    check(target&&a.outcomes.every(o=>target.labels.includes(o.id)),'TARGET','Outcome IDs must be target labels');
    const distribution=target.labels.map(label=>({label,ppm:a.outcomes.find(o=>o.id===label)?.massPpm??0}));
    const assertedLabel=[...distribution].sort((a,b)=>b.ppm-a.ppm||(a.label<b.label?-1:1))[0].label;
    check(['native-probabilities','verbalized-probabilities'].includes(config.scoreKind),'CONFIGURATION','Comparison masses require a declared probability kind');
    const application=await applyCalibration({artifact,prediction:{kind:config.scoreKind,distribution,assertedLabel},evaluationSubjectDigest:await digest(evidence.subject),configurationDigest:artifact.configurationDigest,targetId:artifact.targetId,population:args.population,stratum:args.stratum,at:args.at});
    applications.push({optionId:a.optionId,criterionId:a.criterionId,application});
    if(application.status!=='estimated'){reasons.push(...application.reasons);continue;}
    // No unseen outcome value may be invented when calibration gives it positive mass.
    if(application.distribution.some(p=>p.ppm>0&&!a.outcomes.some(o=>o.id===p.label))){reasons.push('missing-outcome-value');continue;}
    a.outcomes=a.outcomes.map(o=>({...o,massPpm:application.distribution.find(p=>p.label===o.id).ppm})).filter(o=>o.massPpm>0);
    const report=evidence.reports.find(r=>r.targetId===artifact.targetId&&r.configurationDigest===artifact.configurationDigest&&r.artifactDigests.includes(application.artifactDigest));
    const reportDigest=report?await digest(report):null;
    if(report?.status==='passed'&&manifest.tasks.find(t=>t.criterionId===a.criterionId).acceptedCalibrationDigests?.includes(reportDigest))a.calibration={status:'validated',reportDigest};
  }
  if(b.request.dependence.kind==='joint'&&!same(raw,calibrated))reasons.push('joint-scenarios-require-recalibration');
  const preflight=await preflightRelease(evidence,{at:args.at,mode:args.mode,acceptedReleaseDigest:args.acceptedReleaseDigest??null,suspended:args.suspended??false});
  reasons.push(...preflight.reasons);if(args.mode!=='live')reasons.push('experimental-only');
  if(reasons.some(r=>['missing-information','failed-dependency','mapping-missing-or-ambiguous','missing-outcome-value','joint-scenarios-require-recalibration','unsupported-score-range'].includes(r)))return {profileVersion:CALIBRATED_COMPARISON_VERSION,baseResult:null,applications,reliability:null,gate:{status:reasons.includes('missing-information')?'needs-information':'review-required',reasons}};
  const request={...b.request,assessmentDigest:await comparisonDigest(calibrated)};
  const baseResult=await compare({...b,assessments:calibrated,request});
  let reliability=null;
  const candidate=baseResult.rankings?.find(r=>r.optionId===baseResult.selectedOptionId);
  const artifact=evidence.artifacts.find(a=>a.configurationDigest===args.configurationDigest&&a.targetId===args.determinationTargetId&&a.stage==='determination'&&a.population===args.population&&a.strata.includes(args.stratum));
  if(candidate&&artifact){
    const score=Number(BigInt(candidate.soleFirstSupport.numerator)*BigInt(PPM)/BigInt(candidate.soleFirstSupport.denominator));
    const prediction={kind:'native-probabilities',assertedLabel:artifact.positiveLabel,distribution:artifact.labels.map(label=>({label,ppm:label===artifact.positiveLabel?score:PPM-score}))};
    reliability=await applyCalibration({artifact,prediction,evaluationSubjectDigest:await digest(evidence.subject),configurationDigest:artifact.configurationDigest,targetId:artifact.targetId,population:args.population,stratum:args.stratum,at:args.at,upstreamArtifactDigests:[...new Set(applications.map(a=>a.application.artifactDigest).filter(Boolean))]});
  }
  if(!reliability||reliability.status!=='estimated')reasons.push('determination-reliability-unavailable');
  if(evidence.policy){
    if(applications.some(a=>a.application.assertedValueConfidencePpm===null||a.application.assertedValueConfidencePpm<evidence.policy.minimumFactConfidencePpm))reasons.push('low-fact-confidence');
    if(reliability?.assertedValueConfidencePpm<evidence.policy.minimumDeterminationReliabilityPpm)reasons.push('low-determination-reliability');
  }else reasons.push('missing-domain-policy');
  if(baseResult.outcome!=='recommended')reasons.push(baseResult.outcome);
  return {profileVersion:CALIBRATED_COMPARISON_VERSION,baseResult,applications,reliability,gate:{status:reasons.length?'review-required':'eligible',reasons:[...new Set(reasons)]}};
}
