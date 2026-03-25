# Critter Crank — File Split Plan

## Why
The Crank is 4365 lines in a single HTML file. At ~78k tokens, no single session can hold the whole thing in context. Every edit risks breaking something in a part of the file that wasn't read. Splitting by concern lets each piece be understood completely before being touched.

## The Five Files

### 1. `crank-data.js` — Pure Data Tables (~310 lines)
**Lines 198–508 of current file**

Contents:
- Seeded RNG (mulberry32, hashSeed)
- WORLDS object (all world definitions, colors, tags, descriptions)
- PALETTES and palette helpers
- Kitchendom affinities
- RECIPES object
- COHESION_MODES
- Name + description generation (nameFromSeed, descriptionFromSeed)
- Tag → shape hint map
- ALL_SHAPES list
- VOICES object (all 40 voices with emoji, bias arrays)

Dependencies: None. Pure data and tiny utility functions.
Exports to global scope: `mulberry32`, `hashSeed`, `WORLDS`, `PALETTES`, `RECIPES`, `COHESION_MODES`, `VOICES`, `nameFromSeed`, `descriptionFromSeed`, `TAG_SHAPE_HINTS`, `ALL_SHAPES`, etc.

### 2. `crank-renderer.js` — Pixel Generation Engine (~1300 lines)
**Lines 509–1806 of current file**

Contents:
- `renderCritter()` — the main pixel renderer
- Creature body pass
- Flora body pass
- Spirit body pass
- Relic body pass
- Item body pass
- Terrain body pass
- `drawFeature()` helper
- All shape-drawing functions

Dependencies: `mulberry32`, `hashSeed`, `PALETTES`, `TAG_SHAPE_HINTS`, `ALL_SHAPES` (all from crank-data.js)
Exports to global scope: `renderCritter`

### 3. `crank-canvas.js` — Canvas Drawing & Animation (~240 lines)
**Lines 1807–2046 of current file**

Contents:
- `drawCritterToCanvas()` — renders a grid to a canvas element
- `computeDioramaPositions()` / `computeFullDioramaPositions()`
- `startDioramaAnimating()` / `startFullDioramaAnimating()`
- `startAnimating()` — the animation sequencer (idle, pingpong)
- `cancelAllAnimations()`
- Animation frame tracking

Dependencies: None at load time. Called with grids produced by crank-renderer.js.
Exports to global scope: `drawCritterToCanvas`, `startAnimating`, `startDioramaAnimating`, `startFullDioramaAnimating`, `cancelAllAnimations`, `computeDioramaPositions`, `computeFullDioramaPositions`

### 4. `crank-engine.js` — State, Logic, Navigation (~1240 lines)
**Lines 2047–3285 of current file**

Contents:
- `S` state object
- Grid cache + frame generation (`getCachedGrid`, `generateFrames`)
- `creatureIdleFps()`
- Persistence (load/save collection, packets, squatters)
- Crank context (maze handoff)
- `doSingle()` — the generation pipeline
- World inventory generation
- Encounter stats generation
- Biome tag computation
- World name generation
- World pool / held worlds / compass system
- Shuffle functions
- Controller event handlers (compassEnter, compassBrowse, compassView, compassBack)
- Density dial
- World menu
- Lens cycling
- Binder paging / flip
- Quiet squatter logic
- Packet sealing
- `handleCatch()` / `handleCrank()` / crank animation
- Bounce reveal

Dependencies: Everything from the three files above. Also calls `render()`, `renderScreenOnly()`, `postRender()`, `invalidateShell()` from the UI layer — these are the only cross-boundary calls and they already exist as named functions.
Exports to global scope: `S`, `getCachedGrid`, `generateFrames`, and all the handler functions.

### 5. `index.html` — CSS, HTML Shell, UI Rendering (~1080 lines)
**Lines 1–197 (CSS/HTML) + Lines 3286–4365 (render functions + init)**

Contents:
- All CSS (styles, keyframes)
- HTML skeleton (just `<body>` with script tags)
- `render()` / `renderScreenOnly()` / `invalidateShell()`
- `renderMachine()` — the Gameboy shell
- `renderScreen()` — encounter view
- `renderWorldCover()` — browse cover
- `renderCollectionView()` — binder
- `renderCompass()` / `renderStyleButtons()`
- `postRender()` — canvas hookup after DOM write
- `scaleMachine()` / `applyStoredScale()` / `onWindowResize()`
- `init()`

Dependencies: Everything from the four JS files above (loaded via script tags first).

## Script Load Order in index.html

```html
<script src="crank-data.js"></script>
<script src="crank-renderer.js"></script>
<script src="crank-canvas.js"></script>
<script src="crank-engine.js"></script>
<!-- then the inline <script> with render/UI code -->
```

## Extraction Process

Do one file at a time. After each extraction:
1. Cut the lines from index.html
2. Paste into the new .js file
3. Add the `<script src>` tag
4. Reload and verify no console errors
5. Test: generate a creature, catch it, browse worlds, view collection

Order of extraction: data → renderer → canvas → engine (safest to riskiest).

## What Does NOT Change
- No logic changes. No renames. No refactoring.
- Every function stays global (vanilla JS, no modules).
- The CSS stays in index.html.
- The behavior is identical before and after.
