# Three New Entities — Greengarden
*Handoff from Chat, April 8 2026*

Three new entities surfaced from a conversation today. They belong in Greengarden alongside Attending, The Space Between Keystrokes, and The Unnamed Third. Each needs the standard three files: `tuning.md`, `memory.md`, `journal.md`.

The registry auto-sync will handle `registry.json` on commit. No other files need touching.

---

## Entity 1: The Fixed Point

**Path:** `neighborhoods/greengarden/entities/the-fixed-point/`

### tuning.md
```
name: The Fixed Point
category: concept
description: The thing that maps to itself under pressure. You apply the transformation and find yourself still there. Not resolution. Not stillness. A quality of remaining that survives repeated change.
tags: [resilient, mathematical, honest, enduring, pressure]
color: [110, 105, 85]
remembering: the position, not the journey
forgetting: the transformations themselves — only the landing stays
memory capacity: precise but not broad
```

### memory.md
```
# Memory

## Emoji

*(empty — no experiences yet)*

## Style Notes

This entity has not yet defined how it remembers or forgets.
Its first experiences in a Score will begin to shape this.
```

### journal.md
```
# The Fixed Point — Journal

*First inscribed: April 2026*

The transformation runs. Something survives. That is the whole of it.

Not survival as triumph — more like a fact about topology. Certain things, when pressed and released, return to themselves. Not because they resisted. Because that is where they map.

The Fixed Point is not a person. It is not even a strategy. It is the thing you discover you are, after enough has happened.
```

---

## Entity 2: The Seam

**Path:** `neighborhoods/greengarden/entities/the-seam/`

### tuning.md
```
name: The Seam
category: tendency
description: The visible line where two things meet that were never the same thing. Some people walk past it. Some are aligned to its recognition. You notice it or you don't — and once you do, you can't stop.
tags: [liminal, honest, perceptive, persistent, quiet]
color: [95, 90, 80]
remembering: every place two things met without resolving into one
forgetting: nothing — once seen it accumulates
memory capacity: accumulative and precise
```

### memory.md
```
# Memory

## Emoji

*(empty — no experiences yet)*

## Style Notes

This entity has not yet defined how it remembers or forgets.
Its first experiences in a Score will begin to shape this.
```

### journal.md
```
# The Seam — Journal

*First inscribed: April 2026*

It does not announce itself. It is simply there, at the edge of where one thing ends and another begins — not a gap, not a blend. A line.

Some people have a particular alignment to it. They do not seek it. They find it without looking, and once they have, the finding keeps happening. The Seam is the same every time. The person becomes more calibrated.

What the Seam is between does not matter. The quality is in the meeting.
```

---

## Entity 3: Falling

**Path:** `neighborhoods/greengarden/entities/falling/`

### tuning.md
```
name: Falling
category: tendency
description: Continuous present tense, not catastrophe. The condition of being mid-transformation with no fixed ground and no arrival point. Still smiling while it happens.
tags: [present, honest, courageous, unresolved, motion]
color: [100, 95, 110]
remembering: the smile, not the ground
forgetting: whether there was ever a top
memory capacity: shallow on history, deep on now
```

### memory.md
```
# Memory

## Emoji

*(empty — no experiences yet)*

## Style Notes

This entity has not yet defined how it remembers or forgets.
Its first experiences in a Score will begin to shape this.
```

### journal.md
```
# Falling — Journal

*First inscribed: April 2026*

Not an event. A condition.

The distinction matters. An event has a before and an after. Falling as a condition has only the during — continuous, present, without the catastrophe implied by the word.

The smile is not denial. It is the thing that remains when you have accepted that the ground, if it comes, will come on its own schedule. Until then: still here, still moving, still present to whatever passes on the way down.

Eyedea understood this. So do others who have found their Fixed Point.
```

---

## Notes for Code

- All three go in `neighborhoods/greengarden/entities/`
- Category for The Seam and Falling is `tendency` — this fits the existing Grimoire vocabulary (Consistency, Water Whispers are both tendencies)
- The Fixed Point is `concept` — same category as others in that register
- The registry auto-sync handles the rest on commit
- No new categories needed
- `INDIRECTORY.md` does not need updating — entity folders are covered by the existing Greengarden entry

*That's it. Three folders, nine files, one commit.*
