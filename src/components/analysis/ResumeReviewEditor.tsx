'use client';

import React, { useState } from 'react';
import type { ResumeParsed } from '@/types';
import { User, Briefcase, GraduationCap, Code2, FolderGit2, CheckCircle2 } from 'lucide-react';

type ReviewSection = 'info' | 'experience' | 'skills' | 'education' | 'projects';

interface ResumeReviewEditorProps {
  resume: ResumeParsed;
}

export function ResumeReviewEditor({ resume }: ResumeReviewEditorProps) {
  const [activeSection, setActiveSection] = useState<ReviewSection>('experience');

  return (
    <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center">
            <User className="w-4 h-4 mr-2 text-indigo-400" />
            Structured Entity Review & Parsing Audit
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Review parsed candidate facts and structured sections extracted from the document.
          </p>
        </div>

        <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Extraction Quality: {resume.metadata.extractionQuality.toUpperCase()}
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { key: 'experience' as const, label: `Experience (${resume.experience.length})`, icon: Briefcase },
          { key: 'skills' as const, label: `Skills (${resume.allSkills.length})`, icon: Code2 },
          { key: 'education' as const, label: `Education (${resume.education.length})`, icon: GraduationCap },
          { key: 'projects' as const, label: `Projects (${resume.projects.length})`, icon: FolderGit2 },
          { key: 'info' as const, label: 'Contact & Links', icon: User },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSection === tab.key
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {activeSection === 'experience' && (
          <div className="space-y-4">
            {resume.experience.map((exp, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-100">{exp.role}</span>
                    <span className="text-xs text-indigo-400 font-semibold">• {exp.company}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {exp.startDate} – {exp.endDate} {exp.isRemote && '(Remote)'}
                  </span>
                </div>

                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pt-1">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(resume.skills).map(([cat, list]) => (
              <div key={cat} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {cat.replace('_', ' ')} ({list.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {list.map((skill, sIdx) => (
                    <span key={sIdx} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'education' && (
          <div className="space-y-3">
            {resume.education.map((edu, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
                <h4 className="text-xs font-bold text-slate-100">{edu.degree}</h4>
                <p className="text-xs text-indigo-300">{edu.institution}</p>
                {edu.gpa && <p className="text-[11px] text-slate-400 font-mono">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="space-y-3">
            {resume.projects.map((proj, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-100">{proj.name}</h4>
                <p className="text-xs text-slate-300">{proj.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'info' && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><strong className="text-slate-400">Name:</strong> {resume.personalInfo.name}</div>
              <div><strong className="text-slate-400">Email:</strong> {resume.personalInfo.email || 'None'}</div>
              <div><strong className="text-slate-400">Phone:</strong> {resume.personalInfo.phone || 'None'}</div>
              <div><strong className="text-slate-400">Location:</strong> {resume.personalInfo.location || 'None'}</div>
              <div><strong className="text-slate-400">LinkedIn:</strong> {resume.personalInfo.linkedin || 'None'}</div>
              <div><strong className="text-slate-400">GitHub:</strong> {resume.personalInfo.github || 'None'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
