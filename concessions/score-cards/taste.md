# Taste
**Location:** `scores/taste/` | **Status:** Active
**Neighborhood:** None | **Stack:** Vanilla JS (~3,000 lines)

## Current State
Grocery shopping discernment score. Browse bins of produce, use tools to evaluate quality, fill your wife's list. Ghost List entity haunts the margins with smudged impossible entries. Magazine system (The Citrus Issue) with interactive panels, unlocks, and scribbles. Trophy shelf with gem rarity. Only score that sends `hub:listen` instead of `hub:minimize`.

## What's Built
- Lamp phase: trophy shelf, wife's list delivery, ghost hint, "Go Shopping" button
- Magazine system: multi-spread reader with cover, prose, drop caps, interactive panels, unlock mechanics, scribbles, rack with spine selector, toast notifications, done-reading flow
- The Citrus Issue (7 spreads, ~10 panels) — fully authored
- Store selection with multiple store cards
- Shopping phase: bin-based produce browsing (citrus types), drag-and-drop to list slots
- Quality badge system (firmness, freshness, juiciness, color)
- 3 tools: Fruitrampoline (bounce), Gentle Calipers (squeeze), Blade (slice with canvas viz)
- Ghost List: seeded ghost entity, smudged text, arrival delay, weather system, impossible entries, drift accumulation across runs
- Wife's list generation with preferences and weights
- Critic system: positioned voice remarks tied to tools, zones, allocation
- Going Home phase: wife examines items, substitution detection, satisfaction scoring (rolling average)
- Trophy generation with gem rarity, color aging, shelf rendering
- Full persistence via localStorage
- Seeded RNG per store/run

## What's Next
- Only 1 magazine issue exists (The Citrus Issue) — last spread teases "Next issue... potatoes"
- Unlock effects reference types (variety, technique, store_note, fad_watch) — how these modify gameplay could be expanded
- No hub pulse listening

## Specs & References
- `concessions/Taste_Magazine_Handoff_v0.1.docx` — magazine implementation guide
- `concessions/archive/Taste_Design_Handoff_v0.1.docx` — score implementation guide

## Hub Integration
- **Sends:** `hub:listen` (on load — unique), `hub:color` (140, 170, 60), `hub:minimize` (on entering shopping), `hub:scraggle` (blade use, trophy award)
- **Receives:** None
- **localStorage:** `baseline-session/taste` (full save state)
- **Scraggle emissions:** Knife emoji on blade slice, item emoji on trophy award
