# Integration Brief: Sunset Ridge Mall → The Hall
## Instructions for Claude Code
*Fox & Claude — February 2026*

---

## What You're Doing

You're integrating a new Score called **Sunset Ridge Mall** into Fixed Point Local (The Hall). The Score is a first-person 3D mall exploration game. The full spec is in `MALL_WALKER_SPEC.md`. The working reference implementation is in `mall-walker.jsx`.

**Your job:** Port the reference implementation to a self-contained `index.html` and place it in `scores/sunset-ridge-mall/`. No build step. No framework. Vanilla JS + Three.js from CDN, following the same pattern as `neighborhoods/mucklerbuckler/scores/hunter-encounter/index.html`.

---

## The Hall Repository

```
~/Documents/the-hall/          (local)
github.com/Ariliteth/the-hall  (remote)
```

Dev server: `npx serve .` from repo root → `localhost:3000`

---

## Step 1: Read Before Touching Anything

1. Read `hub.html` — understand the frame architecture and postMessage protocol
2. Read `neighborhoods/mucklerbuckler/scores/hunter-encounter/index.html` — this is your structural model. Hunter Encounter is a single HTML file with vanilla JS, CSS, no build step. Sunset Ridge Mall should look exactly like this from The Hall's perspective.
3. Read `registry.json` — understand the score registration format
4. Read `MALL_WALKER_SPEC.md` — the full behavioral spec
5. Skim `mall-walker.jsx` — the reference implementation (React, do not copy the component structure, but all the pure functions are directly portable)

---

## Step 2: Create the Score File

Create: `scores/sunset-ridge-mall/index.html`

### Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sunset Ridge Mall</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    /* All CSS here — no external stylesheets */
  </style>
</head>
<body>
  <!-- Canvas container + HUD overlays here -->
  <script>
    // All JS here — no external scripts except Three.js CDN above
  </script>
</body>
</html>
```

### JS Architecture

Follow Hunter Encounter's pattern: global state object, module-level functions, `init()` call at the bottom.

```js
// Global state
const G = {
  player: { px: 0, py: 0, dir: 0, floor: 1 },
  fd: null,
  hands: [null, null],
  playerStats: {},
  activeQuest: null,
  questLog: [],
  moving: false,
  bumpMode: null,
};

// All pure functions (generation, items, quests) — copy from mall-walker.jsx
// buildScene(scene, fd, onlyTiles) — copy and adapt
// spawnProp(...) — copy directly
// Input handling — addEventListener on window
// render loop — requestAnimationFrame

function init() {
  // Set up Three.js renderer, scene, camera
  // Generate first floor
  // Build scene
  // Start render loop
  // Set up input handlers
  // Notify hub
  window.parent.postMessage({ type: 'hub:minimize' }, '*');
}

init();
```

### Functions to Copy Directly from mall-walker.jsx

These are pure functions with no React dependencies. Copy them verbatim into the `<script>` block:

- `rng(seed)`
- `generateItem(seed)`
- `generateDollar(seed)`
- `craftItemWithDollar(item, dollar)`
- `itemDisplayName(item)`
- `generateQuest(seed)`
- `questMatchesItem(quest, item)`
- `generateFloor(seed)`
- `mutateWorld(fd, questSeed)`
- `spawnProp(type, wx, wz, ac, scene, addBox, mat)`
- All texture functions: `floorTex`, `wallTex`, `ceilTex`, `doorTex`, `atmTex`, `phoneTex`
- `buildScene(scene, fd, onlyTiles)` — adapt `mat` and `addBox` helpers to be local to this function

### Functions to Rewrite (React → Vanilla)

The component state and rendering need to become direct DOM manipulation:

| React pattern | Vanilla equivalent |
|---|---|
| `useState(x)` → setter | `G.someState = x; renderHUD()` |
| JSX returns | `document.getElementById('x').innerHTML = ...` or `el.textContent = ...` |
| `useCallback` | Regular functions |
| `useRef` for Three.js | Module-level variables |
| `useEffect` for setup | Direct calls in `init()` |

### HUD Implementation

All HUD elements are `position: absolute` divs overlaid on the canvas:

```html
<div id="mount" style="position:relative; width:100vw; height:100vh;">
  <!-- Three.js canvas goes here via renderer.domElement -->
  <div id="hud-mall-name">🛍 SUNSET RIDGE MALL</div>
  <div id="hud-floor-dir">FLOOR 1 · N</div>
  <div id="hud-quest"></div>
  <div id="hud-compass"></div>
  <div id="hud-left-hand"></div>
  <div id="hud-right-hand"></div>
  <div id="hud-bump-prompt"></div>
  <div id="hud-phone-msg"></div>
  <div id="hud-acquired"></div>
  <div id="hud-world-event"></div>
  <div id="hud-stats"></div>
  <div id="controls"></div>
