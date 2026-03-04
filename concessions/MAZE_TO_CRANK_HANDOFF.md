# Maze → Crank Handoff Spec
**Fixed Point Local · Color Pin Maze Diffusion ↔ Critter Crank**

---

## Purpose

When a maze has been witnessed (diffusion has run), it can optionally export a
`CrankSeed` object. The Crank receives this object exactly as it currently
receives `crankContext` from the Grimoire — same slot, same logic, additional
fields. No new state required on either side.

The maze does not tell the Crank what to make. It reports what happened, and
the Crank reads the implications.

---

## The CrankSeed Object

```js
{
  source: "maze-diffusion",          // identifies origin

  // ── Pin census (from layers[]) ──────────────────────────────────────────
  pinCounts: {
    circle:   Number,                // count of circle pins across all layers
    square:   Number,
    triangle: Number,
  },
  dominantPinType: "circle" | "square" | "triangle",

  // ── Color (from cellColors Float32Array, post-diffusion) ────────────────
  dominantHex: String,               // most-occupied color at rest (#rrggbb)
  paletteKey:  String,               // nearest Crank palette key (see mapping)
  secondaryHex: String | null,       // second color if contested, else null

  // ── Spread / cohesion (derived from kiwiMap density) ────────────────────
  cohesionMode: "radial" | "directional" | "clustered" | "scattered",

  // ── Inflation hint (for future cutout depth) ─────────────────────────────
  // Average final strength of non-zero cells. High = thick. Low = thin/tapered.
  meanStrength: Number,              // 0.0 – 10.0
  calcifiedRatio: Number,            // calcifiedCount / totalCells  (0.0 – 1.0)

  // ── Kiwi history (The Third's witness record) ────────────────────────────
  totalKiwis: Number,
  kiwiDensity: "sparse" | "moderate" | "dense",  // derived from totalKiwis / N

  // ── Layer depth hint ─────────────────────────────────────────────────────
  layerCount: Number,                // how many layers were active

  // ── Optional: extra shape hints from pin types ───────────────────────────
  extraShapeHints: Array<String>,    // e.g. ["ring","spike"] — see mapping below
}
```

---

## Derivation Rules (maze-side, ~20 lines)

```js
function exportCrankSeed() {
  // Pin census
  const counts = { circle: 0, square: 0, triangle: 0 };
  layers.forEach(l => l.pins.forEach(p => counts[p.type]++));
  const dominantPinType = Object.keys(counts)
    .reduce((a, b) => counts[a] >= counts[b] ? a : b);

  // Dominant color: scan cellColors for most-occupied rgb bucket
  const dominantHex = readDominantColor(cellColors); // helper below
  const paletteKey  = nearestPaletteKey(dominantHex); // helper below

  // Cohesion: read kiwi spatial distribution
  const cohesionMode = inferCohesion(kiwiMap);        // helper below

  // Inflation
  const meanStrength   = readMeanStrength(cellColors);
  const calcifiedRatio = calcifiedCount / (W * H);

  // Kiwi density
  const N = W * H;
  const kiwiDensity = totalKiwis < N * 0.05 ? "sparse"
                    : totalKiwis < N * 0.20 ? "moderate" : "dense";

  // Extra shape hints from pin type mix
  const extraShapeHints = pinTypeToShapeHints(counts, dominantPinType);

  return {
    source: "maze-diffusion",
    pinCounts: counts, dominantPinType,
    dominantHex, paletteKey, secondaryHex: readSecondaryColor(cellColors),
    cohesionMode, meanStrength, calcifiedRatio,
    totalKiwis, kiwiDensity,
    layerCount: layers.length,
    extraShapeHints,
  };
}
```

---

## Mapping Tables

### Pin Type → Recipe + Shape Hints

| Dominant Type | Recipe weight         | Extra shape hints         |
|---------------|-----------------------|---------------------------|
| `circle`      | `creature`, `spirit`  | `blob`, `ring`, `circle`  |
| `square`      | `item`, `terrain`     | `rect`, `cross`, `diamond`|
| `triangle`    | `relic`, `creature`   | `spike`, `line`, `scatter`|
| mixed (even)  | `flora`, `spirit`     | `irregular`, `blob`       |

