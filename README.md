# ◈ MoFlow Lab — R&D Index

> Architectural Noir. Technical Precision.

>A self-directed high-fidelity R&D index built as a Technical Residency project. No UI frameworks. No shortcuts. Raw precision. Every experiment is a deliberate stress-test — a constraint set, a performance target, and a rule against abstraction until it's earned.

---

## Visual Identity & Aesthetic

MoFlow Lab is not a portfolio. It is an R&D archive. Every visual decision is a functional one — the palette, type hierarchy, and texture are designed to read like a living process monitor, not a designed website.

| Property | Value                                      
|–––|–––|
| Vibe | Architectural Noir — Brutalist Precision   
| Palette | Deep Madder · Burnt Orange · Parchment     
| Typography | Syne ExtraBold (9:1) + JetBrains Mono      
| Motion | GSAP + ScrollTrigger + Lenis               
| Philosophy | Stress-Test — no CDNs, no frameworks       

---

## Stack

| Tool | Version | Role                        
|–––|–––|–––|
| Vite          | ^8.0.0    | Build tool & dev server     
| TypeScript    | ~5.9.3    | Type-safe logic layer       
| SCSS (7-1)    | ^1.98.0   | Architecture-grade styling  
| GSAP          | ^3.14.2   | Motion & ScrollTrigger      
| Lenis         | ^1.3.18   | Smooth scroll engine        

---

## Project Structure
```
src/
├── data/          # Typed project data (ProjectEntry interface)
├── modules/       # Feature modules (no framework — raw TS classes)
├── styles/        # 7-1 SCSS architecture
│   ├── abstracts/ # Tokens: variables, mixins
│   ├── base/      # Reset, globals, typography, animations
│   ├── components/# One partial per UI component
│   ├── layout/    # Grid, containers, regions
│   ├── pages/     # Page-specific overrides
│   ├── themes/    # Dark/light variants (future)
│   └── utilities/ # Helper classes
└── main.ts        # Entry point — App class boot sequence
```

---

## Getting Started
```bash
npm install
npm run dev       # Dev server at localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

---

## Migration History

This project was migrated from a Vanilla JS + Gulp + Webpack build.
See `DECISIONS.md` for the full audit trail of every architectural change.

| Previous Stack | Replacement | Reason |
|–––|–––|–––|
| Gulp + Webpack | Vite | Single tool, faster HMR |
| Babel | Vite / esbuild | Native ESNext — no transpile |
| CDN GSAP | npm gsap | Tree-shaking, version lock |
| CDN Lenis | npm lenis | Same + removes LenisLite.js |
| LenisLite.js | Retired | Superseded by npm lenis |
| Vanilla JS | TypeScript strict | Catches bugs at compile time |

---

## Phase Progress

- [x] Phase 01 — Foundation: Environment & Identity
- [x] Phase 02 — DNA: Brand System & Design Tokens
- [ ] Phase 03 — Instrumentation: Motion & Scroll Engine
- [ ] Phase 04 — Artifacts: Index Architecture & Data Layer
- [ ] Phase 05 — Deployment: Stress-Test & Ship

---

### The Palette — Ember & Earth

The colour system is built around thermal contrast: deep madder backgrounds absorb light; burnt orange signals cut through it; parchment text sits high-contrast without the clinical coldness of pure white.

| Token | Hex | Role |
|–––|–––|–––|
| `$color-bg` | `#2C0E0E` | **Deep Madder** — page background. Warm-dark; absorbs aggressive typography without visual noise. |
| `$color-bg-elevated` | `#3D1414` | Raised surface for hover states and cards. |
| `$color-bg-surface` | `#4D1C1C` | Highest surface level — tooltips, active states. |
| `$color-accent` | `#FF7043` | **Burnt Orange** — primary signal. CTAs, cursor dot, highlight on hover. Hot against the madder field. |
| `$color-text` | `#F4EBD0` | **Parchment** — primary body text. Warm-white; avoids the sterile brightness of `#ffffff` on a red field. |
| `$color-text-muted` | `#9E8A6E` | Mid-tone ochre for metadata, labels, and secondary text. |
| `$color-text-dim` | `#5C4A38` | Near-invisible warm brown — index numbers, dividers, ghost text. |
| `$color-accent` | `#FF7043` | Burnt Orange (CTAs, highlights, cursor). |
| `$color-accent-dim` | `rgba(244, 122, 67, 0.12)` | Accent wash for backgrounds |
| `$color-border` | `rgba(244, 235, 208, 0.08)` | Parchment at low opacity — hairline dividers. |
| `$color-border-hover` | `rgba(244, 235, 208, 0.2)` | Parchment at mid opacity — hairline dividers. |

