---
name: Taste Score
description: Taste grocery shopping game — current state, ghost list, design decisions, future direction
type: project
---

## Current State (March 2026)

Pass 1 complete + Ghost List (Pass 2 first feature).

**Location:** `scores/taste/index.html` — single file, vanilla JS, DOM-based (no canvas except blade cross-section).

**Phases:** lamp → chooseStore → shopping → goingHome

**Pass 1 (complete):**
- Single store: Maria's Produce (careful shop)
- Single department: Citrus (lemon, orange, grapefruit, lime)
- Three tools: Fruitrampoline (weight), Gentle Calipers (firmness+freshness), The Blade (juiciness+freshness+color, one use per basket)
- Wife's list: 2-3 items per run, explicit preferences, seeded per run
- Trophy system: gold plastic weathers to silver, magnitude > 0.9 = gemstone
- Inner critic: ambient voice, appears after tool use, notices substitutions
- Hub protocol: sends `hub:listen` (no HUD bar — Taste wants to breathe)

**Ghost List (complete):**
- One persistent entity across all runs, known by handwriting not name
- Stable identity seed generated on first run, persists in localStorage
- 1-2 items per run, partially illegible (smudge system replaces word spans with `~~~`)
- Legibility varies per run (seeded 0.2–0.8 intensity), ~15% chance fully illegible
- Ghost slots in sidebar below wife's list, spectral CSS (breathing animation, blur, low opacity)
- Optional — "Done Shopping" only requires wife's list filled
- No critic voice on ghost allocation (ghost doesn't judge aloud)
- Going home: ghost reflection fades in after trophy (10s animation, 50% peak opacity)
  - Warmth calculated from quality vs ghost's desire
  - Warm: "#c8a860", Cool: "#7a7a7a", Neutral: "#9a9080"
- Ghost drift: preferences accumulate slightly based on what you give it
- Ghost history: last 8 runs stored
- Lamp hint: faint `~~~` appears at bottom of lamp phase when ghost has history

**Persistence:** `localStorage['baseline-session/taste']` — run count, wife satisfaction/memory, trophies, critic preferences, ghost seed/history/drift.

## Design Decisions
- Stock gaps are intentional — store doesn't guarantee what wife needs
- Slicing commits the item — "(cut)" stays on display
- Five quality attributes are complete (weight, firmness, freshness, juiciness, color)
- Ghost is one entity, not many — identity through repetition, not mechanics
- Ghost illegibility is real — sometimes all you get is `~~~`
- Ghost carries no consequences — it will be happy regardless
- Ghost section header is itself partially illegible ("som~~~ne's list", "~~~", etc.)

## Future Direction (from Fox's handoff doc)
- **Magazine**: diegetic tutorial / theme socket
- **FruitScoot orders**: transactional second list, proportional payment
- **More stores**: each with distinct character
- **More departments**: potatoes (bin/explore-exploit), apples (shelf sorting), melons (new tool), avocados (reveal only at home)
- **Testing degradation**: over-handling has texture cost
- **Store relationships**: 4-U sticker (store knows you)
- **Wife voice range**: warmth vs sharpness
- **Trophy shelf overflow**: allocation game of its own
- **Critic growing opinions**: learns patterns, develops preferences
