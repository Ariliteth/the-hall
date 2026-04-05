# Larr.AI Onboarding
**Location:** Anteroom (within `index.html`) | **Status:** Specced, not built
**Neighborhood:** None (hub-level) | **Stack:** Vanilla JS

## Current State
Spec complete. Conversational device onboarding disguised as a chihuahua greeting you at the door. Three beats: ambient render (silent probes), passive presence detection ("Oh! Is someone there?"), and a four-way greeting choice (Hello / THX / I am... / BYE). Produces a capability tier (full/capable/light) and visitor intent signal that seeds Temperature of the Room, Hall Memory, and Score ordering.

## What's Built
- Nothing yet. Build spec: `concessions/LARR_ONBOARDING_SPEC.md`

## What's Next
- Resolve open questions (score-to-tier mapping, anteroom architecture, Larr.AI's script)
- Build when open questions are closed — estimated one session

## Specs & References
- `concessions/LARR_ONBOARDING_SPEC.md` — full build spec
- `concessions/LARR_ONBOARDING_HANDOFF.md` — original handoff note (superseded by spec)
- `concessions/archive/ANTEROOM_SPEC.md` — anteroom architecture (integration point)
- Larr.AI character sheet (external, can be provided)

## Hub Integration
- **Sends:** `hub:color` (initial Temperature seed from four-way choice)
- **Receives:** None
- **localStorage:** `baseline-session/larr-onboarding` (capability object — tier, input mode, intent, viewport, perf, connection, identity)
- **Downstream:** Hub selection panel reads intent for Score ordering nudge. The Third records arrival as first scan.
