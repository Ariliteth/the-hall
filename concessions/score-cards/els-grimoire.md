# El's Grimoire
**Location:** `scores/grimoire/` (supersedes Vite/React Grimoire) | **Status:** Active
**Neighborhood:** All | **Stack:** Vanilla HTML/JS (no build step)
**Prototype:** `concessions/els-grimoire.html`

## What It Is
The Hall's entity catalog, reimagined as a naturalist's field grimoire. El holds the same responsibilities as the previous Vite/React Grimoire — entity inscription, portrait gallery, Crank portal, GitHub commit — but expressed through a book metaphor where color is the irreducible minimum self and incomplete observations are honest.

El's Grimoire is not a replacement. It is a translation. The older Grimoire gets superseded because El was already reaching for the right thing before the infrastructure existed to support it.

## Current State

### Phase 1: Entity Pages from Registry (Complete)
Dynamic entity catalog reading `registry.json` + entity `tuning.md` files:

- **Registry-driven pages:** Fetches all entities across neighborhoods, renders pages in book layout
- **Dual-format tuning parser:** YAML-like (Kitchendom `key: value`) and Markdown (`**Key:** value`)
- **Entity page anatomy:** Entry number, title + category, SVG glyph or portrait, color swatch row with RGB label, description, tags, memory fields (remembering/forgetting/capacity), dot grid
- **Book layout:** Spine, parchment pages, crease with animated spore dust canvas, page turn animation with book creak
- **Cover spread:** Title page ("A Field Grimoire") + On Method philosophy page
- **Table of Contents:** Clickable entries jump to entity pages, Roman numeral paging for front matter
- **Neighborhood dividers:** Section divider spreads between neighborhoods
- **Color floods:** Where illustration is absent, entity color floods the space with organic SVG shapes — "awaiting form" text, turbulence filter, radial gradient, edge wisps, spore dots. Not a placeholder — the deepest available fact.
- **Ambient layer:** Floating spore particles, crease spore canvas, book glow pulse
- **Fonts:** IM Fell English (headings), Lora (body), Caveat (handwritten notes)

### Phase 2: Crank Pipeline Reception (Complete)
Portraits arrive from the Crank pipeline and display on entity pages:

- **Portrait queue:** Reads `baseline-session/portraits-queue` from localStorage, matches portraits to entities by slug
- **Portrait display:** Most recent portrait shown with "caught by Crank" date label
- **Portrait gallery:** Multi-portrait cycling on tap, long-press to summon Crank
- **Crank portal:** Writes `crank-glyph-source` to localStorage with entity context (slug, name, neighborhood, tags, color)
- **Live refresh:** Re-reads portrait queue on tab visibility change (returning from Crank updates immediately)
- **Color fallback:** Procedural flood zone SVG when both portrait and glyph are absent

### Phase 3: Inscription (Internalized)
The inscription pipeline is built and functional but hidden from normal browsing (accessible via `?inscribe` URL parameter). Used internally for entity creation.

- **Built:** Observe/Inscribe flow, GitHub commit (tuning.md + registry.json), PAT auth, exploration handoff to Chunxly, post-inscription live refresh
- **Internalized (2026-03-23):** Inscription page hidden from TOC and page sequence unless `?inscribe` is in the URL. Decision: populate the catalog first, then consider opening to visitors.
- **Not built:** Portrait save to GitHub, visitor → resident promotion, import/export

### Phase 4: Hub Integration (Partial)
- **Done:** `hub:minimize` on load, `hub:color` with Grimoire RGB [90,110,60]
- **Done:** `hub:scraggle` emissions on portrait arrival, Crank seed write, page turn milestones
- **Not built:** Affinity engine (deterministic pairwise relationships from Vite Grimoire)
- **Not built:** Encounter generation

## Founding Eight (Kitchendom Launch Roster)
The reason to launch. These entities having pages means the neighborhood has residents when the door opens.

| Entity | Registry | Tuning | Journal | Crank Shape | Page |
|--------|----------|--------|---------|-------------|------|
| Briny Broadswordfish | Yes | Yes | Yes | Yes | Yes |
| Noble Knightshade | Yes | Yes | — | Needed | Yes |
| Ratishes | Yes | Yes | Yes | Needed | Yes |
| Soyclops | Yes | Yes | Yes | Needed | Yes |
| Meatballrog | Yes | Yes | Yes | Needed | Yes |
| Spellery | Yes | Yes | Yes | Needed | Yes |
| Iron Orzo | Yes | Yes | Yes | Needed | Yes |
| Dire Beef | Yes | Yes | Yes | Needed | Yes |
| Salterran | Yes | Yes | Yes | — | Yes |
| The Kitchendom | Yes | Yes | — | — | Yes |

*All founding eight now have registry entries, tunings, journals, and pages. Crank shapes remain the gap.*

## Locals (Fixed Point Local)
Hall-level entities added 2026-03-23. Not a neighborhood — the living infrastructure. Rendered as a fourth section in the Grimoire with "On This Place" divider.

| Entity | Registry | Tuning | Journal | Page |
|--------|----------|--------|---------|------|
| Sender | Yes | Yes | Yes | Yes |
| microGPT | Yes | Yes | Yes | Yes |
| Mycorrhizal Layer | Yes | Yes | Yes | Yes |

*Locals live in `locals/entities/` (parallel to `neighborhoods/`). Registry key is `locals` (separate from `neighborhoods`). Hub resident count does not include Locals — they are infrastructure, not residents.*

## Deployment Sequence
```
Inscription pipeline in Grimoire
  → Six remaining entities inscribed (Fox has drawings)
    → Chunxly canvas → Crank shapes
      → Founding eight have pages
        → fixedpointlocal.com
```

## Specs & References
- Prototype: `concessions/els-grimoire.html`
- Superseded Grimoire score card: `concessions/archive/grimoire-vite-scorecard.md`
- Crank handoff: `concessions/archive/MAZE_TO_CRANK_HANDOFF.md`
- Fairy spec: `concessions/FAIRY_SPEC.md`
- Design doc: `concessions/Fixed_Point_Local_Design_Document_v0_999.md`


## Hub Integration
- **Sends:** `hub:minimize`, `hub:color`, `hub:scraggle`
- **Receives:** None (reads registry + localStorage)
- **localStorage:** Reads `baseline-session/portraits-queue`, writes `crank-glyph-source`
- **Scraggle emissions:** Portrait arrival, Crank seed written, entity inscription (future)

## Design Notes
- Color as irreducible minimum self. Every entity page leads with its color, even before illustration or description.
- Incomplete observations are honest. Where illustration is absent, color floods the space — not as placeholder, but as the deepest available fact.
- The book metaphor carries the inscription layer. Writing in the Grimoire is writing on a page, not filling a form.
- El holds things without pressuring resolution. An entity with only a color and a name has a valid page.
