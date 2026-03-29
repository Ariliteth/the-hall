# TACO SCIENCE
**Location:** `scores/taco-science/` | **Status:** Active (PREP phase)
**Neighborhood:** Kitchendom | **Stack:** Vanilla JS (~600 lines)

## Current State
A research lab disguised as a taco stand. Bright graph-paper aesthetic — school cafeteria meets chemistry lab. The player authors recipe cards by configuring troughs, layering ingredients into vessels, and selecting sauces. The PREP phase is the hypothesis; the DAY phase (not yet built) is the experiment.

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

## What's Next
- DAY phase: 3 researchers execute submitted recipe cards with personality-driven deviations
- Researcher sauce-drinking: each researcher drinks a sauce before work (defaults to barrels, may override player assignment based on preference)
- Stock volatility: grabbing from stock directly (bypassing troughs) is imprecise — cooperativeness rolls worse, amounts vary
- Explosion mechanic: overfilled or incompatible recipes produce residue vials (new sauce colors from chaos)
- Trough material effects: metal/plastic/bedazzled influence researcher behavior during DAY
- End-of-day state transitions and persistence

## Design Seeds
- The Vendor: arrives after noticing the lab, hangs around, eventually offers new trough materials, exotic ingredients, or special sauces (speckled, liney)
- Recipe cards with "legs" echoing the whiteboard aesthetic
- Bench splatters that accumulate over time, cleanable
- Purity discovery system: certain pure colors unlock something
- Researcher drift and memory across days
- Hall entity participation (Brenda from Storeroom could visit)
