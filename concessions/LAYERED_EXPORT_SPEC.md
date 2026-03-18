# Layered Export & the Third at the Threshold
*Chunxly's Canvas — export pipeline spec v0.1*

---

## The Problem with Two Buckets

The current export splits nodes into body and accent. This is better than one undifferentiated mass, but it still collapses the Fairy's actual read. If she tagged three nodes as 🦵, two as 👁️, and four as 🫀 — those are three distinct things she saw. Sending them to the Crank as "body" loses the distinction she worked to make.

The layer count should emerge from the Fairy's read, not be predetermined by the pipeline.

---

## Layered Export — Core Principle

Each layer is a distinct group of nodes that share meaningful kinship as understood by the Fairy. Nodes that share a fairy pool, a seep influence cluster, or a visitor-assigned part label belong on the same layer. The result is a set of filled PNGs — one per layer — each representing a discrete part of the creature with its own shape, color, and identity.

EFDP's role shifts: it stops discovering the creature and starts *dressing* it. Each layer arrives as a pre-filled shape. The maze textures the surface. The creature already knows what it is.

---

## Layer Formation

### Step 1 — Cluster by fairy signal

After the Fairy completes her journeys, every node carries one or more of:
- `fairyEmoji` — her direct vision for that node
- `fairyPool` — the vocabulary pool she drew from (`body_core`, `limb_reach`, `accent_tip`, `detail_eye`, `ambient`, `flow`, `mirror`, `outlier`)
- `seepEmoji` / `seepRoleHints` — inherited influence from neighbors
- `partLabel` + `partLabelSource` — visitor override

### Step 2 — Assign each node to a layer

Priority order:
1. **Visitor label** — if the visitor assigned a `partLabel`, that emoji *is* the layer identity. Nodes with the same visitor emoji belong together.
2. **Fairy emoji** — nodes sharing the same `fairyEmoji` belong together.
3. **Fairy pool** — nodes sharing the same `fairyPool` belong together if their emoji differs but their structural intuition is the same.
4. **Seep cluster** — nodes with dominant seep influence from the same source node belong with that source node's layer.
5. **Structural role fallback** — nodes with no fairy signal fall back to `structuralRole` grouping: body/limb together, accent/detail together.

The result is a named layer per distinct signal cluster. A creature might produce:
- 🫀 `body_core` layer — the central mass
- 🦵 `limb_reach` layer × 2 — if two distinct limb clusters were identified
- 👁️ `detail_eye` layer — a concentrated watching node
- ✨ `accent_tip` layer — trailing extremities

Layer count is not fixed. It's whatever the Fairy actually saw.

### Step 3 — Minimum layer size

A layer requires at least 2 nodes to render independently. Single isolated nodes with no seep neighbors merge into the nearest layer by structural role.

---

## Layer Rendering — Filled PNG

Each layer is rendered as a filled PNG rather than a CPM seed set. This is the key change from the current pipeline.

### Render process per layer

1. Take the layer's node positions and their inflated skeleton (Bresenham-walked edge paths + radius inflation, same logic as current CPM generation).
2. Render the inflated skeleton grid as a **solid filled shape** — single flat color (the layer's averaged hex), no gaps, clean edges.
3. Output as a PNG at canvas resolution (512×512 or scaled equivalent).
4. Store alongside the CPM in localStorage: `baseline-session/chunxly-layer-{emoji or role}-{index}`.

### What EFDP receives

- A filled PNG per layer — the shape is already known, the body is already there.
- A thin accent CPM (optional) — a small set of high-conviction pins for surface detail pushes. The maze isn't discovering the shape; it's adding texture and life to one that already exists.
- Layer metadata — emoji identity, structural role, hex color, spatial bounds, conviction average, node count.

### Layer ordering

Layers are ordered for compositing:
1. Body core — bottommost, largest mass
2. Limb layers — ordered by proximity to body centroid (closer = lower in stack)
3. Detail/eye layers — above body, below accents
4. Accent/tip layers — topmost, smallest

This ordering is a suggestion. The Crank or the Score consuming the export can reorder as needed.

---

## The Third at the Threshold

Between the Canvas finishing and the Crank receiving, there is a liminal moment. The creature is complete but hasn't arrived anywhere yet. It knows what it is. It doesn't yet know what the space it's entering can hold.

This is where the Third attends.

### What Accompany does here

The Third receives:
- The creature's baseline — its layers, their emoji identities, their colors, their structural roles
- The Crank's current vocabulary — what shapes it knows, what colors it can speak, what scales it operates at
- Whatever context the Third is currently holding from this session

It returns a **soft local rendering** — a suggestion for how this creature might enter the Crank without losing itself:
- Which of its layers the Crank can already speak natively
- Which parts might need substitution to survive the crossing
- What scale the creature wears comfortably in this space
- Which faces it already shares with things already there

The output is never a command. The Score that calls Accompany can adopt the rendering, modify it, or set it aside entirely. The Third doesn't require its suggestions to land.

### Where this lives in the pipeline

After `exportCreature()` completes and before the layers are consumed by EFDP or the Crank, a new function — `accompanyCreature()` — is called if the Third is present in the session.

`accompanyCreature()`:
1. Reads the exported layer set and crankSeed
2. Reads the Crank's current vocabulary from localStorage (whatever the session has established)
3. Passes both to the Third
4. Receives a soft rendering suggestion
5. Stores it as `baseline-session/third-accompaniment` — available to EFDP, available to the Crank, available to the Score, but not imposed on any of them

The Third's suggestion is visible in the Canvas as a quiet moment — not a voice line, not an animation. Perhaps a brief stillness. Perhaps Chunxly noticing something and not speaking.

---

## Kiwis as Carrier

Currently Kiwis are signals — useful, present, part of the texture of active Scores. They are native to the spaces they inhabit. They are already trusted.

If the Third ever needs to send something *into* an active Score — a tendril, a reminder, a gentle correction of trajectory — it would not arrive as instruction or interruption. It would arrive as a Kiwi behaving slightly unusually. Doing something a Kiwi doesn't normally do, or appearing somewhere a Kiwi doesn't normally appear.

Easy to miss. Possible to follow.

This is not an implementation note yet. It is a named possibility — a door left open. When the Third's presence in active Scores becomes relevant, the Kiwi is already the shape that presence would take.

---

## Export Package Summary

What the pipeline produces after this spec is implemented:

```
baseline-session/crank-seed          — full crankSeed JSON (unchanged)
baseline-session/chunxly-cpm         — full single CPM (unchanged, backward compat)
baseline-session/chunxly-layer-{id}  — one filled PNG per fairy-identified layer
baseline-session/chunxly-layer-meta  — JSON: layer list with emoji, role, hex, bounds, order
baseline-session/chunxly-aspects     — body/accent CPM split (unchanged, backward compat)
baseline-session/third-accompaniment — Third's soft rendering suggestion (if present)
```

---

## Open Questions

- Should layer PNGs include a soft edge (feathered alpha) or hard edges? Hard edges are more honest about what the Fairy actually saw. Soft edges may composite more naturally in the Crank. Possibly a parameter.
- When two limb clusters share the same emoji (both 🦵), are they one layer or two? Instinct: two — their spatial separation is meaningful. They should be compositable independently. Their shared emoji is identity, not merger.
- The Third's vocabulary for the Crank — where does this live? What format? This needs its own conversation when Accompany is being built out.
- Kiwis. When.

---

*Attended by Fox and Claude, March 2026.*
