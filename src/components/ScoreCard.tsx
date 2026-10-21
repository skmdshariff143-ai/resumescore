'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Download, FileText } from 'lucide-react';
import type { ResumeScore } from '@/types';
import { generateExecutivePDF } from '@/lib/export/pdf-report';
import { Button } from './ui/Button';

export function ScoreCard({score,onOpenCoverLetter,onNavigateToTab}:{
 score:ResumeScore; onOpenCoverLetter?:()=>void; onNavigateToTab?:(tab:string)=>void;
}){
 const [exporting,setExporting]=useState(false);
 const [exportError,setExportError]=useState('');
 const confidence=score.dimensions.some(d=>d.confidence==='low')?'Limited':score.dimensions.every(d=>d.confidence==='high')?'Higher':'Moderate';
 const quality=score.generalQualityScore??score.overall;
 const skills=Object.values(score.skillMatrix??{}).flat();
 async function exportReport(){
  setExporting(true);setExportError('');
  try{await generateExecutivePDF(score);}catch{setExportError('The report could not be exported. Try again or export your resume from the editor.');}finally{setExporting(false);}
 }
 return <div className="space-y-6">
  <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
   <section className="panel space-y-5" aria-label="Resume quality summary">
    <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Your resume review</p><h2 className="mt-2 text-2xl font-semibold break-words">{score.parsedResume.personalInfo.name||'Your resume'}</h2></div><FileText className="shrink-0 text-brand" size={24}/></div>
    <div className="flex flex-wrap items-end gap-x-8 gap-y-4"><div><p className="text-sm text-muted">Resume quality</p><p className="text-5xl font-bold text-brand tracking-tight">{quality}<span className="text-lg font-normal text-muted"> / 100</span></p></div>{score.mode==='job_match'&&<div><p className="text-sm text-muted">Job match</p><p className="text-3xl font-semibold text-ink">{skills.length?score.skillMatchScore:'N/A'}<span className="text-sm font-normal text-muted">{skills.length?' / 100':''}</span></p></div>}</div>
    <p className="text-sm text-muted">{confidence} evidence confidence · Inferred from supplied text and extraction quality.</p>
    <p className="border-t border-line pt-4 text-sm text-muted">These are editorial estimates, not a hiring prediction. Expand each dimension below to inspect the evidence and rubric.</p>
   </section>
   <section className="panel space-y-4" aria-labelledby="next-step-heading"><p className="eyebrow">Start here</p><h2 id="next-step-heading" className="text-xl font-semibold">{score.topActions[0]?.title||'Review the evidence in your resume'}</h2><p className="text-sm text-muted">{score.topActions[0]?.howToFix||score.topPriority}</p><p className="text-sm text-body">{score.topActions[0]?.reason}</p><button className="action action-primary" onClick={()=>onNavigateToTab?.('review')}>Improve in the editor <ArrowRight size={16}/></button></section>
  </div>
  <div className="grid gap-5 md:grid-cols-2">
   <section className="panel space-y-4"><h3 className="font-semibold">What is working</h3>{score.topStrengths.length?<ul className="space-y-3">{score.topStrengths.slice(0,3).map((s,i)=><li key={i} className="flex items-start gap-2 text-sm"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-success"/><span>{s}</span></li>)}</ul>:<p className="text-sm text-muted">Add clearer examples of your contributions to make strengths easier to identify.</p>}</section>
   <section className="panel space-y-4"><h3 className="font-semibold">Your next improvements</h3><ol className="space-y-4">{score.topActions.slice(0,3).map((a,i)=><li key={a.id||i} className="flex items-start gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">{i+1}</span><div><p className="text-sm font-semibold text-ink">{a.title}</p><p className="mt-1 text-sm text-muted">{a.howToFix}</p></div></li>)}</ol></section>
  </div>
  <section className="panel space-y-5" aria-labelledby="dimensions-heading"><div><h3 id="dimensions-heading" className="text-lg font-semibold">Understand your score</h3><p className="mt-1 text-sm text-muted">Open a dimension for supporting evidence. Job-mode weights include alignment; general resume quality is calculated separately.</p></div>
   <div className="divide-y divide-line">{score.dimensions.map(dim=><details key={dim.key} className="py-4"><summary className="flex flex-wrap items-center justify-between gap-3"><span className="font-semibold text-sm text-ink">{dim.name}</span><span className="text-sm text-muted">{dim.score}/100 <span className="ml-3 text-xs">{Math.round(dim.weight*100)}% weight</span></span><span className="h-1.5 w-full rounded-full bg-subtle"><span className="block h-full rounded-full bg-brand" style={{width:dim.score+'%'}}/></span></summary><div className="mt-4 space-y-3 text-sm"><p>{dim.feedback}</p><p><strong>Why:</strong> {dim.reason}</p><p><strong>Evidence confidence:</strong> {dim.confidence??'medium'} (heuristic)</p><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-subtle p-4"><h4 className="mb-2 font-semibold">Detected evidence</h4><ul className="list-disc pl-4">{dim.evidence.detected.map((s,i)=><li key={i}>{s}</li>)}</ul>{!dim.evidence.detected.length&&<p>No direct evidence detected.</p>}</div><div className="rounded-xl bg-subtle p-4"><h4 className="mb-2 font-semibold">Missing evidence</h4><ul className="list-disc pl-4">{dim.evidence.missing.map((s,i)=><li key={i}>{s}</li>)}</ul>{!dim.evidence.missing.length&&<p>No specific gap detected by this rubric.</p>}</div></div><p><strong>Next action:</strong> {dim.evidence.recommendedAction}</p></div></details>)}</div>
  </section>
  <section className="panel flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-semibold">Keep your next step practical.</h3><p className="text-sm text-muted">Export your review or prepare a truthful cover-letter draft.</p></div><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={exportReport} isLoading={exporting} icon={<Download size={16}/>}>Export Executive PDF Report</Button>{onNavigateToTab&&<Button variant="secondary" onClick={()=>onNavigateToTab('critique')}>View Qualitative Critique</Button>}{onOpenCoverLetter&&<Button onClick={onOpenCoverLetter}>Generate Cover Letter</Button>}</div>{exportError&&<p role="alert" className="text-danger text-sm">{exportError}</p>}</section>
 </div>;
}
