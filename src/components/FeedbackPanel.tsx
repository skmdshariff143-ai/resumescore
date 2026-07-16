'use client';

import { useState } from 'react';
import type { FeedbackItem, FeedbackType } from '@/types';

interface FeedbackPanelProps {
  items: FeedbackItem[];
}

const TYPE_CONFIG: Record<FeedbackType, { icon: string; label: string; border: string; bg: string; text: string }> = {
  success: {
    icon: '✅',
    label: 'Strengths',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  warning: {
    icon: '⚠️',
    label: 'Improvements',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
  },
  error: {
    icon: '❌',
    label: 'Critical Issues',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
  },
  info: {
    icon: 'ℹ️',
    label: 'Suggestions',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
  },
};

const CATEGORY_ORDER: FeedbackType[] = ['error', 'warning', 'success', 'info'];

export default function FeedbackPanel({ items }: FeedbackPanelProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Group items by type
  const grouped = CATEGORY_ORDER.reduce<Record<FeedbackType, FeedbackItem[]>>(
    (acc, type) => {
      acc[type] = items.filter((item) => item.type === type);
      return acc;
    },
    { success: [], warning: [], error: [], info: [] },
  );

  const toggle = (type: string) => {
    setCollapsed((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Detailed Feedback</h3>

      {CATEGORY_ORDER.map((type) => {
        const group = grouped[type];
        if (group.length === 0) return null;
        const config = TYPE_CONFIG[type];
        const isCollapsed = collapsed[type] ?? false;

        return (
          <div
            key={type}
            className={`overflow-hidden rounded-xl border ${config.border} bg-white/5 backdrop-blur-xl`}
          >
            {/* Category header */}
            <button
              onClick={() => toggle(type)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5"
              aria-expanded={!isCollapsed}
              aria-controls={`feedback-section-${type}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">
                  {config.icon}
                </span>
                <span className={`text-sm font-semibold ${config.text}`}>
                  {config.label}
                </span>
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${config.bg} text-xs font-bold ${config.text}`}>
                  {group.length}
                </span>
              </div>

              <svg
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  isCollapsed ? '' : 'rotate-180'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Feedback items */}
            <div
              id={`feedback-section-${type}`}
              className={`transition-all duration-300 ease-in-out ${
                isCollapsed ? 'max-h-0' : 'max-h-[2000px]'
              } overflow-hidden`}
            >
              <ul className="divide-y divide-white/5 px-4 pb-3" role="list">
                {group.map((item, idx) => (
                  <li key={`${item.category}-${idx}`} className="flex gap-3 py-2.5">
                    <span className={`mt-0.5 text-xs ${config.text}`} aria-hidden="true">
                      •
                    </span>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm leading-relaxed text-slate-300">
                        {item.message}
                      </p>
                      <p className="text-xs text-slate-500">{item.category}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-10 text-center backdrop-blur-xl">
          <p className="text-sm text-slate-400">No feedback available yet.</p>
        </div>
      )}
    </div>
  );
}
