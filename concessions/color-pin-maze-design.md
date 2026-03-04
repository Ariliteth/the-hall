# Color Pin Maze Diffusion
### Design Document v1.0
*For Fixed Point Local — Critter Crank Image Generation Pipeline*

---

## What This Is

A guided image generation system that uses maze structure as a diffusion substrate. Color "pins" are placed inside a maze and pulse their color outward through passages. The maze's walls shape how color travels, blends, and pools. The result is an organic, structured color image that can serve as a tile base, portrait foundation, or entity visual for the Critter Crank.

The key insight: **we are not rendering, we are accumulating.** Each pulse adds a layer. Multiple passes build resolution the way impressionist painting does — not by precision but by convergence.

This was proven to work in a browser prototype. The screenshots in this folder show early results using Prim's algorithm with manual pins.

---

## Core Concepts

### The Maze as Substrate

The maze is generated fresh for each use. Its walls are not obstacles — they are **structure**. They shape where color can travel, how fast it spreads, where it pools and where it thins. Different generation algorithms produce different aesthetic characters:

- **Backtracker (DFS):** Long winding corridors. Color runs fast in rivers, creates stripes and veins. Good for elongated creatures, flowing shapes.
- **Prim's:** Organic, cellular, branchy. Color diffuses more evenly, creates blob-like territories. Good for rounded creatures, faces, ambient tiles.
- **Kruskal's:** Statistically uniform. Color blends most evenly across the field. Good for background tiles, gradients, environmental color.

Algorithm choice is a **creative decision** that shapes the character of the result before a single pin is placed.

### Shape Masking

The maze does not have to fill a rectangle. A **shape mask** defines the silhouette that gets filled with maze. Everything outside the mask is void — transparent, empty. The maze only generates inside the mask boundary. The mask's edges become hard exterior walls automatically.

This means you can say "give me a Chunxly-shaped thing" and the maze will fill that shape. The color diffusion then fills it from within, fully contained, preserving transparency outside.

**How to define a shape mask:**
- Paint mode: a secondary canvas layer where a soft brush marks "inside" vs "outside"
- Import mode: a silhouette image (black/white) used as a stencil
- Rough shapes are fine and preferred — fuzzy edges at the boundary are free, because maze cells at the edge are partially enclosed and color naturally bleeds right up to but not beyond the mask

The exterior walls (mask boundary) are **much harder to erase** than interior walls. This is intentional — it preserves the shape's integrity. Interior walls can be erased freely.

---

## Pin Types

Pins are the creative input. They define where color originates and how it asserts itself. Three types, each with a different personality.

### Circle Pin — Water Through a Hose

Pulses outward equally in all directions. **Actively erodes walls as it spreads.** Every 2–3 points of strength, the pin removes one nearby wall section — always choosing the wall that most directly opposes its current spread. It carves its own path through the maze rather than following existing passages.

- Behavior: Expansive, aggressive, self-directing. Knows what it is and how it works.
- Best for: Dominant colors, background fills, creatures with fluid or liquid qualities
- Wall erosion rate: `floor(strength / 3)` walls removed per pulse, nearest-first
- Visual indicator: Circle dot

### Square Pin — Stream Carrying Sediment

Pulses through existing passages only. Finds the path of least resistance — and then **reinforces it**. When spreading into a cell that has only one existing wall, the square pin adds a second wall segment, quietly enclosing the space it's settling into. It wants stability. It builds the room it wants to live in.

- Behavior: Contained, tidy, territorial. Takes the easy path and fortifies it.
- Best for: Secondary colors, detail areas, creatures with hard edges or defined anatomy
- Wall addition rate: when pushing into a cell with exactly one wall, adds one wall segment adjacent to its direction of travel. Builds its own enclosure over many pulses.
- Visual indicator: Square dot

### Triangle Pin — Directional Emitter

Pulses in one direction only, defined at placement. Does not flow — it **beams**. At full strength it fires in a straight line until it hits a wall. On hitting a wall: loses 1 strength unconditionally, then has a chance (default: 40%) to remove that wall, allowing the next beam to reach further. If the wall survives, the beam stops there until next pulse.

- Behavior: Focused, determined, costly. Has something to prove and may not survive proving it. Aimed at open space it travels far and fast; aimed at dense structure it grinds down, chipping away, maybe breaking through, maybe dying at the wall.
- Best for: Eyes, light sources, directional features, pointed anatomy, anything that should assert itself in one direction
- Strength cost: 1 per wall hit, regardless of removal outcome
- Wall removal chance: 40% per hit (tunable)
- Direction set on placement (click + drag or click + arrow key)
- Visual indicator: Triangle dot pointing in emission direction