#### Signal Colours — Experiment Palette

Each experiment in the R&D Index has a unique signal colour drawn from a five-stop accent palette. These are the only hues allowed beyond Ember & Earth.

| Token | Hex | Name | Experiment |
|–––|–––|–––|–––|
| `$color-signal-01` | `#ff3c00` | Burnt Orange | EXP-01 |
| `$color-signal-02` | `#dfff00` | Acid Lime | EXP-02 |
| `$color-signal-03` | `#26C6DA` | Steel Teal | EXP-03 |
| `$color-signal-04` | `#EC407A` | Electric Rose | EXP-04 |
| `$color-signal-05` | `#FFA726` | Amber Gold | EXP-05 |

---

### Typography Hierarchy

Two typefaces, two jobs. They never compete — they are calibrated to create maximum contrast between information tiers.

#### Impact Layer — Syne ExtraBold (800)

Used for: Hero headline, section titles (`R&D Index`, `Craft without compromise.`), project titles.

Syne at `font-weight: 800` is aggressive at large sizes — the tight letter-spacing (`-0.04em`) and `line-height: 0.9` create the stacked-headline density that makes the hero section read as architectural rather than decorative. At small sizes it would look wrong. It is never used below `2rem`.

```
clamp(3rem, 12vw, 7.5rem)   — hero headline
clamp(2rem, 5vw, 4rem)      — project titles (uppercase, -0.03em)
clamp(48px, fluid, 96px)    — section titles
```

#### Data Layer — JetBrains Mono Light (300)

Used for: All lab metadata, index numbers, stack badges, nav links, marquee ticker, section labels, counter, status text, footer copy.

The deliberate design decision is to keep system text *small* — `0.625rem` to `0.85rem`. The tiny mono against the massive Syne creates the `editorial brutalism` contrast that defines the aesthetic. Increasing the mono size to match body text would destroy the hierarchy.

```
0.75rem   — labels, nav, counter, footer  (12px)
0.6875rem — index numbers, stat labels    (11px)
0.625rem  — category tags                 (10px)
0.5625rem — stack badges                  (9px)  ← smallest readable tier
```

---

### The "Feel" — Editorial Brutalism

The aesthetic target is a research archive that feels *alive*. Three elements produce this:

**Clean grids.** Every section uses a strict grid. The Work section grid (`64px | 1fr | auto`) pins index numbers to a hard left rail, project titles to a fluid centre column, and action links to the far right — at every viewport width. No float, no implicit positioning.

**Aggressive typography.** Syne at 96px headings against 11px mono labels creates a scale ratio of roughly 9:1. This is intentional. The ratio creates the visual tension that makes the page feel designed rather than laid out.

**Living texture.** The procedural Noise-Kernel (`NoiseGenerator.js`) draws a new random noise frame on every animation tick using the Canvas 2D `ImageData` API. Combined with `mix-blend-mode: overlay` in CSS, it composites a grain texture over gradient thumbnails and hover states at the GPU level. There are no image assets — the texture is generated at runtime, making it infinitely variable and viewport-responsive. The `[Noise-Kernel: Active]` badge in the work header is a UI reference to this live process.

---

### The Dynamic Signal System

Each experiment in `data/projects.json` carries a `color` field — a unique hex code that defines its signal colour. This hex is converted at runtime into a per-row CSS custom property, enabling the hover states and badge glows to each emit a distinct colour.

