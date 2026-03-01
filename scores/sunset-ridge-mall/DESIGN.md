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

### Low-hanging / likely next
- **Ra** — Fox noticed DOUGH + FÜSS rhymed with Skyrim's FUS RO DAH. A third store ("Ra"?) could be a mystical/power store: shout-themed items, "Ancient", "Booming", "of the Voice" affixes. Closes the triangle.
- **Bench + fountain minor interactions** — toss a coin in the fountain (LUCK +1, one-time per fountain); sit on a bench (brief PA joke about resting). Purely atmospheric.
- **Coffee machine in Staff Room** — a wall entity in STAFF ONLY rooms; gives a small one-time CHILL boost and a scraggle. The break room feeling deepened.
- **Quest giver follow-up** — after delivery, ~30% chance a second payphone call comes in from the same giver with a babble line or a thank-you item hint

### Medium scope
- **Down escalator** — some floors could have both up and down, creating a web rather than a strict tower. Would require tracking visited floors.
- **Parking garage floor** — pre-exit floor type: darker, lower ceiling, more cars on the ground, leading to the Emergent Exit as a guaranteed feature (not just food court)
- **Quest chains** — same giver across multiple floors; building toward something bigger
- **Mall map kiosk** — a wall entity that renders a rough text/canvas map of the current floor's corridor layout

### Bigger / later
- **The Management Office** — a special floor that opens after enough Staff Rooms found; legendary item guaranteed, something narratively conclusive-feeling
- **Seasonal PA events** — holiday lines, grand opening days, clearance weeks (could be driven by real date)
- **Named item provenance** — items remember where they were found (floor, store, mall name) and show it in the hand card as a tiny footnote
