# Bao (GENERALS)
**Location:** `scores/bao/` | **Status:** Active
**Neighborhood:** None | **Stack:** Vanilla JS, canvas-based (~2,350 lines)

## Current State
Dispatch strategy game. Five generals with persistent records. Five animal armies with polyomino formation shapes. Core verb: DISPATCH. Draw orders on a canvas map, resolve lane-by-lane battles. Vendetta system carries knowledge across kingdoms. Title and medal system. Advisor (Strategist Wuhen) with mood tracking and plan generation.

## What's Built
- 5 generals with emoji identities, preferred armies, persistent records
- 5 animal armies with polyomino formations (Wolves/Eagles/Bears/Deer/Fish)
- Assignment phase with comfort/denial tracking
- Arrange phase: draw HoI-style order arrows on canvas
- Battle resolution with staggered async lane reveals
- Vendetta system: enemies remember generals/armies, knowledge spreads
- Vendetta ally interrupts during battle
- Title system (5 titles + medal accumulation up to 5 dots)
- Quip/spring-up system with general portraits and voice lines
- Advisor (Strategist Wuhen): plans from enemy knowledge, mood tracking, follow/dismiss consequences
- Comfort/discontent tracking for general-army pairings
- Dispatch system (the 報): scroll overlay, resource commitment, personality-driven reports
- Resource economy (troops/grain/coin), kingdom-fall bonuses
- 2 continents × 3 kingdoms with vendetta carryover
- Canvas board with territory washes, formation rendering

## What's Next
- GAB (voice) system only populated for Glacius (1 of 5 generals) — other 4 generals are silent
- Snow particle system defined but never called (`spawnSnow()` dead code, no `#snow` element)
- After 2 continents, static "The World Falls" modal — no endgame content
- Build Order: "specialist unlock, correspondence front, council scene"

## Specs & References
- No dedicated spec in concessions — described in design doc Scores section

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (160, 130, 70)
- **Receives:** None
- **localStorage:** None
- **Scraggle emissions:** None
