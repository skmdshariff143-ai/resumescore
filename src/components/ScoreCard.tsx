'use client';

import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Briefcase,
  Target,
  FolderGit2,
  FileCheck2,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Download,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import type { ResumeScore } from '@/types';
import { generateExecutivePDF } from '@/lib/export/pdf-report';
import { CareerSignalRadar } from './ui/CareerSignalRadar';
import { BiggestOpportunityCard } from './ui/BiggestOpportunityCard';
import { Button } from './ui/Button';

interface ScoreCardProps {
  score: ResumeScore;
  onOpenCoverLetter?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export function ScoreCard({ score, onOpenCoverLetter, onNavigateToTab }: ScoreCardProps) {
  const [expandedDim, setExpandedDim] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const getDimensionIcon = (key: string) => {
    switch (key) {
      case 'ats':
        return <Shield className="w-4 h-4 text-indigo-400" />;
      case 'skill_match':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'experience':
        return <Briefcase className="w-4 h-4 text-purple-400" />;
      case 'impact':
        return <Target className="w-4 h-4 text-emerald-400" />;
      case 'projects':
        return <FolderGit2 className="w-4 h-4 text-amber-400" />;
      case 'readability':
        return <FileCheck2 className="w-4 h-4 text-sky-400" />;
      default:
        return <UserCheck className="w-4 h-4 text-rose-400" />;
    }
  };

  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-400';
    if (val >= 70) return 'text-cyan-400';
    if (val >= 55) return 'text-amber-400';
    return 'text-rose-400';
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await generateExecutivePDF(score);
    } catch (err) {
      console.error('Failed to export PDF', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. DOMINANT SIGNATURE: CAREER SIGNAL RADAR */}
      <CareerSignalRadar score={score} onNavigateToTab={onNavigateToTab} />

      {/* 2. CREATIVE SECONDARY SIGNATURE: YOUR BIGGEST OPPORTUNITY */}
      {score.topActions[0] && (
        <BiggestOpportunityCard
          topAction={score.topActions[0]}
          onTakeAction={() => {
            if (score.topActions[0].dimension.toLowerCase().includes('bullet') || score.topActions[0].dimension.toLowerCase().includes('impact')) {
              onNavigateToTab?.('rewrites');
            } else if (score.topActions[0].dimension.toLowerCase().includes('skill')) {
              onNavigateToTab?.('skills');
            } else if (score.topActions[0].dimension.toLowerCase().includes('ats')) {
              onNavigateToTab?.('ats');
            }
          }}
        />
      )}

      {/* 3. QUICK ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-white/[0.08] rounded-xl p-4">
        <div className="text-xs text-slate-300">
          <strong className="text-slate-100">Export & Next Actions: </strong>
          Download executive summary report or generate a fact-grounded cover letter.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPDF}
            isLoading={isExporting}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Executive PDF Report
          </Button>
          {onNavigateToTab && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateToTab('critique')}
              icon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
            >
              View Qualitative Critique
            </Button>
          )}
          {onOpenCoverLetter && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenCoverLetter}
              icon={<Zap className="w-3.5 h-3.5" />}
            >
              Generate Cover Letter
            </Button>
          )}
        </div>
      </div>

      {/* 4. TOP 3 PRIORITIZED ACTION ITEMS */}
      {score.topActions.length > 1 && (
        <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-indigo-400" />
              Prioritized Impact Actions
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Estimated Score Gains</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {score.topActions.map((action, i) => (
              <div
                key={action.id || i}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-800/40">
                      {action.dimension}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
                      {action.expectedScoreBoostLabel}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 leading-snug">{action.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{action.howToFix}</p>
                </div>

                <div className="text-[10px] text-slate-500 border-t border-slate-800/60 pt-2">
                  <strong className="text-slate-400">Why: </strong>
                  {action.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. 7-PILLAR DETERMINISTIC BREAKDOWN */}
      <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm font-bold text-slate-100">7-Dimension Resume Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent, evidence-based weighting: Overall Score ({score.overall}/100)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              Deterministic Analysis
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
              Contribution: Σ (Score × Weight)
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {score.dimensions.map((dim) => {
            const isExpanded = expandedDim === dim.key;
            return (
              <div
                key={dim.key}
                className="border border-slate-800 rounded-xl bg-slate-950/50 transition-all overflow-hidden"
              >
                <button
                  onClick={() => setExpandedDim(isExpanded ? null : dim.key)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {getDimensionIcon(dim.key)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-200">{dim.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({Math.round(dim.weight * 100)}% Weight)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{dim.feedback}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`text-xs font-bold ${getScoreColor(dim.score)}`}>
                        {dim.score}/100
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        +{dim.contribution} pts
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Evidence Drawer */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-900/70 text-xs space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                        <span className="font-semibold text-slate-300 block mb-1">Detected Evidence:</span>
                        <div className="flex flex-wrap gap-1">
                          {dim.evidence.detected.length > 0 ? (
                            dim.evidence.detected.map((item, idx) => (
                              <span key={idx} className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800">
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">No direct matches detected</span>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                        <span className="font-semibold text-slate-300 block mb-1">Recommended Action:</span>
                        <p className="text-slate-300 text-[11px]">{dim.evidence.recommendedAction}</p>
                      </div>
                    </div>

                    <div className="text-slate-400 text-[11px] border-t border-slate-800/60 pt-2">
                      <strong className="text-slate-300">Scoring Rationale: </strong>
                      {dim.reason}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
