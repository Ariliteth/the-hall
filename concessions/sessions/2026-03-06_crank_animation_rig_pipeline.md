# Session: Crank Animation Rig Pipeline + Squatter Logic
**Date:** 2026-03-06
**Continues from:** `2026-03-06_efdp_animation_rigs.md`, `2026-03-06_crank_encounter_arc_world_pools.md`

## What Was Built

### Animation Rig Pipeline (Procedural)
Replaced static sine-wave breathing with a pose-aware, frame-based animation system. Creatures now breathe, jump, land, run, and attack using the same 5-pose vocabulary defined in `EFDP_ANIMATION_RIGS.md`, translated to procedural transforms.

**CRANK_POSES table** — 5 poses with per-pose transforms:
- `dx/dy` (body lean), `sizeMod` (radius delta), `spreadMod` (feature distance multiplier), `angleBias` (feature angle shift in radians)
- Idle has non-zero values (`dy: -1, sizeMod: 0.5, spreadMod: 0.08`) so even breathing produces visible pixel shifts

**Key constraint:** Pose transforms are post-RNG arithmetic only. The seeded RNG call sequence is never altered by pose — `renderCritter(seed, ..., "idle", 0)` produces the exact same grid as the old `renderCritter(seed, ...)`. Verified with pixel-exact comparison.

**Frame generation:**
- `generateFrames(roll, poseKey, frameCount)` — produces cached grid arrays at evenly-spaced pulse depths (0 to 1)
- `getFrameCacheKey(roll, pose, depth)` — extends the existing grid cache with `:pose:depth` suffix
- 2 frames = retro idle loop, 3 frames = action pose with mid-point peak

**Animation sequencer:**
- `startAnimating(canvas, frames, size, fps, mode)` replaces `startBreathing()`
- Modes: `"pingpong"` (idle), `"once"` (action burst, no longer used), `"loop"` (continuous)
- `startBreathing()` kept as backward-compat wrapper (single-frame static draw)

**All recipe types animate** — spirits, flora, relics, items, terrain. The body lean transform (`cx/cy` shift) propagates naturally to all recipe rendering paths.

### playPose Triggers
`playPose(poseKey, onComplete)` — fires an action pose, then returns to idle.

Three interaction triggers wired:
1. **Tap creature canvas** → `playPose("jump")` — moment of connection
2. **Catch button** → `playPose("attack")` — flourish while crank turns, creature shows its burst before seal
3. **Shoulder clean-tap** → `playPose("run")` — shoulder pressed and released without any style button interaction in between

**Shoulder clean-tap detection:**
- `S._shoulderCleanTap` flag set `true` on `holdShoulder()`
- Cleared to `false` if `pressStyle()` shoulder intercept fires (voice swap)
- Checked on `releaseShoulder()` — only fires run pose if still `true`

**Animation feel (revised):** Action poses use `"pingpong"` mode at 7fps with a 1400ms timeout — gives 2-3 full bounces before settling back to idle. Feels reactive but substantial.

### Landing Pose on Creature Entrance
`playPose("land")` fires in `doSingle()` immediately after `render()`. Every new creature arrives with a settling compression — body pushes down, features tighten — then relaxes into its personal idle rhythm. One line, every entrance has weight.

### Per-Creature Idle Breathing
`creatureIdleFps(roll)` — derives a unique breathing tempo from creature DNA.

| Signal | Effect |
|--------|--------|
| SPD stat | +0.15 fps per point above 5 (high SPD = quick, alert) |
| DEF stat | -0.12 fps per point above 5 (high DEF = slow, steady) |
| Seed jitter | ±0.3 fps (seededRng with offset prime 51749) |

Range: 2.0 to 4.5 fps. Most land near 3 (previous universal default). Spirits breathe faster, terrain breathes slower. No two creatures in a collection grid feel identical.

Applied in all 4 idle animation sites: main creature canvas, collection detail, collection thumbnails, and playPose return-to-idle.

