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
          icon: <CheckCircle2 className="w-3 h-3 text-success" />,
          bg: 'bg-subtle text-success border-line hover:bg-subtle',
          title: item.aliasMatched ? `Alias matched: ${item.aliasMatched}` : 'Direct match verified',
        };
      case 'partial':
        return {
          icon: <AlertCircle className="w-3 h-3 text-warning" />,
          bg: 'bg-subtle text-warning border-line hover:bg-subtle',
          title: item.taxonomyRelationship || 'Ecosystem taxonomy relationship',
        };
      case 'missing':
        return {
          icon: <XCircle className="w-3 h-3 text-danger" />,
          bg: 'bg-subtle text-danger border-line hover:bg-subtle',
          title: 'No explicit evidence found in resume',
        };
      default:
        return {
          icon: <HelpCircle className="w-3 h-3 text-muted" />,
          bg: 'bg-surface text-muted border-line',
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
        <span className="text-xs uppercase font-sans px-1 py-0.2 rounded bg-surface text-brand border border-line font-bold">
          Req
        </span>
      )}
    </div>
  );
}