---

## Pin Lifecycle — Decay and Legacy

### Strength Decay

Every pin has a **strength value** (1–10 at placement). Each pulse, strength decreases by a small amount (default: 0.5 per pulse, tunable). When strength reaches zero, the pin disappears.

This prevents the runaway flooding problem seen in the prototype — no pin asserts forever. Colors establish their territory and then fade, leaving the blended result as the record.

Visual feedback: the pin dot shrinks as strength decays, giving a live reading of remaining life.

### Legacy Walls

When a pin's strength drops below a threshold (default: 1.0), **before disappearing it builds walls**. It places a small number of wall segments at the edges of its color territory, in cells where its color borders another color. These walls partially preserve the boundary it fought to establish.

This means the **history of the diffusion is encoded in the maze structure**. A pin that lived and died leaves walls behind. The maze after a full diffusion run is a record of what happened, not just the current state.

Legacy wall count: `floor(final_strength * 2)` walls placed at color boundaries before removal.

### Meeting Pins — Emergent Secondaries

When two colors of significant strength meet at a cell, they can **spawn a child pin**:

- Trigger: Two colors collide at the same cell with combined weight above a threshold
- Child color: Blended mix of both parents (weighted by their relative strengths)
- Child type: Circle by default (emergent, fluid)
- Child strength: Moderate (3–5), starts with a brief **growth phase** (gains 0.2 strength per pulse for 3 pulses) before entering normal decay
- Child position: The collision cell

Child pins create the surprising intermediate tones — the colors you didn't place but that emerge from the interaction of the ones you did. These are the most visually interesting cells in the result.

---

## Named Pin Groups (Recipes)

A **pin group** is a named cluster of pins that together describe a visual component. Instead of placing individual pins, you place a recipe.

Example — **Eye:**
```
Eye:
  - 1 black triangle pin (center, pointing outward from face center)
  - 2 amber circle pins (tight radius around triangle, strength 6)
  - 1 weak red circle pin (outer glow, strength 3, large radius)
```

When Chunxly requests 3 eyes, the system places 3 Eye groups at the positions Chunxly specifies. The maze negotiates between the three clusters and whatever other pins exist. The result resembles Chunxly because the structure was seeded with Chunxly's intentions.

Pin groups are stored in a **recipe library** — a simple JSON file. They can be created, named, saved, and reused across sessions.

```json
{
  "eye": {
    "pins": [
      { "type": "triangle", "color": "#111111", "strength": 8, "offset": [0, 0], "direction": "outward" },
      { "type": "circle",   "color": "#f5a623", "strength": 6, "offset": [1, 0] },
      { "type": "circle",   "color": "#f5a623", "strength": 6, "offset": [-1, 0] },
      { "type": "circle",   "color": "#cc3300", "strength": 3, "offset": [0, 1] }
    ]
  }
}
```

The `"outward"` direction for triangle pins means "away from the shape's center" — computed at placement time based on the shape mask's centroid.

---

## Pressure Gauge

The pressure gauge measures **how much competition exists at color boundaries** — the total "tension" in the system.

Formula: sum of all cells where two or more colors are present with significant weight, scaled by the weight difference between the dominant and secondary colors. High pressure = colors are still actively fighting. Low pressure = the system has reached approximate equilibrium.

**Display:** A simple bar or value shown live during pulsing. When pressure drops below a threshold and begins to plateau, that is the natural stopping point. The user can define a target pressure or watch it and stop manually.

**Why this matters:** It gives you a read on whether more pulses will meaningfully change the image or whether you're just overwriting settled territory. Stopping at the right moment preserves the interesting transitional zones — the places where colors met and negotiated.

### Flattening

When pressure crosses a high threshold — or manually triggered by the user — the system **flattens**. Each cell resolves its stacked color weights into a single authoritative color, resets all weights to a baseline value, and resumes. The colors stay. The accumulated pressure clears.

This is not just a safety valve. **Flattening is the layering tool.**

- First pass: broad territory. Flatten. Ground is committed.
- Second pass: detail on top of stable base. Flatten.
- Third pass: fine work, accent pins, legacy preservation.

The image builds like paint. Each flatten is a decision that this layer is done.

**Two flatten triggers:**
- **Auto-flatten:** pressure has plateaued above threshold for N pulses — the system recognizes stasis and clears
- **Manual flatten:** user triggers at any moment — commits what's settled, clears pressure, continues

The pressure gauge reads differently before and after: high pressure still moving means keep pulsing; high pressure plateaued means flatten and continue or stop.

---

## The Crank Pipeline

