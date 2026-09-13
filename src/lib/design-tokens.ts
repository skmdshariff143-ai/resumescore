/**
 * Formal Design Token System for ResumeScore
 *
 * Visual Philosophy:
 * - Instrument-grade Career Intelligence Workspace (Linear clarity + Notion simplicity + Fintech trust).
 * - Deliberate, calm 3-color palette: Precision Cobalt + Verified Emerald + Context Amber over Obsidian Slate.
 * - Distinct typography: Editorial display weights + High-density JetBrains Mono telemetry + Relaxed body.
 * - Explicit surface hierarchy: Level 0 (Canvas) -> Level 1 (Well) -> Level 2 (Standard) -> Level 3 (Hero) -> Level 4 (AI Narrative).
 */

export const DESIGN_TOKENS = {
  colors: {
    // Canvas & Surface Hierarchy
    bg: {
      canvas: '#080C14',        // Deep obsidian substrate (Level 0)
      well: '#0A0F1A',          // Recessed section panel (Level 1)
      surface: '#0F1626',       // Standard interactive card (Level 2)
      elevated: '#141E34',      // Raised hero card & calibration HUD (Level 3)
      hover: '#192642',         // Interactive hover state
      aiNarrative: '#0B132B',   // Distinct LLM qualitative container (Level 4)
    },
    // Hairline Borders
    borders: {
      subtle: 'rgba(255, 255, 255, 0.06)',
      default: '#1E293B',       // Slate-800
      elevated: '#334155',      // Slate-700
      active: '#3B82F6',        // Precision Cobalt
      verified: 'rgba(16, 185, 129, 0.40)', // Emerald
      derived: 'rgba(245, 158, 11, 0.40)',  // Amber dashed
    },
    // Typographic Scale
    text: {
      display: '#F8FAFC',       // Pure white display
      primary: '#E2E8F0',       // High-contrast headings
      secondary: '#94A3B8',     // High-readability body
      muted: '#64748B',         // Secondary metadata
      faint: '#475569',         // Decorative lines
    },
    // Deliberate Functional Signals
    signals: {
      cobalt: '#3B82F6',        // Primary engineering & system intelligence
      emerald: '#10B981',       // Verified facts, exact matches (100%), passing ATS
      amber: '#F59E0B',         // Ecosystem familiarity, taxonomy inference (80%), candidate input
      rose: '#F43F5E',          // Critical risk, missing required skills, parsing blockers
    },
    // Score Tier Mappings
    status: {
      excellent: {
        label: 'Excellent',
        text: 'text-emerald-400',
        bg: 'bg-emerald-950/60',
        border: 'border-emerald-700/50',
        hex: '#10B981',
      },
      strong: {
        label: 'Strong',
        text: 'text-blue-400',
        bg: 'bg-blue-950/60',
        border: 'border-blue-700/50',
        hex: '#3B82F6',
      },
      needsImprovement: {
        label: 'Needs Work',
        text: 'text-amber-400',
        bg: 'bg-amber-950/60',
        border: 'border-amber-700/50',
        hex: '#F59E0B',
      },
      highRisk: {
        label: 'High Risk',
        text: 'text-rose-400',
        bg: 'bg-rose-950/60',
        border: 'border-rose-700/50',
        hex: '#F43F5E',
      },
    },
  },
  typography: {
    fontSans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    display: 'text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] leading-[1.08]',
    heading1: 'text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight',
    heading2: 'text-lg sm:text-xl font-bold text-slate-100 tracking-tight',
    heading3: 'text-sm font-bold text-slate-200',
    body: 'text-xs sm:text-sm text-slate-400 leading-relaxed font-normal',
    monoLabel: 'font-mono text-[10px] sm:text-[11px] uppercase tracking-wider',
    monoValue: 'font-mono font-bold text-xs sm:text-sm',
  },
  elevation: {
    well: 'bg-slate-950/60 border border-slate-800/80 rounded-2xl',
    card: 'bg-slate-900/80 border border-slate-800 rounded-2xl shadow-md',
    hero: 'bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl ring-1 ring-white/[0.06]',
    aiNarrative: 'bg-gradient-to-b from-blue-950/20 via-slate-900/90 to-slate-950 border border-blue-900/40 rounded-2xl shadow-xl',
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
