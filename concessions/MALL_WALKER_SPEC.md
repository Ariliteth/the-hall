# Sunset Ridge Mall — Score Spec
## For integration into Fixed Point Local / The Hall
*Fox & Claude — February 2026*

---

## What This Is

A first-person 3D mall exploration game built as a Score for The Hall. The player walks through a procedurally generated shopping mall using Etrian Odyssey-style grid movement (snap-step, face cardinal directions, turn 90°). They find items, earn Mall Dollars from ATMs, buy things, receive quests from payphones, and deliver items to unlock new areas of the mall.

The mall is seeded — the same seed produces the same mall. Mall names are intended to eventually be seeds (visit "Sunset Ridge Mall" to find the same mall as anyone else with that name).

---

## Implementation Notes — CRITICAL

**Do not use React or JSX.** The reference implementation was written as a React artifact and suffers from a renderer bug (`returnReact is not defined`) in Claude's artifact environment. The code logic is sound — the framework is wrong for this context.

**Follow Hunter Encounter's pattern:** a single self-contained `index.html` with vanilla JS and CSS. Three.js loads from CDN (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`). No build step. No bundler. Drop into `scores/sunset-ridge-mall/index.html` and serve.

The reference `.jsx` file contains all the working logic — generation, rendering, interaction, quests — and should be used as the source of truth for behavior while being rewritten in vanilla JS.

---

## File Location in The Hall

```
scores/
  sunset-ridge-mall/
    index.html          ← the entire score
    README.md           ← optional, brief
```

The hub loads it in a frame like all other scores. On load, the score should send `window.parent.postMessage({type: 'hub:minimize'}, '*')` so the hub steps back and the mall takes over the screen.

---

## Dependencies