The full intended workflow for generating a Critter Crank tile or portrait:

1. **Define shape** — paint or import a silhouette mask (Chunxly, Broadswordfish, abstract blob)
2. **Choose algorithm** — Backtracker for elongated/flowing shapes, Prim's for organic creatures, Kruskal's for even ambient fills
3. **Generate maze** — fills the shape interior; exterior walls are hard
4. **Place pin groups** — drop named recipes at key positions (eye, fin tip, spine, glow center)
5. **Set pin types** — circle for dominant fills, square for contained anatomy, triangle for directional features
6. **Pulse** — watch the pressure gauge; run x1, x5, or x20 depending on how settled things look
7. **Erase walls selectively** — open passages to let colors find each other faster; watch how new connections change the blend zones
8. **Check pressure** — stop when it plateaus
9. **Export** — the colored maze image is the tile base

For **quick flora tiles:** 2–4 passes, 3–5 pins, simple circle fills. Minutes per tile.

For **portraits:** 8–15 passes with manual wall erasure between passes, named groups for features, iterative pin adjustment. Can layer the original reference image back over the result between passes and re-pin based on what needs more definition.

---

## Diffusion Math

For implementors — the core algorithm is **weighted multi-source flood fill with decay**.

Each cell stores: `[r, g, b, weight]` as floats.

**Per pulse:**
```
for each cell with weight > 0:
    color = [r/weight, g/weight, b/weight]
    for each neighbor reachable through open passage:
        neighbor.accumulate(color, weight * decay_factor)
    self.accumulate(color, weight)  // self-retain

decay_factor = 0.72  // tunable, controls spread speed
```

