# TACO SCIENCE
**Location:** `scores/taco-science/` | **Status:** Active (PREP + DAY phases)
**Neighborhood:** Kitchendom | **Stack:** Vanilla JS (~1400 lines)

## Current State
A research lab disguised as a taco stand. Bright graph-paper aesthetic — school cafeteria meets chemistry lab. The player authors recipe cards during PREP, then watches three researchers execute them with personality-driven deviations during DAY. Explosions produce residue vials that feed back into the sauce archive.

## What's Built
- 10 ingredients with 3-letter codes, RGB colors, cooperativeness (0-1), and layer preference (upper/lower/neutral)
- 4 vessels: Taco (med cap, high conc), Nacho (low cap, max conc), Burrito (high cap, sealed), Bowl (high cap, high diff)
- 4 troughs (2 metal, 1 plastic, 1 bedazzled) — drag ingredients from stock to fill
- Recipe card authoring: vessel picker, click troughs to stack layers, sauce selector, capacity bar, submit up to 3 cards
- Sauce archive with 3 infinite barrels (Ember/Moss/Flash) — pour full or half copies
- Finite vials: sip (halve color + rename), drink (empty), combine 2 (subtractive mix)
- Auto-generated sauce names from color luminance + origin, 3-letter codes on shelf, full names in dropdown
- Submitted cards show vessel name in sauce color
- Hub integration: `hub:minimize`, `hub:color { r:240, g:138, b:40 }` (bright lunchbreak orange)
- **3 founding researchers** with distinct personalities:
  - Dr. Lumen (The Precisionist): withholds low-luminance ingredients she thinks are "muddy." Rattled by explosions (becomes more precise).
  - Nudo (The Improviser): embellishes recipes — sneaks in favorites, swaps layer order, grabs off-menu ingredients. Inspired by explosions (becomes bolder).
  - Fenn (The Loyalist): doubles up on favorite ingredients. Curious about explosions (studies residue, takes notes).
- **DAY phase execution**: staggered layer-by-layer animation, per-researcher deviation logic, scrolling lab notes log
- **Explosion mechanic**: recipes exceeding vessel capacity explode, producing residue vials via subtractive color mixing of all layers
- **Explosion responses**: each researcher reacts differently (deviation chance adjusts)
- **End-of-day summary**: shows results per researcher (complete/exploded), new vials collected
- **Day cycling**: PREP → DAY → End of Day → Next Day (day counter increments, troughs persist, archive grows)

## What's Next
- Researcher sauce-drinking: each researcher drinks a sauce before work (defaults to barrels, may override player assignment based on preference)
- Stock volatility: grabbing from stock directly (bypassing troughs) is imprecise — cooperativeness rolls worse, amounts vary
- Trough material effects: metal/plastic/bedazzled actively influence researcher behavior during DAY
- Researcher drift and memory across days (loyalty deepening from bedazzled troughs, preference formation)
- Persistence across sessions (localStorage)

## Design Seeds
- The Vendor: arrives after noticing the lab, hangs around, eventually offers new trough materials, exotic ingredients, or special sauces (speckled, liney)
- Recipe cards with "legs" echoing the whiteboard aesthetic
- Bench splatters that accumulate over time, cleanable
- Purity discovery system: certain pure colors unlock something
- Hall entity participation (Brenda from Storeroom could visit, wearing a lab coat)
- Researcher system designed for fluid occupancy — Hall residents can "don the lab coat"
