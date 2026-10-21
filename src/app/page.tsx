'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, FileText, ShieldCheck, Target, PencilLine, LockKeyhole, Upload, Sparkles } from 'lucide-react';

const examples = [
 {label:'Student', original:'Responsible for building new frontend user interfaces in React and fixing bugs.', improved:'Built new user interfaces in React and fixed bugs.', tip:'Make your contribution clear. Add an outcome only when you can substantiate it.'},
 {label:'Professional', original:'Worked on database queries and helped improve backend API latency for users.', improved:'Worked on database queries and helped improve backend API latency.', tip:'Describe the change you made. Include measurements only if you have them.'},
 {label:'Career switcher', original:'Responsible for preparing monthly financial reports and helping with budget reviews.', improved:'Prepared monthly financial reports and supported budget reviews.', tip:'Connect transferable experience to the role without adding new qualifications.'},
];
const faqs = [
 ['Is my resume uploaded to a server?','By default, extraction and analysis happen in your browser. You can choose server analysis separately. Saving history is optional and off by default.'],
 ['What do the scores mean?','They are reproducible estimates of resume quality, readability and job terminology alignment. They do not verify your qualifications, certify ATS compatibility or predict hiring. Independent scoring calibration is still pending.'],
 ['Does this work for students and career switchers?','Yes. Choose from six career profiles. Relevant projects, internships and academic work contribute according to the selected rubric.'],
 ['Can I edit and export my resume?','Yes. Review extracted text, edit sections, compare versions and download TXT or DOCX. Use your browser’s print dialog to save a selectable PDF. Review pagination before sharing.'],
 ['Is AI required?','No. Paid AI is disabled in this release. Deterministic resume analysis works without external AI services. Optional server tools provide clearly labeled heuristic suggestions.'],
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map(([q, a]) => ({
    '@type': 'Question',
    'name': q,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': a,
    },
  })),
};

