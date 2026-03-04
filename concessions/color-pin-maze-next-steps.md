# Color Pin Maze — Next Steps
### Implementation Plan for Pipeline-Ready Diffusion

*Refined from design session, March 3 2026*
*Builds on: `color-pin-maze-design.md` (v1.0) and `scores/color-pin-maze/index.html` (working prototype, promoted from concessions)*

---

## Context

The prototype works. All three pin types function (circle erosion, square building, triangle beaming), decay is in, legacy walls land, kiwis track events, meteor drops clear space on placement. The aesthetic system is proven.

The problem: **coverage gaps.** Pins die before reaching distant corridors. With 3–5 manually placed pins on a 30x30 maze, large regions stay unclaimed. For the Crank pipeline, every cell needs color. The system needs to be practical, efficient, and fast — while staying interesting enough to also work as a toy or Score.

---

## Design Shift

The original design doc treats layers as typed phases (Full Assertion → Negotiated Presence → Appropriate Scale). The refined model treats **layers as generic, configurable, stackable units.** The three-phase pattern from the design doc becomes a *preset*, not a rule.

Each layer has settings:
- **Blend mode** — alpha/mix with layers below, or full overwrite
- **Press** — whether a flatten-press runs after diffusion to guarantee full coverage
- **Pin density** — how many pins, manually placed or auto-scattered
- **Decay rate** — how fast pins burn out (or zero for full assertion)

You stack as many layers as you want. The Crank pipeline saves layer stacks as presets.

### The Standard Three-Layer Preset

This is the expected default for Crank content, but it's a preset — not hardcoded.

**Layer 1 — Background.** Placed pins + auto-scattered fills. Full diffusion. Flatten-press at the end. Result: complete color coverage, big territories, no gaps. This layer is the workhorse.

**Layer 2 — Detail.** Smaller pins or fast runners on top of the filled canvas. Painting over existing color, not filling void. Gaps are fine — there's color underneath. Walls guide color into streaks and veins, making the maze structure visible as color variation rather than empty corridors. Alpha blend with layer below.

**Layer 3 — Accents.** Placed deliberately, small, precise. Triangle beams for eyes, tiny circles for highlights. No press needed. Gaps are features. Alpha blend or overwrite per pin.

---

## Implementation Order

### Step 1: Flatten-Press (BFS Fill)

**What:** After all pins have diffused and died (or after manual trigger), run a breadth-first flood that claims every unclaimed cell from its nearest colored neighbor through open passages.

**Why:** This alone gets usable output from the existing system. It's the minimum viable fix for coverage gaps.

**How:**
1. Collect all cells with color weight > threshold as seed frontier
2. BFS outward through open passages
3. Each unclaimed cell inherits the exact color of the neighbor that reached it first
4. No decay, no strength, no blending — just nearest-neighbor fill
5. Runs in one pass, very fast

**UI:** "Press" button alongside existing Pulse buttons. Can also auto-trigger when all pins are dead.