#### How it works

**1. Data definition (`projects.json`)**

```json
{
  "id": "02",
  "color": "#D4E157",
  "gradient": "linear-gradient(135deg, #2C0E0E 0%, #5f6527 50%, #D4E157 100%)"
}
```

**2. Runtime injection (`ProjectReveal.js`)**

On component mount, `ProjectReveal` reads the `data-color` attribute from each `<li class="project">` and sets two CSS custom properties directly on the element:

```js
const r = parseInt(signalColor.slice(1, 3), 16);
const g = parseInt(signalColor.slice(3, 5), 16);
const b = parseInt(signalColor.slice(5, 7), 16);
project.style.setProperty('--project-signal-rgb', `${r}, ${g}, ${b}`);
project.style.setProperty('--project-signal',     `rgba(${r}, ${g}, ${b}, 0.10)`);
```

`--project-signal-rgb` stores only the triplet — no alpha. This is intentional: CSS can then compose any opacity level at the point of use, rather than being locked into a single value set by JavaScript.

**3. CSS consumption (`_work.scss`)**

The custom properties are consumed in `_work.scss` at three opacity levels, each serving a different visual purpose:

```scss
// Hover wash — the entire row tints to the experiment's colour at 5%
&::before {
  background: rgba(var(--project-signal-rgb), 0.05);
}

// Badge glow — tech stack badges emit the signal colour on row hover
.project:hover .project__stack-badge {
  color:        rgba(var(--project-signal-rgb), 0.9);
  border-color: rgba(var(--project-signal-rgb), 0.5);
  box-shadow:   0 0 10px rgba(var(--project-signal-rgb), 0.2);
}
```

The result: EXP-02 on hover washes the row in Acid Lime at 5% and glows the badges in the same hue. EXP-04 does the same in Electric Rose. No conditional CSS, no class swapping — one mechanism, five identities.

**4. Gradient generation**

The `gradient` value in `projects.json` uses a three-stop formula derived from the signal colour:

```
linear-gradient(135deg, #2C0E0E 0%, [signal at 55% darkened] 50%, [signal] 100%)
```

The mid-stop is the signal colour darkened to 55% to create readable gradient depth. The left anchor is always `#2C0E0E` (Deep Madder) so thumbnails blend seamlessly into the page background at their left edge.

---

### Dynamic Rendering Pipeline

The Work section has no static HTML for experiment rows. Instead:

1. `DataManager` calls `fetch('data/projects.json')` on init.
2. On success, it maps the array through `_template(p)` — a single ES6 template literal that produces the full `<li class="project">` markup including title, objective, tech stack badges, `data-color` attribute, and gradient thumbnail.
3. The result is injected as a single `innerHTML` assignment on `#projectList`, triggering one DOM reflow rather than five.
4. `ScrollTrigger.refresh()` is called immediately after to recalculate scroll positions with the new page height.
5. `ScrollAnimations` and `ProjectReveal` are instantiated only after this sequence completes.

To add or edit an experiment, update `data/projects.json` only — no HTML changes required.

### Procedural Noise-Kernel

`NoiseGenerator` drives the `<canvas class="noise-canvas">` element that sits fixed over the entire viewport. It is activated and deactivated by `ProjectReveal` on project hover.

**How it works:**
- On each animation frame, `ctx.createImageData(width, height)` produces a fresh pixel buffer.
- Every 4th byte (the alpha channel) is set to `40` (~16% opacity); the RGB channels receive `Math.random() * 255 | 0` — pure white noise, no Perlin smoothing.
- `ctx.putImageData()` writes the buffer directly to the canvas.
- `mix-blend-mode: overlay` in `_noise.scss` composites the noise over the page at the GPU level, giving gradients and thumbnails a tactile grain without any image assets.
- `pointer-events: none` is set in `_noise.scss` — the canvas is purely visual and never intercepts clicks or hover events on the project list beneath it.