</div>
```

Write a `renderHUD()` function that reads from `G` and updates all HUD elements. Call it after every state change.

### Input

```js
window.addEventListener('keydown', e => {
  if (e.code === 'ArrowUp'   || e.code === 'KeyW') tryMove(true);
  if (e.code === 'ArrowDown' || e.code === 'KeyS') tryMove(false);
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') tryTurn(false);
  if (e.code === 'ArrowRight'|| e.code === 'KeyD') tryTurn(true);
});
```

Touch controls: four buttons rendered as HTML elements with `onpointerdown` handlers.

### Animation

Movement and turning use `requestAnimationFrame` with a manual timer. **Do not use `function` declarations inside `requestAnimationFrame` callbacks** — use arrow functions assigned to `const`:

```js
// CORRECT
const tick = (now) => {
  const t = Math.min(1, (now - t0) / 180);
  // ...
  if (t < 1) requestAnimationFrame(tick);
  else { G.player.moving = false; renderHUD(); }
};
requestAnimationFrame(tick);
```

---

## Step 3: Register in registry.json

Add to `registry.json`:

```json
{
  "id": "sunset-ridge-mall",
  "name": "Sunset Ridge Mall",
  "type": "score",
  "path": "scores/sunset-ridge-mall/index.html",
  "neighborhood": null,
  "tags": ["exploration", "shopping", "procedural", "3d"],
  "description": "A procedurally generated first-person mall. Find items, earn Mall Dollars, take quests from payphones, unlock new areas."
}
```

Check the existing registry format and match it exactly.

---

## Step 4: Verify Hub Integration

1. Start dev server: `cd ~/Documents/the-hall && npx serve .`
2. Open `http://localhost:3000/hub.html`
3. Find "Sunset Ridge Mall" on the score rack
4. Click it — the hub frame should load the score, hub should minimize
5. Walk around, find an ATM, get a dollar, find an item, buy it
6. Find a payphone, get a quest, find a matching item, deliver it
7. Verify a new corridor appears after delivery
8. Press ⏏ EJECT — hub should restore to selection screen

---

## Step 5: Commit

```bash
cd ~/Documents/the-hall
git add scores/sunset-ridge-mall/ registry.json
git commit -m "Add Sunset Ridge Mall score — 3D grid mall explorer with items, quests, world mutation"
git pull --rebase
git push
```

---

## Known Issues in Reference Implementation

These are bugs in `mall-walker.jsx` that should be fixed during the port:

1. **ATM face detection** has been fixed in the latest version — ATM `face` = the wall the ATM is mounted on = the direction the player must face while standing in the ATM's tile. Confirm this logic is correct during port.

2. **Payphone density** — the generation algorithm may not always produce payphones if corridor tiles with valid wall faces are scarce. Add a fallback: if no payphones were placed, force one at a valid corridor tile before returning floor data.

3. **Item facing requirement** — `requiredFace` is derived from `offsetX` vs `offsetZ` magnitude. This is correct. Items with `|offsetX| > |offsetZ|` face east/west; others face north/south.

4. **World mutation bounds** — `mutateWorld` checks `grid[cy][cx]` before checking if `cy` and `cx` are valid indices. Add bounds checking before array access.

---

## Behavioral Notes (from play testing)

- The ATM is dark and easy to walk past — the cyan point light above it is important. Make sure it renders visibly.
- The payphone should be distinctly blue and recognizable as different from the ATM. The hanging receiver geometry helps.
- The "Face ← left to buy" instruction in the bump prompt is the clearest interaction pattern. Keep it.
- Corridor prop density was originally too high (fountains filling entire hallways). Current rates: 6% corridors, 10% stores, one prop max per tile.
- Dollar crafting is subtle but meaningful — a Legendary yellow dollar should visibly change the item. The ✨ marker on the hand card and the "UPGRADED to RARE!" flash are the feedback.

---

## Design Philosophy Notes (for reference, not instructions)

This Score was designed under The Hall's principles:

**Consent over command.** The bump model means nothing is bought accidentally. The player must deliberately face an item and confirm. Quests are optional — you can ignore the payphone.

**Emergent over scripted.** The quest givers, their needs, the items available — none of it is hand-placed. The mall feels like it exists whether or not you show up.

**Honest minimalism.** The item display is a colored square and some text. The 3D world is boxes and canvas textures. It works because the composition is honest, not because it's elaborate.

**The world knows more than it shows.** The seed system means every mall has a full layout even if the player never explores all of it. The quest reward room was always there — the quest just told you where to look.

---

*Attend Gently.*
