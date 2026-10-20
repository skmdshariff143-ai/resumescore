# V3 design system

## Contract

`src/app/globals.css` owns semantic Tailwind tokens; `src/lib/design-tokens.ts` documents the shared typography, spacing, status, radii, motion, container and breakpoint contract.

Light is the sole supported theme in this candidate. Canvas `#f7f9fc`, surface white, ink `#17243b`, body `#33445d`, muted `#52637b`, blue `#2457d6`, line `#d8e0ec`. Status colors use dark green/amber/red on pale surfaces and are accompanied by text. No third-party font requests or animation dependency.

## Components

- `action` / `Button`: minimum 44px, visible loading/disabled/focus states; actual link elements for navigation. No conflicting variant text utilities.
- `panel` / `Card`: bounded padding, 16px radius, restrained shadow, minimum width zero.
- Forms: visible labels, native controls, 16px input text, contrasting borders; browser-resizable text review.
- Results: separate quality/alignment, inferred confidence, prioritized evidence, native expandable dimensions; wrapped selected-state navigation.
- Editor: section fieldsets, accessible move buttons, mobile editor/preview selector, desktop split layout, explicit rewrite approval.
- Existing dialogs, alerts, skeletons, empty states and evidence rows share the same palette. Native disclosure controls provide FAQ/evidence progressive disclosure.

## Layout and motion

4px base / 8px major spacing rhythm; 72rem maximum content container, 48rem reading container. Hero 40px at smallest sizes, 48–56px at larger widths. Body 16px, secondary content 14px, metadata 12px. Responsive breakpoints follow Tailwind 640/768/1024/1280px. Strong focus outline, reduced-motion override, no page overflow masking. Wide comparison tables retain a bounded scroll region.

## Review

Applied the Vercel React best-practices checklist: no new dependency, independent analysis imports remain parallel and lazy; SSR history hydration protection retained; event-driven input invalidation and stale-response checks; semantic controls and explicit approval preserved. No claim of full manual screen-reader certification.
