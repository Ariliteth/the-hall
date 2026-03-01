# Sunset Ridge Mall — Design Document

A vanilla JS first-person 3D dungeon crawler set inside a procedurally generated mall.
Built in a single `index.html` using Three.js r128, embedded as a score inside The Hall.

---

## Core Loop

Walk the mall. Pick things up. Sell or ship or discard them.
Complete payphone quests. New areas open. Find the escalator. Go up.
Occasionally find a car. Drive to another mall. Do it again.

---

## Architecture

**Renderer:** Three.js r128 — `MeshLambertMaterial`, `PointLight`, `CanvasTexture`
**State:** Single `G` global object (player, hands, stats, quests, floor data)
**Generation:** Seeded LCG (`rng(seed)`) — all floors, props, items, wall entities fully deterministic
**Hall integration:** `window.parent.postMessage` scraggles, `localStorage` portraits-queue for U-SEEN

---

## Systems

### Map Generation (`generateFloor`)
- Grid of EMPTY / CORRIDOR / STORE tiles
- Two-row atrium spine runs east-west at midY
- 3–7 stores placed above/below spine, corridors connect them
- Escalator fixed at far-east end of spine (always reachable)
- Wall entities: ATMs, payphones, Ship-It stations, U-SEEN kiosks
- Props seeded per-tile: bench, plant, trashcan, kiosk, fountain (corridor); shelf, rack, display, counter, mannequin (store)
- Every 7th floor (floor > 1): Food Court instead of normal floor

### Food Court (`generateFoodCourtFloor`)
- Wide 4-row atrium, no stores
- Beef'd and Cheesn'ts statues at north/south ends
- 3–5 sampler carts (one sample per cart, then silent)
- ATM + payphone + Emergent Exit wall entities

### Items (`generateItem`)
- Seeded per tile: name, color, rarity (common 55% / uncommon 27% / rare 14% / legendary 1%)
- Stats: random selection of BASE_STATS [VIBES, BULK, STYLE, LUCK, CLOUT, CHILL]
- Prefixes / suffixes from global PREFIXES/SUFFIXES or store-specific pools
- 3% chance: Car item (rare, VIBES+3 CLOUT+2) — unlocks Emergent Exit

### Stores
**8 Base Palettes** (always present): XCESS, SPORT PLUS, PHASE, SUNCOAST, NATURE CO, BLAZE, GOLDENROD, PACIFIC
Each has: floor/wall/ceil colors, tagline, favStats (boost 60% chance +1–2), extraPrefixes/extraSuffixes

**11 Special Palettes** (floor 7+, max 1 per floor, seeded):
ARWHEN (watches) · DOUGH (calendars) · MOIST (squirters) · SANG (vinyl records) ·
FEAT. (collab records, "ft the Mall") · FÜSS (anklets) · C·C JEANS (capris, "No. 1 of 500") ·
LOTUS (incense) · BEANS (beans) · IMPORTÉ (glasses) · TOUCHBACK (jerseys)
Special stores have `itemBases` — 70% chance item name/color overrides to store-specific goods
Floor gating: 35% chance floor 7+, 55% floor 14+, 100% floor 21+

### Economy
- **Mall Dollar**: withdraw from ATM (free), or craft from 2 non-dollar/non-car items
- **Buying**: stand on store item tile facing correctly, press forward with a dollar in hand
- **Crafting upgrade**: dollar rarity influences purchased item rarity

### Stat Layers (HUD: STATS / PERMANENT / SIGNATURE)
- **Active** = sum of both hand items' stats (lost when item leaves hand)
- **PERMANENT** (green) = 25% of each stat retained when discarding at a trashcan — stays forever
- **SIGNATURE** (purple) = 40% of each stat retained when shipping at Ship-It — the mark you leave

