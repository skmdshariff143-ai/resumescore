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
      <div className="flex items-center justify-between max-w-3xl mx-auto gap-1 sm:px-4">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div
                onClick={() => onStepClick && idx <= currentStepIndex && onStepClick(idx)}
                role={onStepClick ? 'button' : undefined}
                tabIndex={onStepClick && idx <= currentStepIndex ? 0 : undefined}
                onKeyDown={event => {
                  if (onStepClick && idx <= currentStepIndex && ['Enter', ' '].includes(event.key)) {
                    event.preventDefault(); onStepClick(idx);
                  }
                }}
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex min-w-0 flex-1 flex-col items-center space-y-1.5 ${
                  idx <= currentStepIndex ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-panel '
                      : isCurrent
                      ? 'bg-brand text-white ring-4 ring-blue-500/20 shadow-panel '
                      : 'bg-surface border border-line text-muted'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-semibold text-center break-words ${
                    isCurrent ? 'text-brand' : isDone ? 'text-body' : 'text-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`hidden sm:block flex-1 h-0.5 mx-2 -mt-5  ${
                    idx < currentStepIndex ? 'bg-emerald-600' : 'bg-subtle'
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
