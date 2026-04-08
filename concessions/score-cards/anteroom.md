# Anteroom — One Voice in the Dark

**Location:** `index.html` (anteroom section) | **Status:** Active, attending needed
**Neighborhood:** None (hub-level) | **Stack:** Vanilla JS

## Current State
The anteroom runs. Entities cross the canvas, the Third's scan sweeps and settles, "YOU ARE HERE" is placed correctly, "ENTER" fades in after four seconds. The visual system is intact. The experience does not land for visitors unfamiliar with the Hall — the darkness reads as empty rather than inhabited, and visitors tap through without having felt anything.

## What's Built
- Canvas animation with mood system (flood, gathering, drift, solo)
- Entity walkers: color, glyph, portrait, name presence modes
- The Third's warm scan sweep (2.5s) + breathing grid pulse
- "YOU ARE HERE" floor label (lower-right, rotated)
- "ENTER" ghost button (appears at 4s, click fires anteroomEnter)
- anteroomShow() for return visits with fresh mood

## What's Next
- **One line of text on the canvas.** The anteroom speaks once per visit, quietly, before ENTER appears. The line: `something is already here`. Renders on canvas (not DOM), fades in at ~3.2s, holds ~1s, fades out. ENTER timer shifts from 4000ms to 5800ms so it arrives into the silence left by the line. anteroomShow() resets line state so it speaks on return visits too.
- Full spec: `concessions/ANTEROOM_VOICE_SPEC.md`

## Specs & References
- `concessions/ANTEROOM_VOICE_SPEC.md` — build spec for this change
- `concessions/archive/ANTEROOM_SPEC.md` — original anteroom architecture

## Hub Integration
- **Sends:** Nothing
- **Receives:** Nothing
- **localStorage:** None
- **Scope:** Self-contained within index.html anteroom functions
