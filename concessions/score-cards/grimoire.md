# The Grimoire (Vite/React)
**Location:** `scores/grimoire/` (source: `the-grimoire/`) | **Status:** Superseded by El's Grimoire
**Neighborhood:** All | **Stack:** Vite/React (only build-step score)
**Superseded by:** [El's Grimoire](els-grimoire.md) — vanilla HTML/JS translation carrying forward all functionality

## Current State
The Hall's entity catalog. Residents from all neighborhoods, visitors awaiting commit, portrait galleries, affinity engine, divination, journal. Direct commit to GitHub. Portal to Critter Crank — tap a resident's glyph to open the Crank carrying entity context. Portrait return pathway proven end-to-end.

## What's Built
- Dual entity sources: GitHub registry residents + local visitors
- Entity inscription form (name, category, description, tags)
- Procedural glyph canvas + custom SVG glyph support
- Affinity system with deterministic pairwise relationships
- Encounter generation (narrative vignettes from entity combinations)
- Portrait system: gallery, Crank return via localStorage polling, GitHub commit
- GitHub write layer (commit visitors with tuning.md, memory.md, journal.md stubs)
- Catalog filtering by category, neighborhood, source
- Import/export

## What's Next
- Does not send `hub:color` — only score missing color emission
- Does not emit Scraggles — could emit on entity commit, portrait save, affinity discovery
- Memory.md and journal.md are committed as stubs — could template with entity-specific content

## Specs & References
- No dedicated spec file — described in design doc Scores section
- Build: `cd the-grimoire && npm run build && cp -r dist/* ../scores/grimoire/`

## Hub Integration
- **Sends:** `hub:minimize`
- **Receives:** None
- **localStorage:** Writes `crank-glyph-source` (SVG for Crank), reads/writes `baseline-session/portraits-queue`
- **Scraggle emissions:** None
