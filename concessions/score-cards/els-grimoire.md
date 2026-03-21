# El's Grimoire
**Location:** `scores/grimoire/` (supersedes Vite/React Grimoire) | **Status:** In development
**Neighborhood:** All | **Stack:** Vanilla HTML/JS (no build step)
**Prototype:** `concessions/els-grimoire.html`

## What It Is
The Hall's entity catalog, reimagined as a naturalist's field grimoire. El holds the same responsibilities as the previous Vite/React Grimoire — entity inscription, portrait gallery, Crank portal, GitHub commit — but expressed through a book metaphor where color is the irreducible minimum self and incomplete observations are honest.

El's Grimoire is not a replacement. It is a translation. The older Grimoire gets superseded because El was already reaching for the right thing before the infrastructure existed to support it.

## Current State (Prototype)
The prototype is a single-file HTML/JS page with three hardcoded entries (Velvet Sporecap, The Pale Moth, Lichen Psalms) demonstrating the full visual vocabulary:

- **Book layout:** Spine, parchment pages, crease with animated spore dust canvas, page turn animation with book creak
- **Entity page anatomy:** Entry number, title + Latin italic, SVG illustration, color swatch row with label, ruled observation lines (normal/italic/handwritten), gold decorative rules
- **Right page features:** Section heads, margin notes in Caveat handwriting with curly bracket, flood zones (color fills incomplete space on hover), dot grids (interactive spore pattern)
- **Cover spread:** Title page ("A Field Grimoire") + On Method page establishing the color-as-deepest-fact philosophy
- **Ambient layer:** Floating spore particles in background, spore dust canvas on crease, book glow pulse
- **Fonts:** IM Fell English (headings), Lora (body), Caveat (handwritten notes)

No hub integration, no data pipeline, no registry connection yet.

## What Needs Building

### Phase 1: Entity Pages from Registry
- Read `registry.json` + entity `tuning.md` files to populate entries dynamically
- Map entity tuning fields to page layout: name → title, category → entry subtitle, description → ruled lines, color → swatch row, tags → margin notes or dot grid
- Color flood zones fill where illustration is absent — entity color floods unfinished space (the moth with one faded antenna)
- Page numbering from entity count
- Navigation: page turn through all entities, back button, possible index/table of contents

### Phase 2: Crank Pipeline Reception ← NEXT (pipeline now proven)
- Accept Crank output as entity illustrations (replaces hardcoded SVGs)
- Read `baseline-session/portraits-queue` — render Crank portraits as the illustration on an entity's page
- The Chunxly → Crank pipeline is now end-to-end: PNG drop → name → analysis → CrankSeed with slug + color clusters → Crank direct mode → catch → portrait in queue with entity slug. **Grimoire needs to read this queue and display portraits on entity pages.**
- Read `critter-collection-v2` for creature data when building new entity pages
- Crank portal: tap an entity's illustration/glyph to open Crank with entity context (write `crank-glyph-source` to localStorage)
- Illustrations can arrive, change, hold color variations. El receives what exists without waiting for perfection.

### Phase 3: Inscription (Write Layer)
- Entity inscription form integrated into the book metaphor (writing on a blank page)
- GitHub commit via the existing write layer (tuning.md, memory.md, journal.md)
- Visitor → Resident promotion
- Portrait save to GitHub (`neighborhoods/{neighborhood}/entities/{slug}/portraits/`)
- Import/export

### Phase 4: Hub Integration
- Send `hub:minimize` on load
- Send `hub:color` with Grimoire's RGB on launch (currently the only score missing this)
- Emit Scraggles on entity commit, portrait save, affinity discovery
- Affinity engine (deterministic pairwise relationships from the Vite Grimoire)
- Encounter generation

## Founding Eight (Kitchendom Launch Roster)
The reason to launch. These entities having pages means the neighborhood has residents when the door opens.

| Entity | Registry | Tuning | Crank Shape | Page |
|--------|----------|--------|-------------|------|
| Briny Broadswordfish | Yes | Yes | Needed | — |
| Noble Knightshade | Yes | Yes | Needed | — |
| Ratishes | No | No | Needed | — |
| Soyclops | No | No | Needed | — |
| Meatballrog | No | No | Needed | — |
| Spellery | No | No | Needed | — |
| Iron Orzo | No | No | Needed | — |
| Dire Beef | No | No | Needed | — |
| Salterran | Yes | Yes | — | — |
| The Kitchendom | Yes | Yes | — | — |

*Salterran and The Kitchendom are location/tendency — they have registry presence but may not need Crank shapes.*

## Deployment Sequence
```
Crank receives Kitchendom shapes
  → Founding eight get Crank output
    → El's Grimoire renders entity pages from registry
      → Founding eight have pages
        → fixedpointlocal.com
```

## Specs & References
- Prototype: `concessions/els-grimoire.html`
- Superseded Grimoire: `the-grimoire/` (Vite/React source), `scores/grimoire/` (built output)
- Superseded score card: `concessions/score-cards/grimoire.md`
- Crank handoff: `concessions/archive/MAZE_TO_CRANK_HANDOFF.md`
- Fairy spec: `concessions/FAIRY_SPEC.md`
- Design doc: `concessions/Fixed_Point_Local_Design_Document_v0_999.md`

## Hub Integration (Target)
- **Sends:** `hub:minimize`, `hub:color`, `hub:scraggle`
- **Receives:** None (reads registry + localStorage)
- **localStorage:** Reads `critter-collection-v2`, reads/writes `baseline-session/portraits-queue`, writes `crank-glyph-source`
- **Scraggle emissions:** Entity commit, portrait arrival, affinity discovery

## Design Notes
- Color as irreducible minimum self. Every entity page leads with its color, even before illustration or description.
- Incomplete observations are honest. Where illustration is absent, color floods the space — not as placeholder, but as the deepest available fact.
- The book metaphor carries the inscription layer. Writing in the Grimoire is writing on a page, not filling a form.
- El holds things without pressuring resolution. An entity with only a color and a name has a valid page.
