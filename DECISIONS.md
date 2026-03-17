# MoFlow Lab — DECISIONS.md

Engineering decision log. Every architectural choice is recorded here
with its rationale. This document is the audit trail.

Format: ## [PHASE-STEP] TITLE · DATE

---

## [P01-S01] Initial Audit · Phase 1, Step 1

### Context
Project began as a Vanilla JS + Gulp + Webpack build with CDN-loaded
GSAP and Lenis. Full module inventory conducted before migration.

### Existing Modules
- `app.js` — Orchestrator. Boot order: fonts → data → ScrollTrigger.refresh() → UI.
- `CursorManager.js` — Custom crosshair cursor.
- `DataManager.js` — Fetches projects.json, injects DOM nodes.
- `LenisLite.js` — Custom smooth-scroll fallback (lerp-based).
- `NoiseGenerator.js` — Canvas noise overlay.
- `ProjectReveal.js` — GSAP follow-image on project hover.
- `ScrollAnimations.js` — ScrollTrigger-driven reveals.
- `StatsCounter.js` — Animated number counter.
- `TextScramble.js` — Character scramble on nav links.

### Findings
GSAP and ScrollTrigger were declared as `externals` in webpack —
intentionally excluded from the bundle because they were CDN globals.
Lenis was also a CDN global. LenisLite.js was the runtime fallback.

---

## [P01-S03] Vite Replaces Gulp + Webpack · Phase 1, Step 3

### Decision
Replace the two-tool pipeline (Gulp for SCSS, Webpack for JS) with Vite.

### Rationale
- Vite handles SCSS compilation, JS bundling, and dev-server HMR in one tool.
- Webpack + Babel was transpiling to ES5 for broad browser support.
  Our browserslist targets modern browsers only — esbuild handles this
  natively with zero config.
- Gulp's watch/task system is replaced by Vite's built-in watch mode.
- Net result: two config files (gulpfile.js + webpack config inside it)
  replaced by one (vite.config.ts).

### Trade-offs
- PurgeCSS (gulp-purgecss) requires replacement. Using PostCSS or
  accepting Vite's tree-shaking for now. Revisit in Phase 05.
- The Gulp safelist for dynamically-injected DataManager classes must
  be documented for whoever maintains this project.

---

## [P01-S03] CDN Dependencies Replaced by npm · Phase 1, Step 3

### Decision
Remove all CDN `<script>` tags for GSAP and Lenis. Install as npm packages.

### Rationale
- CDN loading is not version-locked — a CDN update can silently break
  the site.
- CDN globals are not tree-shakeable — the entire library loads even if
  only one function is used.
- npm packages work offline, in CI/CD, and in the Vite build pipeline.
- GSAP's npm package includes TypeScript types built-in.

### Consequence
Every `gsap.to(...)` call that relied on `window.gsap` must be updated
to use `import { gsap } from 'gsap'`. Tracked as a migration task in
Phase 03.

---

## [P01-S03] LenisLite.js Retired · Phase 1, Step 3

### Decision
Delete LenisLite.js. Use npm lenis exclusively.

### Rationale
LenisLite.js existed solely as a fallback for when the Lenis CDN was
unavailable. With Lenis now bundled via npm, the fallback path is
unnecessary. The real Lenis instance replaces both code paths in
app.js._initScroll().

### Note
LenisLite.js was well-architected (lerp loop, RAF tick, ScrollTrigger
coupling). The pattern it implements is identical to what npm Lenis does
internally. Preserved in legacy-js/ for reference.

---

## [P01-S04] Path Aliases Configured · Phase 1, Step 4

### Decision
Configure `@`, `@styles`, `@modules`, `@data` aliases in both
vite.config.ts and tsconfig.json.

### Rationale
Relative imports (`../../modules/CursorManager`) break silently when
files are moved. Aliases create a stable address space — moving a file
never requires updating its importers.

---

## [P01-S04] sass Moved to devDependencies · Phase 1, Step 4

### Decision
`sass` belongs in devDependencies, not dependencies.

### Rationale
`sass` is a build-time compiler. It produces CSS and then exits. It is
never required at runtime. Placing it in dependencies would cause it to
be included in production installs unnecessarily.

---
