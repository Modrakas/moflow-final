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
Webpack + Babel was transpiling to ES5 for broad browser support — unnecessary
overhead for a project targeting modern browsers only. Gulp's watch/task system
added a second config file for no real gain. Vite handles SCSS, JS bundling, and
HMR in one tool with zero config for our target environment.

Two config files become one. That's the whole argument.

### Trade-offs
PurgeCSS (gulp-purgecss) needs a replacement. Deferring to PostCSS or accepting
Vite's tree-shaking for now — revisit in Phase 05. The Gulp safelist for
DataManager's dynamically-injected classes needs to be documented before anyone
else touches this project.

---

## [P01-S03] CDN Dependencies Replaced by npm · Phase 1, Step 3

### Decision
Remove all CDN `<script>` tags for GSAP and Lenis. Install as npm packages.

### Rationale
CDN loading isn't version-locked. A CDN update can silently break the site with
no build error, no warning, nothing. npm packages are version-locked, work offline,
work in CI/CD, and plug directly into the Vite pipeline. GSAP's npm package also
ships TypeScript types, which we need.

### Consequence
Every `gsap.to(...)` call that relied on `window.gsap` needs to be updated to
`import { gsap } from 'gsap'`. Tracked as a migration task in Phase 03.

---

## [P01-S03] LenisLite.js Retired · Phase 1, Step 3

### Decision
Delete LenisLite.js. Use npm lenis exclusively.

### Rationale
LenisLite.js only existed because the Lenis CDN might not load. That risk is gone
now that Lenis is bundled. Two scroll implementations in the same codebase is a
liability, not a safety net.

The implementation was solid — same lerp loop, same RAF tick, same ScrollTrigger
coupling as real Lenis. Kept in `legacy-js/` for reference.

---

## [P01-S04] Path Aliases Configured · Phase 1, Step 4

### Decision
Configure `@`, `@styles`, `@modules`, `@data` aliases in both
`vite.config.ts` and `tsconfig.json`.

### Rationale
Relative imports break silently when files move. Aliases don't. That's it.

---

## [P01-S04] sass Moved to devDependencies · Phase 1, Step 4

### Decision
`sass` belongs in `devDependencies`, not `dependencies`.

### Rationale
`sass` compiles and exits. It's never needed at runtime. Having it in `dependencies`
would pull it into production installs for no reason.

---

## [P01-S07] main.ts Entry Point Sanitization · March 17, 2026

### Decision
Removed all Vite boilerplate from `main.ts`.

### Rationale
The default counter logic had no place in this project. `main.ts` is the
orchestrator — it should only contain what intentionally belongs there.
Cleared the file so Phase 02's motion and data engines have a clean surface
to initialize from.

---

## [P01-S07] Legacy Asset Decontamination · March 17, 2026

### Decision
Removed all legacy `<script>` tags, CDN references, and redundant `<link>`
elements from `index.html`.

### Rationale
GSAP and Lenis are now bundled via npm. The old CDN tags were still in the HTML,
which caused a build warning: `script can't be bundled without type="module"`.
The legacy scripts were trying to claim the same namespace as the ES modules.

Removing them also cut a 370ms processing bottleneck. The browser now initializes
one version-locked instance of each engine. No conflicts, no ghosts.

### Trade-offs
No more cross-site CDN cache hits for GSAP and Lenis. Worth it — those cache hits
were for whatever version the CDN happened to serve that day, not the version we
actually tested against.

---

## [P01-S07] Google Fonts CDN — Deferred · March 17, 2026

### Decision
Kept Google Fonts CDN links in `index.html` temporarily. Local font hosting
deferred to Phase 2, Step 1.

### Rationale
The project constraint is no CDNs. This is a known violation. Deferring it here
to avoid scope creep at the end of Phase 1. The debt is documented, it'll be
resolved first thing in Phase 2.

---

## [P02-S01] Local Font Integration · March 17, 2026

### Decision
Migrated Syne and JetBrains Mono from Google Fonts CDN to local hosting.
Resolves the deferred debt from [P01-S07].

### Rationale
Google Fonts adds a 200–400ms connection overhead on first load. Local hosting
eliminates that entirely. The build is now self-contained — no third-party
design dependencies at runtime.

---

## [P02-S01a] Static Font Weight Selection · March 23, 2026

### Decision
Static weights (300, 800) over variable font files.

### Rationale
We're using exactly two weights. Variable fonts make sense when you need the
full range — here they'd just add payload for capabilities we don't use.

---

## [P02-S01b] Font Asset Architecture · March 23, 2026

### Decision
`@font-face` rules live in `_typography.scss`. Assets stored in `/fonts/`
(aliased), not `/public/fonts/`. `format('woff2')` only.

### Rationale
Putting `@font-face` in `_typography.scss` keeps the Sass partial hierarchy
clean — the global reset doesn't need to know about fonts. `/fonts/` instead
of `/public/fonts/` means Vite hashes the files on build, which kills stale
cache issues. woff2 only — maximum compression, no legacy format overhead.

---

## [P02-S01c] Script Module Execution · March 23, 2026

### Decision
Added `type="module"` to the primary script tag.

### Rationale
Vite 8 treats the whole dependency graph as ES Modules. Without the attribute
the browser can't resolve the imports and the font-loading logic fails silently.

---

