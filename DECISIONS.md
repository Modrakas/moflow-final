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

## [P01-S07] main.ts Entry Point Sanitization · March 17, 2026

### Decision
Systematically purged all default `Vite` boilerplate from `main.ts` to establish a high-fidelity, zero-dependency entry point.

### Rationale
The factory-default counter logic introduces arbitrary DOM manipulation and state management that compromises our "Architectural Noir" structural integrity. In high-end design engineering, it's important to prioritize a "Clean Site" protocol—removing all non-essential artifacts to ensure the orchestrator remains lean and the initialization sequence is strictly deterministic. This establishes a sterile environment for the custom motion and data engines arriving in **Phase 02**.

---

## [P01-S07] Legacy Asset Decontamination · March 17, 2026

### Decision
Systematic removal of legacy <script> tags, CDN references, and redundant <link> elements from the root index.html.

### Rationale
In the `Gulp` -era "Old World," there was reliance on external life support via CDNs for GSAP and Lenis. In the modern Vite architecture, these engines are now bundled locally via npm. Retaining the legacy tags created a **Direct Conflict** warning during the build: `script can't be bundled without type="module"` attribute. This occurred because the legacy scripts were attempting to claim the same namespace as our type-safe modules.

By purging these artifacts, a `370ms` processing bottleneck is eliminated, ensuring that the browser only initializes a single, version-locked instance of our core engines. This removal of external dependencies allows the project to shift from a fragmented global execution model to a centralized, module-based architecture. With the "interference" of legacy scripts cleared, our new orchestrator, `main.ts`, now maintains exclusive authority over the system's initialization and runtime logic

### Trade-offs
Removing CDNs means no longer benefiting from potential browser caching of those common libraries across different websites. However, the gains in build-time determinism and the elimination of "ghost" namespace conflicts far outweigh the negligible cache hits of outdated CDN versions.

---

## [P01-S07] Google Fonts CDN — Deferred · March 17, 2026

### Decision
Temporarily retained the `Google Fonts CDN links (Syne and JetBrains Mono)` in the index.html header, deferring local installation to the start of Phase 2.

### Rationale
While the project constraint strictly mandates `No CDNs` to ensure a sterile, self-contained build, we are deferring the local font hosting setup to avoid scope creep at the end of Phase 1. This is a known temporary violation of the architectural principles. By acknowledging this debt now, it's ensured the baseline environment is functional for the current sprint while flagging the assets for a proper local-host migration in Phase 2, Step 1.

## [P02-S01] Local Font Integration · March 17, 2026

### Decision
Resolved the temporary CDN violation from [P01-S07] by migrating Syne and JetBrains Mono to local hosting.

### Rationale
Serving fonts locally eliminates the 200-400ms overhead of establishing a connection to Google’s servers. It also aligns with our "Self-Sustaining" protocol—the application is now fully independent of third-party design providers, ensuring architectural stability and privacy.

## [P02-S01a] Static Font Weight Selection · March 23, 2026

### Decision
Opted for static font weights (300, 800) over variable font files.

### Rationale
Static weights minimize initial payload size and ensure pixel-perfect consistency across legacy browsers. Variable fonts, while flexible, introduce unnecessary overhead for a constrained weight set.

---

## [P02-S01b] Font Asset Architecture · March 23, 2026

### Decision
Defined `@font-face` rules within `_typography.scss` and stored assets in `/fonts/` (aliased) rather than `/public/fonts/`, enforcing `format('woff2')` as the exclusive format standard.

### Rationale
Scoping `@font-face` declarations to `_typography.scss` maintains a clean Sass partial hierarchy rather than cluttering the global reset. Storing assets in `/fonts/` allows Vite's build pipeline to hash the files, preventing stale cache issues. Enforcing `format('woff2')` exclusively leverages maximum compression without the overhead of redundant legacy formats.

---

## [P02-S01c] Script Module Execution · March 23, 2026

### Decision
Applied `type="module"` to the primary script tag.

### Rationale
Vite 8 treats the entire dependency graph as ES Modules by default. Without this attribute, the browser fails to resolve the imports required for the font-loading logic, causing a silent initialization failure.

---

## [P02-S01d] Node.js Runtime Upgrade · March 23, 2026

### Decision
Implemented `fnm` (Fast Node Manager) to upgrade the Node.js runtime from `22.11.0` to `22.12+`.

### Rationale
Vite 8 requires Node.js `22.12+` as a minimum. The environment was running `22.11.0`, creating a version mismatch that blocked compatibility with the latest build engine features. `fnm` was chosen as the version manager to enforce this constraint going forward.