import { PPM, SPEC_VERSION, check, digest, distribution, instant, snapshot, validateArtifact, validateRun, validateRecord } from './contracts.mjs';
const round = (n,d) => Number((2n*n+d)/(2n*d));
export function fitPav(points) {
  check(points.length>0,'SAMPLES','No usable fit cases');
  const grouped=new Map();
  for(const [x,y] of points) { check(Number.isSafeInteger(x)&&x>=0&&x<=PPM&&(y===0||y===1),'SAMPLE','Invalid fit point'); const g=grouped.get(x)??{x,end:x,n:0n,sum:0n};g.n++;g.sum+=BigInt(y);grouped.set(x,g); }
  const blocks=[];
  for(const g of [...grouped.values()].sort((a,b)=>a.x-b.x)) {
    blocks.push(g);
    while(blocks.length>1) {
      const b=blocks.at(-1), a=blocks.at(-2);
      if(a.sum*b.n<=b.sum*a.n) break;
      blocks.splice(-2,2,{x:a.x,end:b.end,n:a.n+b.n,sum:a.sum+b.sum});
    }
  }
  return {minimumPpm:Math.min(...grouped.keys()),maximumPpm:Math.max(...grouped.keys()),knots:blocks.map(b=>({inputPpm:b.x,outputPpm:round(b.sum*BigInt(PPM),b.n)}))};
}
export function normalizeMass(values) {
  check(new Set(values.map(x=>x.label)).size===values.length&&values.every(x=>Number.isSafeInteger(x.ppm)&&x.ppm>=0&&x.ppm<=PPM),'DISTRIBUTION','Invalid normalization masses');
  const total=values.reduce((s,x)=>s+BigInt(x.ppm),0n);
  if(total===0n) return null;
  const rows=values.map(x=>{const n=BigInt(x.ppm)*BigInt(PPM);return {label:x.label,ppm:Number(n/total),r:n%total};});
  let remaining=PPM-rows.reduce((s,x)=>s+x.ppm,0);
  rows.sort((a,b)=>a.r>b.r?-1:a.r<b.r?1:a.label<b.label?-1:a.label>b.label?1:0);
  for(let i=0;i<remaining;i++) rows[i].ppm++;
  return rows.sort((a,b)=>a.label<b.label?-1:1).map(({label,ppm})=>({label,ppm}));
}
export async function fitCalibration({subject,suite,run,targetId,method='binary-isotonic-pav-v1',population,strata,validFrom,validUntil,upstreamArtifactDigests=[]}) {
  upstreamArtifactDigests=[...upstreamArtifactDigests];strata=[...strata];
  const validated=await validateRun(run,suite,subject); ({subject,suite,run}=validated);
  const t=subject.targets.find(x=>x.id===targetId);check(t,'TARGET','Unknown calibration target');
  check(['binary-isotonic-pav-v1','categorical-isotonic-normalized-v1','identity-v1'].includes(method),'METHOD','Unsupported calibration method');
  check(t.stage!=='determination'||upstreamArtifactDigests.length>0,'DEPENDENCY','Determination fit requires frozen upstream mappings');
  const split=t.stage==='fact'?'fact-fit':'determination-fit', groups=new Set(), selected=[];
  check(run.phase===split,'PHASE','Fitting requires its separate fitting run');
  check(instant(validFrom)>=instant(run.completedAt),'TIME','A fitted artifact cannot become valid before its fit run ends');
  for(const c of suite.cases.filter(c=>c.split===split&&c.relation==='baseline'&&c.population===population&&strata.includes(c.stratum))) {
    const l=c.labels.find(l=>l.targetId===targetId), o=run.observations.find(o=>o.caseId===c.id&&o.targetId===targetId);
    if(!l || l.value===null || l.disagreement || !o || o.status!=='ok' || !o.prediction.distribution) continue;
    check(!groups.has(c.groupId),'SAMPLES','Multiple baseline cases in one fit group');groups.add(c.groupId);selected.push({c,l,o});
  }
  check(selected.length>0 && t.labels.every(label=>selected.some(x=>x.l.value===label)),'SAMPLES','Every target label must occur in fitting data');
  const labels=method==='identity-v1'?[]:method==='binary-isotonic-pav-v1'?[t.positiveLabel]:t.labels;
  const mappings=labels.map(label=>({label,...fitPav(selected.map(({l,o})=>[o.prediction.distribution.find(p=>p.label===label).ppm,l.value===label?1:0]))}));
  return validateArtifact({specVersion:SPEC_VERSION,kind:'calibration-artifact',evaluationSubjectDigest:await digest(subject),configurationDigest:run.configurationDigest,targetId,stage:t.stage,method,labels:t.labels,positiveLabel:t.positiveLabel,mappings,fitSuiteDigest:await digest(suite),fitRunDigest:await digest(run),fitCaseIds:selected.map(x=>x.c.id).sort(),fitGroupIds:[...groups].sort(),population,strata:[...strata].sort(),validFrom,validUntil,upstreamArtifactDigests:[...upstreamArtifactDigests].sort()});
}
export function mapDistribution(artifactValue, prediction) {
  const a=validateArtifact(artifactValue);
  validateRecord('prediction',prediction);
  check(a.labels.includes(prediction.assertedLabel),'TARGET','Unknown asserted label');
  if(!prediction.distribution) return {status:'not_estimated',reason:'unsupported-score-kind'};
  distribution(prediction.distribution,a.labels);
  if(a.method==='identity-v1') return {status:'estimated',distribution:snapshot(prediction.distribution)};
  const mapped=[];
  for(const m of a.mappings) {
    const q=prediction.distribution.find(p=>p.label===m.label).ppm;
    if(q<m.minimumPpm||q>m.maximumPpm) return {status:'not_estimated',reason:'unsupported-score-range'};
    const knot=m.knots.findLast(k=>k.inputPpm<=q); mapped.push({label:m.label,ppm:knot.outputPpm});
  }
  if(a.method==='binary-isotonic-pav-v1') mapped.push({label:a.labels.find(l=>l!==a.positiveLabel),ppm:PPM-mapped[0].ppm});
  const result=normalizeMass(mapped);
  return result?{status:'estimated',distribution:result}:{status:'not_estimated',reason:'zero-normalization-mass'};
}
export async function applyCalibration({artifact:artifactValue,prediction:predictionValue,evaluationSubjectDigest,configurationDigest,targetId,population,stratum,at,upstreamArtifactDigests=[]}) {
  const artifact=snapshot(validateArtifact(artifactValue)),prediction=snapshot(validateRecord('prediction',predictionValue));
  const reasons=[];
  if(artifact.evaluationSubjectDigest!==evaluationSubjectDigest||artifact.configurationDigest!==configurationDigest||artifact.targetId!==targetId) reasons.push('binding-mismatch');
  if(artifact.population!==population||!artifact.strata.includes(stratum)) reasons.push('out-of-population');
  if(instant(at)<instant(artifact.validFrom)||instant(at)>=instant(artifact.validUntil)) reasons.push('artifact-expired-or-not-yet-valid');
  if(artifact.upstreamArtifactDigests.slice().sort().join()!==upstreamArtifactDigests.slice().sort().join()) reasons.push('upstream-mismatch');
  const mapped=reasons.length?null:mapDistribution(artifact,prediction);
  if(mapped?.status==='not_estimated') reasons.push(mapped.reason);
  const dist=mapped?.status==='estimated'?mapped.distribution:null;
  return validateRecord('application',{specVersion:SPEC_VERSION,kind:'calibration-application',evaluationSubjectDigest,configurationDigest,targetId,artifactDigest:await digest(artifact),inputDigest:await digest(prediction),status:dist?'estimated':'not_estimated',distribution:dist,assertedValueConfidencePpm:dist?.find(x=>x.label===prediction.assertedLabel)?.ppm??null,reasons});
}
export function determinationPredictor(applications,requiredTargetIds) {
  check(new Set(requiredTargetIds).size===requiredTargetIds.length,'DUPLICATE','Duplicate dependency');
  if(!requiredTargetIds.length) return {status:'not_estimated',reason:'no-probabilistic-dependencies'};
  check(new Set(applications.map(a=>a.targetId)).size===applications.length,'DUPLICATE','Duplicate application');
  const relevant=requiredTargetIds.map(id=>applications.find(a=>a.targetId===id));
  if(relevant.some(a=>!a||a.status!=='estimated'||a.assertedValueConfidencePpm===null)) return {status:'not_estimated',reason:'failed-dependency'};
  return {status:'estimated',predictorPpm:Math.min(...relevant.map(a=>a.assertedValueConfidencePpm))};
}
export const ppmToBasisPoints = ppm => { check(Number.isInteger(ppm)&&ppm>=0&&ppm<=PPM,'VALUE','Invalid ppm');return Math.floor((ppm+50)/100); };