### Quiet Squatter Logic
When a player cranks past a creature without catching it, the creature may decide to stay. ~15% of seeds hash into squatters (deterministic from `seededRng(seed + 7919)` with 3 warm-up calls to decorrelate LCG).

**Three manifestation modes:**
- **Silent immediate** (~50% of squatters): Added to packets now, no notification. Player discovers them browsing the haul.
- **Soft note** (~30%): Added now with scraggle: "something moved in."
- **Delayed** (~20%): Stored in `S.pendingSquatters`, appears after 3 more cranks with scraggle.

**Key functions:**
- `checkSquatter(roll)` — returns `null`, `"silent"`, `"noted"`, or `"delayed"`
- `buildSquatterPacket(roll)` — mirrors `sealPacket()` structure, adds `squatter: true` flag
- `handleSquatter(roll, mode)` — routes to immediate insert or pending queue
- `savePendingSquatters()` / `loadPendingSquatters()` — localStorage persistence
- Pending queue drains in `doSingle()` (after 3 cranks) and on page load (immediate flush)

Hooked into `doSingle()` — checks outgoing creature before generating the new one. At that point `S.encounterStats`, `S.encounterBiomeTags`, and `S.worldInventory` are still populated.

## Key Functions Added
- `creatureIdleFps(roll)` — per-creature idle tempo from stats + seed
- `generateFrames(roll, poseKey, frameCount)` — cached frame array generation
- `getFrameCacheKey(roll, pose, depth)` — pose-aware cache key
- `startAnimating(canvas, frames, size, fps, mode)` — frame-based animation sequencer
- `playPose(poseKey, onComplete)` — action pose with ping-pong cycling + auto-return to idle
- `checkSquatter(roll)` — seed-deterministic squatter probability
- `buildSquatterPacket(roll)` — packet construction for uncaught creatures
- `handleSquatter(roll, mode)` — squatter routing (silent/noted/delayed)
- `savePendingSquatters()` / `loadPendingSquatters()` — pending queue persistence

## State Changes
Added to `S`: `activePose`, `pendingSquatters`, `_cranksSinceSquatter`, `_shoulderCleanTap`

## Bugs Encountered & Fixed
1. **Idle frames 0 pixel diff (first attempt):** Idle pose had all-zero transforms. Fixed with non-zero values.
2. **Idle frames still 0 diff (second attempt):** Sub-pixel shifts (`dy: 0.7`) didn't cross `Math.round()` boundaries in drawing functions. Fixed by increasing to `dy: -1` — guarantees 1px body shift.
3. **Non-creature recipes didn't animate:** `generateFrames()` had a creature-only guard. Removed — body lean transform propagates to all recipe types naturally.
4. **Squatter probability 0% across all seeds:** LCG first-call values for nearby seeds are highly correlated (~0.85-0.92, all above 0.15 threshold). Fixed with 3 warm-up calls. Verified: 14.8% rate across 1000 seeds.

## Design Notes

### Procedural vs Diffusion
This session implemented the **procedural** animation path — pose transforms applied as arithmetic on the existing rendering pipeline. The API (`generateFrames`, `playPose`, `CRANK_POSES`) is designed so a future diffusion renderer (EFDP round-trip) can drop in as an alternative frame source without changing the sequencer or triggers.

### Ideas Discussed but Not Implemented
- **Relic-as-expression during poses** — a creature's world inventory relic could briefly manifest during action poses. Starts on frame 2, ends on frame 3. Connected to what world inventory slots *mean* — separate discussion.
- **Squatter visual distinction in haul** — `squatter: true` flag is stored but nothing renders differently yet.
- **Console sizing** — keep small even with dead space outside.
- **Buttons/controls planning pass** — UI layout needs attention.

## Next Up
- **Creature animation round-trip** (Crank to Mazie to Crank) — see `2026-03-06_efdp_animation_rigs.md` (bottom section)
- **Squatter visual identity** in haul views
- **Relic expression system** during action poses
- **Controls/UI planning pass**
