/**
 * Formal Design Token System for ResumeScore
 * Dark-first, calm, high-precision career intelligence interface.
 */

export const DESIGN_TOKENS = {
  colors: {
    bg: {
      primary: '#07090E',     // Deep obsidian background
      secondary: '#0C0F19',   // Primary surface container
      elevated: '#111625',    // Raised cards & dialogs
      hover: '#182034',       // Interactive hover surface
      subtle: '#090D17',      // Inset wells & code blocks
    },
    borders: {
      subtle: 'rgba(255, 255, 255, 0.06)',
      default: 'rgba(255, 255, 255, 0.10)',
      strong: 'rgba(255, 255, 255, 0.18)',
      focus: '#6366F1',
    },
    text: {
      primary: '#F8FAFC',     // Crisp white headings
      secondary: '#94A3B8',   // High readability body
      muted: '#64748B',       // Metadata and labels
      disabled: '#475569',
    },
    signal: {
      primary: '#6366F1',     // Indigo - Main career signal
      cyan: '#06B6D4',        // Cyan - Technical & semantic matches
      emerald: '#10B981',     // Emerald - Verified facts & high scores
      amber: '#F59E0B',       // Amber - Developing & partial alignment
      rose: '#F43F5E',        // Rose - Critical risks & missing requirements
      purple: '#A855F7',      // Purple - Impact & Leadership
    },
    status: {
      excellent: {
        label: 'Excellent',
        text: 'text-emerald-400',
        bg: 'bg-emerald-950/40',
        border: 'border-emerald-800/40',
        hex: '#10B981',
      },
      strong: {
        label: 'Strong',
        text: 'text-cyan-400',
        bg: 'bg-cyan-950/40',
        border: 'border-cyan-800/40',
        hex: '#06B6D4',
      },
      needsImprovement: {
        label: 'Needs Improvement',
        text: 'text-amber-400',
        bg: 'bg-amber-950/40',
        border: 'border-amber-800/40',
        hex: '#F59E0B',
      },
      highRisk: {
        label: 'High Risk',
        text: 'text-rose-400',
        bg: 'bg-rose-950/40',
        border: 'border-rose-800/40',
        hex: '#F43F5E',
      },
    },
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    full: '9999px',
  },
} as const;

export type ScoreTier = 'excellent' | 'strong' | 'needsImprovement' | 'highRisk';

export function getScoreTier(score: number): ScoreTier {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'strong';
  if (score >= 55) return 'needsImprovement';
  return 'highRisk';
}

export function getScoreTierConfig(score: number) {
  const tier = getScoreTier(score);
  return DESIGN_TOKENS.colors.status[tier];
}
