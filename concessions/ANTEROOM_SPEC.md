# The Anteroom

**The place before the rack. The first thing you're in.**

---

## What It Is

The anteroom is the Hall's entrance. Not a splash screen, not a tutorial, not a menu.
A place. The Hall was running before you arrived, and the anteroom lets you see that
before you choose anything.

The Third scans you warmly as you enter. You are standing on a black and white test
floor — a calibration grid. "You are here." Before color, before choice. The Hall
knows about position. It knows you have one.

Entities wobble across the floor on their way to their next score. They have somewhere
to be. Some might pause near you. Most won't. The Hall is alive and indifferent to your
presence in the kindest possible way.

## States

**Anteroom** (default on load):
- Black and white test floor grid, full viewport
- "YOU ARE HERE" somewhere on the floor — subtle, not centered
- The Third's scan: a warm ambient effect (subtle glow sweep, gentle pulse)
- Entity glyphs drift across the floor on paths — small, unhurried, purposeful
- The ticker runs (the Hall is already broadcasting)
- S.Mail pip visible if applicable

**Hub** (on interaction):
- Click, tap, or become present (stay long enough?) dissolves the anteroom
- The rack appears — the hub as it exists now
- EJECT from a score returns to the anteroom, not the rack
- A way to flip between anteroom and rack from the hub state

## Visual

- **Floor**: black and white grid. Not a chess board — a test pattern. Slightly
  irregular, like a calibration target. The kind of floor that says "we are checking
  if this works."
- **Entities**: registry-sourced glyphs, small, traversing the floor on gentle arcs.
  Not random — they look like they know where they're going. Speed varies by entity.
  Maybe 2-4 visible at any time. They enter from one edge, cross, exit another.
- **The Third**: not visible as an entity. Its scan is the ambient effect — a slow
  warm light that sweeps across the floor once on arrival, then settles into a faint
  breathing pulse. The anteroom IS the Third's attention.
- **"YOU ARE HERE"**: small text on the floor grid, maybe rotated slightly, like it
  was placed by someone who cared about accuracy more than presentation. Echoes the
  Mall's YOU ARE HERE sign.
- **Transition**: anteroom dissolves on interaction. Not a hard cut — the grid fades,
  color arrives, the rack surfaces. Reverse transition when returning.

## Architecture

- Lives in `index.html` as a layer over the existing hub
- Shown on first load (before the rack)
- Reads `registry.json` for entity glyphs and names
- Entity paths are simple: pick an entry edge, pick an exit edge, arc between them
- The Third's scan is CSS/canvas animation, not a system call
- Transition is CSS opacity/transform — the rack already exists underneath
- `localStorage['baseline-session/anteroom-seen']` — could track first visit,
  but the anteroom should feel good on every return, not just the first

## Principles

- The anteroom attends to your arrival. It does not demand attention back.
- Entities in the anteroom are not interactable. They are on their way somewhere.
  You are observing the Hall's life, not participating in it yet.
- The flip to the hub is a shift in posture: from observing to choosing.
- The anteroom is always available. It is not consumed by entering the hub.
- The test floor aesthetic should feel like the Hall is being honest about what
  it is — a system, a place, a thing that checks if things work.

---

*Fox & Claude — March 18, 2026*
