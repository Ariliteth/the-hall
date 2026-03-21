# Storeroom
**Location:** `scores/storeroom/` | **Status:** Active
**Neighborhood:** None | **Stack:** Vanilla JS (~1,970 lines)

## Current State
A game about tending things that can't ask clearly. Objects live on shelves and express preferences through interaction cycles — swipe, tap, hold. Tolerance narrows over time. Objects pass through lifecycle states and may depart if consistently misread. Departed objects leave ghosts that speak one honest sentence about their life.

## What's Built
- 3 full object personalities: Brenda (swipe), Flicker (tap), Glen (hold)
- Tolerance narrowing system (rate, acceleration, resistance, floor per object)
- Idle animation with parametric easing (evolves over time), jitter from inconsistency
- Lifecycle: present → developing → particular → departed
- Swipe interaction: speed/direction/changes matching with damping
- Tap interaction: pulse count + gap timing replication
- Hold interaction: duration timing with tilt visual
- Preference proximity scoring
- Perfect detection with cooldown
- Room-wide accuracy (rolling 12-interaction average)
- Strict mode escalation + gimme dots (forgiveness buffer)
- Failure celebration: shelf droop, balloons, confetti
- Departure: going-away party, outline on shelf, ghost visit with composed speech
- Trophy system: periodic arrival, dust accumulation (3 levels), inversion at max dust, tap to acknowledge
- Scraggle emission: departure (amber, weight by longevity), first perfect (gold), trophy arrival (per-trophy color)

## What's Next
- No persistence — all state resets on reload (objects, trophies, outlines, interaction history)
- No mechanism to spawn new objects after departures — once all 3 depart, room is permanently empty
- Cannot receive hub messages (no message event listener)
- No hub pulse listening — could respond to heartbeat for ambient life

## Specs & References
- `concessions/archive/storeroom-design-doc.docx` — full design reference

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (150, 110, 70)
- **Receives:** None
- **localStorage:** Writes directly to `baseline-session/scraggles` (Crank-style, not postMessage)
- **Scraggle emissions:** Direct localStorage write — `🪦` on departure, `✨` on first perfect, trophy emoji on trophy arrival
