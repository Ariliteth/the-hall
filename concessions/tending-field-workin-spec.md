# The Tending Field — Workin' Integration Spec
**Status:** Design Spec | **Touches:** `scores/tending-field/`
**Authored:** March 2026

---

## What This Is

A light blanket over the Tending Field's existing structure. Not a rewrite. Not a new score. The Field already has tiles, residents, adjacency, caravan cycles, and trade. This spec adds skill seeds, worker context, output provenance, and a living trader relationship system. Everything else was already growing.

---

## Skill Seeds

A tile can be planted with a **skill seed** instead of an aquatic plant.

A skill seed is a single word or short phrase describing a kind of work:

```
Mining
Fishing
Cooking
Beekeeping
```

Once planted, the tile establishes itself as a **gathering point** for that skill's output. The land becomes what the seed says it is. It doesn't produce anything yet — it's just ready.

Skill seeds can be authored in a simple CSV format for extensibility:

```
Mining:Ore
Fishing:Fish
Cooking:Ash
Beekeeping:Honey
```

One skill. One output. The rest emerges from who tends it.

---

## Workers and Residents

The existing entity placement system handles this. A worker is just a resident placed on an established gathering point.

Once a worker is present on a skill tile, they produce **their version** of the output when the caravan arrives. The output carries:

- The skill type (what the tile is)
- The worker's identity (who made it)
- Any adjacency influence (who was nearby)

So Chunxly on an Ore tile produces **Chunxly Ore**. A Circle resident produces **Circle Ore**. These are genuinely different things with different histories.

No additional placement rules are needed. Workers go on tiles the same way residents always have. The skill context is what changes the meaning.

---

## Output Provenance

What a tile produces carries its history. The Field remembers:

- **Skill type** — what the gathering point is
- **Worker identity** — who tended it
- **Adjacency** — who was next to the worker at production time
- **Age** — how many caravan cycles this tile has been established

Adjacency influence works through the existing bonus system. Chunxly next to a Circle doesn't need a stat — they're just there, and the output reflects it. **Curious Ore** appears because they're friends. The player watches it happen.

Age is expressed naturally. An Ore tile that has been tended for four caravan cycles has **aged Ore**. Eight cycles, it's **deep-season Ore**. The exact language can be light and evocative rather than numerical. The Field knows how long something has been there.

Chimeric outputs emerge when a worker has tended multiple skill types over time, or when adjacency crosses skill contexts. **Fish Ore** isn't crafted — it accrues. Nobody planned it.

---

## Trader Preferences

Traders no longer have hard wants. They have **preferences** — a dream item and a genuine openness to what's actually on offer.

A trader's preference is a direction, not a requirement:

> *Wants something old. Loves anything from the water. Has a soft spot for Chunxly's work.*

When the trader arrives, they look at what the Field has produced and respond to it. The matching considers:

- **Proximity to preference** — does this touch what they care about?
- **Age** — older outputs are more interesting to traders who savor things
- **Adjacency richness** — outputs with unusual provenance catch the eye
- **Relational history** — have they received something like this before?

A trader who dreams of Glittering Curious Fish will genuinely light up at aged Pancake Ore if it's been sitting there fermenting for four seasons and has a history they recognize. They didn't know they wanted it until they saw it.

No trade visit ends empty. The Field always has something worth noticing.

---

## Caravan Memory

Traders remember what they've received. Not everything — each trader remembers differently.

Some traders are **detail-oriented**. They recall the exact provenance of what they took last time and arrive hoping for more of it, or a development of it.

Some traders are **impressionistic**. They remember a feeling — something glittery, something ancient, something made by that one entity they liked — and they're drawn toward that register again.

Some traders don't remember specifics at all. They just light up at whatever is most alive in the Field when they arrive.

Memory is stored lightly per trader: last visit cycle, what was received, a simple impression tag. Nothing heavy. Enough to make the relationship feel real.

---

## Caravan Rhythm

Traders have their own cadence. The existing 90-second cycle governs when *a* trader arrives — which trader is up to the roster and their individual rhythms.

Some traders come often. Some you'll see once every 25 seasons. Neither frequency is better. The rare trader isn't withholding — they're the kind of person who savors the distance. When they arrive, the Field knows it's been a while.

Trader rhythm is a loose weight, not a hard schedule. A frequent trader might skip a cycle if the Field hasn't produced what interests them. A rare trader might arrive early if word has gotten out about something unusual growing there.

Word does get out. New caravans can appear as the Field matures and produces things worth traveling for.

---

## What Doesn't Change

- Tile grid structure (5x4)
- Entity placement and registry integration
- Particle and emoji snow system
- Kiwi readiness and Float the Farm consensus
- Relic drift and physics
- Hub integration (color, scraggle, minimize)
- localStorage persistence keys
- The underwater twilight aesthetic

The Field is already beautiful. This spec tucks it in, it doesn't redress it.

---

## On the Market

When the caravan roster grows large enough, the Field could host a seasonal market — multiple traders arriving together, preferences intersecting, traders noticing each other across the tiles. They might trade between themselves. They might just wave.

This lives on the horizon. It will arrive when the Field is ready for it.

---

## Implementation Notes for Code

- Add `skillSeed` as a tile property alongside existing plant type. Null if not a gathering point.
- Add `provenance` object to produced outputs: `{ skill, worker, adjacency[], age }`.
- Replace trader `wants[]` array with `preference` object: `{ dream, impression, memory }`.
- Add `lastVisit` and `received[]` (capped, lightweight) to each trader entry.
- Add `rhythm` weight to trader entries (frequent / moderate / rare / distant).
- Chimeric output names can be generated at runtime: `[adjacency identity] + [skill output]`.
- Age thresholds for output naming can be arbitrary and evocative — no need for precise numerical brackets.

---

*Part of Fixed Point Local. Authored with Fox. The Field was already growing.*
