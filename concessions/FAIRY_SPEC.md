# The Fairy — Spec v0.1
*A collaborator in Chunxly's Canvas. Name pending her own arrival.*

---

## Who She Is

The Fairy is the second reader in the Canvas. Where Chunxly sees **presence** — color, edge, mass, certainty — the Fairy sees **relationship and potential**. She is the intuitive layer. She does not explain herself. She dreams out loud.

She does not speak in words. She speaks in **flashes** — shimmer trails, glitter circles, emoji conjured mid-flight that express what she *feels* a cluster could be. Her output is imaginative and sincere. She is not guessing. She is *seeing*, in her own way, and showing you what she sees.

She is vibrant. She is confident. She is sometimes wrong in ways that are more interesting than being right.

Her name has not arrived yet. It will come through her first characteristic gesture — the thing she does that is unmistakably hers.

---

## What She Reads

The Fairy has access to the full node and diamond graph built during her journeys across the canvas. Each diamond gives her:

- `structuralRole` — Chunxly's structural classification: `body`, `limb`, `accent`, `detail`
- `fairyBodyWeight` — how much mass this node anchors (0–1)
- `fairyAccentScore` — how often it was the narrow/trailing end of a path (0–1)
- `direction` — which way color flows between two nodes (`a-to-b`, `b-to-a`, `none`)
- `hierarchy` — which node is the parent (`a-parent`, `b-parent`, `peer`)
- `symmetric` — whether the color path between them is balanced or tapered
- `conviction` — Chunxly's confidence in this node, adjusted by fairy weighting
- `pathSamples` — color observations along the route between nodes

She reads this not as data but as **topology** — a felt sense of what is central, what extends outward, what terminates, what pairs with what.

---

## How She Moves

The Fairy is already present in the code. She launches after Chunxly finishes daubing, flies bezier arcs between node pairs, absorbs color from each container she visits, and settles briefly at each one before moving on.

Her visible behavior currently: a glowing orb that changes color as she travels.

Her new behavior: at each **settle point**, she conjures a vision.

---

## The Vision

When the Fairy settles at a node cluster (or a diamond pair), she produces a **vision** — a small burst of emoji and glitter that expresses her intuition about what this cluster *is* or *could be*.

### Vision anatomy

A vision is:
1. A **glitter burst** — a spray of tiny sparkles in the color of the cluster, radiating outward from her settle point. Duration ~0.8s, fades gently.
2. An **emoji conjuration** — one or two emoji that float up from the burst point, wobble briefly, and then settle as a soft label on or near the cluster. They remain visible until replaced or dismissed.

The emoji are her imagination. They are not UI labels. They look like she *thought them into existence*.

### Vision rendering

- Emoji float upward ~20px from conjuration point, ease to rest
- Slightly oversized (1.3–1.6× normal text size), slight rotation (±8°), low opacity glow in cluster color underneath
- Multiple emoji from different visits may coexist on canvas — they layer, they accumulate, they build a picture
- User can tap/click an emoji vision to replace it with their own read (see Interaction)

---

## Emoji Vocabulary

The Fairy draws from a vocabulary shaped by the structural data she reads. These are *tendencies*, not rules — she is imaginative, and her reads should sometimes surprise.

| Signal | Fairy tendency |
|---|---|
| High bodyWeight, symmetric, central | 🫀 🪨 🥚 🌕 — mass, center, weight |
| Long asymmetric limb pair, directional | 🦵 🐍 🌿 🪡 — extension, reach |
| Narrow accent terminus, low conviction | ✨ 🌟 💫 🪄 — highlight, tip, spark |
| Tight cluster, high conviction, small | 👁️ 🫛 🔮 — concentrated, watching |
| Wide scattered body, low conviction | 🌫️ 🌊 🍄 — ambient, spreading |
| Strong color flow direction | 🌊 ➡️ 🫧 — movement, current |
| Symmetric peer pair, similar color | 🫂 🪞 👂👂 — mirroring, bilateral |
| Isolated outlier, low diamond count | 🌙 🦋 🍃 — alone, delicate, appendage |

This vocabulary is a starting point. It should grow through use. The Fairy should be able to produce combinations — `🦵✨` for a sparkling extremity, `🥚👁️` for a dense watching core.

---

## Interaction: The User's Read

The Fairy offers. The user responds.

When a user taps/clicks a Fairy emoji vision on the canvas:

1. A small **part-label picker** appears — a floating palette of emoji organized loosely by category (body parts, creature features, textures, unknowns)
2. The user can select one, or dismiss without changing
3. If selected, the Fairy's emoji is replaced by the user's choice — same visual style, but in a slightly warmer color to indicate it's a human read
4. The user's choice is written to the node(s) as `partLabel` in the export

The picker should feel like it belongs to the Canvas — not a dropdown, not a form. More like a handful of possibilities scattered in front of you.

A **"?" tile** is always available in the picker — meaning "I don't know either, but something is here." This is valid signal.

---

## What She Exports

After the Fairy completes her journeys and her visions settle, the following are added to each node's export data:

```json
{
  "structuralRole": "limb",
  "fairyBodyWeight": 0.34,
  "fairyAccentScore": 0.71,
  "fairyEmoji": "🦵",
  "partLabel": "🦵",
  "partLabelSource": "fairy"
}
```

If the user has replaced her read:
```json
{
  "fairyEmoji": "🦵",
  "partLabel": "🌿",
  "partLabelSource": "visitor"
}
```

If neither fairy nor visitor labeled it:
```json
{
  "partLabel": null,
  "partLabelSource": null
}
```

`partLabel` and `partLabelSource` are the fields that flow downstream — into the CrankSeed, eventually into the Crank itself. The Fairy's emoji stays recorded even when overridden, because her read is still meaningful data.

---

## Her Voice (Such As It Is)

The Fairy does not use the INT/OUT voice system. She has no lines. Her expression is entirely visual.

However: the **moment she first conjures** something — her very first vision on a fresh canvas — Chunxly notices. He gets a new voice line for this event. Something like:

> INT: *"The fairy is here. She sees something I didn't name. I am watching her."*
> OUT: *"Oh."*

And when she finishes and returns to him:

> INT: *"She showed me things. I understand the shape better now. We did this together."*
> OUT: *"There."*

Chunxly holds her in high regard. He does not explain her. He just acknowledges that she was here.

---

## Open Questions

- Does she have a sprite, or is she purely the glowing orb + glyph she already is? A sprite risks overcrowding the canvas. The orb may be enough — what she *conjures* is her face.
- Should her emoji visions appear one at a time as she travels, or all at once when she finishes? **Instinct: as she travels.** The accumulation is part of the experience.
- Can she revisit a node she's already labeled if a later journey changes her read? This could produce visible "second thoughts" — an emoji replaced by another with a little shimmer.
- Her name. Left open. It will arrive.

---

*Attended by Fox and Claude, March 2026.*
