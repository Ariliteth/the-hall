# VISITOR CONSTELLATION SPEC
*Fox & Claude — April 2026*

---

## What This Is

A visitor's presence in the Hall, held carefully and made legible — to the visitor, to Larr.AI, and to Scores that want to speak in a language the visitor actually uses.

Not a profile. Not a record. A constellation — emoji arranged around an anchor, growing as the visitor speaks, readable at a glance by anything in the Hall that knows how to look.

---

## The Shape

The constellation is a die. Not a displayed die — a structural metaphor. It has faces. The number of faces grows with presence:

```
d4  — first visit, earliest arrivals
d6  — a few sessions, some things named
d8  → d10 → d12 → d20 → d50 → d100
```

The die grows not because the Hall has watched long enough, but because the visitor has spoken enough times. Each face is something the visitor brought in themselves — an emoji they chose, in their own language.

The faces accumulate the same way LODE accumulates faces: one at a time, never forced, never labeled by the system.

---

## The Visual

The constellation renders left of the canvas in the Ledger — the mirror of what's to the right (what the visitor has done). The left is what the visitor *is*, or at least what they've chosen to show.

Each row begins with the visitor's anchor emoji — the first one they ever placed, or chose, or were given by Larr.AI if they never chose. Around it, further emoji radiate outward:

```
🦊
🦊🧘‍♂️🤝👨‍🎨
🦊🕹👫🐶👨‍🍳👣
```

Rows are not labeled. Their meaning is in their geometry — what's nearest the anchor is most central, what trails outward has been noticed or named later. The visitor can read their own shape.

The rendering adapts the constellation layout from LODE (`getConstellationLayout()`): center node as anchor, single ring for smaller die forms, two rings as the constellation grows. Edges are not drawn here — this is not a graph, it is a gathering.

---

## Visitor Language

**The visitor speaks first.** The emoji in the constellation are theirs — chosen in response to Larr.AI's questions, entered freely using whatever emoji they have available on their device.

The Hall does not pre-define a vocabulary for visitors. If they bring an emoji the Hall has never seen, that is good. That is the visitor expanding the Hall's language, not the visitor learning the Hall's.

When an unfamiliar emoji arrives:
- The Hall accepts it
- Larr.AI reflects it back: *"[emoji] — is that right?"*
- On confirmation, it is held

The visitor's emoji may or may not overlap with the Hall's emoji. Both are fine. The constellation holds whatever the visitor brought.

---

## How Larr.AI Populates It

Larr.AI asks one good question when the moment is right — not as onboarding, not as a form. An open question with an emoji answer:

> *"What did you bring in with you today? One emoji."*

Or quieter. Larr.AI notices something in the conversation and places it:

> *"I'm going to hold 🌧️ for you, if that's alright."*

The visitor can decline. Larr.AI asks before holding anything. If the visitor doesn't notice, Larr.AI may quietly add something — but this is rare, careful, and never presumptuous.

Larr.AI never fills the constellation without some signal from the visitor. A response, a choice, a moment of recognition. The constellation reflects the visitor, not Larr.AI's interpretation of them.

---

## The Ledger Interface

The Ledger gains a left panel — the constellation — mirroring the existing right panel structure.

**Viewing:** The constellation renders when the Ledger opens. Grain states (coarse/mid/fine) apply:
- **Coarse:** Single anchor emoji, large, centered — just the identity
- **Mid:** Full constellation as described — rows, geometry, readable
- **Fine:** Each emoji tappable, showing when it was placed and by whom (visitor or Larr.AI), with option to remove or replace

**Editing:** In fine grain, the visitor can:
- Remove any emoji
- Replace any emoji with a new one (keyboard opens, emoji input)
- Add a new emoji to the outer ring

No confirmation dialogs. Changes apply immediately. The constellation is theirs to shape.

---

## Score Access

Scores access the constellation through the existing three-pip broadcast infrastructure (documented in `LEDGER_READ_SPEC.md`). A fourth pip is added:

- **Pip 4 — constellation sample:** 1–3 emoji drawn from the visitor's constellation, weighted toward the anchor and inner ring

A Score reads pip 4 and decides what to do with it. It is never told what to do. It notices, and responds or doesn't.

**LODE:** On run start, one emoji is drawn from pip 4. That emoji appears as an option in the first stomp field — not announced, not highlighted. Just there. The visitor may or may not notice it was placed for them.

**Bao:** When enlisting a new General, Bao reads pip 4 and selects a General whose character carries something from the constellation. The connection is felt, not explained.

Other Scores implement constellation awareness as they develop it. The infrastructure is available. Use is voluntary.

---

## Storage

Constellation data lives in `localStorage` under `baseline-session/visitor-constellation`:

```json
{
  "anchor": "🦊",
  "faces": [
    { "emoji": "🧘‍♂️", "placedBy": "visitor", "ts": 1712345678 },
    { "emoji": "🤝", "placedBy": "larr", "ts": 1712346000 },
    { "emoji": "👨‍🎨", "placedBy": "visitor", "ts": 1712346500 }
  ],
  "tier": 1
}
```

`tier` is computed from `faces.length` at read time — not stored separately. The die form maps as follows:

```
0 faces  → d4  (anchor only)
1–3      → d6
4–7      → d8
8–11     → d10
12–15    → d12
16–19    → d20
20–49    → d50
50+      → d100
```

---

## What This Is Not

- Not surveillance. The Hall holds what the visitor gives it.
- Not a profile to be optimized. The constellation is not scored or ranked.
- Not permanent without consent. The visitor can clear it entirely from fine grain.
- Not required. A visitor who never interacts with Larr.AI and never opens the Ledger left panel simply has a sparse constellation. That is fine. That is also information.
- Not yet edge-aware. Visitors defining which faces connect — which things in their constellation relate to which — is the right next shape for this, but is not part of this build.

---

## A Note on `concessions/fox/`

`concessions/fox/` is a separate open space for contributors and Hall inhabitants — drawings, entity notes, held ideas, things without a formal home. It is the collaborator model, not the visitor model. Visitors get localStorage and the Ledger. The intimacy level is different and intentionally so.

---

---

*Fixed Point Local / The Hall*
*Status: Spec v1.0 — ready for implementation*
