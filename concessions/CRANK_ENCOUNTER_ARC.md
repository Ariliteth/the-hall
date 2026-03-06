# Critter Crank: The Encounter Arc
**Fixed Point Local · Design Note · 2026-03-06**

---

## What Changed

The Crank was generating hauls — snapshots of possibility, plural, unattached. A team, a pile of items, a spread of things. It was a vending machine for variety.

That was never quite right. The Crank resisted finishing because it wasn't done becoming what it is.

What it is: **an encounter**. One creature arrives. The space around it fills with *its* things. This is the Crank now.

---

## The Encounter Screen

One Crank. One creature. The rest of the screen is that creature's world.

Visual reference: Gen 1 Pokémon status screen — retro, dense, alive, beyond its time. Not nostalgia. Structure.

**Left or center:** The creature. Full EFDP diffusion rendering. Pose-aware when animation rigs are attached.

**Right panel — stats and traits:**
- Stat bars or readouts. Numbers, bars, or emoji. Not explained, just present.
- Skills, tendencies, affinities. What it does. How it moves through the world.
- Voice emoji. Spirit fragments. The parts of its personality that can be shown rather than told.

**Below or surrounding — the creature's world inventory:**
Fills out one tile at a time, but it is no longer random. It is *precise*. Each slot is a category:

| Slot | Contents |
|------|----------|
| Tiles | The terrain it naturally walks on |
| Flora | The plants it ignores, shelters near, or eats |
| Items | Things it naturally interacts with or carries |
| Relics | What gives it power, or how it expresses its own magic |
| Spirit | Fragments of personality — expressed, not described |

The inventory is not a haul. It is a portrait of a world implied by one creature.

---

## Catch or Crank

Two choices after an encounter:

**Catch** — saves the creature and its world inventory to the haul/collection.

**Crank** — generates a new encounter. The current creature is released.

### The Quiet Squatter

If you Crank without catching, the released creature may decide to stay anyway.

It knows what it wants. You were just present for the decision.

Options:
- **Silent** — it simply appears in the collection later, no announcement
- **Polite notification** — a small, undemanding note: *"Something moved in."*

The creature's autonomy is real. Catching is an invitation. Not catching is not necessarily a goodbye.

---

## The World Generation Arc

A creature doesn't move into a world. **A creature generates the conditions of its world.**

When a creature is caught, it carries world tags — biome affinities derived from its DNA. These tags either:
- **Match an existing world** in the collection → the creature moves in
- **Create a new world** if the combination is novel

Early world types: City, Jungle, Water, Desert, Underground, Sky, Liminal, etc.

A creature with City/Water affinity doesn't move into City *or* Water — it implies a world that is both, and that world comes into being.

### Living World Pools

Each world accumulates a pool of entities, flora, items, and things that feel at home there in at least one dimension.

- A wave-icon creature wanders past a City world, notices the water vibe from a City/Water resident, and moves in.
- A world with no natural residents is okay. Some worlds wait.
- Affinity is directional — a creature can *create* a world it wouldn't have chosen alone.

The haul is no longer a list of things. It is a list of **worlds that formed naturally**, each populated by things that belong there for their own reasons.

---

## What Stays from the Old Crank

- The roll mechanic — seeded, reproducible, fast
- Recipe keys, palette keys, trait and shape systems
- ECGP as the address — same diffusion substrate, same DNA language
- The `crankContext` / `CrankSeed` handoff to EFDP
- The existing rendering pipeline

What changes is the *presentation layer* and the *meaning* of what gets generated. The engine is the same. The encounter is new.

---

## What the Crank Needs

1. **Single-creature focus** — one roll displayed at a time, not a team spread
2. **World inventory generation** — tiles, flora, items, relics, spirit slots derived from creature DNA
3. **Catch / Crank UI** — clean, binary, low pressure
4. **Quiet squatter logic** — probability-based re-appearance for uncaught creatures
5. **World tag derivation** — from recipe key, palette, cohesion, traits → biome affinities
6. **World pool system** — creatures collect into worlds, worlds accumulate residents
7. **EFDP animation rig integration** — creature displays with pose awareness when available

---

## Relationship to EFDP

The Crank generates a creature. EFDP teaches it how to move. The creature returns home with an animation set.

The round-trip spec (Crank → Mazie → Crank) defined in `2026-03-06_efdp_animation_rigs.md` is the pipeline that makes the encounter screen *alive* rather than static.

A caught creature in the encounter screen is not a sprite. It is something that breathes.

---

## Notes

*"Instead of taking a snapshot of worlds, we are taking a snapshot of one thing and its world, from which we can create that world."*

The Crank wasn't resisting. It was waiting to be about one thing deeply instead of many things shallowly.
