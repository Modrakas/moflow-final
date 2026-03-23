# MoFlow Lab — DEVLOG.md

Personal journal. The human side of this project — the energy, the doubt,
the small wins, the hard days. Written alongside DECISIONS.md, which tracks
the technical choices. This one tracks everything else.

---

## March 23, 2026 — Entry 1

Phase 2 is almost complete. On paper that looks clean. In reality I worked
three 12.5 hour shifts back to back in the NICU, had one day to recoup, and sat down this morning to write
TypeScript token maps.

The energy problem is real. It's not laziness — it's that by the time I get
home my brain has been making high-stakes decisions for three days straight.
Coding after that takes a different kind of effort than it would for someone
who just rolled out of bed-after a relaxing weekend and opened their laptop. I'm doing both, and some
days that feels impossible and other days it feels like the point.

The tech transition is harder than I expected. I learned HTML, CSS, SCSS, JS, GSAP,
Gulp — I was comfortable there. Vite and TypeScript are a different vocabulary.
Not just new tools, but a different way of thinking about the build. The module
system, the type system, the fact that errors now show up at compile time
instead of silently in the browser at 2am — it's genuinely better, but getting
there has been disorienting. Comfortable and competent are not the same thing
and right now I'm somewhere in between.

The residency format is the other thing I'm adjusting to. Writing DECISIONS.md,
committing with structured messages, treating this like a professional project
instead of a personal one — that discipline is new. It mirrors what working in
a real team would look like and that's exactly why I'm doing it. But it adds
weight. It's not just building something anymore, it's building something
*accountably*.

Three things I'm holding onto right now:
- The DECISIONS.md is honest. That matters.
- The fact that this is hard is the proof it's worth doing.
- I already know how to do hard things. I do them three shifts at a time.

---

## March 23, 2026 — Entry 2
 
I was hitting a wall. Not a technical wall — just the low-grade mental fatigue
that sets in when you've been staring at tokens and abstracts for hours. I stopped and ate
some dolmas.
 
That helped more than I expected. Came back with enough clarity to actually
look at the project roadmap properly, and when I did I noticed something — the
order was wrong. I already had legacy style files sitting there: `_reset.scss`
and `_globals.scss`. The original Phase 3 plan would have had me writing motion
and interaction code on top of a visual layer that hadn't been wired up yet.
That didn't make sense.
 
So I inserted a Phase 2.5. Not a detour — a correction. Get the base styles
grounded before building anything that moves.
 
I wrote the globals file. Wired up the color tokens. And then I opened the
browser and the colors were actually there. Deep Madder background, Cream text. 
The palette I'd been staring at as hex values in a variables file was suddenly 
sitting on the screen looking exactly like I'd imagined it.
 
I know that probably sounds small. It's not. Up until that moment this project
has been entirely invisible — config files, token maps, barrel fixes, things
that are real and necessary but produce nothing you can point to. Seeing the
colors appear was the first proof that any of it is actually connected. The
DNA layer isn't abstract anymore. It rendered.
 
That's what I needed today. Not a breakthrough. Just evidence.