### Interactions (bumpMode system)
| Interaction | Trigger | Effect |
|---|---|---|
| Item purchase | face item, press fwd + hold dollar | crafts item with dollar, puts in hand |
| ATM | face wall entity | withdraw dollar, or craft 2 items → dollar |
| Payphone | face wall entity | receive/deliver quest |
| Ship-It | face wall entity | ship hand item, retain 40% as SIGNATURE |
| Trashcan | land on tile with item in hand | discard item, retain 25% as PERMANENT |
| U-SEEN Kiosk | face wall entity | wave at Hall visitor or mall regular |
| Sampler | face wall entity (food court) | one free food item per cart, then silent |
| Emergent Exit | face wall entity (food court) | consume car, drive to seeded new mall |

### Quest System
- `generateQuest(seed)` — random giver (named person), stat preference, item type hint
- Quest displayed on payphone call; active quest shown in HUD
- Deliver matching item → world mutates (new corridor + back room)
- **Quest reward escalation:**
  - Quest 1: normal back room (STORE_PALETTES, uncommon+ item)
  - Quest 2: 45% Staff Room, else normal
  - Quest 3+: 70% Staff Room
  - Resets on escalator / driving to new mall

### Staff Room (STAFF ONLY)
- Spawns as back room after loyal quest completion
- Goods: Lanyard, Name Tag, Donut, Clipboard, Walkie, Leftovers, Staff Key, Break Room Key
- Affixes: Employee/Spare/Lost/Manager's + of the Break Room/of Overtime/of the Back Office
- Stats: LUCK + CHILL boosted; rarity: 35% uncommon, 45% rare, 20% legendary
- World event reads "🔑 STAFF AREA · HEAD X · FOLLOW THE LIGHT"