- **Three.js r128** — `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
- Nothing else. All generation, textures, and UI are self-contained.

---

## Architecture Overview

Everything lives in one file. Global state object `G` holds floor data and player state. No classes required — plain objects and functions throughout, consistent with Hunter Encounter.

```js
const G = {
  player: { px, py, dir, floor },   // grid position, facing direction (0-3), floor number
  fd: null,                           // floor data (see Floor Data below)
  hands: [null, null],               // left and right hand items
  playerStats: {},                   // discovered stats and their totals
  activeQuest: null,                 // current quest object or null
  questLog: [],                      // completed quests
  moving: false,                     // animation lock
  bumpMode: null,                    // { target: { kind, entity } } or null
};
```

---

## Grid System

The world is a 2D grid of tiles. Each tile is `CELL = 4` world units wide.

```js
const T = { EMPTY: 0, CORRIDOR: 1, STORE: 2 };
```

The player occupies one tile and faces one of four directions:
```js
const DIRS = [
  { dx:0, dz:-1, f:'N' },  // index 0
  { dx:1, dz:0,  f:'E' },  // index 1
  { dx:0, dz:1,  f:'S' },  // index 2
  { dx:-1, dz:0, f:'W' },  // index 3
];
```

Movement is 180ms eased translation. Turning is 140ms eased rotation. Both use the same easing curve: `t < 0.5 ? 2*t*t : -1+(4-2*t)*t`.

---

## Floor Data Object

```js
{
  grid: T[][],           // 2D array, T.EMPTY | T.CORRIDOR | T.STORE
  storeMap: number[][],  // parallel array, store index (-1 for non-store)
  stores: [              // array of store objects
    { palette, x, y, w, h, isBackRoom? }
  ],
  doors: Set<string>,    // "x,y:nx,ny" pairs (bidirectional)
  W: number, H: number,  // grid dimensions
  startX, startY,        // player start position
  wallEntities: [        // wall-snapped interactive objects
    { tileX, tileY, face, type, id }
    // face: 'N'|'S'|'E'|'W' — which wall of the tile the entity is on
    // type: 'atm' | 'payphone'
  ],
  looseItems: [          // floor items
    { tileX, tileY, item, offsetX, offsetZ, requiredFace, id }
    // requiredFace: which direction player must face to buy
    // offsetX/Z: scatter within tile, seeded from item id
  ],
  seed: number
}
```

---

## Store Palettes

Eight named store palettes, each with floor/wall/ceil hex colors and a name:

```js
const STORE_PALETTES = [
  { floor:"#C8508C", wall:"#FF2D78", ceil:"#FFB3D9", name:"XCESS" },
  { floor:"#1A3A6B", wall:"#00CFFF", ceil:"#B3EEFF", name:"SPORT PLUS" },
  { floor:"#2B1A4F", wall:"#9B59B6", ceil:"#DDB3FF", name:"PHASE" },
  { floor:"#4A1A00", wall:"#FF6600", ceil:"#FFD9B3", name:"SUNCOAST" },
  { floor:"#004A1A", wall:"#27AE60", ceil:"#B3FFD1", name:"NATURE CO" },
  { floor:"#1A0000", wall:"#CC0000", ceil:"#FFB3B3", name:"BLAZE" },
  { floor:"#4A3A00", wall:"#FFD700", ceil:"#FFF5B3", name:"GOLDENROD" },
  { floor:"#003A4A", wall:"#008080", ceil:"#B3FFFF", name:"PACIFIC" },
];
const CORRIDOR_PALETTE = { floor:"#D4A76A", wall:"#F5ECD7", ceil:"#F0EDE0" };
```

---

## Seeded RNG

All procedural generation uses a deterministic LCG:

```js
function rng(seed) {
  let s = (seed ^ 0xDEADBEEF) >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
}
```

Call `rng(seed)` to get a generator function. Each call to the generator advances the sequence.

---

## Item Schema

```js
{
  id: number,             // seed used to generate this item
  name: string,           // base item type ("Beanie", "Hoodie", etc.)
  color: string,          // hex color for 3D cube representation
  rarity: string,         // "common" | "uncommon" | "rare" | "legendary"
  prefix: null | { name, stat, val },   // e.g. { name:"Chunky", stat:"BULK", val:3 }
  suffix: null | { name, stat, val },   // e.g. { name:"of the Mall", stat:"VIBES", val:2 }
  stats: { [statName]: number },        // e.g. { VIBES: 2, STYLE: 3 }
  isDollar: boolean,
  crafted?: boolean       // true if modified by dollar crafting
}
```

**Stats:** VIBES, BULK, STYLE, LUCK, CLOUT, CHILL

**Rarity distribution:** common 55%, uncommon 27%, rare 14%, legendary 4%

**Affix counts by rarity:** common = 0, uncommon = 1 prefix, rare = 2 (prefix + suffix), legendary = 2

---

## Dollar Schema

Mall Dollars are items with `isDollar: true`. They have their own color (from DOLLAR_COLORS array), rarity, and stats. When spent on an item, dollar stats blend into the purchased item at half value. If the dollar's rarity exceeds the item's rarity, there's a 40% chance to upgrade the item's rarity by one tier.

```js
const DOLLAR_COLORS = ["#FF3366","#33AAFF","#FFEE00","#44DD88","#FF9900","#CC44FF"];
```

---

## Quest Schema

```js
{
  id: number,       // seed
  giver: string,    // "Aunt Carol", "Grandma Pat", etc.
  stat: string,     // which stat they need
  min: number,      // minimum value required
  msg: string,      // the call message shown to player
  complete: boolean
}
```

Quest matching: sum the item's base stat + prefix contribution (if prefix.stat matches) + suffix contribution (if suffix.stat matches). If total >= quest.min, it's a match.

---

## Wall Entities

ATMs and payphones are wall-snapped — positioned against one wall face of a corridor tile. The face indicates which wall: 'N' = north wall (z- edge), 'S' = south wall (z+ edge), 'E' = east wall (x+ edge), 'W' = west wall (x- edge).

**ATM:** `face` matches the direction player must be **facing** to interact. Player must be in the ATM's tile, facing the same direction as the ATM's face. Interaction: bump (forward into wall) → green border → bump again → Mall Dollar dispensed.

**Payphone:** Same facing rule. Interaction:
- No active quest → generates and assigns a new quest, shows caller message
- Active quest, no matching item → plays babble line
- Active quest, matching item in hand → delivers item, completes quest, triggers world mutation

---

## Interaction Model (Bump System)

1. Player attempts to move forward into a wall or blocked tile
2. If there's an ATM or payphone on that wall face: enter **bump mode** (green border)
3. If player steps onto a tile with a loose item: enter bump mode automatically on landing
4. For loose items: player must also be **facing the item's requiredFace** to confirm purchase
   - The prompt tells them which direction to face
   - Turning to face the item updates bump mode; turning away cancels it
5. Second forward input confirms: ATM dispenses dollar, payphone triggers quest logic, item consumed by purchase

**Cancel:** back up, turn away from a floor item, or any non-forward input while in ATM/phone bump mode.

---

## World Mutation

Completing a quest calls `mutateWorld(fd, questSeed)`:
1. Finds corridor tiles adjacent to empty space
2. Carves 3-5 new corridor tiles in a direction
3. 65% chance: adds a small store (2-4 tiles) off the side, with a door, containing one above-average item
4. Places a payphone at the end of the new hall
5. Calls `buildScene` incrementally on only the new tiles (no full rebuild)
6. Shows "A new area has opened up somewhere..." toast

---

## Rendering

Three.js r128. `PerspectiveCamera` at FOV 70, player eye height 1.6 units. `AmbientLight` warm white at 0.55 intensity. `Fog` from 16 to 44 units. `PointLight` every 2 tiles at ceiling height.

**Textures:** All generated via `<canvas>` at 256×256. Cached by key. Floor has rotated diamond tile pattern. Wall has vertical stripe pattern. Ceiling has grid panel pattern. Door is painted wood with gold knob. ATM is dark panel with cyan terminal display. Payphone is blue panel with keypad and receiver.

**Geometry:**
- Floor/ceiling tiles: `BoxGeometry(4, 0.08, 4)`
- Walls: `BoxGeometry(4, 3.2, 0.15)` or `BoxGeometry(0.15, 3.2, 4)`
- ATM: `BoxGeometry(0.9, 2.1, 0.22)`, positioned `CELL/2 - 0.12` from tile center toward wall
- Payphone: `BoxGeometry(0.75, 1.8, 0.18)`, same offset
- Loose items: small cube `BoxGeometry(0.24, 0.24, 0.24)` on a flat pedestal `BoxGeometry(0.35, 0.06, 0.35)`. Offset within tile by seeded amount (up to ±55% of cell size). Rarity-colored point light above.

**Props:** Benches, plants (sphere tree), trash cans, kiosks, fountains, shelves, racks, display stands, counters, mannequins. Spawned per tile at low density (6% corridors, 10% stores). Position seeded from tile coordinates.

---

## HUD Elements

All HUD is HTML overlaid on the Three.js canvas using `position: absolute`.

- **Top left:** Mall name ("🛍 SUNSET RIDGE MALL"), pink neon style
- **Top right:** Floor number, facing direction, current store name if inside a store
- **Top center:** Active quest note (when quest is assigned) — yellow/amber, handwritten feel
- **Right edge:** Compass (N/E/S/W), current direction highlighted
- **Bottom corners:** Hand slots (L HAND, R HAND) — shows item color swatch, name, prefix/suffix, rarity, stats
- **Center:** Bump prompt when in bump mode — shows item name, rarity, facing instruction
- **Center:** Phone message overlay when payphone activates
- **Top center (below quest):** Acquired flash — brief confirmation of purchase or delivery
- **Bottom center:** World event toast when new area unlocks
- **Touch controls:** D-pad layout (▲ ◄ ▼ ►), large touch targets

---

## Prop Types

```
Corridor: bench, plant, trashcan, kiosk, fountain
Store: shelf, rack, display, counter, mannequin
```

Prop positions are seeded from `(seed * 137 + y * 31 + x)` so they're deterministic per floor.

---

## Quest Givers

```js
"Aunt Carol", "Uncle Dave", "Your Cousin Jess", "Grandma Pat", "Your Neighbor Tim",
"Old Friend Mira", "Your Roommate", "Mom", "Dad", "Your Sister", "Your Brother",
"A Kid Named Rory", "Someone Called Bex", "Your Old Coach"
```

---

## Payphone Babble Lines

Played when player uses a payphone while a quest is active but they don't have the right item:

```
"...anyway how are you doing, you sound tired—"
"—I already TOLD you, the cat is FINE—"
"—did you see what they're doing to the old Sears—"
"—just pick up something nice, you know what I like—"
"—hello? hello? can you hear me? HELLO—"
"—the signal here is terrible, I'm at the mall—"
"—your father says hi, I'm saying hi too—"
"—honestly just get something, anything, just think of me—"
```

---

## Aesthetic Direction

90s mall nostalgia. Warm terracotta corridor floors, cream walls, fluorescent ceiling panels. Each store has a distinct color world. Neon signage. The controls and HUD use a yellow-gold palette with monospace fonts. Rarity colors: common gray, uncommon green, rare blue, legendary orange.

The experience should feel like wandering a mall on a weeknight — slightly too empty, lights a little too bright, the fountain running for nobody.

---

## Hub Integration

```js
// On score load:
window.parent.postMessage({ type: 'hub:minimize' }, '*');

