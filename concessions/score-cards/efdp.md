# Color Pin Maze (EFDP)
**Location:** `scores/efdp/` | **Status:** Active
**Neighborhood:** None (tool) | **Stack:** Vanilla JS (~2,950 lines)

## Current State
Guided image generation using maze structure as a diffusion substrate. Color pins pulse outward through maze passages. Three pin types with distinct physics. Multi-layer compositing. The Third serves as inter-layer observer reading kiwi density. Exports CrankSeed witness records. Full Chunxly round-trip pipeline with per-aspect layers and touch-up.

## What's Built
- 3 maze algorithms (Backtracker, Prim, Kruskal) + wall density slider
- 3 pin types: Circle (erosion/flood), Square (fortification), Triangle (directional beam)
- Color diffusion engine with pulse, decay, legacy walls, meteor drop
- Kiwi detection, multi-layer compositing (alpha/overwrite blend, per-layer opacity)
- Pin memory + poses affecting direction, strength, decay, bias
- Direction bias for anisotropic diffusion
- Scatter (auto-pin unclaimed), Press (BFS flood fill), auto-pulse to death
- The Third: kiwi-cluster analysis, ghost pin suggestions (interactive or pipeline auto)
- Preset save/load system
- .cpm template parser (grid, pins, colors, edges, annotations)
- Chunxly integration: per-aspect layers, 3-phase diffusion, touch-up, snapshot export
- Crank export: dominant/secondary color, palette key, cohesion, kiwi density, shape hints
- Eyedropper mode, wall erase mode
- Scraggle witness overlay (radial glow from persistent Scraggles)
- Hub pulse listener for witness refresh
- Hub greeting (auto-pins on bare load)

## What's Next
- Commented-out production deltas for challenge phase (infrastructure preserved, hidden)
- Possible case bug: witness overlay references `maze.w`/`maze.h` but maze uses `maze.W`/`maze.H`
- Build Order: "Fairy edges → EFDP skeleton" — corridor creation from Chunxly structural data
- `color-pin-maze-next-steps.md` lists: configurable layers, layer settings (blend mode, press, pin density, decay rate)

## Specs & References
- `concessions/COLOR_PIN_MAZE_DESIGN.md` — full pin physics and design
- `concessions/color-pin-maze-next-steps.md` — refinement plan
- `concessions/archive/EFDP_ANIMATION_RIGS.md` — pose/rig system
- `concessions/archive/MAZE_TO_CRANK_HANDOFF.md` — CrankSeed format

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (60, 140, 160), Scraggles to localStorage
- **Receives:** `hub:pulse` (refreshes witness overlay)
- **localStorage:** Writes `baseline-session/crank-seed`, `baseline-session/efdp-snapshot`, `baseline-session/scraggles`. Reads `baseline-session/chunxly-cpm*`, `baseline-session/chunxly-aspects`, `baseline-session/persistent-scraggles`, `cpm-preset:*`.
- **Scraggle emissions:** Slot machine emoji on Crank send, microscope on Chunxly send