export default function LandingPage(){
 const [example,setExample]=useState(0);
 const current=examples[example];
 return <div className="page-shell space-y-20 sm:space-y-28">
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
  />
  <section className="grid items-center gap-12 pt-4 pb-4 lg:grid-cols-[1.05fr_1fr] lg:py-12">
   <div className="space-y-7">
    <p className="eyebrow flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand"/>A clearer path to your next role</p>
    <h1 className="max-w-2xl text-[2.5rem] leading-[1.1] font-bold tracking-[-.045em] sm:text-5xl xl:text-[3.5rem]">Build a stronger resume.<br/><span className="text-brand">Apply with confidence.</span></h1>
    <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">Analyze your resume, compare it with job requirements, and receive clear, evidence-based recommendations to improve your application.</p>
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap"><Link href="/analyze" className="action action-primary">Analyze My Resume <ArrowRight size={17}/></Link><Link href="/analyze?mode=job_match" className="action">Match a Job Description <ArrowUpRight size={17}/></Link></div>
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted"><span className="flex items-center gap-2"><Check size={16} className="text-success"/>No account required</span><span className="flex items-center gap-2"><LockKeyhole size={15} className="text-success"/>Private by default</span><span className="flex items-center gap-2"><Sparkles size={15} className="text-brand"/>7-Pillar Scoring</span></div>
   </div>
   <div className="panel space-y-5">
    <div className="flex items-center justify-between gap-2 border-b border-line pb-4"><div className="flex items-center gap-3"><span className="rounded-lg bg-brand-soft p-2 text-brand"><FileText size={20}/></span><div><p className="font-semibold text-ink">Your resume, at a glance</p><p className="text-xs text-muted">Fictional sample · Illustrative scores</p></div></div></div>
    <div className="grid grid-cols-2 gap-4"><div className="rounded-xl bg-brand-soft p-4"><p className="text-sm text-muted">Resume quality</p><p className="mt-2 text-4xl font-bold tracking-tight text-brand">78<span className="text-base font-normal text-muted"> / 100</span></p></div><div className="rounded-xl bg-subtle p-4"><p className="text-sm text-muted">Job match</p><p className="mt-2 text-4xl font-bold tracking-tight text-ink">72<span className="text-base font-normal text-muted"> / 100</span></p></div></div>
    <div className="space-y-3 text-sm"><p className="flex items-start gap-2"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-success"/>Clear experience and education sections</p><p className="flex items-start gap-2"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-success"/>Relevant skills supported by project examples</p></div>
    <div className="rounded-xl border border-line p-4"><p className="text-xs font-semibold text-brand">A useful next step</p><p className="mt-1 text-sm text-ink">Show what you contributed to your most relevant project.</p><p className="mt-1 text-xs text-muted">Explain the action and outcome. Keep every claim true.</p></div>
    <Link className="inline-flex items-center gap-2 text-sm font-semibold text-brand py-2" href="#sample">Explore a sample improvement <ArrowRight size={16}/></Link>
   </div>
  </section>
  <section aria-labelledby="workflow-heading" className="space-y-8">
   <div className="space-y-3"><p className="eyebrow">From first draft to next step</p><h2 id="workflow-heading" className="section-title">A little clarity goes a long way.</h2><p className="text-muted">Three steps. Useful feedback. You stay in control.</p></div>
   <div className="grid gap-5 md:grid-cols-3">{[
    {icon:Upload,title:'Bring your resume',text:'Upload a PDF, DOCX or TXT file, or paste your text. Check and correct what was extracted.'},
    {icon:Target,title:'Find what matters',text:'Choose your career profile. Get a general review or compare with a specific job description.'},
    {icon:PencilLine,title:'Make it stronger',text:'Focus on the most useful changes, edit your resume and export a clean, readable version.'},
   ].map((s,i)=><article className="panel space-y-4" key={s.title}><div className="flex items-center justify-between"><s.icon size={22} className="text-brand"/><span className="text-sm text-muted">0{i+1}</span></div><h3 className="text-lg font-semibold">{s.title}</h3><p className="text-sm leading-relaxed text-muted">{s.text}</p></article>)}</div>
  </section>
  <section className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
   <div className="space-y-4"><p className="eyebrow">Feedback with a reason</p><h2 className="section-title">Know what to improve.<br/>Understand why.</h2><p className="text-muted">Move beyond a number. See the evidence behind each recommendation and decide what belongs in your resume.</p><Link href="/analyze" className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-brand">Review my resume <ArrowRight size={16}/></Link></div>
   <div className="grid gap-5 sm:grid-cols-2">{[
    {icon:FileText,title:'Readability, explained',text:'Check section headings, contact details and potential parsing issues. An estimate, never an ATS certification.'},
    {icon:Target,title:'A match grounded in evidence',text:'See demonstrated, mentioned, transferable and missing skills against recognized job requirements.'},
    {icon:PencilLine,title:'An editor that stays truthful',text:'Edit sections, compare drafts and approve suggested wording before it is applied.'},
    {icon:ShieldCheck,title:'Built around your choices',text:'Analyze locally, save history only when you choose, and export or delete saved data.'},
   ].map(c=><article className="space-y-3 border-t border-line pt-5" key={c.title}><c.icon size={22} className="text-brand"/><h3 className="font-semibold">{c.title}</h3><p className="text-sm text-muted">{c.text}</p></article>)}</div>
  </section>
  <section id="sample" aria-labelledby="sample-heading" className="panel space-y-6 scroll-mt-24">
   <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="space-y-2"><p className="eyebrow">Try the idea</p><h2 id="sample-heading" className="section-title">Stronger wording. Same facts.</h2><p className="text-sm text-muted">Illustrative edits using fictional text. No new skills or achievements.</p></div><div className="flex flex-wrap gap-2" aria-label="Sample career profile">{examples.map((e,i)=><button key={e.label} aria-pressed={example===i} onClick={()=>setExample(i)} className={`action ${example===i?'action-primary':''}`}>{e.label}</button>)}</div></div>
   <div className="grid gap-5 md:grid-cols-2" aria-live="polite"><div className="rounded-xl bg-subtle p-5 space-y-3"><h3 className="text-sm font-semibold text-muted">Original</h3><p className="text-ink">{current.original}</p></div><div className="rounded-xl border border-line p-5 space-y-3"><h3 className="text-sm font-semibold text-brand">Suggested wording</h3><p className="text-ink">{current.improved}</p></div></div><p className="text-sm text-muted">{current.tip}</p>
  </section>
  <section className="grid gap-6 rounded-2xl bg-brand-soft p-6 sm:p-10 md:grid-cols-[auto_1fr_auto] md:items-center"><span className="w-fit rounded-xl bg-surface p-3 text-brand"><LockKeyhole size={27}/></span><div className="space-y-2"><h2 className="text-xl font-semibold">Your resume is personal. Keep it that way.</h2><p className="max-w-xl text-sm text-muted">Browser-only analysis is the default. No account, no automatic history, and no paid AI calls. You choose whether to save anything on this device.</p></div><Link className="action" href="/privacy">Our privacy approach <ArrowUpRight size={16}/></Link></section>
  <section aria-labelledby="faq-heading" className="mx-auto max-w-3xl space-y-6"><div className="text-center space-y-3"><p className="eyebrow">Good questions</p><h2 id="faq-heading" className="section-title">Before you get started.</h2></div><div className="divide-y divide-line">{faqs.map(([q,a])=><details key={q} className="py-5"><summary className="font-semibold text-ink">{q}</summary><p className="mt-3 pr-4 text-sm leading-relaxed text-muted">{a}</p></details>)}</div></section>
  <section className="border-t border-line pt-14 text-center space-y-5"><h2 className="section-title">Your next step starts with a clearer resume.</h2><p className="text-muted">Bring what you have. Leave with a practical plan.</p><Link href="/analyze" className="action action-primary">Analyze My Resume <ArrowRight size={17}/></Link></section>
 </div>;
}
