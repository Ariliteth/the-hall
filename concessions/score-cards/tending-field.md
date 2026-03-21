# The Tending Field
**Location:** `scores/tending-field/` | **Status:** In Development
**Neighborhood:** Greengarden | **Stack:** Vanilla JS, canvas-based (~1,470 lines)

## Current State
Underwater twilight farming field. 5x4 tile grid. Plants produce emoji snow that drifts around tiles. Entities from the Hall registry can be placed as residents. Caravan traders arrive on 90-second cycles. Relics from trades drift freely with organic physics. Kiwi system builds readiness toward Float the Farm consensus.

## What's Built
- 5 aquatic plant types with emoji production, spawn rates, affinities
- Entity integration from Hall registry via GitHub API
- Particle system: emoji particles spawn, drift, get swept into caravans
- Caravan timer (90s cycles) with trader approach and progress bar
- 7 traders with specific wants + Strange Visitor (wants any 3)
- Trade modal with exchange UI
- Relic system: successful trades spawn drifting emoji relics with proximity interaction
- Kiwi system: hidden readiness per tile, builds through relic proximity + time
- Float the Farm: vote triggers when 62%+ tiles reach threshold after 6+ caravans
- Adjacency bonuses for entity-plant affinity matches
- Background canvas with sparkle stars and periodic crossing shadow entity
- Underwater twilight gradient aesthetic
- Ticker bar with flavor text
- Plant/entity/clear modal per tile
- Full persistence via localStorage
- Resident rendering with organic drift and spring physics

## What's Next
- Build Order: "underwater twilight aesthetic, produce snow, Float the Farm consensus" — these appear implemented
- The Unnamed Third is not yet visible in code (ambient presence described in design doc)
- No hub pulse listener — could respond to heartbeat
- No Scraggle listening — could receive cross-score items as relics (Build Order: "Cross-Score item pipeline Mall → Field")
- Mycorrhizal Layer integration (Build Order: "After that")

## Specs & References
- No dedicated spec in concessions — described in design doc Scores section
- Memory file: `tending-field.md` in Claude memory

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (30, 90, 110), `hub:scraggle` (relic drift, float, first harvest, trader approach, trade completion)
- **Receives:** None
- **localStorage:** Reads/writes `tending-field/*` keys (field, progress, traderIdx, caravanCount, kiwis, floatAsked, floatCount)
- **Scraggle emissions:** Multiple via `hub:scraggle` — harvest, caravan, trade, float
