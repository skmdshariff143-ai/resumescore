'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: StepItem[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStepIndex,
  onStepClick,
  className = '',
}: StepIndicatorProps) {
  return (
    <div className={`w-full py-2 ${className}`}>
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div
                onClick={() => onStepClick && idx <= currentStepIndex && onStepClick(idx)}
                className={`flex flex-col items-center space-y-1.5 ${
                  idx <= currentStepIndex ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-md shadow-indigo-600/40'
                      : 'bg-slate-900 border border-slate-700 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold text-center whitespace-nowrap ${
                    isCurrent ? 'text-indigo-300' : isDone ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-5 transition-colors ${
                    idx < currentStepIndex ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
