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

### Context
Google Fonts CDN links were left in `index.html` as a known temporary violation
at the end of Phase 1. This entry resolves that debt.

### Decision
Migrated Syne and JetBrains Mono from Google Fonts CDN to local hosting.

### Rationale
Google Fonts adds a 200–400ms connection overhead on first load — a DNS lookup,
TCP handshake, and TLS negotiation before a single byte of font data moves.
Local hosting eliminates that entirely. The build is also now self-contained,
which was the original constraint. Keeping the CDN any longer would mean every
future Lighthouse run flagging a third-party render-blocking resource we chose
to keep.

### Trade-offs
Font files now live in the repo and add to bundle size. woff2 compression keeps
this reasonable — Syne ExtraBold and JetBrains Mono Light together come in well
under 100kb. The connection overhead we eliminate is worth more than the marginal
cache hit Google Fonts might have provided.

---

## [P02-S01a] Static Font Weight Selection · March 23, 2026

### Context
The design uses exactly two weights: Syne 800 for Display tier and JetBrains
Mono 300 for System tier. Variable font files were the available alternative.

### Decision
Static weights (300, 800) over variable font files.

### Rationale
Variable fonts carry the full weight axis in a single file — useful when you
need the range, but the file is larger than any individual static weight.
We're using two specific weights and nothing in between. Downloading the full
variable range to use two points on it doesn't make sense.

### Trade-offs
If the design ever adds intermediate weights, we'd need to either swap to
variable fonts or add more static files. That's an acceptable future cost
given the current constraint.

---

## [P02-S01b] Font Asset Architecture · March 23, 2026

### Context
Font files needed a home in the project. The two options were `/public/fonts/`
(Vite serves as-is, no processing) or `/fonts/` with a path alias (goes through
the build pipeline).

### Decision
`@font-face` rules live in `_typography.scss`. Assets stored in `/fonts/`
(aliased), not `/public/fonts/`. `format('woff2')` only.

### Rationale
Putting `@font-face` in `_typography.scss` keeps the Sass partial hierarchy
clean — the global reset doesn't need to know about fonts. `/fonts/` instead
of `/public/fonts/` means Vite hashes the files on build, which kills stale
cache issues. woff2 only — maximum compression, no legacy format overhead.

### Trade-offs
Files in `/fonts/` aren't accessible at a predictable public URL the way
`/public/fonts/` would be. That matters if something outside the build pipeline
ever needs to reference them directly — nothing currently does, but worth
knowing.

---

## [P02-S01c] Script Module Execution · March 23, 2026

### Context
After migrating to local fonts and wiring up the `@font-face` declarations,
the font-loading logic in `main.ts` was failing silently in the browser. No
error, fonts just weren't loading.

### Decision
Added `type="module"` to the primary script tag in `index.html`.

### Rationale
Vite 8 treats the whole dependency graph as ES Modules. Without `type="module"`
the browser parses the script in classic mode and can't resolve ES Module
imports — including the ones the font-loading logic depends on. The failure
was silent because classic mode doesn't throw on unresolved imports, it just
skips them.

### Trade-offs
None meaningful. `type="module"` defers execution by default, which is actually
the behaviour we want — DOM is ready before the script runs.

---

## [P02-S01d] Node.js Runtime Upgrade · March 23, 2026

### Context
Vite 8 was installed but the build was failing at startup. The environment
was running Node.js `22.11.0`.

### Decision
Used `fnm` to upgrade Node.js from `22.11.0` to `22.12+`.

### Rationale
Vite 8 requires Node.js `22.12+` as a hard minimum — not a recommendation,
an error. The version mismatch was the only thing blocking the build. `fnm`
was chosen over `nvm` because it's faster and supports `.node-version` files
natively, so the correct version can be enforced per-project going forward
rather than just fixed once.

### Trade-offs
Anyone else working on this project needs `fnm` installed. That's a one-time
setup cost and worth documenting in the README.

---

## [P02-S02] CSS Custom Properties Convention · March 23, 2026

### Context
The project had SCSS variables for colours and typography but no runtime token
layer. Any value JavaScript needed — for theming, state, or animation — had to
be hardcoded separately from the SCSS source of truth.

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
relationship obvious and removes any ambiguity when context-switching between
the two.

`:root` lives in `_variables.scss`, imported at the top of the main entry
partial. One place to look, globally scoped, declared before anything tries
to consume it.