### Dominant Color → Nearest Palette Key

Match `dominantHex` to closest palette by RGB Euclidean distance against each
palette's `pal[2]` (main color):

| Palette   | Representative hue      |
|-----------|-------------------------|
| `nature`  | mid green               |
| `creature`| deep blue / red         |
| `item`    | warm brown / gold       |
| `fire`    | red / orange            |
| `ice`     | cool blue               |
| `poison`  | purple                  |
| `ghost`   | desaturated blue-grey   |
| `earth`   | tan / sienna            |
| `water`   | teal / cyan             |
| `light`   | yellow / cream          |

### Kiwi Distribution → Cohesion Mode

Read the `kiwiMap` (Float32Array, one value per cell):

- Kiwis concentrated within ~30% of grid radius from centroid → `radial`
- Kiwis form a band or directional streak → `directional`
- Kiwis in a tight cluster offset from center → `clustered`
- Kiwis widely distributed with gaps → `scattered`

Simple approximation: compute kiwi centroid, then mean distance from centroid.
Low mean distance = `radial` or `clustered`. High = `scattered` or `directional`.

---

## Crank-Side Reception

The Crank receives `CrankSeed` into `S.crankContext` (same field as Grimoire
context). In `doRoll()`, after the existing entity tag hints block, add:

```js
// Maze seed layer
if (S.crankContext && S.crankContext.source === "maze-diffusion") {
  var ms = S.crankContext;
  // Override or weight recipe
  if (!S.recipeKey || S.recipeKey === "creature") rKey = pick(ms.recipePool, rng);
  // Apply palette
  rPal = ms.paletteKey;
  // Apply cohesion
  rCohesion = ms.cohesionMode;
  // Merge shape hints
  ms.extraShapeHints.forEach(function(h) {
    if (!rExtras.includes(h)) rExtras.push(h);
  });
}
```

`meanStrength` and `calcifiedRatio` are stored on the critter object for later
use by the cutout/inflation system — not consumed by the Crank's 2D renderer yet.

---

## Inflation Fields (Stored, Not Yet Used)

The following fields ride along in the kept critter's data for when the
depth/cutout system is ready:

```js
critter.mazeOrigin = {
  meanStrength:    ms.meanStrength,    // overall body thickness
  calcifiedRatio:  ms.calcifiedRatio,  // edge sharpness / how much "stopped"
  layerCount:      ms.layerCount,      // depth layer count for parallax
  kiwiDensity:     ms.kiwiDensity,     // animation energy hint
  dominantHex:     ms.dominantHex,     // primary surface color
  secondaryHex:    ms.secondaryHex,    // secondary / accent
}
```

This is the DNA. It travels with the critter everywhere.

---

## Score-Specific Extension (Crank XL Pattern)

Any Score or Theme can extend the Crank by passing additional fields in
`CrankSeed` or `crankContext`:

```js
// Mall example
crankContext.extraRecipes  = ["pants", "shirt"];
crankContext.extraPalettes = { minty: ["#e8fff8", ...] };
crankContext.extraTraits   = ["baggy", "tight"];
crankContext.accentColor   = "#aaffcc";   // new buttons render in this color
```

The Crank renders unrecognized recipe/palette keys gracefully — unknown recipes
fall back to `creature`, unknown palettes fall back to nearest known. New
buttons appear adjacent to existing ones in `accentColor`.

No core Crank files change. The extension lives entirely in the calling Score.

---

## What Claude Code Ships

1. `exportCrankSeed()` function added to `scores/color-pin-maze/index.html`
2. A "Send to Crank" button appears after diffusion has run (witnessed state)
3. Button writes `CrankSeed` to `localStorage` key `baseline-session/crank-seed`
   and optionally navigates to the Crank (or just signals via Scraggles)
4. Crank reads `baseline-session/crank-seed` on load alongside existing
   `crankContext` URL param logic
5. Kept critter stores `mazeOrigin` block — no other Crank behavior changes

Total new code: ~60–80 lines across both files.
