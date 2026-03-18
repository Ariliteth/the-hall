# Critter Crank — Claude Code Handoff
**Date:** 2026-03-05  
**File:** `index.html` (3281 lines, single-file vanilla JS/HTML/CSS)  
**Project:** Fixed Point Local (FPL) — The Hall  
**Owner:** Fox

---

## What This Is

Critter Crank is a standalone HTML/JS creature generation toy — a virtual handheld console that generates pixel-art entities ("critters") and packages them into sealed "world-packets" for use in other FPL systems. It runs fully in-browser, no build step, no dependencies. Everything is in one file.

The aesthetic is a physical Game Boy-style device that reshapes itself per world — crystal translucent plastic, distinct border radii, hardware textures. Screen is locked/fixed size. Controls are below.

---

## Current State (what works)

- **World selection** — 6 worlds (City, Jungle, Space, Deep, Ruin, Forge), each with distinct crystal body style, color palette, recipe pools
- **D-pad** — 4 world slots, pressing generates a creature. Hold = splash (generates full cohort)
- **Face buttons** — 4 voice/style influence toggles. Now passive (toggle on/off), DO NOT trigger generation. Generation is D-pad only.
- **Screen layout** — main creature centered, 4 side creature slots flanking (2 left, 2 right), inventory row (4×2 grid) below separator
- **Crank (center button)** — seals current screen into a world-packet, clears screen
- **Haul tab** — shows sealed packets as full-width rows with ENTER button
- **Lens system** — 4 lenses (Sims/Grid/Platformer/Hunter) stub-wired, cycling works, content is placeholder
- **Packet data structure** — cohort (main + 5 creatures + 8 inventory), relations array (positional affinities/aversions), sealed timestamp
- **Crystal body** — per-world shape (border-radius), gradient, glow, hardware texture, screen glow color
- **Viewport scaling** — `scaleMachine()` measures natural size once and applies CSS `scale()` transform to `#machine-scaler`
- **Shell caching** — `_shellRendered` flag means machine chrome only rebuilds on world change; normal renders call `renderScreenOnly()` instead

---

## The Unsolved Bug — PRIORITY ONE

**The Pinch:** Every time the D-pad is pressed (which triggers `doSingle()` → `render()`), the machine visually shrinks and snaps back. On mobile this is very noticeable.

### What we know
- It happens on D-pad press specifically (confirmed by Fox)
- We have tried: fixed control row height, removing scale() from face buttons, shell caching to avoid full DOM rebuild, storing scale value and reapplying, only measuring once
- None of it worked
- The current theory (unverified): `renderMachine()` (full shell rebuild) may still be getting called on some D-pad presses, or the `scaleMachine()` setTimeout is causing a visible frame at scale(1) before reapplying

### What Claude Code should do first
1. Open browser devtools on mobile or use remote debugging
2. Add `console.log('render path:', _shellRendered)` at the top of `render()` to confirm whether `renderMachine()` or `renderScreenOnly()` is being called on D-pad press
3. Check whether `scaleMachine()` is resetting `scaler.style.transform = "scale(1)"` during measurement on any path
4. The real fix is probably: after initial scale is locked, **never touch `scaler.style.transform` again** under any circumstance except window resize. The scale value should be applied via CSS `transform` on the scaler wrapper, set once, left alone.

### Relevant functions
```
scaleMachine()          — measures and sets _machineScaleValue, applies transform
scaleMachineOnce()      — only measures if not locked
applyStoredScale()      — reapplies _machineScaleValue without re-measuring
_machineScaleLocked     — bool, set true after first measure
_machineScaleValue      — stored float (e.g. 0.72)
_shellRendered          — bool, false = full renderMachine(), true = renderScreenOnly()
invalidateShell()       — sets _shellRendered = false (call before world change)
render()                — main render dispatcher
renderMachine()         — builds full mount.innerHTML including #machine-scaler
renderScreenOnly()      — only swaps #screen-content innerHTML + updates tab/crank states
```

---

## Architecture