### Trade-offs
Two systems means two places to update when a value changes — the SCSS variable
and the custom property. That's the cost of having a runtime token layer.
The alternative is JavaScript reading computed styles off DOM elements to get
SCSS values, which is messier and more fragile than just maintaining the mirror.

---

## [P02-S03] Typography Token Map & Mixin Integration · March 23, 2026

### Context
`_typography.scss` had grown into a flat list of individual SCSS variables with
no structural boundary. Every system-tier element individually declared
`font-family`, `font-weight`, and a static `font-size` token — the same three
lines repeated across every component.

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
The `fluid-type()` min/max values are approximations for now, mapped from the
original `$fs-*` token names. They need to be validated against actual rendered
output before the component partials get audited. If the rendered sizes are
wrong, this is where to look first.

---

## [P02-S04] Spacing, Motion & Z-Index Token Maps · March 23, 2026

### Context
Layout values, animation timings, and stacking orders were all hardcoded across
component partials and GSAP calls. No shared vocabulary, no central reference —
the same interaction had slightly different timing depending on who wrote it.

### Decision
Added three token maps to `_variables.scss`: spacing with semantic aliases,
motion covering duration and easing, and z-index covering all stacking contexts.

### Rationale
The raw spacing scale (`$space-1` through `$space-12`) stays — it's the
foundation. The semantic aliases (`$space-section-gap`, `$space-component-pad`,
`$space-element-gap`, `$space-page-margin`, `$space-inline-gap`) sit on top so
call sites say what they're doing, not just what number they picked.

Motion tokens exist because hardcoded duration and easing values drift. One
place to change the rhythm means one place to tune it when the motion direction
changes in Phase 03.

Z-index magic numbers are how stacking bugs happen. Named contexts make the
intended order explicit and auditable. `$z-cursor` should always beat `$z-nav`
— now that's written down instead of assumed.

These are variables, not mixins. There's no logic to abstract — just values.
The one exception is `section-pad`, which already exists as a mixin because it
bundles two axes and a breakpoint, which is worth abstracting.

### Trade-offs
Semantic aliases are a second layer on top of the numeric scale — if a designer
changes the section gap, you update the alias, not the scale. That indirection
is the point, but it means understanding both layers to debug layout issues.

---

## [P02-S05] Abstracts Barrel Fix · March 23, 2026

### Context
`abstracts/_index.scss` existed as a scaffolded placeholder but was never
populated. Every partial in the project was compensating by reaching directly
into `abstracts/variables` and `abstracts/mixins` via its own `@use` path.
The barrel was invisible dead weight — no errors, so the gap went unnoticed.

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

### Trade-offs
None. This is a pure structural fix — behaviour is identical, the dependency
graph is just honest now.

---

## [P02-S06] TypeScript Motion Token Mirror · March 23, 2026

### Context
SCSS motion tokens existed in `_variables.scss` but GSAP runs in JavaScript —
it has no access to Sass variables at runtime. Animation calls across the legacy
codebase were using hardcoded strings (`'power3.out'`) and numbers (`0.8`)
directly, with no shared reference.

### Decision
Created a `tokens.ts` file exporting a `TOKENS` object with `as const`,
covering GSAP easing strings and duration values. Delay stagger multipliers
excluded.

### Rationale
SCSS variables don't exist at runtime. By the time the browser runs the JS,
Sass is long gone — it compiled and left. GSAP runs in JavaScript, so it
needs the values in JavaScript. The TS file is the motion token system's
runtime copy, the same way CSS custom properties are the runtime copy of
SCSS variables.

`as const` was used instead of an explicit interface because without it
TypeScript widens every value — `'power3.out'` becomes `string`, `0.8`
becomes `number`. That means the compiler can't catch a typo in an easing
name or a wrong duration key. An explicit interface would actively widen
the types back, which is worse than nothing. If the type is needed elsewhere
it can be derived cleanly: `type MotionTokens = typeof TOKENS`.

Delays were left out because the delays in the legacy code aren't fixed
values — they're stagger multipliers computed at runtime: `i * 0.07`,
`i * 0.05`. Freezing those in a constants file would mean locking an
arbitrary number that only makes sense as part of a formula. The stagger
factor belongs at the call site.

### Trade-offs
The TS token file and the SCSS motion tokens are now two separate sources
that need to stay in sync manually. There's no build-time check that
`TOKENS.duration.base` in TypeScript matches `$duration-base` in SCSS.
That's an acceptable cost for now — both live close together and the
values are unlikely to change frequently.

---

