# Shoot the Moon
**Location:** `scores/shoot-the-moon/` | **Status:** Active
**Neighborhood:** None | **Stack:** Vanilla JS, canvas-based (~2,380 lines)

## Current State
The correct move is visible from the start. Everything else is talking yourself out of it. Rocket-to-moon physics game with tinkering, vendor gadgets, lunch system, and two rivals. Accepts FPL context gracefully.

## What's Built
- 5-axis physics model (thrust, wobble, confidence, magnetism, drag)
- 30 label definitions with stat mods (20 universal + 10 phased: launch/early/mid/late)
- Phase-aware physics: labels active only during time windows
- Card draw system (3 cards, jitter on stats, shuffle, fold animation)
- Vendor character (pixel art, 80x48) with expressions, speech bubbles, gadget offers, walk
- 8 vendor gadgets (lunar tether, gyroscope, mystery fuel, etc.)
- Lunch system: 5 dishes + 5 drinks → meal gadget applied to rocket
- 2 rivals (Pell, Corvus) with cut-in introductions, label copying/synthesis, sneer vocabulary
- Pristine shot (tutorial), stall animation, tinkering phase, countdown pre-launch
- Flight simulation with gravity, thrust, wobble, confidence, magnetism, drag
- Multi-rocket launch with staggered delays and collision physics
- Trail rendering with phase-shift highlights
- Moon breathing, glow, lean, nervous oscillation, bandage on hit
- Star field, particle system (exhaust, sparks, flash), camera zoom/pan, screen shake
- Vendor comment reactions (axis-specific and escalating)

## What's Next
- No persistence — everything resets completely on outcome click
- Binary outcome (hit/miss) with no scoring, distance, or progression between rounds
- Legacy label panel hidden but not removed (`closeLabelPanel()` still exists)
- `S.lunch.tipAlpha` defined but never modified or rendered
- No Scraggle emissions, no localStorage, no hub pulse listening

## Specs & References
- `concessions/archive/shoot-the-moon-spec.md` — full design spec

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (140, 160, 180)
- **Receives:** None
- **localStorage:** None
- **Scraggle emissions:** None