### PA System
- Runs 50–110s intervals with 35% chance to weave Hall scraggle content
- 20 generic lines + food court variants
- Payphone guard (doesn't announce payphone activity during call)

### U-SEEN Kiosk
- Shows Hall portraits-queue visitor (B-HERE, bright green) if present
- Falls back to MALL_REGULARS pool (REGULAR, muted blue) — 12 named regulars rotating every 30 min:
  Bev (Bath & Beyond), Old Man Gerald (Fountain Level), The Sunglasses Kid (Unknown),
  Marcia (Senior Walk), Chip (Food Court), Double Stroller Mom (Near Parking),
  Pager Guy (Somewhere Beeping), Carol (Always Here), Phil (Back Hallway),
  Nana Del (The Mall), Terri (Suncoast), The Kiosk Man (The Kiosk)
- Waving at a real visitor sends a Hall scraggle; regulars are quiet

### Emergent Exit
- In food court; requires a car item in hand
- Consumes car; seeds new world from car ID; transitions with full fade
- 12 MALL_NAMES: Sunset Ridge Mall, Pinecrest Galleria, Westfield Commons,
  Lakeside Plaza, Harbor Point Mall, Crossroads Center, Northbrook Court,
  The Promenade, Valley View Mall, Ridgeview Place, Cedar Point Shops,
  The Galleria at Noon

### Visuals
- `personalLight`: PointLight follows camera, pulses with held items, rarity-tinted color
- `flickerLights`: store lights flicker when player holds items (enrolled per store, amplitude varies by rarity)
- Glass ceiling panels over atrium spine; skylight mesh at escalator top
- Store door signs (signTex canvas) above door frames
- 3D props with scale tied to CELL constant (CELL=6 → S=1.5)
- Escalator overlay fade; escalator room with YOU ARE HERE sign

---

## Commit History

| Hash | Description |
|---|---|
| `(next)` | ??? |
| `bfd782d` | Sound system, enhanced bench (CHILL tiers, audio) |
| `3272515` | Ra (cheerleading), item provenance, silent bench |
| `87bbe3c` | Staff rooms, U-SEEN regulars, quest reward escalation |
| `77d6227` | Special stores: 11 shops appear deeper in the mall |
| `82db6ef` | Trashcans of permanence |
| `291536b` | ATM crafting, Emergent Exit, car items, sampler limit, mall worlds |
| `5fb83ed` | Store identity, food court, signage, ATM hint, Hall quest givers |
| `7c4bdb1` | Emoji stats, spawn fix, ATM guarantee, item glow |
| `650eac6` | U-SEEN Community Kiosk and PA Announcement System |
| `7c2dcd5` | Dim atrium skylights; item acquisition scraggles |
| `c6adbf8` | Atrium spine, glass ceiling, taller halls |
| `b4b8ac7` | Ship-It station and Signature stats |
| `e847cd7` | Fix upper-floor props and escalator reachability |
| `d16f39d` | Escalator, glass storefronts, scaled props |
| `a69c14b` | Initial score |

---

## On the Horizon

### Implemented
- **Ra** ✓ — cheerleading store. Pom Poms, Megaphones, Spirit Sticks, Cheers, Banners.
  Gold and red. "Go. Go. Go." VIBES + CLOUT favored. "of the Squad" suffix (+4 CLOUT).
- **Named item provenance** ✓ — `foundFloor`, `foundMall`, `foundStore` stamped at pickup.
  Hand card shows tiny footnote: `f7 · SANG`, `f12 · Pinecrest Galleria`, `f3 · STAFF ONLY`.
  Mall name only shown if item is from a *different* mall (carried through Emergent Exit).
- **Silent bench** ✓ — backing into a wall while standing on a bench tile absorbs the red flash.
  Depth scales with `benchSits` counter and total CHILL stat.
  Five tiers: casual → settling → drifting → deep ease → full peace.
  CHILL ≥ 8: rare chance for "the bench is also quite chill."
  Plays a soft filtered tone (C3–E3) on each sit. Bench depth resets on escalator/drive.
- **Sound system** ✓ — Web Audio API, no library. Lazy init on first keypress (autoplay policy).
  **Mall muzak:** C2+G2 bass drone (triangle oscillators) + two generative pentatonic pad voices
  at independent tempos, all routed through a low-pass filter for that muffled mall warmth.
  **Sound effects:** pickup (ascending chime), atm (mechanical beeps), ship (departing tone),
  perm (soft low thud), bench (filtered low sine, random pitch each sit), escalator (freq glide).
  **🔊 toggle button** in HUD bottom-left. State: muted/unmuted survives turns but resets on reload.

### Minor interactions (design notes from Fox)
- **Principle:** these must not interrupt flow. They are environmental, not mechanical.
  No green border, no bumpMode prompt. Brief world-event text at most (or nothing at all).
- **Fountain** — possible: toss a coin (one-time, slight LUCK flicker). Silent.
- **Coffee machine in Staff Room** — wall entity in STAFF ONLY; one-time CHILL boost.
- **Quest giver follow-up** — after delivery, ~30% chance a second call comes from same giver

### Medium scope
- **Down escalators** — random count per floor (0–2), seeded. Going down could access
  different room/floor pools (darker palettes? different special store weights?). Design intent:
  creates a web, not a strict tower. Visited-floor tracking needed.
- **Parking garage floor** — darker, lower ceiling, concrete pillars with colored shapes
  (each level has its own shape/color so you can navigate). Safe feeling. Cars on the ground.
  Emergent Exit guaranteed (not just food court). Guaranteed car item spawn.
- **Ship-It receipt board** — a wall entity that shows a scrolling log of shipped items
  (name, rarity, floor, store). Could appear near Ship-It stations or in Staff Rooms.
- **Quest chains** — same giver across multiple floors; building toward a larger delivery
- **Mall map kiosk** — rough canvas map of current floor's corridor layout

### Bigger / later
- **The Management Office** — unlocks after enough Staff Rooms found; legendary item guaranteed;
  narratively conclusive-feeling. The escalator goes somewhere different.
- **Sunset Ridge Mall as its own Hall neighborhood** — the mall world is rich enough
  to warrant its own presence in The Hall ecosystem.
- **Seasonal PA events** — holiday lines, grand opening days, clearance weeks (real date)
- **Named item full provenance record** — items already remember where they came from.
  Future: the Ship-It log / receipt board shows the trail of items that passed through.
