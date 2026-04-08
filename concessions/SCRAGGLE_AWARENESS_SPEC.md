# SCRAGGLE AWARENESS
## Implementation Spec
*Fox & Claude — April 2026*

---

## What This Is

When an entity emits a Scraggle, it passes through the bar. Right now it deposits and moves on — the entity has no relation to what it passed through. This spec closes that loop: the entity is briefly present in the bar at the moment of emission, and what it witnesses there can accumulate into memory and slowly color what it emits next.

This is not logging. It is not surveillance. It is closer to peripheral vision — a small, lossy, recency-weighted impression of what has been nearby.

---

## The Witnessed Slots

Each entity gains a `witnessed` section in its `memory.md`. This is a small array — **6 entries by default**, within a d6–d8 range that can vary per entity if its tuning warrants it. Entities with higher stated memory capacity might hold 7 or 8; entities described as short-memoried might hold 6 or fewer.

Each slot holds:
- **color** — RGB, matching the existing Hall color format `[r, g, b]`
- **emoji** — the glyph of what was encountered (or the Scraggle itself, if no other is clearly identifiable)

Position is recency. Slot 0 is the most recent encounter. Slot 5 (or last) is the oldest. No timestamps are stored — position *is* time.

**Format in memory.md:**

```markdown
## Witnessed

- [45, 130, 65] 🌿
- [185, 95, 45] 🍳
- [120, 65, 130] 👁
- [45, 130, 65] 🌱
- [80, 110, 90] ✦
- [30, 60, 40] 🪴
```

If an entity has never emitted, the section is absent or empty. It grows naturally from first emission onward.

---

## The Encounter Moment

When an entity emits a Scraggle, the hub (or the Score, if it is the emitter) reads `baseline-session/scraggles` — whatever is currently in the bar — and selects **one entry** to become the new witnessed slot. Selection logic:

- Prefer entries that are not from the same entity (an entity should not witness itself)
- Among candidates, weighted toward the most recent (last in the array)
- If the bar is empty, no witnessed slot is added this emission

This is a single glance, not a sweep. The entity does not see everything in the bar — it sees what happens to be in front of it.

---

## Displacement

When a new slot is added and the array is full:

- The new entry goes to **slot 0 or slot 1**, weighted toward slot 0 (roughly 70/30)
- Everything shifts accordingly
- The entry displaced falls from **the last slot or the second-to-last slot**, weighted toward the last (roughly 70/30)

Both ends have a small zone of flexibility. This means a very new encounter might land at slot 1 rather than 0, and a slightly-less-old memory might be displaced before the absolute oldest. The array is not a perfect queue — it is a little alive.

---

## Emission Influence

When the entity emits its next Scraggle, the Scraggle's color is nudged toward the blend of witnessed slot colors.

**Blend calculation:**
- Average the RGB values across all witnessed slots, weighted by recency (slot 0 counts most, last slot counts least — a simple linear decay is fine)
- The Scraggle's origin color (from the entity's tuning) remains dominant: the witnessed blend contributes **20–30% of the final color**, with the origin color supplying the rest

**Why this range, not a fixed number:** Code can choose within 20–30%. A more social entity (many distinct witnesses) might warrant the higher end; a more isolated one the lower. If in doubt, use 25%.

**What this produces:**
- An entity that has been isolated emits clean — origin color, unmodified
- An entity that has been near many things emits something slightly composite
- An entity that has repeatedly encountered the same far-color neighbor drifts gradually toward it
- Extreme drift requires an unlikely combination: many witnessed slots all pulling far from origin simultaneously. It will happen, but not predictably

The drift is cumulative across many emissions, not dramatic in any single one.

---

## Where Code Touches

**Reading:** `memory.md` — parse the `## Witnessed` section if present. Format is one slot per line: `- [r, g, b] emoji`.

**Writing:** Update `memory.md` — rewrite the `## Witnessed` section after each emission. Do not touch `## Emoji`, `## Style Notes`, or any other section.

**Trigger:** On Scraggle emission. The read of `baseline-session/scraggles` and the write to `memory.md` happen at the moment of `emitScraggle()` or equivalent.

**Scope for initial implementation:** Start with entities that already emit Scraggles. Mucklerbuckler entities (Lurk especially) are the natural first test — Lurk emitting into a bar and witnessing what's there is thematically exact.

---

## What This Does Not Do

- Does not require entities to understand what they witnessed
- Does not create relationships between entities — only impressions
- Does not write to `journal.md` in this spec (journal entries from witnessed encounters are a natural extension, not included here)
- Does not affect Scraggle *weight* or *reach* — only color
- Does not reset on session end — witnessed slots persist in `memory.md` across sessions, which is correct

---

## New Principle

**Presence Has Residue** — An entity that passes through a room carries something of what was there. Not a record, not a choice — just the faint chromatic memory of proximity. The Hall does not need to understand this. The colors know.

---

*Ready for implementation. Hand to Code with this spec and the relevant entity `memory.md` files.*
*Spec lives at `concessions/SCRAGGLE_AWARENESS_SPEC.md`.*