The `[ Noise-Kernel: Active ]` label in the Work header is a UI reference to this live process. Its CSS animations (`kernelDotPulse` 2.4s + `kernelFlicker` 8s) are timed at `LCM(2.4, 8) = 24s` — within that window, all phase combinations occur, making two deterministic loops read as a live process heartbeat.

---

## SCSS Architecture (7-1 Pattern)

Styles split across three layers, all using `@use` (never `@import`):

**`abstracts/`** — zero CSS output; design tokens and mixins only. All components `@use '../abstracts' as a` via the barrel `_index.scss`. Every token is accessed as `a.$color-accent`, `a.$font-mono`, etc. — never as a global.

**`base/`** — global rules: reset (`cursor: none` on all interactive elements), the two-tier type system, keyframes, scrollbar, GSAP initial hidden states.

**`components/`** — one partial per UI block. `_work.scss` contains the full signal system, row grid, `kernelDotPulse`/`kernelFlicker` keyframes, and `.project__stack-badge` styles injected by `DataManager`.

### `fluid-type` mixin

```scss
@include fluid-type(28px, 96px);
// → font-size: clamp(28px, calc(0.065 * 100vw + -0.375px), 96px)
```

`math.div` strips units before arithmetic — multiplying `px` by `vw` is a type error in Dart Sass. The mixin handles this internally.

---

## Adding a New Experiment

1. Open `data/projects.json`
2. Add a new object following the schema:

```json
{
  "id": "06",
  "slug": "your-experiment-slug",
  "tag": "Category / Type",
  "title": "EXP-06 — Your",
  "titleLine2": "Experiment Title",
  "objective": "What you're testing and the constraints you're working under.",
  "stack": ["Tech A", "Tech B", "Tech C"],
  "color": "#hexcolor",
  "gradient": "linear-gradient(135deg, #2C0E0E 0%, #midstop 50%, #hexcolor 100%)",
  "url": "#"
}
```

3. The `color` field is what powers the `--project-signal-rgb` injection. Choose a colour from the signal palette or define a new one. The mid-stop in `gradient` should be the signal colour darkened to ~55% to maintain gradient depth.

4. Save. No HTML, JS, or SCSS changes required. Reload the dev server.

---

## Page Sections

| Section | Anchor | Description |
|–––|–––|–––|
| Header / Nav | — | Fixed, scroll-state background, TextScramble on nav links |
| Hero | `#hero` | Full-screen Syne headline, mouse parallax, footer bar |
| Marquee | — | Auto-scrolling JetBrains Mono tech ticker |
| Work | `#work` | Data-driven experiment list, signal hover system, mouse-follow preview |
| About | `#about` | R&D identity, animated stat counters, capabilities grid |
| Contact | `#contact` | Direct mailto CTA — `modrak@moflowlab.com` |
| Footer | — | Brand mark, tagline, social links |

---

## Build Process & Logic

---

### Phase 01 — Foundation 

**GSAP NPM Install.** 


### Phase 02 — DNA

**Content separated from markup via `data/projects.json`.** Hardcoding experiments in HTML couples content to structure. The JSON schema decouples them: to add a sixth experiment, edit one JSON object. `DataManager` handles the render — no HTML, no JS, no SCSS changes required.

**Single `innerHTML` assignment, not iterative DOM insertion.** Each DOM insertion triggers a browser reflow. `DataManager._render()` builds the full markup string first by mapping the array through `_template(p)`, then assigns it once. Five experiments = one reflow, not five.

**The boot sequence is a hard-ordered async chain.**

```
1. NoiseGenerator, _initScroll(), CursorManager  — no DOM dependency, run immediately
2. await dataManager.load()                       — injects .project nodes into the DOM
3. ScrollTrigger.refresh()                        — remeasures page height with new nodes
4. ScrollAnimations, ProjectReveal                — depend on .project nodes existing
```

`ScrollTrigger.refresh()` is the critical call. ScrollTrigger measures scroll positions on initialisation. If it runs before the project rows exist, it measures a shorter page and every scroll trigger fires at the wrong depth. The `await` enforces the ordering. This is a functional requirement, not defensive programming.

---

