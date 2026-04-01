# Taste
**Location:** `scores/taste/` | **Status:** Active
**Neighborhood:** None | **Stack:** Vanilla JS (~3,900 lines)

## Current State
Grocery shopping discernment score. Two stores (Maria's Produce, Terroir's Roots), four tools, Dream Dish system for roots produce. Browse bins of produce, use tools to evaluate quality, fill your wife's list. Ghost List entity haunts the margins with smudged impossible entries. Magazine system with two issues (The Citrus Issue, Hommes de Terre). Trophy shelf with gem rarity. Only score that sends `hub:listen` instead of `hub:minimize`.

## What's Built
- Lamp phase: trophy shelf, wife's list delivery, ghost hint, "Go Shopping" button
- Magazine system: multi-spread reader with cover, prose, drop caps, interactive panels, unlock mechanics, scribbles, rack with spine selector, toast notifications, done-reading flow
- The Citrus Issue (7 spreads, ~10 panels) — fully authored
- Hommes de Terre / Issue 02 (6 spreads, 6 panels) — potato/potäto, Apeeler, Terroir's store, dream reading technique, color dreams fad watch
- Catalog abstraction: stores reference catalog (citrus/roots), all systems catalog-aware
- Two stores: Maria's Produce (citrus, grid bins) and Terroir's Roots (roots, aisle layout)
- Aisle-based mobile layout for Terroir's: vertical item stacking, horizontal scroll between aisles
- Dream Dish system: categorical property on roots produce, weighted by health average with overlapping ranges
- 4 tools: Fruitrampoline (bounce → weight), Gentle Calipers (squeeze → firmness/freshness), Blade (slice → juiciness/freshness/color), The Apeeler (peel → Dream Dish)
- Tool loadout phase: choose 3 of 4 when Apeeler unlocked, dynamic tool bench
- Shopping phase: bin-based produce browsing, drag-and-drop / tap-to-place to list slots
- Quality badge system (firmness, freshness, juiciness, color) + dream labels
- Ghost List: seeded ghost entity, smudged text, arrival delay, weather system, impossible entries, drift accumulation across runs. Store-specific phrase pools.
- Wife's list generation with preferences and weights, including dream-based preferences for roots
- Critic system: positioned voice remarks tied to tools, zones, allocation. Apeeler remarks keyed per dream dish.
- Going Home phase: wife examines items, substitution detection, dream preference scoring, satisfaction scoring (rolling average)
- Trophy generation with gem rarity, color aging, shelf rendering
- Store gating: Terroir's and Apeeler unlocked via magazine panels
- Store-specific hub:color (Maria's green-gold, Terroir's earthy warm)
- Full persistence via localStorage
- Seeded RNG per store/run

## What's Next
- Aisles as universal layout (replace grid at Maria's too) — snap-based, group related produce
- Remove loadout phase; tools resize in fixed space, selection at lamp desk
- Aisle language: discerning script, store-influenced item descriptions
- Tool upgrades / versions (cosmetic or functional)
- No hub pulse listening
- Wife's list vs store mismatch (asking for lemons at a potato shop) — design discussion

## Specs & References
- `concessions/TASTE_HOMMES_DE_TERRE_SPEC.md` — Issue 02 design spec
- `concessions/Taste_Magazine_Handoff_v0.1.docx` — magazine implementation guide
- `concessions/archive/Taste_Design_Handoff_v0.1.docx` — score implementation guide

## Hub Integration
- **Sends:** `hub:listen` (on load — unique), `hub:color` (store-specific), `hub:minimize` (on entering shopping), `hub:scraggle` (blade use, trophy award)
- **Receives:** None
- **localStorage:** `baseline-session/taste` (full save state)
- **Scraggle emissions:** Knife emoji on blade slice, item emoji on trophy award
