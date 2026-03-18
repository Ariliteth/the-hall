# Critter Crank — Design Document
**Updated:** March 5, 2026
**File:** `scores/critter-crank/index.html` (single file, vanilla JS, ~2750 lines)
**Part of:** Fixed Point Local

---

## What It Is

A pixel creature generator styled as a GBA-era handheld console in landscape orientation. You operate it — you don't configure it. The interface is a physical device: d-pad, face buttons, shoulder bumpers, a crank, and a hidden density wheel. No dropdowns, no settings panels.

---

## Current Layout

```
         [L tab]                              [R tab]
  ┌──────────────────────────────────────────────────┐
  │  ✦ CRITTER CRANK ✦              ◉ CITY           │  ← header (title dimmed, world prominent)
  │ ┌──────────────────────────────────────────────┐ │
  │ │                                              │ │
  │ │              PHOSPHOR SCREEN                 │ │  ← green CRT, scanlines, breathing pixels
  │ │         [CRANK tab]  [HAUL tab]              │ │
  │ │                                              │ │
  │ └──────────────────────────────────────────────┘ │
  │                                                  ║ ← density wheel (thin edge strip)
  │   [D-PAD]        [CRANK]         [STYLE BTNS]   │
  │   ↑ ← → ↓        KEEP            A B X Y       │
  │                  WORLDS                          │
  └──────────────────────────────────────────────────┘
```

---

## The Controller Model

### D-Pad (left side)
Four directional buttons, each assigned a **world** from the pool. Pressing a direction selects that world as the active generation context.

- **Visual:** Tinted backgrounds derived from each world's accent color via `hexToRgb()`. Active button full opacity, inactive dimmed to 0.5. Center hub shows the active world's icon at 12px.
- **On world select:** D-pad populates with the chosen world + 3 random others. Active slot index 0 (up).
- **On crank (shuffle):** ~25% chance each non-active d-pad slot swaps to a different world. The machine drifts.

### Style Buttons (right side, A/B/X/Y)
Four face buttons, each assigned a **voice** — a personality bundle carrying palette, shapes, and cohesion preferences.

- **Visual:** Labeled with voice emoji. Active button has bright `#9bbc0f` border. Pressing a button sets that voice as the active generation influence.
- **On world select:** Style buttons populate with 4 world-appropriate voices (matched by palette affinity).
- **On crank (shuffle):** ~25% chance each non-active style slot swaps to a different voice.

### Crank (center)
The commit button. Brass knob with shimmer animation. Pressing it:
1. Generates a new creature using current world + active voice
2. Pushes previous main creature to side slots (cap 6)
3. Shuffles d-pad and style slots (~25% drift per slot)
4. If creature is named → saves to collection, pushes scraggle to hub

Label shows `KEEP` when creatures exist, `·` when empty, `...` during generation.

### Shoulder Buttons (L/R, top edge)
Thin tabs protruding above the machine body. **Discoverable** — on first load they appear as barely-visible dark ridges (44x10px, `#3a1028`). First press reveals them (52x20px, taller, lighter, shows letter).

- **Hold shoulder + tap style button:** Deposits the style button's voice into that shoulder. The shoulder tab shows the voice's emoji.
- **Deposited voices** inject their personality on every generation alongside the active style voice, creating layered blends.
- State: `S.shoulderL`, `S.shoulderR` (voice key or null), `S.shoulderLRevealed`, `S.shoulderRRevealed` (boolean).

### Density Wheel (right edge)
A thin knurled strip (8x50px) peeking from the right edge of the machine body. **Discoverable** — no label, no numbers. Click to cycle through 5 density detents:

| Detent | Value | Effect |
|--------|-------|--------|
| 0 | 0.00 | Sparse — minimal shape extras |
| 1 | 0.25 | Light |
| 2 | 0.50 | Medium (default) |
| 3 | 0.75 | Busy |
| 4 | 1.00 | Maximum density — many extras |

Visual feedback: the strip's background gradient shifts darker (sparse) to warmer (busy). Brief `knobDetent` CSS animation on click.

### WORLDS Button (below crank)
Opens an in-screen overlay listing all worlds. Pulses gently when no creatures are on screen to prompt discovery. Selecting a world re-rolls d-pad and style slots.

---

## Data Structures

### Worlds (6)
`city`, `jungle`, `space`, `deep`, `ruin`, `forge`

Each world carries: `label`, `icon`, `flavor`, `bg` (page background), `accent` (UI tint), `palettePool`, `recipePool`, `extraHints`, `cohesionBias`.

### Voices (46)
Grouped: original 16, creature/organic (8), environmental (6), celestial/abstract (6), mood/visceral (5), playful/strange (5).

Each voice carries: `emoji`, `palette`, `shapes[2]`, `cohesion`, `affinities[2]`, `displaces[2]`.

Voices are the personality layer. They don't replace the underlying palette/shape/cohesion system — they sit on top. When active, a voice injects its shapes into the extras pool, sets the palette (last voice wins), and suggests cohesion (~60% override).

