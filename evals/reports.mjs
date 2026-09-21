import { SPEC_VERSION, check, digest, instant, same, snapshot, unique, validateArtifact, validateRecord, validateRun, validateSubject } from './contracts.mjs';
import { applyCalibration, mapDistribution } from './calibration.mjs';
import { scoreRows, robustness } from './metrics.mjs';
export async function createReport({subject,suite,run,artifact:artifactValue,policy:policyValue=null,targetId,population}) {
  ({subject,suite,run,artifactValue,policyValue}=snapshot({subject,suite,run,artifactValue:artifactValue??null,policyValue}));
  const v=await validateRun(run,suite,subject);({subject,suite,run}=v);
  check(run.phase==='acceptance','PHASE','Validation reports require a final acceptance run');
  const artifact=artifactValue?snapshot(validateArtifact(artifactValue)):null,policy=policyValue?snapshot(validateRecord('policy',policyValue)):null;
  const target=subject.targets.find(t=>t.id===targetId);check(target,'TARGET','Unknown report target');
  const cases=suite.cases.filter(c=>c.split==='acceptance'&&c.population===population&&c.labels.some(l=>l.targetId===targetId));
  const observations=cases.map(c=>({c,o:run.observations.find(o=>o.caseId===c.id&&o.targetId===targetId)}));
  const groups=new Set();for(const c of cases.filter(c=>c.relation==='baseline')){check(!groups.has(c.groupId),'SAMPLES','Multiple acceptance baselines in a group');groups.add(c.groupId);}
  let independent=true;const raw=[],calibrated=[];
  for(const {c,o} of observations){
    const l=c.labels.find(l=>l.targetId===targetId);
    if(!['independent-adjudication','independent-observation'].includes(l.source)||l.disagreement)independent=false;
    if(o.status!=='ok'||!o.prediction.distribution||l.value===null||l.disagreement)continue;
    raw.push({case:c,label:l.value,prediction:o.prediction});
    if(!artifact)continue;
    check(!artifact.fitGroupIds.includes(c.groupId),'LEAKAGE','Acceptance group appeared in fit');
    const applied=await applyCalibration({artifact,prediction:o.prediction,evaluationSubjectDigest:run.evaluationSubjectDigest,configurationDigest:run.configurationDigest,targetId,population,stratum:c.stratum,at:run.completedAt,upstreamArtifactDigests:artifact.upstreamArtifactDigests});
    if(applied.status==='estimated')calibrated.push({case:c,label:l.value,prediction:{...o.prediction,distribution:applied.distribution}});
  }
  const baseline=rows=>rows.filter(r=>r.case.relation==='baseline'),n=cases.filter(c=>c.relation==='baseline').length;
  const rawScore=scoreRows(baseline(raw),target,n),score=scoreRows(baseline(calibrated),target,n);
  const robust=robustness(calibrated,target);
  const strata=[...new Set(cases.map(c=>c.stratum))].sort().map(id=>({id,metrics:scoreRows(baseline(calibrated).filter(r=>r.case.stratum===id),target,cases.filter(c=>c.stratum===id&&c.relation==='baseline').length).metrics}));
  const checks=[],add=(id,status,reason)=>checks.push({id,status,reason});
  add('independent-labels',independent&&cases.length?'passed':'insufficient','Independent reference labels are required for live use');
  const fitLabels=artifact?artifact.fitCaseIds.map(id=>suite.cases.find(c=>c.id===id)?.labels.find(l=>l.targetId===targetId)):[];
  add('independent-fit-labels',fitLabels.length&&fitLabels.every(l=>l&&!l.disagreement&&['independent-adjudication','independent-observation'].includes(l.source))?'passed':'insufficient','Fitting labels also require independent reference evidence');
  add('configuration-revision',v.configuration.evaluatorKind!=='model'||v.configuration.revisionResolved?'passed':'insufficient','Model aliases must resolve to an immutable revision');
  add('required-perturbations',['baseline','prompt-structure','evidence-order','question-order','answer-label-order','paraphrase','repeat'].every(f=>suite.requiredVariants.includes(f))?'passed':'insufficient','Required prompt and ordering families must be declared and measured');
  add('artifact',artifact?'passed':'insufficient','An applicable executable mapping is required');
  const policyDigest=policy?await digest(policy):null;
  add('policy-binding',subject.acceptancePolicyDigest===policyDigest&&policy?'passed':'insufficient','Policy must be bound into the evaluation subject');
  add('domain-review',policy?.review?'passed':'insufficient','Domain partner review is required');
  if(policy){
    add('fit-sample-size',artifact&&artifact.fitGroupIds.length>=policy.minimumGroups?'passed':'insufficient',`Requires ${policy.minimumGroups} fitting groups`);
    check(policy.population===population,'POPULATION','Policy population differs');
    add('policy-freshness',instant(run.completedAt)<instant(policy.validUntil)?'passed':'failed','Policy must be current at acceptance evaluation');
    if(policy.review)check(instant(policy.review.reviewedAt)<=instant(suite.frozenAt),'POLICY','Acceptance policy review must precede suite freeze');
    const gate=(id,m,limit,upper=false,min=false)=>add(id,m.valuePpm===null?'insufficient':(min?m.valuePpm>=limit:(upper?m.upperPpm:m.valuePpm)<=limit)?'passed':'failed',`Required ${min?'minimum':'maximum'} ${limit} ppm`);
    const metricGates=(prefix,m,minimum)=>{add(prefix+'sample-size',m.accuracy.n>=minimum?'passed':'insufficient',`Requires ${minimum} independent labelled groups`);gate(prefix+'ece',m.ece,policy.maximumEcePpm);gate(prefix+'false-approval',m.falseApproval,policy.maximumFalseApprovalPpm,true);gate(prefix+'false-rejection',m.falseRejection,policy.maximumFalseRejectionPpm,true);gate(prefix+'coverage',m.coverage,policy.minimumCoveragePpm,false,true);};
    metricGates('',score.metrics,policy.minimumGroups);
    for(const id of policy.requiredStrata){const stratum=strata.find(s=>s.id===id);if(stratum)metricGates(`stratum:${id}:`,stratum.metrics,policy.minimumGroups);else add(`stratum:${id}`,'insufficient','Required stratum is missing');}
    for(const id of new Set([...suite.requiredVariants,...policy.requiredVariants])) {
      const rows=calibrated.filter(r=>r.case.variant===id),total=cases.filter(c=>c.variant===id).length;
      const groupIds=rows.map(r=>r.case.groupId);unique(groupIds);
      if(total)metricGates(`variant:${id}:`,scoreRows(rows,target,total).metrics,policy.minimumGroups);else add(`variant:${id}`,'insufficient','Required perturbation is missing');
    }
    gate('flip-rate',robust.flipRate,policy.maximumFlipRatePpm,true);
  }
  const summary={scheduled:observations.length,attempted:observations.filter(({o})=>o.attempts>0).length,ok:0,invalid:0,error:0,unavailable:0,unattempted:0,independentGroups:independent?groups.size:0};
  for(const {o}of observations)summary[o.status]++;
  const times=observations.filter(({o})=>o.attempts>0).map(({o})=>o.elapsedMs).sort((a,b)=>a-b),percentile=p=>times.length?times[Math.ceil(p*times.length)-1]:null;
  const costs=observations.filter(({o})=>o.attempts>0).map(({o})=>o.costMicroUsd);
  return validateRecord('report',{specVersion:SPEC_VERSION,kind:'validation-report',evaluationSubjectDigest:await digest(subject),configurationDigest:run.configurationDigest,suiteDigest:await digest(suite),runDigest:await digest(run),artifactDigests:artifact?[await digest(artifact)]:[],policyDigest,targetId,population,summary,raw:rawScore.metrics,calibrated:score.metrics,reliabilityBins:score.bins,strata,robustness:robust,confusion:score.confusion,latencyMs:{p50:percentile(.5),p95:percentile(.95)},costMicroUsd:costs.length&&costs.every(c=>c!==null)?costs.reduce((a,b)=>a+b,0):null,checks,status:checks.some(c=>c.status==='failed')?'failed':checks.some(c=>c.status==='insufficient')?'insufficient':'passed',limitations:['Intervals cover independent case groups, not individual truth.','Synthetic fixtures and self-reported provenance do not establish independent validation.','Classwise isotonic normalization requires end-to-end multiclass validation.']});
}
export async function createModelCard({subject:subjectValue,suite,runs,reports,artifacts,policy=null,intendedUse,limitations,createdAt,validUntil}) {
  ({subjectValue,suite,runs,reports,artifacts,policy}=snapshot({subjectValue,suite,runs,reports,artifacts,policy}));
  const subject=snapshot(validateSubject(subjectValue));
  const configs=[];
  for(const configuration of subject.configurations){
    const configurationDigest=await digest(configuration),r=reports.filter(r=>r.configurationDigest===configurationDigest);
    check(r.length>0,'COVERAGE','Every configuration requires reports');
    const complete=subject.targets.every(t=>r.some(x=>x.targetId===t.id));
    const status=r.some(r=>r.status==='failed')?'failed':complete&&r.every(r=>r.status==='passed')?'passed':'insufficient';
    configs.push({configurationDigest,status,reportDigests:await Promise.all(r.map(x=>digest(x))),artifactDigests:await Promise.all(artifacts.filter(a=>a.configurationDigest===configurationDigest).map(x=>digest(x))),permittedModes:status==='passed'?['experimental','live']:['experimental']});
  }
  check(instant(validUntil)>instant(createdAt),'TIME','Card must have positive validity');
  return validateRecord('card',{specVersion:SPEC_VERSION,kind:'model-card',kit:subject.kit,evaluationSubjectDigest:await digest(subject),intendedUse,limitations,configurations:configs,datasets:[await digest(suite)],benchmarkRuns:await Promise.all(runs.map(x=>digest(x))),validationReports:await Promise.all(reports.map(x=>digest(x))),calibrationArtifacts:await Promise.all(artifacts.map(x=>digest(x))),acceptancePolicy:policy?await digest(policy):null,createdAt,validUntil});
}
export async function validateBundle(value) {
  const b=snapshot(validateRecord('bundle',value)),subject=validateSubject(b.subject);
  const subjectDigest=await digest(subject),artifactDigests=await Promise.all(b.artifacts.map(a=>digest(validateArtifact(a))));
  unique(b.runs,r=>r.id);unique(artifactDigests);unique(b.reports,r=>JSON.stringify([r.configurationDigest,r.targetId,r.population]));
  for(const run of b.runs)await validateRun(run,b.suite,subject);
  for(const a of b.artifacts){
    const candidates=await Promise.all(b.runs.map(async r=>[await digest(r),r]));
    const r=candidates.find(([d])=>d===a.fitRunDigest)?.[1];check(r,'BINDING','Missing fit run');
    check(a.upstreamArtifactDigests.every(d=>artifactDigests.includes(d)&&d!==artifactDigests[b.artifacts.indexOf(a)]),'DEPENDENCY','Missing or self-referential upstream artifact');
    if(a.stage==='fact')check(a.upstreamArtifactDigests.length===0,'DEPENDENCY','Fact mappings cannot depend on determination mappings');
    else check(a.upstreamArtifactDigests.length>0&&a.upstreamArtifactDigests.every(d=>b.artifacts[artifactDigests.indexOf(d)].stage==='fact'),'DEPENDENCY','Determination mappings require fact mappings');
    for(const upstreamDigest of a.upstreamArtifactDigests){
      const upstream=b.artifacts[artifactDigests.indexOf(upstreamDigest)];
      check(instant(r.startedAt)>=instant(upstream.validFrom),'TIME','Determination fitting must follow frozen fact calibration');
    }
    const {fitCalibration}=await import('./calibration.mjs');
    const rebuilt=await fitCalibration({subject,suite:b.suite,run:r,targetId:a.targetId,method:a.method,population:a.population,strata:a.strata,validFrom:a.validFrom,validUntil:a.validUntil,upstreamArtifactDigests:a.upstreamArtifactDigests});
    check(same(a,rebuilt),'REPLAY','Calibration artifact does not reproduce from declared fitting cases');
  }
  for(const report of b.reports){
    const candidates=await Promise.all(b.runs.map(async r=>[await digest(r),r]));
    const run=candidates.find(([d])=>d===report.runDigest)?.[1];check(run,'BINDING','Missing report run');
    check(report.artifactDigests.length<=1,'METHOD','Reference report accepts one target mapping');
    const artifact=report.artifactDigests.length?b.artifacts[artifactDigests.indexOf(report.artifactDigests[0])]:null;
    check(!report.artifactDigests.length||artifact,'BINDING','Missing report artifact');
    if(artifact)check(instant(run.startedAt)>=instant(artifact.validFrom),'TIME','Acceptance must follow frozen calibration');
    const expected=await createReport({subject,suite:b.suite,run,artifact,policy:b.policy,targetId:report.targetId,population:report.population});
    check(same(report,expected),'REPLAY','Validation report does not reproduce');
  }
  if(!subject.resources.some(r=>r.id==='comparison-executable.json')){
    for(const a of b.artifacts.filter(a=>a.stage==='determination')){
      const upstream=a.upstreamArtifactDigests.map(d=>b.artifacts[artifactDigests.indexOf(d)]);
      const required=subject.targets.filter(t=>t.stage==='fact').map(t=>t.id).sort();
      check(same(upstream.map(a=>a.targetId).sort(),required),'DEPENDENCY','Determination mapping must bind every fact target');
      for(const run of b.runs.filter(r=>r.configurationDigest===a.configurationDigest&&['determination-fit','acceptance'].includes(r.phase))){
        for(const c of b.suite.cases.filter(c=>c.split===run.phase&&c.population===a.population&&a.strata.includes(c.stratum))){
          const observation=run.observations.find(o=>o.caseId===c.id&&o.targetId===a.targetId);
          if(observation?.status!=='ok')continue;
          const masses=upstream.map(artifact=>{
            const o=run.observations.find(o=>o.caseId===c.id&&o.targetId===artifact.targetId);
            if(o?.status!=='ok')return null;
            const mapped=mapDistribution(artifact,o.prediction);
            return mapped.status==='estimated'?mapped.distribution.find(p=>p.label===o.prediction.assertedLabel).ppm:null;
          });
          check(masses.length&&masses.every(m=>m!==null),'DEPENDENCY','Successful determination predictor requires every fact mapping');
          check(observation.prediction.distribution?.find(p=>p.label===a.positiveLabel)?.ppm===Math.min(...masses),'PREDICTOR','Determination observation must use the frozen minimum-confidence predictor');
        }
      }
    }
  }
  const expectedCard=await createModelCard({subject,suite:b.suite,runs:b.runs,reports:b.reports,artifacts:b.artifacts,policy:b.policy,intendedUse:b.modelCard.intendedUse,limitations:b.modelCard.limitations,createdAt:b.modelCard.createdAt,validUntil:b.modelCard.validUntil});
  check(same(b.modelCard,expectedCard),'REPLAY','Model card does not reproduce');
  check(b.release.evaluationSubjectDigest===subjectDigest&&b.release.modelCardDigest===await digest(b.modelCard)&&same(b.release.kit,subject.kit),'BINDING','Release binding differs');
  unique(b.release.resources,r=>r.id);
  check(b.release.resources.every(r=>subject.resources.some(x=>same(r,x))||r.id==='model-card.json'||(r.id==='comparison-kit.json'&&subject.resources.some(x=>x.id==='comparison-executable.json'))),'BINDING','Release may add only model-card.json and the final comparison kit to subject resources');
  check(subject.resources.every(r=>b.release.resources.some(x=>same(r,x))),'BINDING','Release replaced executable resources');
  check(b.release.resources.some(r=>r.id==='model-card.json'&&r.digest===b.release.modelCardDigest),'BINDING','Release must contain model-card.json');
  check(instant(b.release.createdAt)>=instant(b.modelCard.createdAt)&&instant(b.modelCard.createdAt)>=Math.max(...b.runs.map(r=>instant(r.completedAt))),'TIME','Release chronology differs');
  return b;
}
export async function preflightRelease(bundle,{at,mode='experimental',acceptedReleaseDigest=null,suspended=false}={}) {
  const b=await validateBundle(bundle),reasons=[];
  check(mode==='experimental'||mode==='live','MODE','Unknown mode');
  if(instant(at)>=instant(b.modelCard.validUntil)||instant(at)<instant(b.modelCard.createdAt))reasons.push('model-card-not-current');
  if(suspended)reasons.push('release-suspended');
  if(mode==='live'){
    if(acceptedReleaseDigest!==await digest(b.release))reasons.push('release-not-accepted-by-operator');
    if(b.modelCard.configurations.some(c=>!c.permittedModes.includes('live')))reasons.push('validation-not-passed');
    if(!b.policy?.review||instant(at)>=instant(b.policy.validUntil))reasons.push('domain-policy-not-current');
  }
  return {allowed:reasons.length===0,mode,reasons,releaseDigest:await digest(b.release)};
}
