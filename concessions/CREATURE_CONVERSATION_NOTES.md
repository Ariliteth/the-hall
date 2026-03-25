# Creature Conversation & World Evolution — Design Notes

**Status:** Raw ideas from Fox + Code session, March 24 2026. Not a spec yet — needs shaping.

---

## Creature Conversation (Core Loop Redesign)

The catch mechanic transforms from a button press into a conversation.

**Current loop:** see creature → press CATCH → done (passive, creature has no say)

**Proposed loop:** encounter creature → use aspect buttons to "speak" → creature evaluates → settles or leaves

### How It Works
- You encounter a creature. It's alive, waiting.
- The 4 aspect buttons (emoji voices) become your vocabulary. Tapping them "speaks" to the creature.
- The creature has a **disposition** — it wants certain types of voices to feel at home:
  - Fire-adjacent voices to feel warm
  - One organic + one geometric to feel balanced
  - Something rare you don't currently have (worth waiting for voice drift to bring it)
- If you say what it's hoping for, it **settles**. The crank seals the bond.
- If you don't find the right words, or speak too many wrong ones, it **leaves on its own** and the next encounter begins.

### Design Principles
- Every creature is a small puzzle of **attention** — you must *read* it (palette, shapes, cohesion) to guess what it wants
- No time pressure. The pressure is **conversational** — understanding before the creature decides you're not who it was looking for
- Some creatures are easy (common voices). Some want something rare. Those are worth pursuing.
- The voice buttons are **dual-purpose**: they influence generation AND they're your conversation tools
- Strong parallel with **Silmor Spells** — negotiation, not transaction

### Open Questions
- How many "wrong" voices before a creature leaves? Fixed number or creature-dependent?
- Can you "undo" a wrong voice press? Or is every press committed?
- Should the creature's disposition be visible (UI hint) or entirely read from its visual properties?
- What happens to creatures that leave — do they become squatters? Or truly gone?

---

## Founding Creature Influence

The first creature caught in a world shapes what comes after.

- Founding creature's **palette** biases the world slightly — its colors appear more often in future generations
- Founding creature's **shape hints** become more likely to surface
- Not as a rule — as a gentle gravitational pull
- Could introduce **new colors/shapes** the world hasn't seen — founding creature as pioneer bringing novel genetics
- Shades could drift to colors not in the base palettes — cohesive or not, monotone or not

### Mechanics
- Add `foundingInfluence` to world object: `{ paletteWeight, shapeHints, colorDrift }`
- `generateRoll` checks founding influence and biases pools ~10-15% toward founding creature's properties
- Over time, as more creatures are caught, the founding influence dilutes (or compounds if catches align)

---

## World Aging

Worlds evolve with use. Their identity shifts based on who lives there.

- **Name evolution**: world name regenerates with a salt that includes resident count + dominant characteristics. "Civic Works" after 50 catches might become "Storied Furnace."
- **Resident composition influence**: what residents carry most (mushrooms, crystals, etc.) becomes the world's emergent identity
- Not always predictable — "this world loves the newest thing!...and also mushrooms"
- Worlds and residents have agency in how the identity evolves

### Mechanics
- Periodically (every N catches?), re-derive world name using a salt from `{compoundKey, residentCount, dominantPalette, dominantRecipe}`
- Store name history so old names can be remembered (the world's own memory)
- Flavor text could evolve too

---

## Constellation Map (Long-Press Back)

A map of all 21 possible compound worlds.

- Shows which ones you hold (lit), which are undiscovered (dim), which the visitor currently occupies (pulsing)
- Spatial layout based on aspect adjacency — worlds sharing an aspect are near each other
- Gives hints toward what you might discover if you delve deep enough in one direction
- Could show anomaly history — which compounds have been spotted as anomalies before

### Layout Ideas
- Hexagonal grid with 6 aspects at vertices, compounds at edges/centers
- Constellation dots connected by aspect lines
- Pure worlds at the vertices, compounds on the edges between their two aspects

---

## The 7th Slot as True Third

The visiting world doesn't just hold creatures — it **observes**.

- Tracks patterns across your other 6 worlds
- Notes which aspects appear most, which are missing
- Records anomaly history
- When you look at the visitor's cover, it reflects back what it's seen
- Could help usher new potential worlds — suggesting what compounds are "calling"
- The Third doesn't command — it notices, suggests, places attention

### Connection to Lode
- The visiting slot is the bridge between Crank and Lode
- Can load dice from Lode into worlds, or set out from worlds into Lode
- Each import back yields diminishing returns (tracking density/percentages, not absolutes)
- Carries potentially new emoji from aspect pools

---

## Emoji Trail as Crank Memory

The strip at the top of the screen (replacing tabs) is the Crank's own memory.

- 4 slots, leftmost = strongest direction
- Records one emoji per crank from active voices
- Catches echo their voice emoji more strongly (front of trail)
- Anomalies disrupt the trail entirely
- You can read it to feel which direction you're leaning
- It's not a log — it's a **lean**

### Future Potential
- The trail could influence generation subtly — if the Crank has been seeing a lot of fire, fire-adjacent creatures become slightly more common
- The trail becomes the Crank's own "third" — its own perspective on what's happening
- Could be visualized as a color gradient strip instead of emojis

---

*Captured from Fox + Code session, March 24 2026. Part of Fixed Point Local.*