After accumulation, re-anchor all pins (pins override their cell's color each pulse — they are immovable sources).

**Decay:** reduce each pin's strength by `decay_rate` per pulse (default 0.5). When strength < 0 remove pin (after legacy wall phase).

**Meeting pins:** after each pulse, scan for cells where two colors have weight above `meeting_threshold` (default: 3.0 combined). Spawn child pin with probability `meeting_chance` (default: 0.3 per eligible cell per pulse) to avoid over-spawning.

**Pressure:** `sum over all cells of: (secondary_weight / primary_weight) where primary_weight > 1.0`

---

## File Structure for Implementation

```
color-pin-maze/
  index.html          — main application (single file for portability)
  
  OR as a proper app:
  
  src/
    maze.js           — maze generation (backtracker, prim, kruskal)
    diffusion.js      — pulse math, pin lifecycle, pressure gauge
    pins.js           — pin types, recipes, named groups
    mask.js           — shape masking, stencil painting
    renderer.js       — canvas drawing, wall rendering, pin visuals
    ui.js             — controls, mode switching, export
  recipes/
    default.json      — built-in pin group library (eye, glow, etc.)
  index.html
```

For Claude Code: start with `index.html` as a single file. Split into modules once the core is working and stable.

---

## Working Prototype

`color-pin-maze.html` — the proof of concept built in the design session. Implements:
- Maze generation (backtracker, prim, kruskal)
- Basic flood fill diffusion
- Circle pins only, fixed strength
- Manual wall erasure
- Pulse x1 / x5 / x20

**Known issues in prototype:**
- No decay — colors run away and flood everything given enough pulses
- No pressure gauge — no natural stopping point
- No shape masking
- Single pin type only
- No meeting pins or legacy walls

The prototype proved the core concept works. The screenshots show Prim's algorithm producing organic color territories that respond meaningfully to pin placement and wall erasure.

---

## Pin Limits — Self-Knowledge

Each pin can optionally declare a **reach limit** — the maximum number of cells it will ever claim as its own, regardless of remaining strength. This is not a constraint imposed from outside. It is the pin knowing its appropriate scale and choosing not to take more.

A triangle pin that declares a limit of 5 will beam up to 5 tiles and stop — even if it has strength remaining, even if the path ahead is open. It has made itself known. It doesn't ask for more.

Limits are most meaningful on triangle pins (reach distance) and circle pins (radius of spread). Square pins naturally self-limit through their wall-building behavior.

**Why limits matter:** In a cooperative system, knowing your scale is a virtue. A pin with a limit participates without consuming. The maze can contain many voices at once when each voice knows where it ends.

Limits are not enforced during Layer One (full assertion). They become active in Layer Two and are fully respected in Layer Three.

---

## The Three Layers

A complete diffusion run consists of three passes, each expressing a different mode of relation between pins and space. Each layer is run, then flattened — committed to a stable canvas before the next begins. The three flattened layers are then merged into the final result.

### Layer One — Full Assertion

No decay. Every pin fires at full strength for the entire pass. Limits are not enforced. This is the pins being completely themselves — circle floods, square fortifies, triangle beams as far as it can reach. This layer establishes *who is here* and *what they want*. It is loud and probably excessive. That is correct. It is supposed to be.

This layer is most shaped by **Circle pins** and **Backtracker mazes** — both favor long reaches and strong corridors.

### Layer Two — Negotiated Presence

Decay begins. Pins start strong but fade over pulses. Limits are softly enforced — pins slow as they approach their declared scale. The maze begins to shape the result more than the pins do. Colors that found good passages persist; colors that were fighting walls burn out. This is where the *maze* gets its say.

This layer is most shaped by **Square pins** and **Prim's mazes** — both create more branch points and negotiation opportunities.

### Layer Three — Appropriate Scale

Full decay and full limit enforcement. Reach is capped at the pin's declared limit, or half its current strength, whichever is smaller. Pins assert themselves only within their honest territory. Nothing overreaches. This is the cooperative pass — the colors that remain are the ones that belong.

This layer is most shaped by **Triangle pins** and **Kruskal's mazes** — both settle most evenly and reward precision over force.

### Merging the Layers

The three flattened layers are merged with equal weight by default. The Third (see below) can adjust this weighting — giving more influence to layer one in areas that need strong color, more influence to layer three in areas that need restraint.

Each layer can also be run multiple times before flattening and averaged, for smoother results in any given mode.

---

## The Third — Observer and Editor

The Third does not diffuse color. It does not place pins in the conventional sense. It **notices** — and from noticing, it suggests.

Between layers, the Third reads the **Kiwi map** (see below) and produces annotations on the canvas: ghost pins (suggested placements for the next layer), proposed wall additions, proposed wall removals. The user sees these suggestions and accepts, modifies, or ignores them before the next layer fires.

The Third knows where its attention matters. It does not need to know why.

**What the Third can suggest:**
- New pin placements (type, color, strength, limit)
- Wall removals (open a passage where pressure built up)
- Wall additions (close a passage where color bled where it shouldn't)
- Layer merge weights (give this region more layer-one influence, give that region more layer-three)

The Third's suggestions are always optional. It has a voice, not a veto.

---

## Kiwis — Event Markers for The Third

Kiwis are lightweight event markers dropped at the location of significant diffusion events. They are how the Third knows where its attention is warranted.

**Events that drop a Kiwi:**

| Event | Kiwi weight |
|-------|-------------|
| Two colors negotiate and spawn a meeting pin | Medium |
| Circle pin breaks a wall | Low |
| Square pin adds a wall | Low |
| Triangle pin hits a wall and loses strength | Low |
| Triangle pin breaks through a wall | High |
| Pin reaches its self-declared limit and stops | Medium |
| Pressure plateaus locally before global flatten | Medium |
| Pin dies and places legacy walls | Medium |

Kiwis accumulate into a **density map** — a lightweight heatmap of event activity across the canvas. The Third reads this map, not the diffusion math. High Kiwi density = something interesting happened here = attention is warranted. Sparse Kiwis = settled and quiet.

**What Kiwi type suggests to the Third:**

- Wall-break cluster → consider a pin here that wants open space (circle)
- Wall-add cluster → area is consolidating, reinforce it (square)
- Negotiation Kiwi → two things met here, a new voice might belong (any type, low strength)
- Limit-stop cluster → pins are being polite here, the Third could open space or add more presence
- Breakthrough Kiwi → a path was forced open, something wants to travel it

Kiwis are cleared at each flatten. Each layer generates its own Kiwi map, which the Third reads before the next layer begins.

---

## Notes for Implementation Session

- **Start with decay and limits** — most important missing pieces; without decay the system floods; without limits there is no self-knowledge
- **Add pressure gauge and flatten** — gives stopping conditions and the layer structure; flatten is the creative tool, not just a safety valve
- **Shape masking third** — transforms it from a toy into a pipeline tool
- **Pin types (all three) fourth** — circle/square/triangle distinction is high value; triangle beam behavior is the most novel
- **Three-layer system fifth** — once pin types work, the layer structure emerges naturally from running them in sequence
- **Kiwis and The Third last** — they depend on everything else working; implement Kiwi event emission first, then The Third's reading and suggestion system
- **Meeting pins and legacy walls alongside Kiwis** — all three are emergent behaviors that build on the stable core

The math is simple. The interesting work is in the UI — making it feel good to place pins, watch the pulse, and know when to stop.

---

*Document generated from a design session with Fox, March 2, 2026.*
*Part of Fixed Point Local — The Critter Crank image generation pipeline.*
