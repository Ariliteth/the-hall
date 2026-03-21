# LODE
**Location:** `scores/lode/` | **Status:** Active
**Neighborhood:** None | **Stack:** Vanilla JS, canvas-based (~2,760 lines)

## Current State
Dice-ascending empire builder. You are the Big Bad. Choose an emblem from three concentric rotating rings, declare a heading, stomp to fill die faces, evolve through the die taxonomy (d4 → d20). Companions are shed skins that fly in V-formation. Star field, emoji periphery wildlife, trajectory lookahead.

## What's Built
- 6-tier die taxonomy (d4 through d20) with evolution bursts
- Ring selection system (3 concentric spinning rings, 12-o'clock capture)
- Emblem system: first stomp sets identity emoji + HSL color palette
- Declaration system: 3 heading words (TOWARD/BEYOND/WITHIN) with economic models
- Stomp mechanic with 3-phase animation (lunge, grip, return)
- Die face filling with emblem recognition (auto-claim, improvement rings)
- Companion fleet: pairs spawn on tier evolution, V-formation, conviction-based positioning
- Companion personality: preferred face, accent HSL, conviction, stomp direction tracking
- Cascade spawning, fleet compression, veteran/seasoned distinction
- Companion idle life: tier-gap drift, conviction modulation, weaving rhythms
- Trajectory lookahead with ghost emoji lanes (depth scales with tier)
- Companion pings (scanning for novelty), forgotten face fill
- Star field (3 parallax layers, velocity-based streaking)
- Emoji periphery wildlife: 3 temperaments (curious/shy/drifter), fleet awareness
- Stomp ripple through fleet (delay wavefront, conviction-scaled intensity)
- Production math: base + improvement + declaration bonus + fleet echo multiplier
- Mushroom passive (bonus for empty slots)
- Constellation view: face nodes + edges, traveling pulses, production values, companion satellites
- Evolution burst: beat/surge/peak/spawn with particles, rings, flash, screen shake
- HUD: spoil counts + total production

## What's Next
- Ascending phase (post-d20) is empty — `case 'ascending':` has comment "could add celebration later"
- Only 1 emoji passive defined (Mushroom) — `EMOJI_PASSIVES` has room for more
- Commented-out production deltas for challenge phase (infrastructure preserved)
- Build Order: "fleet autonomy, declaration influence, d50/d100 (the quiet)"

## Specs & References
- `concessions/LODE_GDD_v2.md` — active design reference (Die as Taxonomy)
- `concessions/archive/LODE_GDD.md` — original design (superseded by v2)

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (60, 30, 80)
- **Receives:** None
- **localStorage:** None
- **Scraggle emissions:** None