**Edge case:** If multiple colored regions are separated by walls with unclaimed cells between them, the press respects walls. Truly walled-off empty regions stay empty (which is correct — they're outside the reachable maze).

---

### Step 2: Auto-Pin Scatter

**What:** Before or after the creative diffusion phase, automatically place pins to fill coverage gaps.

**Why:** Manually placing 12+ pins for full coverage isn't practical for pipeline use. The user places 3–5 creative pins; the system fills in the rest.

**How:**
1. After placed pins die, count unclaimed cells
2. Find the largest unclaimed clusters (connected components through open passages)
3. Drop a new circle pin at the centroid of each cluster above a size threshold
4. Pin color: inherited from nearest existing color (so auto-pins extend territories, not introduce new colors)
5. Pin strength: scaled to cluster size — enough to reach most of the cluster before dying
6. Run another diffusion pass with these pins
7. Press at the end

**Tuning:** A "target pin density" setting — e.g., "aim for 1 pin per 80 cells." At 30x30 (900 cells), that's ~11 pins. If the user placed 4, auto-scatter adds 7.

**Pipeline mode:** All of this is automatic. Place creative pins → system auto-fills → press → done.

---

### Step 3: Layer System

**What:** Stackable layers with independent settings, composited in order.

**Why:** Enables the background/detail/accent workflow without hardcoding it.

**Data model per layer:**
```
Layer {
  pins: [],              // pin placements for this layer
  blendMode: 'alpha' | 'overwrite',
  pressAfter: true | false,
  decayRate: 0.5,        // 0 = no decay (full assertion)
  autoScatter: true | false,
  targetDensity: 80,     // cells per auto-pin
  opacity: 1.0,          // layer opacity for compositing
}
```

**Compositing:** Layers render bottom-to-top. Each layer's cell colors composite onto the accumulated result below using its blend mode and opacity.

**UI:** Layer panel (add/remove/reorder). Each layer shows a thumbnail of its isolated result. Active layer is where new pins are placed. Previous layers are visible but locked.

**Presets:** Named layer stacks saved as JSON. "Chunxly Standard," "Quick Flora Tile," "Portrait Base," etc.

---

### Step 4: The Third (Inter-Layer Observer)

**What:** Between layers, The Third reads the kiwi heatmap from the layer that just ran and produces suggestions for the next layer.

**Why:** Automates the creative decisions that would otherwise require manual pin placement on detail/accent layers. Essential for pipeline mode.

**How — Kiwi reading heuristics:**

| Kiwi Pattern | Suggestion |
|---|---|
| High density + coverage gaps | Place circle pin here (fill needed) |
| Breakthrough kiwis along a line | Place detail runner along this corridor |
| Negotiation kiwis at color boundaries | Small accent pin, blended color |
| Wall-add cluster (square activity) | Area is consolidated, maybe open a wall for detail layer |
| Limit-stop cluster | Pins were polite here, consider more presence |

**Two modes:**
- **Pipeline mode:** The Third's suggestions auto-apply. No user interaction.
- **Interactive mode:** Ghost pins appear on canvas. User accepts, modifies, or ignores before running the next layer.

**Implementation note:** The Third doesn't need to be smart. It's reading a density map and applying lookup rules. The kiwi system already did the noticing — The Third just translates patterns into pin placements.

---

### Step 5: Presets and Pipeline Integration

**What:** Saved configurations for one-click Crank content generation.

**A preset contains:**
- Layer stack (count, settings per layer)
- The Third's auto-apply rules (or "off")
- Default pin groups/recipes to use
- Target maze size and algorithm
- Wall density (% of random walls to remove at generation)

**Crank workflow:**
1. Receive shape mask (Chunxly silhouette, Broadswordfish outline, etc.)
2. Load preset
3. Generate maze inside mask
4. Place recipe pins at entity-specified positions (eyes, fins, glow centers)
5. Auto-scatter remaining
6. Run all layers with auto-apply Third
7. Export final composited image

**Wall density slider:** A simple addition to maze generation — after generating the maze, randomly remove N% of interior walls. At 0% you get the full maze structure. At 50% it's very open and colors flow freely. Cheap way to tune how much maze structure is visible in the final result without changing anything else.

---

## Step 6: Template System

**What:** A lightweight text format that defines shape, color layout, and pin placement in a single human-readable file. Separates structure (the grid) from meaning (the key), and scales to any resolution at render time.

**Why:** Makes the Crank pipeline fast for repeated or variant content. Design a present once, recolor it by swapping three lines. Generate a family of critters from the same template with different palettes. Templates are trivially editable, diffable, storable in the repo, and generatable by anything that can produce text — including The Third, Scores, or entities.

### Format

```
# name
Diamond Present

# scale
3

# colors
1 = #f5c842
2 = #cc3300
3 = #2255aa

# pins
A = circle #f5c842 str:6
B = square #cc3300 str:4
T = triangle #2255aa str:8 dir:up

# grid
. . . 1 1 1 . . .
. 1 1 1 A 1 1 1 .
1 1 2 2 2 2 2 1 1
1 1 2 B 2 B 2 1 1
1 1 2 2 2 2 2 1 1
. 1 1 1 T 1 1 1 .
. . . 1 1 1 . . .
```

### Key Concepts

**The grid IS the shape mask.** Dots (or empty) mean "maze doesn't reach here." Everything else is inside the shape. No separate masking system needed for templated content.

**The key IS the palette.** Recoloring means changing the `# colors` section. The grid never changes. A "red present" and "blue present" are the same template with different keys.

**Scale factor** controls resolution:
- **Scale 1** — each character = 1 maze cell. No maze texture, pure color-by-number. Tiny, fast, sturdy. Good for icons, pixel art, small tiles.
- **Scale 3** — each character = 3x3 block of maze cells. Pins land in center cell. Maze provides texture within each color region. Good balance of template simplicity and diffusion richness.
- **Scale 6+** — each character = 6x6 block. Real diffusion dynamics within each template region. Blending at boundaries, corridor patterns, the full aesthetic. Good for portraits and hero art.

**Pin placement:** Pins land in the center cell of their expanded block. For finer placement, use detail/accent layers on top of the template layer.

**Color-only cells** (digits/letters mapped to `# colors`) don't place pins — they pre-fill their expanded block with that color before any diffusion runs. They're the settled ground that pins and the press build on top of.

### Rendering Pipeline

1. Parse template: extract key, grid, scale factor
2. Expand grid to maze dimensions (grid width × scale, grid height × scale)
3. Build shape mask from non-dot cells
4. Generate maze inside mask (algorithm from layer settings or template metadata)
5. Pre-fill color-only cells (entire expanded block gets base color)
6. Place pins at center of their expanded blocks
7. Run diffusion + press as normal
8. Color-only regions provide the broad territories; pins and maze add texture and blending at boundaries

### What Templates Enable

- **Recoloring:** Same grid, different `# colors` section. Batch-generate palette variants.
- **Variant generation:** Same grid, swap a few pin types or add/remove pins. A present with a bow vs. without.
- **Entity-driven content:** An entity specifies "I want eyes here and here, fin there" as a template. The Crank renders it.
- **Quick iteration:** Edit a text file, re-render, see the result. No GUI needed for structural changes.
- **The Third can write templates.** It reads kiwi patterns and outputs a template for the next run. Templates are the lingua franca between the observer and the renderer.

### File Convention

Templates stored as `.cpm` files (Color Pin Maze) in the repository. They're just text — any editor works.

```
recipes/
  presents/
    basic-square.cpm
    ribbon-cross.cpm
  critters/
    chunxly-base.cpm
    broadswordfish-base.cpm
  tiles/
    flora-simple.cpm
    ambient-gradient.cpm
```

---

## What's NOT in This Plan

These are still in the design doc but aren't needed for pipeline functionality:

- **Meeting pins** (child spawning from color collisions) — cool emergent behavior, not needed for coverage. Add later as a toggle for interactive/toy mode.
- **Pin reach limits / self-knowledge** — the layer system handles scale better than per-pin limits. Could add later for fine control.
- **Shape masking** — important for Crank pipeline but orthogonal to these changes. Can be added independently at any point. The press and auto-scatter work the same with or without a mask.
- **Named pin groups / recipes** — useful for pipeline presets but just JSON config on top of existing pin placement. Add when presets are built.

---

## Quick Wins (Can Do Now)

Before any of the above, two small changes to the existing prototype that improve usability immediately:

1. **Wall density slider** — add a percentage slider next to maze generation. After `makeMaze()`, randomly remove `floor(totalWalls * density%)` interior walls. Loosens the maze without changing anything else.

2. **Pin count indicator** — show "X pins / Y ideal" based on maze size ÷ target density. Helps the user know when they've placed enough pins for good coverage before they start pulsing.

---

*For Claude Code: start with Step 1 (flatten-press). It's a single function addition and immediately makes every existing session produce usable output.*
