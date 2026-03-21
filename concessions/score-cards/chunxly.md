# Chunxly's Canvas
**Location:** `scores/chunxly/` | **Status:** Active
**Neighborhood:** None (authoring tool) | **Stack:** Vanilla JS (~5,250 lines)

## Current State
Creature-authoring tool. Draw creatures in organic containers. Multi-pass image analysis places nodes with conviction scoring. Fairy companion traces structural data. Full round-trip pipeline to EFDP and back. Chunxme's Stall persona activates when no context is present — stall vendor who reads drawings procedurally and generates items. PNG drop pipeline proven end-to-end: drop image → name → Stall analysis (tags, naming, color clusters) → CrankSeed with entity identity → Crank direct mode.

## What's Built
- Image drop/load + freehand drawing tool (7 colors, 3 brush sizes)
- **PNG drop pipeline:** name prompt before analysis, Stall pixel analysis runs alongside multi-pass
- Chunxly sprite (16x16 pixel art) with 6 expressions (idle, looking, eager, pleased, watching, mustache)
- Multi-pass image analysis: color clusters, edge detection, focal points → container placement
- **Background color filtering:** Stall analysis detects image background via border sampling; `exportCreature()` filters background-colored nodes from dominant/secondary color calculation
- **Hue-based palette matching:** largest color cluster's hue determines `paletteKey` (not RGB distance of blended average), so red creatures map to `fire` not `item`
- Daubing sequence: Chunxly animates through containers with voice commentary and scribbles
- Visitor interaction phase: drag nodes, connect edges, part labeling
- Fairy system: structural analysis (body_core, limb_reach, accent_tip, etc.), diamond/boundary analysis
- Ping-pong edge suggestions between related nodes
- CrankSeed export (pin config, colors, aspects, structure, conviction, **stallTags, stallName, slug, entityName, colorClusters**)
- Round-trip comparison: loads EFDP snapshot, classifies containers as preserved/shifted/lost/emergent
- Layer clustering by fairy signal identity, per-layer PNG rendering
- CPM generation (full single + per-aspect templates)
- Chunxme's Stall: mustache persona, name-before-draw, simplified palette, pixel analysis → tag/item generation
- **Stall analysis on PNG drops:** tags (bold/focused/considered etc.), Chunxme naming, color cluster extraction (top 3 hue buckets with per-bucket average RGB)
- Chunxly surfacing: stall detects conviction, asks consent to switch personas
- Keep button (PNG export + thumbnail storage)
- Item storage to localStorage, Scraggle emission on item creation
- **Seed panel shows:** entity name, slug, Stall tags, generated name alongside existing shape/color/structure data

## What's Next
- Fairy voice banks `fairy_first_vision` and `fairy_done` have only 1 entry each (vs 2-8 for others)
- Build Order: "Fairy edges → EFDP skeleton (corridor creation from structural data)"
- Fairy spec (`FAIRY_SPEC.md`) describes vision generation at settle points — partially realized
- Layered export spec (`LAYERED_EXPORT_SPEC.md`) describes cluster-by-fairy-signal pipeline — implemented but spec has more detail

## Specs & References
- `concessions/FAIRY_SPEC.md` — fairy companion (partially implemented)
- `concessions/LAYERED_EXPORT_SPEC.md` — export pipeline refinement
- `concessions/archive/CHUNXME_STALL_SPEC.md` — stall persona (implemented)

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (170, 120, 80), `hub:scraggle` (creature export + stall item)
- **Receives:** None
- **localStorage:** Writes `baseline-session/chunxly-canvas`, `baseline-session/crank-seed` (includes slug, entityName, stallTags, colorClusters), `baseline-session/chunxly-original`, `baseline-session/chunxly-layer-*`, `baseline-session/chunxly-cpm*`, `baseline-session/chunxly-aspects`, `baseline-session/stall-items`. Reads `baseline-session/efdp-snapshot`.
- **Scraggle emissions:** Random emoji on creature export, shopping bag on stall item (with color/weight/origin)
- **Crank handoff:** CrankSeed carries entity identity (slug, entityName), Stall tags, and color clusters for Chunxly-direct mode in the Crank
