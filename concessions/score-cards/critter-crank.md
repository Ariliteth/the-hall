# Critter Crank
**Location:** `scores/critter-crank/` | **Status:** Active
**Neighborhood:** All | **Stack:** Vanilla JS (5 files, ~4,365 lines total)

## Current State
Procedural creature generator. Turn the handle, something arrives. Shaped by world and entity context. Receives CrankSeed context from EFDP/Chunxly via localStorage. Portrait returns to Grimoire automatically. Ported from React to vanilla JS — split into 5 files by concern: `crank-data.js` (RNG, worlds, palettes, recipes, voices), `crank-renderer.js` (pixel generation for all 6 entity types), `crank-canvas.js` (canvas drawing, diorama compositing, animation), `crank-engine.js` (state, persistence, generation pipeline, navigation), `index.html` (CSS + UI rendering + init). No build step, no dependencies. **Chunxly-direct mode:** when a Chunxly PNG seed arrives with color clusters, builds a custom palette from the creature's actual colors and generates rolls that trust the seed completely — no world palette blending, no voice shapes, no recipe randomization. Produces anchor shapes that carry the creature's visual identity.

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
- **Critter binder:** Haul world detail shows caught critters as trading cards in a paginated 2×2 binder (4 per page). Shoulder buttons and ‹/› arrows page through. Card front: pixel art (64px, breathing idle animation), name, recipe + world icon badges. Card back: living diorama — creature centered with 5 world inventory companions placed spatially via seeded RNG, world background color, subtle ground texture. CSS 3D flip via 🔄 button.
- **Packet diorama:** WORLD/INFO toggle in packet detail view. WORLD shows full-screen 240×220 diorama with creature large (96px) and all 5 companions animated at their own tempos. INFO shows the existing stat sheet.
- **Diorama rendering:** `drawGridAt()` compositing primitive, `computeDioramaPositions()` / `computeFullDioramaPositions()` for seeded spatial placement, `startDioramaAnimating()` / `startFullDioramaAnimating()` for composite canvas animation loops
- **Stat-specific colors:** HP coral, ATK amber, DEF steel blue, SPD green (used in encounter screen)

## What's Next
- World pool summary cards in Haul are still text-only — visual peek with tiny creature art would complete the binder feel
- Card identity layer: world icon badges/emblems, border embellishments, shiny/foil variants for special catches
- Card battle mechanic: one-choice showdown using existing stats + biome affinity
- `playPose()` comment references "future battle system" — poses are wired to catch/click but no battle mode exists
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