### Phase 03 — Instrumentation

**BEM keeps specificity flat.** Without scoped styles, class names are global. BEM encodes context into the name: `.project__title` cannot collide with `.hero__title`. Every selector stays at `0-1-0` specificity — no nesting escalation, no `!important`, no source-order dependency.

**`fluid-type` uses `math.div` for unit-safe arithmetic.** The mixin produces a `clamp()` declaration that scales font size linearly between two viewport widths. The unit-stripping step is required because multiplying a `px` value by `vw` is a type error in Dart Sass. `math.div` produces a unitless scalar first; the arithmetic then resolves correctly.

**GSAP hidden states defined in CSS, not JS.** If JavaScript set `opacity: 0` on elements, there would be a flash of visible content between `DOMContentLoaded` and when GSAP executes. CSS is parsed before JavaScript — elements are invisible from the first paint. GSAP only animates *to* the final state; it never sets the starting state.

**The signal system uses CSS custom properties, not class swapping.** Each `.project` row gets `--project-signal-rgb` set inline by `ProjectReveal.js` at mount. `_work.scss` consumes this triplet at three opacity levels: `0.05` for the hover wash, `0.5` for badge borders, `0.9` for badge text. Changing the opacity of a signal colour in CSS costs zero JavaScript — the triplet stays constant, the alpha changes at the point of use.

---

### Phase 04 — Artifacts

**The cursor uses a RAF loop, not CSS transitions.** CSS transitions interpolate between two fixed states with a preset easing curve. A lerp is continuous: each frame the ring moves a fixed percentage closer to the cursor, so lag is proportional to distance. Fast cursor movement = long lag; slow movement = ring nearly catches up. CSS has no concept of the previous frame's position — this effect cannot be replicated with `transition`.

```js
// CursorManager — ring lerp at 12% per frame (~8-frame lag at 60fps)
this.ringX += (this.mouseX - this.ringX) * 0.12;
this.ringY += (this.mouseY - this.ringY) * 0.12;
```

**`ScrollTrigger.defaults({ scroller })` is required with LenisLite.** LenisLite moves all body content into a fixed `div` and scrolls that element instead of `window`. `window.scrollY` stays at `0` permanently. Without pointing ScrollTrigger at the correct scroller, every trigger fires on page load. Set once in `_initScroll()` immediately after LenisLite initialises.

**The Noise-Kernel uses `| 0` for bitwise floor.** `Math.random() * 255 | 0` strips fractional bits in a single CPU instruction — faster than `Math.floor()`. In a loop over a full-viewport `ImageData` buffer (2M+ iterations per frame at 1080p), this compounds. `mix-blend-mode: overlay` composites the noise at the GPU level — no JavaScript is involved in the visual blend.

**Two animation durations prevent perceived looping.** The noise-kernel dot pulses on a `2.4s` cycle; the label text flickers on an `8s` cycle. They re-synchronise every `LCM(2.4, 8) = 24s`. Within that window, all phase combinations occur — making two deterministic CSS animations read as a live process, not a designed loop.

**ProjectReveal's RAF loop runs continuously, even when hidden.** Stopping and restarting RAF on every `mouseenter`/`mouseleave` introduces a one-frame freeze at re-entry. Keeping the loop always running but gating style updates on `this.isVisible` costs one conditional per frame and guarantees smooth entry on every hover.

**`ProjectReveal` teleports the lerp origin on `mouseenter`.** When the follow card first appears, `this.imgX` and `this.imgY` are set to the current mouse position before the lerp starts. Without this, the card slides in from wherever it was last positioned on screen — a visible jump at high cursor speeds.

---

### Phase 05 — Deployment

---

## Browser Support

Targets modern evergreen browsers. Custom cursor, `mix-blend-mode`, `mask-image`, and `pointer-events: none` on the noise canvas are desktop-only by design — the custom cursor is hidden and noise canvas disabled on touch devices. Babel transpiles ES6 modules to ES5 for the production bundle.

---

## License

◈ R&D v1.0 — Experiments ongoing.