# The Tending Field
**Location:** `scores/tending-field/` | **Status:** Active
**Neighborhood:** Greengarden | **Stack:** Vanilla JS, canvas-based (~2,000 lines)

## Current State
Underwater twilight farming field with a named item economy. 5x4 tile grid. Plants produce atmospheric emoji snow. Entities placed as workers produce named items from adjacency context on caravan arrival. Traders arrive with preferences, memory, and rhythm — responding to what the Field has grown rather than checking a shopping list. Kiwi system builds readiness toward Float the Farm consensus.

## What's Built
- 5 aquatic plant types with emoji production, spawn rates, affinities, output words (Frond, Glass, Bloom, Ember, Thread)
- Entity integration from Hall registry via GitHub API
- **Named item economy:** workers produce items composed from adjacent plants/entities
  - Item names: `[age] [adjective] [worker] [output word]` — long worker names omit age/adjective
  - Chimeric outputs blend output words when exposed to multiple plant types over time
  - Tile age tracking (Seasoned/Aged/Deep-Season) and tile exposure memory
- **Crafting personality:** each entity selects influences differently (explorer, curator, bold, listener, patient, shaker) based on their tags
- **Atmospheric particles:** emoji snow is visual weather, not currency
- **7 traders with preferences:** dream text, tag leanings, plant affinity, memory style (detail/impressionistic/forgetful)
- **Trader rhythm:** weighted random selection (frequent/moderate/rare/distant) with delight-based drift
- **Trader memory:** per-trader persistence of received items, impressions, rhythm drift (survives Float)
- **Item scoring:** 0-10 based on plant affinity, tag overlap, age, chimeric bonus, memory influence
- **Trade consequence gradient:** relic life/size/behavior varies by match score (delighted → long-lived orbit/spiral; tepid → gentle drift gift)
- **Strange Visitor as Third herald:** scores by adjacency richness + reads Temperature of the Room from localStorage
- **Trader-voiced empty harvest:** each trader has a unique idle line when the Field produces nothing
- **Emoji provenance:** trade modal shows influence chains as emoji (compact, visual)
- Caravan timer (90s cycles), relic system with proximity effects, kiwi system, Float the Farm consensus
- **Tap-and-drag movement:** pointer-event drag for plants and entities with swap-on-drop, ghost at origin, lifted emoji at cursor, drop-target highlight. Taps still open placement modal.
- **Trader gifts:** trades scoring >= 4 leave the trader's emoji as a placeable `gift` tile on the nearest empty slot. Gift leanings blend into adjacent workers' item production (adjacency tags + influence emoji provenance). Rendered smaller (17px) with amber tint ring. Persist across reloads. Draggable and clearable like any tile.
- Adjacency bonuses, background canvas with sparkles and shadow entity, ticker, full localStorage persistence

## What's Next
- **Color canvas visualization** — relationship/influence visualization via color
- **Hub pulse listener** — respond to heartbeat
- **Cross-score item reception** — receive items from other scores as relics
- **Mycorrhizal Layer integration**

## Specs & References
- Workin' Integration Spec: `concessions/tending-field-workin-spec.md`
- Memory file: `tending-field.md` in Claude memory

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (30, 90, 110), `hub:scraggle` (relic drift, float, first harvest, trader approach, trade completion with reaction)
- **Receives:** None (reads Temperature from `baseline-session/the-third` via localStorage)
- **localStorage:** Reads/writes `tending-field/*` keys (field, progress, caravanCount, kiwis, floatAsked, floatCount, tileAge, tileExposure, traders)
