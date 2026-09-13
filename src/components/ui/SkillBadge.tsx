'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';
import type { SkillMatchItem } from '@/types';

interface SkillBadgeProps {
  item: SkillMatchItem;
  className?: string;
}

export function SkillBadge({ item, className = '' }: SkillBadgeProps) {
  const getBadgeStyle = () => {
    switch (item.status) {
      case 'matched':
        return {
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
          bg: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/50',
          title: item.aliasMatched ? `Alias matched: ${item.aliasMatched}` : 'Direct match verified',
        };
      case 'partial':
        return {
          icon: <AlertCircle className="w-3 h-3 text-amber-400" />,
          bg: 'bg-amber-950/40 text-amber-300 border-amber-800/40 hover:bg-amber-900/50',
          title: item.taxonomyRelationship || 'Ecosystem taxonomy relationship',
        };
      case 'missing':
        return {
          icon: <XCircle className="w-3 h-3 text-rose-400" />,
          bg: 'bg-rose-950/40 text-rose-300 border-rose-800/40 hover:bg-rose-900/50',
          title: 'No explicit evidence found in resume',
        };
      default:
        return {
          icon: <HelpCircle className="w-3 h-3 text-slate-400" />,
          bg: 'bg-slate-900 text-slate-400 border-slate-800',
          title: 'Unknown requirement status',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div
      title={style.title}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors cursor-help ${style.bg} ${className}`}
    >
      {style.icon}
      <span>{item.skill}</span>
      {item.importance === 'required' && (
        <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-slate-950/80 text-indigo-400 border border-indigo-900/60 font-bold">
          Req
        </span>
      )}
    </div>
  );
}
