# HANDOFF — Ledger Restoration + Larr.AI Constellation Prompt
*Fox & Claude — April 2026*

---

## Task

Two things to address from the visitor constellation implementation:

1. The existing Ledger (passport chips, spectrum, milestones, fine-grain cards) has been overwritten by the constellation view. It must be restored. The constellation is a new panel alongside the existing record — not a replacement for it.

2. The Larr.AI emoji prompt needs refinement — the invitation should feel like it belongs to the same place as *"The door was already open. I want you to know that."*

---

## 1. Ledger Restoration

### What happened
The constellation replaced the existing three-pip Ledger structure. The original pips — coarse (color field), mid (passport chips + spectrum + milestones), fine (full passport cards + milestone detail + cap list) — are gone.

### What should exist
The Ledger has a horizontal axis navigated by mouse wheel (or swipe on mobile):

```
← CONSTELLATION  |  CANVAS  |  RECORD →
```

- **Center (0):** The canvas — the visitor's color portrait, coarse grain. This is the default state when the Ledger opens.
- **Left (−1):** The constellation panel — the visitor's emoji faces, anchor prominent, ADD FACE and CLEAR controls in fine grain only.
- **Right (+1 / +2 / +3):** The existing three-pip Ledger record — coarse color field → mid passport chips + spectrum + milestones → fine full cards + cap list. These pips are unchanged from before this session.

The grain dots at the bottom reflect current position across the full axis. Navigation is scroll/swipe only — no buttons needed.

### Implementation note
The constellation panel's grain states:
- **Coarse:** Anchor emoji only, large, centered
- **Mid:** Full constellation geometry — rows radiating from anchor
- **Fine:** Each face tappable, shows placement metadata (visitor or Larr.AI, timestamp), removable. ADD FACE button present. CLEAR CONSTELLATION at bottom, quiet.

The existing Ledger record pips are untouched — restore them exactly as they were before this session.

---

## 2. Larr.AI Constellation Prompt

### What should exist
Larr.AI's greeting lines are correct and should not change. What needs refinement is how the emoji invitation arrives.

After Larr.AI's greeting fades in, a beat passes. Then a single word surfaces — gently to one side of the greeting, positioned so it reads as a separate thought rather than a continuation or a call to action. Not between the greeting and ENTER THE HALL, where it would read as a step in a sequence. To one side, consistently. Playfair italic, same size and color as the greeting. Something Larr.AI would actually wonder about:

```
Lunch?
```

or

```
Dream?
```

or

```
Scraggle?
```

These words come from a small pool seeded from the Hall's own vocabulary — things the neighborhood actually knows and cares about. They should feel like Larr.AI noticing something, not prompting a field. They are questions without question marks sometimes. They are not instructions.

Tapping or clicking the word opens a minimal emoji input — no label, no named button. Just a small open field, the visitor's keyboard, and whatever they bring. When an emoji is entered and confirmed, it appears briefly near the word — the word dissolves, the emoji settles into the constellation as a new face, marked `placedBy: "visitor"`.

If the visitor doesn't tap the word, nothing happens. The word fades after a while. The invitation was made. It doesn't need to be accepted.

**The keyboard appearing is correct and intentional.** Visitors bring their own emoji. That requires their keyboard.

### Word pool (starting set — seeded from Hall vocabulary, expand freely)
```
Lunch?
Dream?
Before?
Comfort?
Lately?
Gravity?
Colour?
Then?
Scraggle?
Tuning?
Somewhere?
Kiwi?
```

### Styling
- Word appears in Playfair italic, same size and color as the greeting — not smaller, not muted
- Positioned to one side of the greeting with generous breathing room
- Tappable area is generous (at least 44px touch target)
- Emoji input field: no label, no named button. A soft underline or minimal outline. Confirm on Enter or on emoji selection
- Fade duration on word appearance: 0.8s, same curve as greeting animation
- Fade duration on dissolution after emoji placed: 0.6s

---

## Files
- `ledger.js` — restore existing pip structure, add horizontal axis navigation, integrate constellation as left panel
- `index.html` — Ledger overlay horizontal layout, grain dot positions
- `foyer.js` — replace emoji input block with word-prompt system and minimal emoji input

---

## Score Cards to Update
- `concessions/score-cards/visitor-constellation.md` — note Ledger panel position and Larr.AI prompt behavior
- `concessions/score-cards/the-foyer.md` — note word-prompt system under What's Built