// Optional: send Scraggles on significant events
window.parent.postMessage({
  type: 'scraggle',
  emoji: '🛍',
  text: `Quest completed for ${quest.giver}`
}, '*');
```

---

## What's Working (in reference implementation)

- Procedural floor generation with stores, corridors, doors
- Grid movement with smooth animation (move + turn)
- Wall-snapped ATMs (dispense Mall Dollars)
- Wall-snapped payphones (quest assignment + delivery)
- Loose item scatter (facing-direction-to-buy)
- Dollar crafting (stat blending, rarity upgrade chance)
- Quest system (one active, stat matching, delivery)
- World mutation on quest completion (new corridor + back room)
- Incremental scene building (only new tiles rebuilt)
- Hand slots with item display
- Stat discovery (stats appear in HUD when first encountered)
- Rarity-colored point lights on loose items
- Touch controls

---

## What's Built

As of February 2026, the score is live at `scores/sunset-ridge-mall/index.html` — vanilla JS, no build step, served from The Hall's hub at `localhost:3000`. Committed to `Ariliteth/the-hall`.

- **Grid-based first-person 3D** — Three.js r128, snap-step movement, 90° turns, FOV 70, cell size CELL=6
- **Procedural floor generation** — stores, corridors, ATMs, payphones, loose items on pedestals
- **Items** — rarity tiers (common/uncommon/rare/legendary), prefix/suffix affixes, per-stat bonuses, rarity-colored glow
- **Mall Dollars** — dispensed from ATMs, required to purchase items, stat bonuses applied on craft
- **Payphone quests** — stat-minimum delivery missions with randomized givers and babble lines
- **World mutation** — quest completion extends the map with new corridors and a back room; directional toast + pulsing orange beacon mark the entrance
- **Escalator** — fixed at the far end of the main corridor spine. Step onto it, screen fades to warm pale white, new floor generates from a deterministic seed (`seed * 7919 + floor * 3571`). One-way only. Hands, stats, and active quest carry over. Floor counter increments in HUD.
- **YOU ARE HERE sign** — mall directory panel on the east wall of the escalator tile. Reads clearly only once you are standing at the escalator. Fine print: MANAGEMENT NOT RESPONSIBLE.
- **Glass storefronts** — all corridor/store boundaries render as translucent glass panels. Door positions add a slightly more opaque insert with metal frame jambs and header. Store lighting bleeds through.
- **Props scaled to cell size** — `const S = CELL / 4` inside `spawnProp` keeps mannequins, racks, shelves, fountains, and plants proportional to the corridor regardless of CELL value.
- **Hub integration** — sends `hub:minimize` on load, `scraggle` on quest completion and floor ascent.

## What's Planned

- **Mall name as seed** — typing "Sunset Ridge Mall" at an entry screen generates a deterministic, shareable layout
- **Parking lot / mall selection screen** — choose your mall before entering
- **Shopping lists as JSON** — external `mall-config.json` feeds store themes and item tables per floor
- **Multiple active quests** — carry more than one at a time
- **Item dropping / swapping** — put things down, trade between hands
- **Inventory / bag** — carry more than two items
- **Critter Kiosk** — critters from Critter Crank surface as purchasable entities in mall pet shops, reading from `baseline-session/portraits-queue`
- **ATM guarantee** — currently intentional: a floor with no ATM is a window-shopping floor. Revisit when quest complexity increases.
- **Map screen** — floor layout visible on escalator transition or via a kiosk

---

## Reference Implementation

The original reference code is in `concessions/mall-walker.jsx`. It is React/JSX and will not run directly in The Hall. The canonical implementation is now `scores/sunset-ridge-mall/index.html` — the ported vanilla JS version. The JSX is kept as a historical artifact and behavioral reference only.

---

*Attend Gently.*