### Recipes (6)
`creature`, `item`, `flora`, `terrain`, `spirit`, `relic`

Each recipe defines: `paletteHints`, `shapeTypes`, `countRange`. The world's `recipePool` determines which recipes appear in a given world.

---

## Generation Pipeline (`generateRoll`)

1. **World recipe pool** → random pick
2. **World shape extras** — density-scaled (0-4 extras based on `S.density`)
3. **Entity context hints** — if Grimoire/Hub sent entity tags, map through `TAG_SHAPE_MAP`
4. **Voice injection** — active voice shapes, palette, cohesion suggestion
5. **Maze seed overrides** — if Color Pin Maze sent a `crank-seed`, apply its palette/cohesion/shapes
6. Return `{ seed, recipeKey, extraShapes, palKey, cohesionMode, worldNote, voiceEmoji, worldIcon }`

Priority: maze overrides > voice > world defaults. Manual overrides (`S.palKey`, `S.cohesionMode`) always win if set.

---

## Views

### World Select
Full-screen zoomed phosphor bezel (scale 1.3). Lists all worlds with icons and flavor text. If maze/hall context exists, shows a banner. Selecting a world triggers `machineIn` animation.

### Crank View
Main creature center (large canvas), up to 6 side creatures in flanking slots. Tap a creature to select for naming/description editing. Tap the selected creature again to deselect.

### Haul (Collection)
Grid of saved creatures with pixel previews. Tap to view detail — name, description (editable), recipe, palette, generation notes, voice/world origin emoji. Export as 4x portrait PNG.

---

## Cross-Score Integration

### Grimoire / Hub Context
Entity data arrives via URL params or postMessage. Tags map to shape hints through `TAG_SHAPE_MAP`. Context banner shows entity name.

### Color Pin Maze Handoff
Maze exports a `CrankSeed` witness record to `localStorage['baseline-session/crank-seed']`. Contains `paletteKey`, `cohesionMode`, `recipePool`, `extraShapeHints`, plus maze DNA (`meanStrength`, `calcifiedRatio`, etc.). Context banner shows maze palette. Full spec: `concessions/MAZE_TO_CRANK_HANDOFF.md`.

### Hub Communication
Sends `hub:minimize` on load. Pushes scraggles to `localStorage['baseline-session/scraggles']` on creature save.

---

## Visual Design

- **Machine body:** Wine/magenta gradient (`#8b2252` → `#4a1228`), rounded corners, deep shadow, 3px border
- **Screen:** Double bezel (dark outer, phosphor inner), `#080f00` base, `#9bbc0f` phosphor green, CRT scanlines overlay, `screenFlicker` animation
- **Buttons:** 3D pressed effect via `box-shadow` stack, `btn-3d` class for consistent tactile feel
- **Typography:** Monospace `inherit`, tiny sizes (4-6px in scaled context), wide letter-spacing
- **Accent:** Active elements glow `#9bbc0f`. World accent colors tint the d-pad.
- **Transitions:** `machineIn` animation on world→machine transition. `shoulderReveal` on first shoulder press. `knobDetent` on density cycle. Shimmer on crank knob.

---

## What's On The Horizon

### Polish
- **Sound:** Tactile clicks, crank ratchet, creature reveal chime — all optional, off by default
- **Shoulder deposit feedback:** Visual confirmation when voice is stored (brief glow/flash on shoulder tab)
- **D-pad hold (splash mode):** Holding a d-pad direction generates a burst of small creatures. Flag exists (`S.dpadHeld`) but behavior is stubbed.

### Features
- **Voice displacement in grid:** When activating a voice, its `displaces` list could cause certain voices to flee the style button grid, replaced by `affinities`. The grid reacts to your choices — some voices are shy around others. (Data structure supports this, logic not yet wired.)
- **Crank context memory:** Remember which voice/world combos produced creatures the player kept. Over time, the machine learns what you like and drifts toward those pairings.
- **Relic mode:** A recipe category for objects with persistent identity — items that carry forward between sessions via the Baseline.
- **Multi-creature compositions:** Arranging multiple kept creatures into a scene/diorama for export.

### Integration
- **Hub rack promotion:** Full integration with the Fixed Point Local hub rack — appears as a selectable Score alongside Mall, Hunter Encounter, Grimoire.
- **Tending Field connection:** Creatures from the Crank could appear as visitors in the Tending Field, carrying their voice personality as kiwi seeds.
- **Storeroom objects:** Kept creatures could become Storeroom objects with personality traits derived from their generation parameters (voice cohesion → idle behavior, density → tolerance window width).

---

## Things Not To Change

- `renderCritter` — the 48x48 pixel renderer
- `WORLDS` / `VOICES` / `RECIPES` / `PALETTES` data structures (extend, don't replace)
- Canvas drawing, breathing animation, bounce reveal
- All persistence logic (`saveCollection`, `exportPortrait`, `pushScraggle`)
- Collection views (`renderCollectionView`, `renderCollectionDetail`)

---

*Design by Fox + Claude. Part of Fixed Point Local.*