### State object `S`
All mutable state lives here. Key fields:
```js
S.worldKey          // current world string key
S.mainCreature      // roll object for center slot
S.sideCreatures     // array of up to 5 roll objects (left/right flanking)
S.inventorySlots    // array of up to 8 roll objects (inventory row)
S.packets           // array of sealed packet objects (haul)
S.activePacket      // packet currently entered (lens view)
S.lensMode          // "sims"|"grid"|"platformer"|"hunter"
S.view              // "crank"|"collection"
S.dpadSlots         // [4 world keys] on d-pad
S.dpadActive        // index 0-3
S.styleSlots        // [4 voice keys] on face buttons
S.activeStyles      // array of active face button indices (multi-select)
S.activeVoices      // voice keys derived from activeStyles
S.packets           // sealed world-packets (localStorage: "critter-packets-v1")
S.collection        // legacy flat critter array (localStorage: "critter-collection-v2")
```

### Roll object (what generateRoll returns)
```js
{
  seed, recipeKey, extraShapes, palKey, cohesionMode,
  voiceEmoji, worldIcon, worldNote, ...
}
```

### Packet object (what sealPacket creates)
```js
{
  id, worldKey, palette, accent, worldLabel, worldIcon,
  main,        // named roll (has .name, .description)
  creatures,   // array of 5 named rolls
  inventory,   // array of 8 named rolls
  relations,   // 14-length array of {affinities:[], aversions:[]}
  lastLens,    // last lens used
  sealed,      // timestamp
}
```

### Generation bias
- `generateRoll("creature")` → pulls from `[creature×3, spirit×2, flora]`
- `generateRoll("inventory")` → pulls from `[terrain×2, item×2, relic]`
- `generateRoll()` → uses world's recipePool

### World body styles
Each world in `WORLDS` has a `body` object:
```js
body: {
  radius,     // CSS border-radius (varies per world — this is the crystal shape)
  gradient,   // rgba semi-transparent gradient over dark base #1a0a18
  glow,       // box-shadow
  border,     // rgba border color
  screenGlow, // inner screen box-shadow color
  hardware,   // additional background-image texture layers
}
```
**Only `border-radius` and visual properties change per world. Padding is hardcoded to `"14px 14px 22px"` and must not vary.**

---

## Next Feature Work (after pinch is fixed)

### Lens gameplay — Sims first
The four lenses share the same packet data. Start with Sims:
- Entities placed on a small grid (derived from packet cohort positions)
- They drift, occasionally emit emoji based on voice/traits
- Player can tap emoji buttons to send influences
- Kiwi events (existing system) should fire when entities collide
- No win condition — purely observational

### Sims implementation notes
- Use `packet.relations` for affinity/aversion behavior
- Emoji speech on collision uses existing voice emoji system
- The Third (unnamed ambient presence) reads kiwi events — stub as console log for now
- `renderPacketView()` in `renderCollectionView()` is where lens content lives

### Grid lens (second)
- Turn-based, face buttons emit emoji from world pool
- Entities respond by affinity (move toward) or aversion (move away)
- Same relation data

### Future: Platformer + Hunter
- Platformer: player inhabits main creature, physics-based tile movement
- Hunter: turn-based RPS, player coaches main creature vs others

---

## Files
- `index.html` — everything. No other files needed to run.
- `HALL_SKILL.md` — FPL vocabulary and conventions (in repo, not included here)

## Key Constraints
- **No build step.** Vanilla JS only, no imports, no npm.
- **Single file.** Don't split into multiple files.
- **Pixel art rendering** is canvas-based (`drawCritterToCanvas`, `startBreathing`). Don't touch the rendering pipeline.
- **localStorage keys:** `"critter-packets-v1"` (packets), `"critter-collection-v2"` (legacy)
- **Screen height is fixed at 260px** — do not change this or the inventory/creature layout will break.
- **Face buttons are passive toggles** — they must never call `render()` or `doSingle()`. `updateStyleButtonsInPlace()` handles their visual state via direct DOM property writes.
- **D-pad is the only generator.** `pressDpad()` → `doSingle()` or `doSplash()`.

---

## Things Fox Cares About
- The machine feeling like a physical object you're holding
- The world body shapes being distinct and readable (Forge = hard angles, Space = very round, etc.)
- Emergence over prescription — systems that surprise
- The Third (ambient presence) witnessing without articulating
- Kiwis as patient event markers
- Nothing that feels like a loading state or UI churn