## [P02-S01d] Node.js Runtime Upgrade · March 23, 2026

### Decision
Used `fnm` to upgrade Node.js from `22.11.0` to `22.12+`.

### Rationale
Vite 8 requires `22.12+` minimum. The environment was on `22.11.0`. `fnm`
was chosen as the version manager so the constraint is enforced going forward,
not just fixed once.

---

## [P02-S02] CSS Custom Properties Convention · March 23, 2026

### Decision
Added CSS custom properties alongside SCSS variables, mirroring the naming
exactly — `--color-*` matches `$color-*`. All declarations in a single `:root`
block in `_variables.scss`.

### Rationale
SCSS variables are compile-time — they get inlined during the build and
disappear. Custom properties survive into the browser, which makes them the
right tool for anything JavaScript needs to read or any value that changes
at runtime (theming, state, etc.).

The mirrored naming isn't accidental. SCSS is the source of truth at build time;
custom properties are its runtime projection. Matching the names makes that
relationship obvious and removes any ambiguity when you're context-switching
between the two.

`:root` lives in `_variables.scss`, imported at the top of the main entry
partial. One place to look, globally scoped, declared before anything tries
to consume it.

---

## [P02-S03] Typography Token Map & Mixin Integration · March 23, 2026

### Decision
Defined a structured typography token map in SCSS covering the full type axis —
family, weight, size, line-height, letter-spacing. Refactored `_typography.scss`
to consume the map and replace all inline declarations with `@include m.mono`
and `@include m.fluid-type()`.

### Rationale
Flat variable lists have no boundary. A map makes the full scope of the type
system visible in one place and lets `@each` generate both SCSS variable bindings
and `--type-*` custom properties without writing each one by hand.

The mixin refactor followed the same logic. Every system-tier element was
individually declaring `font-family`, `font-weight`, and `font-size`. `@include
m.mono` collapses that into one call. Static `$fs-*` tokens became `fluid-type()`
ranges so the type scale responds to viewport width — the size contrast between
Display and System tiers now holds across all screen widths, not just the design
breakpoint.

### Trade-offs
The `fluid-type()` min/max values are approximations for now. They need to be
validated against actual rendered output before the component partials get audited.

---

## [P02-S04] Spacing, Motion & Z-Index Token Maps · March 23, 2026

### Decision
Added three token maps to `_variables.scss`: spacing with semantic aliases,
motion covering duration and easing, and z-index covering all stacking contexts.

### Rationale
The raw spacing scale (`$space-1` through `$space-12`) stays — it's the
foundation. The semantic aliases (`$space-section-gap`, `$space-component-pad`,
`$space-element-gap`, `$space-page-margin`, `$space-inline-gap`) sit on top so
call sites say what they're doing, not just what number they want.

Motion tokens exist because hardcoded duration and easing values drift. The same
interaction ends up with slightly different timing depending on who wrote it and
when. One place to change the rhythm.

Z-index magic numbers are how stacking bugs happen. Named contexts make the
intended order explicit and auditable.

These are variables, not mixins. There's no logic to abstract — just values.
The one exception is `section-pad`, which already exists as a mixin because it
bundles two axes and a breakpoint, which is worth abstracting.

---

## [P02-S05] Abstracts Barrel Fix · March 23, 2026

### Decision
Populated `abstracts/_index.scss` with `@forward` rules for `variables`,
`mixins`, and `tokens`.

### Rationale
The barrel was scaffolded and never filled. It didn't blow up because every
partial was already reaching directly into `abstracts/variables` and
`abstracts/mixins` via its own `@use` — so the missing index was just invisible
dead weight.

The fix matters because `@forward` is what makes a barrel actually work in Sass.
`@use` is scoped to the file that declares it and doesn't propagate. `@forward`
re-exports, so consumers of the barrel get everything. Without it, the file
does nothing.

Now there's one contract to maintain. Move or rename a partial, fix it in
`_index.scss` — not in every file that was importing it directly.

---

## [P02-S06] TypeScript Motion Token Mirror · March 23, 2026

### Decision
Created a `tokens.ts` file exporting a `TOKENS` object with `as const`,
covering GSAP easing strings and duration values. Delay stagger multipliers
excluded.

### Rationale

**Why a separate TS file when SCSS tokens already exist:**
SCSS variables don't exist at runtime. By the time the browser runs the JS,
Sass is long gone — it compiled and left. GSAP runs in JavaScript, so it
needs the values in JavaScript. There's no bridge. The TS file is just the
motion token system's runtime copy, the same way CSS custom properties are
the runtime copy of SCSS variables.

**Why `as const`:**
Without it, TypeScript widens every value — `'power3.out'` becomes `string`,
`0.8` becomes `number`. That means the compiler can't catch a typo in an
easing name or a wrong duration key. `as const` locks the values to their
exact literals so the types are actually useful. An explicit interface would
do the opposite — it would actively widen the types back to `string` and
`number`, which is worse than nothing. If I ever need the type somewhere else
I can just derive it with `type MotionTokens = typeof TOKENS`.

**Why delays are excluded:**
The delays in the legacy code aren't fixed values — they're all stagger
multipliers computed at runtime: `i * 0.07`, `i * 0.05`. Putting those in
the token file would mean freezing an arbitrary number that only makes sense
as part of a formula. The stagger factor belongs at the call site, not in a
constants file.