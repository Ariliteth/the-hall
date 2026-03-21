# Sunset Ridge Mall
**Location:** `scores/sunset-ridge-mall/` | **Status:** Active
**Neighborhood:** None (cross-neighborhood) | **Stack:** Vanilla JS + Three.js CDN

## Current State
First-person 3D grid-based mall crawler. Procedurally generated seeded floors with stores, items, quests, and economy. Food Court floors every 7th level with Kitchendom theming. One-way escalator to new floors. Emergent Exit via car items for world mutation. Most deeply hub-integrated vanilla score — listens for pulses, emits many Scraggles, weaves Hall data into PA announcements.

## What's Built
- Three.js 3D renderer with snap-step movement, glass storefronts, store lighting
- Seeded RNG map generation with stores, corridors, escalators, wall entities
- 8 base + 12 special store palettes + Staff Room palette
- Two-hand inventory, rarity tiers, 6 stat categories (VIBES/BULK/STYLE/LUCK/CLOUT/CHILL)
- ATM (withdraw/craft Mall Dollars), payphone quests, Ship-It stations, trashcan discard
- U-SEEN kiosk (community board showing Hall entities or Mall Regulars)
- Emergent Exit: car items unlock driving to new seeded Mall world
- Food Court floors with Beef'd/Cheesn'ts statues, free samples, Kitchendom poster
- PA announcement system weaving in Hall Scraggles
- Generative muzak (pentatonic pads, bass drone, low-pass filter)
- Sound effects, procedural "You Are Here" map, compass HUD
- Bench sitting with deepening messages, fountain coin toss (+1 LUCK)
- Mall Pulse idle listener: restock stores, ambient events
- Color-routed Scraggle listener
- Personal glow light (color shifts by held item rarity)
- Touch controls (d-pad)

## What's Next
- `mallRespondsToScraggle()` is empty — comments list future ideas: create a store, stock themed items, shift ambient music, name a back room
- Uses legacy `scraggle` postMessage type (not `hub:scraggle`) — could modernize
- Build Order: "Mall ambient audio actions (elevator chime, muzak shift, footsteps)"
- Build Order: "Cross-Score item pipeline (Mall → Field via color-routed Scraggles)"
- World mutation after quest completion exists but Staff Room gating unclear

## Specs & References
- `scores/sunset-ridge-mall/DESIGN.md` — internal comprehensive spec (201 lines)
- `concessions/archive/MALL_WALKER_SPEC.md` — original design spec

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (190, 180, 140), `scraggle` (legacy type — many events), `hub:theme` (Kitchendom poster)
- **Receives:** `hub:pulse` (idle restock/ambience + Scraggle listening)
- **localStorage:** Reads `baseline-session/portraits-queue` (quest giver names, kiosk), `baseline-session/kitchendom-theme`, `baseline-session/scraggles` (PA + routing). Writes `baseline-session/kitchendom-theme`.
- **Scraggle emissions:** Many — quest delivery, crafting, shipping, discarding, kiosk wave, escalator, food court, PA, driving, poster, rare finds, restock, idle ambience
