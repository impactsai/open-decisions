import { PPM, check } from './contracts.mjs';
const ratio=(n,d)=>d?Math.round(n/d*PPM):null;
// A one-sided Hoeffding bound over independent case groups remains conservative at zero errors.
export function rateMetric(count,n,reason='no-eligible-cases') {
  if(!n) return {valuePpm:null,n:0,reason,lowerPpm:null,upperPpm:null};
  const valuePpm=ratio(count,n), delta=Math.ceil(Math.sqrt(Math.log(40)/(2*n))*PPM);
  return {valuePpm,n,reason:null,lowerPpm:Math.max(0,valuePpm-delta),upperPpm:Math.min(PPM,valuePpm+delta)};
}
const scalar=(value,n,reason='no-eligible-cases')=>({valuePpm:value===null?null:Math.round(value*PPM),n,reason:value===null?reason:null,lowerPpm:null,upperPpm:null});
export function scoreRows(rows,target,scheduled=rows.length) {
  const confusion=new Map(), prevalence=new Map(), bins=[];
  let correct=0,brier=0,loss=0,infiniteLoss=false,ordinal=0,positiveN=0,negativeN=0,falsePositive=0,falseNegative=0;
  for(const r of rows) {
    const pred=r.prediction.assertedLabel, truth=r.label;
    if(pred===truth)correct++;
    prevalence.set(truth,(prevalence.get(truth)??0)+1);
    const key=JSON.stringify([truth,pred]);confusion.set(key,(confusion.get(key)??0)+1);
    if(truth===target.positiveLabel){positiveN++;if(target.adverseLabels.includes(pred))falseNegative++;}
    else if(target.adverseLabels.includes(truth)){negativeN++;if(pred===target.positiveLabel)falsePositive++;}
    for(const p of r.prediction.distribution)brier+=(p.ppm/PPM-(p.label===truth?1:0))**2;
    const p=r.prediction.distribution.find(p=>p.label===truth).ppm/PPM;if(p===0)infiniteLoss=true;else loss-=Math.log(p);
    if(target.ordinalLevels){const level=l=>target.ordinalLevels.find(x=>x.label===l).level;ordinal+=Math.abs(r.prediction.distribution.reduce((s,p)=>s+level(p.label)*p.ppm/PPM,0)-level(truth));}
  }
  let ece=0;
  for(const label of target.labels)for(let i=0;i<10;i++) {
    const relevant=rows.filter(r=>Math.min(9,Math.floor(r.prediction.distribution.find(p=>p.label===label).ppm/100000))===i);
    const n=relevant.length, mean=n?Math.round(relevant.reduce((s,r)=>s+r.prediction.distribution.find(p=>p.label===label).ppm,0)/n):null, freq=n?ratio(relevant.filter(r=>r.label===label).length,n):null;
    bins.push({label,loPpm:i*100000,hiPpm:(i+1)*100000,n,meanPpm:mean,frequencyPpm:freq});if(n)ece+=n*Math.abs(mean-freq)/PPM;
  }
  const n=rows.length;
  return {metrics:{accuracy:rateMetric(correct,n),majorityBaseline:rateMetric(Math.max(0,...prevalence.values()),n),brier:scalar(n?brier/n:null,n),logLoss:scalar(infiniteLoss?null:n?loss/n:null,n,infiniteLoss?'zero-probability-for-observed-label':'no-eligible-cases'),falseApproval:rateMetric(falsePositive,negativeN),falseRejection:rateMetric(falseNegative,positiveN),coverage:rateMetric(n,scheduled),selectiveError:rateMetric(n-correct,n),ece:scalar(n?ece/n/target.labels.length:null,n),ordinalMae:scalar(n&&target.ordinalLevels?ordinal/n:null,n,'ordinal-scale-not-declared')},bins,confusion:[...confusion].map(([key,n])=>{const[expected,predicted]=JSON.parse(key);return{expected,predicted,n};})};
}
export function robustness(rows,target) {
  const groups=new Map();for(const r of rows){const g=groups.get(r.case.groupId)??[];g.push(r);groups.set(r.case.groupId,g);}
  let n=0,flips=0,bothCorrect=0,maxChange=null;
  for(const group of groups.values()) {
    const baseline=group.find(r=>r.case.relation==='baseline'),others=group.filter(r=>['meaning-preserving','repeat'].includes(r.case.relation));
    if(!baseline||!others.length)continue;n++;
    if(others.some(r=>r.prediction.assertedLabel!==baseline.prediction.assertedLabel))flips++;
    if([baseline,...others].every(r=>r.prediction.assertedLabel===r.label))bothCorrect++;
    for(const r of others)for(const p of r.prediction.distribution)maxChange=Math.max(maxChange??0,Math.abs(p.ppm-baseline.prediction.distribution.find(x=>x.label===p.label).ppm));
  }
  const variants=[...new Set(rows.map(r=>r.case.variant))].sort().map(id=>({id,metrics:scoreRows(rows.filter(r=>r.case.variant===id),target).metrics}));
  return {flipRate:rateMetric(flips,n),bothCorrect:rateMetric(bothCorrect,n),maximumProbabilityChangePpm:maxChange,variants};
}
