/** V3 semantic design contract. Color values live in globals.css @theme. */
export const DESIGN_TOKENS = {
 colors: {
  bg:{canvas:'var(--color-canvas)',well:'var(--color-subtle)',surface:'var(--color-surface)',elevated:'var(--color-surface)',hover:'var(--color-subtle)',aiNarrative:'var(--color-brand-soft)'},
  borders:{default:'var(--color-line)',active:'var(--color-brand)'},
  text:{display:'var(--color-ink)',primary:'var(--color-ink)',secondary:'var(--color-body)',muted:'var(--color-muted)'},
  status:{
   excellent:{label:'Excellent',text:'text-success',bg:'bg-subtle',border:'border-line',hex:'#147449'},
   strong:{label:'Strong',text:'text-brand',bg:'bg-brand-soft',border:'border-line',hex:'#2457d6'},
   needsImprovement:{label:'Needs work',text:'text-warning',bg:'bg-subtle',border:'border-line',hex:'#865500'},
   highRisk:{label:'Needs attention',text:'text-danger',bg:'bg-subtle',border:'border-line',hex:'#b12b45'},
  },
 },
 typography:{display:'text-4xl sm:text-5xl font-bold tracking-tight',heading1:'text-2xl sm:text-3xl font-bold',heading2:'text-xl font-semibold',body:'text-base leading-relaxed',label:'text-sm font-medium'},
 spacing:{unit:4,section:80,card:24,control:12},
 radii:{sm:'.375rem',md:'.5rem',lg:'.75rem',xl:'1rem',full:'9999px'},
 motion:{fast:150},
 containers:{content:'72rem',reading:'48rem'},
 breakpoints:{sm:640,md:768,lg:1024,xl:1280},
} as const;
export type ScoreTier='excellent'|'strong'|'needsImprovement'|'highRisk';
export function getScoreTier(score:number):ScoreTier{
 if(score>=85)return 'excellent';if(score>=70)return 'strong';if(score>=55)return 'needsImprovement';return 'highRisk';
}
export function getScoreTierConfig(score:number){return DESIGN_TOKENS.colors.status[getScoreTier(score)];}
