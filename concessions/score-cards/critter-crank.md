# Critter Crank
**Location:** `scores/critter-crank/` | **Status:** Active
**Neighborhood:** All | **Stack:** Vanilla JS (~3,860 lines)

## Current State
Procedural creature generator. Turn the handle, something arrives. Shaped by world and entity context. Receives CrankSeed context from EFDP/Chunxly via localStorage. Portrait returns to Grimoire automatically. Ported from React to vanilla JS — one file, no dependencies. **Chunxly-direct mode:** when a Chunxly PNG seed arrives with color clusters, builds a custom palette from the creature's actual colors and generates rolls that trust the seed completely — no world palette blending, no voice shapes, no recipe randomization. Produces anchor shapes that carry the creature's visual identity.

## What's Built
- Recipe-based generation (creature, spirit, flora, item, terrain, relic)
- World system: 7 worlds (City, Jungle, Space, Deep, Ruin, Forge, Kitchendom) with palette pools, shape hints, recipe pools, cohesion biases
- D-pad navigation (4 worlds), style/voice system (~60% world-fitting distribution)
- Frame animation with poses (idle, run, jump, land, attack), ping-pong and loop modes
- Density dial (sparse to busy)
- Encounter stats, world inventory (5 categories)
- Crank catch mechanic with animated handle rotation
- Collection system with detail view, editable descriptions, release
- Packet system (sealed encounters)
- Squatter system (creatures that "move in" via delayed/noted modes)
- Entity export, portrait export (96x96 PNG to portraits-queue)
- CrankSeed integration from EFDP/Chunxly
- **Chunxly-direct mode:** `generateChunxlyRoll()` bypasses normal blending; builds `PALETTES["_chunxly"]` from seed's top 3 color clusters (dominant→main/dark, second→accent, third→mid); status bar shows "CANVAS · DIRECT"
- **Stall tag shape hints:** TAG_SHAPE_MAP extended with 14 Stall-vocabulary entries (bold, focused, vivid, etc.); `generateRoll()` and `generateChunxlyRoll()` both read `stallTags`
- **Entity identity from Chunxly:** reads slug + entityName from CrankSeed, enabling portrait export for PNG-sourced creatures
- Kitchendom world with 5 affinity palettes (umamian, salterran, sourvren, bitterish, sweetese)
- CRT bezel aesthetic with scanlines

## What's Next
- `playPose()` comment references "future battle system" — poses are wired to catch/click but no battle mode exists
- Shoulder buttons (`S.shoulderL`, `S.shoulderR`) initialized to null, partially surfaced
- Compound world keys generated from biome tags but downstream consumption unclear
- Grimoire reception of caught Chunxly-direct creatures (portrait queue → entity page)
- Context label refinement (how long DIRECT/CANVAS labels persist, dismissal)

## Specs & References
- `concessions/archive/CRANK_ENCOUNTER_ARC.md` — encounter arc design
- `concessions/archive/CRANK_UI_REVAMP.md` — GBA-era UI (known pinch bug on D-pad press)
- `concessions/archive/CRITTER_CRANK_HANDOFF.md` — implementation guide
- `concessions/archive/MAZE_TO_CRANK_HANDOFF.md` — CrankSeed format spec

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (70, 180, 90)
- **Receives:** None
- **localStorage:** Writes `critter-collection-v2`, `critter-packets-v1`, `critter-pending-squatters`, `baseline-session/scraggles`, `baseline-session/portraits-queue`. Reads `baseline-session/crank-seed`, `crank-glyph-source`.
- **Scraggle emissions:** Direct localStorage write — sparkle on catch, door on squatter move-in
