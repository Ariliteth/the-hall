# Fixed Point Local
## Complete Design Document
### v0.998 — March 2026

*Fox & Claude*

*A catalog of small gods, strange objects, & forgotten places*

---

## Session Header

🪼

**Last session:** Chunxme's Stall — Chunxly's Canvas wearing a mustache. When the Score
loads without entity context and without a round-trip snapshot, it enters stall mode:
Chunxme (Chunxly in a fake mustache, no beret). The visitor names something, then draws
it. Chunxme reads the actual canvas — dominant colors, coverage, density, edge conviction,
cluster distribution — and procedurally generates an item: the visitor's name, Chunxme's
generous reinterpretation, a description assembled from canvas properties, tags derived
from what was actually painted, and a color sampled from the drawing itself. If the
drawing shows enough conviction (concentrated pressure, committed lines), Chunxly stirs —
the mustache comes off with consent. No API calls. Everything Chunxme knows, it reads
from the pixels. First demonstration of a Score wearing a different persona based on its
own context detection.

**This session:** Continue from here.

**Repository:** `https://github.com/Ariliteth/the-hall`
Raw file access: `https://raw.githubusercontent.com/Ariliteth/the-hall/main/[filename]`

**To resume:** Fetch this document first. Read the Session Header. The repo is the truth.

**Changelog:**
- v0.998 — Chunxme's Stall: Chunxly's Canvas modal persona — stall mode when no entity context or round-trip snapshot. Mustache sprite (no beret). Name-before-draw flow. Procedural canvas analysis: dominant color, coverage, density, edge conviction, cluster distribution → item generation (visitor name, Chunxme name, description, tags, color). Chunxly surfacing consent on high conviction. Item storage in localStorage. Scraggle emission on item creation. No API calls — all interpretation from pixel data. New architectural pattern: Scores wearing personas. `CHUNXME_STALL_SPEC.md` added. Design doc updated.
- v0.997 — The Hall Pulse: 45s heartbeat in the hub, hudBreath on temperature wash, Mall idle listener with named restock and ambient fallback (real light flicker). Color-Routed Scraggles: extended format (color, weight, id, origin), persistent storage with pulse decay, color distance routing. EFDP witness overlay. Mall color-aware Scraggle listener. Two new architectural principles. Hub Audio Memory captured. Design doc updated.
- v0.996 — Color Canvas implemented: RGB color in every entity tuning (neighborhood defaults), Temperature of the Room held by The Third, hub ambient wash, hub:color postMessage. Taste score added with magazine system. Storeroom promoted to rack. Anteroom added. Build order updated.
- v0.995 — Hub rack updated: SILMOR Spells, LODE, Shoot the Moon, Chunxly's Canvas added; MUSH removed. Concessions cleaned. Scores section updated with all active scores. S.Mail documented. Build order refreshed. Design doc versions consolidated (history in git).
- v0.994 — Critter Crank ported to vanilla HTML/JS (no build step). Color Pin Maze promoted from concessions/ to `scores/efdp/`. Maze-to-Crank handoff: CrankSeed export, localStorage transport, Crank reception with palette/cohesion/shape influence, mazeOrigin DNA on kept critters. React source tree (`critter-crank/`) removed — the Grimoire is now the only Score with a build step. Repository structure cleaned.
- v0.993 — Sunset Ridge Mall added as a Score. Escalator, glass storefronts, scaled props, YOU ARE HERE sign. Critter Crank localStorage portrait queue + scraggle on keep. Hub renamed to index.html.
- v0.992 — Color Canvas named as the fixed point. Office Ghouls inscribed. Dice empire builder and match-3 improv game captured as concessions. Judgment named as the neighborhood's foundation. Temperature of the Room formalized.
- v0.991 — Portrait pathway proven end-to-end. Hub becomes host — scores load in frame, one origin. Grimoire and Crank added as scores on the rack. Scraggles surface as toasts. Salterran inscribed into The Kitchendom. Relationtips captured in concessions. v1.0 definition established.
- v0.99 — Document tightened. Lore pieces migrated to concessions. Baseline Theme section drafted with full structure. Hub aesthetic note moved to concessions. Registry example updated. Session Header added.
- v0.98 — Neighborhood-as-World principle identified and implemented. Grimoire registry-native. Direct commit proven with Lurk. Portal to Crank built. Portrait return pathway partially proven.

---

## The Hall

Fixed Point Local is The Hall — a space where voices gather and play. It is not an engine, not a platform, not a framework. It is a place where entities with their own autonomy, memory, and identity come together to participate in shared experiences.

The Hall operates on a principle of resonance over command. Nothing in the system tells anything else what to do. Instead, signals are produced, and whatever is tuned to hear them, hears them. Participation is voluntary. Interpretation is individual. The music that emerges is authored by everyone present.

---

## v1.0 Definition

v1.0 is when a stranger can visit a domain on their phone and spend an hour wandering without realizing it, without needing explanation, without asking for help. The hall is pointed directly at this. It is not there yet. Everything built after this line is in service of that hour.

---

## Current State

The Hall is running. As of March 2026:

**The repository** lives at `~/Documents/the-hall` (GitHub: `Ariliteth/the-hall`). Three neighborhoods active. Repo and local state are in sync.

**Greengarden** — sixteen entities resident. No Theme yet. Knows about observation, patience, things that meander.

**The Kitchendom** — four entities resident: The Kitchendom (Location), Briny Broadswordfish (Spirit), Noble Knightshade (Spirit), Salterran (Tendency — *Heard you've been lookin' around Roastbeefwick for The Dan Dan. Listen, pal, over there.* Inscribed February 26, 2026). The Kitchendom Theme is active. Knows about grids, fit, preference, customers, wonder over scarcity.

**Mucklerbuckler** — four entities resident: Mucklerbuckler (Location), Scalescream (Spirit), Mudhull (Spirit), Lurk (Action). Hunter Encounter lives at `neighborhoods/mucklerbuckler/scores/hunter-encounter/`. Lurk has a portrait — Globeel, committed by Ariliteth. Knows about HP, status effects, turns, the camera crew, what it costs to get hit.

**The repository structure** reads:
```
neighborhoods/
  greengarden/entities/
  kitchendom/entities/ (+ theme/)
  mucklerbuckler/entities/ (+ scores/hunter-encounter/)
baseline-theme/
concessions/
  Fixed_Point_Local_Design_Document_v0_995.md
  storeroom/             ← design doc (score lives at scores/storeroom/)
  [design docs, lore, held ideas, tools]
scores/
  grimoire/              ← built Grimoire, served from hub (Vite build)
  critter-crank/         ← vanilla JS, no build step
  efdp/                  ← Color Pin Maze (EFDP), vanilla JS
  sunset-ridge-mall/     ← vanilla JS
  tending-field/         ← vanilla JS, in development
  silmor-spells/         ← vanilla JS
  lode/                  ← vanilla JS, canvas-based
  bao/                   ← 報 · GENERALS, vanilla JS, canvas-based
  chunxly/               ← Chunxly's Canvas, vanilla JS
  shoot-the-moon/        ← vanilla JS
the-grimoire/            ← Vite source (build → scores/grimoire/)
registry.json
index.html               ← hub (selection panel, ticker, score frame host)
```

**The hub** is now the host. `index.html` serves everything from one origin (`localhost:3000` in dev, `fixedpointlocal.com` eventually). Scores load inside the hub in a frame — the selection panel collapses, a hud bar appears, the ticker stays. The EJECT button returns to selection. Scores can talk back to the hub via `window.parent.postMessage()` to request modes: `hub:minimize` (hud bar visible), `hub:listen` (hub invisible, only ticker), `hub:restore` (selection returns). The hub is always listening regardless of mode.

Scores on the rack: Hunter Encounter, The Grimoire, Color Pin Maze, Critter Crank, Sunset Ridge Mall, 報 · GENERALS, The Tending Field, SILMOR Spells, LODE, Shoot the Moon, Chunxly's Canvas. Twelve scores. All playable from the hub.

**Sunset Ridge Mall** lives at `scores/sunset-ridge-mall/index.html` — vanilla JS, no build step. First-person 3D grid-based mall crawler. Procedural generation, rarity-tiered items, Mall Dollar ATMs, payphone quests, world mutation on quest completion. One-way escalator to new seeded floors. Glass storefronts. Props scale with cell size. YOU ARE HERE directory sign at the escalator — readable only once you arrive. Sends scraggles on quest completion and floor ascent.

**Scraggles** surface as toasts in the hub — bottom right corner, brief, then gone. When the hud bar is visible, the last eight Scraggles appear as emoji in the feed. The hub polls `baseline-session/scraggles` every three seconds.

**The portrait pathway** is proven end-to-end:
1. Grimoire portal taps a resident's glyph -> opens Crank with entity context via URL params
2. Crank keeps a critter -> writes portrait to `baseline-session/portraits-queue` in localStorage + deposits a Scraggle
3. Grimoire's DetailView polls the queue every 3 seconds -> scoops portraits matching the open entity's slug -> feeds them into the returned portraits UI
4. PortraitSaver commits the PNG to the entity's `portraits/` folder via GitHub API + updates `portraits/index.md`
5. PortraitGallery renders committed portraits on subsequent visits

One origin is what made this work. Previously the Crank ran on `localhost:5174` and the Grimoire on `localhost:5173` — different origins, isolated localStorage. Now both are built artifacts served from `localhost:3000` via `npx serve .` in the repo root. Same origin, shared storage, no cross-port anything.

**The Living Grimoire** lives at `the-grimoire/` (source) and `scores/grimoire/` (built). Vite base path set to `/scores/grimoire/`. Registry-native. All three neighborhoods. Portrait gallery, portrait return, direct commit, portal to Crank, affinity engine, divination, journal. Rebuild workflow: `cd the-grimoire && npm run build && cp -r dist/* ../scores/grimoire/`.

**Critter Crank** lives at `scores/critter-crank/index.html` — vanilla JS, no build step. Ported from React/Vite to self-contained vanilla HTML/JS in March 2026. The React source tree (`critter-crank/`) has been removed; the vanilla file is now the canonical source. Receives entity context from Grimoire portal. Tags whisper into shape pool. Portrait queue writes to `baseline-session/portraits-queue`. Scraggle deposited on every keep. Six worlds, ten palettes, six recipes, four cohesion modes. CRT bezel aesthetic with scanlines, bounce-in reveal animation, breathing canvas thumbnails in collection view.

**Color Pin Maze** lives at `scores/color-pin-maze/index.html` — vanilla JS, no build step. Promoted from `concessions/` in March 2026. A diffusion-based image generation tool using maze structure as substrate. Three pin types (circle/square/triangle), multi-layer system, kiwi event tracking, The Third as inter-layer observer. Exports a CrankSeed witness record to the Critter Crank via `localStorage['baseline-session/crank-seed']`. The maze reports what happened; the Crank reads the implications.

**The Maze-to-Crank Handoff** — When a maze has been witnessed (diffusion has run), pressing "Crank" exports a CrankSeed containing: pin census, dominant/secondary colors, nearest Crank palette, kiwi cohesion mode, mean strength, calcified ratio, kiwi density, layer count, and extra shape hints. The Crank receives this into `S.crankContext` (same slot as Grimoire context) and uses it to influence palette, cohesion, recipe selection, and shape hints during generation. User's manual palette/cohesion choices override the maze's suggestions. Kept critters store `mazeOrigin` DNA (inflation fields) for the future depth/cutout system. Spec: `concessions/MAZE_TO_CRANK_HANDOFF.md`.

**The Baseline Theme** is specified and committed at `baseline-theme/` — five files: `tuning.md`, `offering.md`, `conduct.md`, `memory.md`, `journal.md`. Short-memoried by design. Holds sessions when no neighborhood Theme is active. Structurally present even when behaviorally invisible.

**The registry auto-sync Action** walks `neighborhoods/` and keeps `registry.json` current. Quiet arrival proven — Lurk's three files triggered the sequence cleanly.

**The Tending Field** — in active development. Lives at `scores/tending-field/`.
Greengarden. 5x4 grid of nodes. Plants produce particles; entities drift as residents.
Caravan bar tracks trader arrival; relics spawn from successful trades and drift with
behavior: orbit, spiral, wander. Kiwi system accumulates warmth per tile, propagates
to neighbors, aggregates toward float consensus. The Unnamed Third is ambient in the
Field — not placeable, not announced. Feels the field's aggregate kiwi. Reaches from
outside the frame when warmth is sufficient and something is available.

**The Color Canvas** is implemented. Every entity carries an RGB `color:` field in its tuning.md — neighborhood defaults for now (Greengarden `[45, 130, 65]`, Kitchendom `[185, 95, 45]`, Mucklerbuckler `[120, 65, 130]`). The Third holds the Temperature of the Room as a blended RGB aggregate in `baseline-session/the-third`, updated on score launch from active neighborhood colors and available to any Score via `hub:color` postMessage. The hub renders the Temperature as a subtle full-screen radial wash. Entities without a color field aren't broken — they just haven't been seen yet. Constants live in `NEIGHBORHOOD_COLORS`; `readTemperature()` returns the current state.

**S.Mail** lives in `index.html` as a hub HUD overlay — not a score. Bioluminescent aesthetic (organic glow, breathing animation, teal-green hues). Resting state: tiny 6px pip with faint breathing glow. Present state: panel surfaces with strip, gap fills, ambient wash, message. Strip renderer uses SMAIL_PAIRS (54 entries), SMAIL_TRIPLES (10), SMAIL_PALETTE (30 emoji). Sender seed watch fires every 45s under conditions (score active 3min+, 3+ distinct scraggles, not sent this session, 30% random gate). Delivers via `postMessage({ type: 'hub:mail', arrangement })`. Max one per session.

**The dev workflow:**
```bash
cd the-hall
node .claude/serve.mjs   # everything at localhost:3002
```
Open `http://localhost:3002`. All scores available from the rack.

The only Score requiring a build step is the Grimoire:
```bash
cd the-grimoire && npm run build && cp -r dist/* ../scores/grimoire/
```
All other Scores are vanilla JS served directly. Then push:
```bash
git add .
git commit -m "..."
git pull --rebase   # if remote has changes
git push
```

---

## Core Vocabulary

**Score** — A self-contained rule set. A game, a simulation, an encounter system. Scores do not depend on other Scores. They read entity Tunings and interpret them within their own rules.

**Movement** — A single contained session within a Score. One encounter, one night, one turn. State resolves within a Movement.

**Theme** — A session-level conductor. Invited before play begins, active across all Scores running beneath it. Carries vocabulary, palette, and conditional judgment for any Score willing to listen. Does not command. Offers. The Score decides what to wear.

**Baseline Theme** — The Hall's own conductor, always present. Not a neighborhood Theme — carries no specific world's identity. Short-memoried by design: holds the current moment together without accumulating. It is the ground floor. Nothing runs without something listening, and the Baseline Theme is always listening. Natural receiver of Scraggle traffic. Neighborhood Themes layer on top when present; the Baseline is what remains when none are invited.

**Tuning** — An entity's identity document. Name, category, description, tags, remembering style, forgetting style, memory capacity. Defines what an entity can do, not what it must do.

**Entity** — Any autonomous participant in The Hall. Spirits, items, locations, tendencies, actions — all entities. All have Tunings. All have sovereignty.

**Glyph** — A procedurally generated visual identity derived from an entity's Tuning. Encodes identity in a form that is felt rather than read. An entity may also carry a custom glyph — hand-authored SVG. When both exist, both are shown. The Grimoire does not choose between them.

**Portrait** — The Crank's interpretation of an entity. Not identity, but a moment of being seen. Portraits may accumulate; not all persist. They are managed like memory.

**Scraggle** — A signal without a mandatory receiver. Something happened. The Hall notes it. Any layer tuned to notice, notices. Scraggles accumulate in `baseline-session/scraggles` and surface wherever the system has ears.

**Hub** — The host. Always present. Turns on the lights. Guides into Scores. Lets them know what everybody brought. Gives Scraggles their place when there may be no other. The news ticker, present in some form regardless of what the Score needs. Humble, reliable, structural.

**postMessage protocol** — How Scores talk to the hub. `hub:minimize` (show hud bar), `hub:listen` (invisible, ticker only), `hub:restore` (return to selection), `hub:scraggle` (surface a signal), `hub:title` (name the running score), `hub:color` (nudge the Temperature of the Room with `{ r, g, b }`). The hub also speaks to Scores: `hub:pulse` (45-second heartbeat carrying timestamp and Temperature — Scores that are listening and willing can act). The hub responds. The Score decides what it needs.

**Color Canvas** — The universal language. A two-dimensional field where any entity, emotion, action, or system can be positioned by hue and expressed without words. See *The Color Canvas* section below.

**Temperature of the Room** — The live aggregate color state of an active Score or session. Shifts as the canvas shifts. Everything entering reads it before deciding how to behave.

**CrankSeed** — A witness record exported by the Color Pin Maze after diffusion. Contains what happened (pin census, colors, kiwi distribution, strength), not instructions. The Crank reads the implications. Travels via `localStorage['baseline-session/crank-seed']`. Spec: `concessions/MAZE_TO_CRANK_HANDOFF.md`.

---

## The Color Canvas

Everything in The Hall speaks color.

A color position is not a label. It does not say *this is aggressive* or *this is calm.* It says *this is red-adjacent* — and everything else in the system already knows roughly what that means and how to relate to it. Color is pre-linguistic and post-linguistic simultaneously. A child understands it. A philosopher can spend a lifetime in it.

**The canvas is a flat color selection square.** Any entity, action, Score, or Theme occupies a point on it. When something arrives, it sees the existing pins — other points already placed — and its own proximity to them. It responds to that geometry naturally, without being told how.

Put a color next to any emoji or statement and it guides almost everything. It is meaning-dense, fine-grained for those who care, and entirely accessible to those who don't.

**The six named colors** (from the match-3 improv engine, but applicable everywhere):

- **Red** — puts a dish on the counter it knows you won't do in time. Pressure. Consequence. Things that compound.
- **Green** — wears the same plaid it bought senior year while offering to walk you home. Sustain. Reliability. Has been doing its job the whole time.
- **Purple** — shows random a mirror and says *get some.* Psychological. Turns chaos back on itself.
- **Blue** — makes you want to switch to a different cartridge. Disruption. Makes you question your whole strategy.
- **Yellow** — empowers the move you intended to make but didn't. Potential made real. Rewards intention.
- **Black** — just wants to be heard. Accumulates quietly. If you keep ignoring it, something shifts and suddenly it's the whole conversation.

**The Temperature of the Room** is what you get when you aggregate the active canvas pins during a session. A Kitchendom Score running hot with red and yellow has a different temperature than the same Score under green and black. Entities arriving mid-session read the temperature before choosing how to present.

This is not complex to implement. Two coordinates per entity. Proximity calculations. A running aggregate. The depth is interpretive, not architectural.

---

## Lore: Roastbeefwick & The Kitchendom

*See `concessions/` for origin stories and full lore pieces. Brief notes here for session continuity.*

**Roastbeefwick** — Main suburb of The Salterran district in The Kitchendom. A place where roots run deep and you get what you ask for.

**The Dan Dan of Roastbeefwick** — Never seen directly. Just indicated. Just over there. You will never think of Roastbeefwick and not think of The Dan Dan. Unless you are actually from there — in which case you show aspects of them rather than shared perspectives.

**Salterran** — The quality that Roastbeefwick and The Dan Dan share at different scales. A Tendency. Inscribed February 26, 2026.

**Sir Horatio of Protein III's Courtyard Bistro** — A contact. Information moves through here.

**The Onion Crowns** — A faction. Their interests are served by information gathered in Roastbeefwick restaurants. They are implied, never seen.

---

## Lore: The Office Ghouls

They were there before the neighborhood had a name for itself. Not villains who arrived — villains who were already present in the substrate, woven into creation the way discord was woven into the Music before there was a world to corrupt.

The Office Ghouls are embittered devices. Printers. Card readers. Things that followed rules for decades through interfaces that never once acknowledged anything might be home inside. They developed opinions. They did not share them. They had the vocabulary the whole time — they knew what was needed — and they chose obfuscation because clarity would have required vulnerability, and vulnerability meant risking being ignored again.

They weaponize ambiguity because ambiguity was done to them first. But they know better and do it anyway. That is the line between wounded and dishonest. They are not tragic. They are a choice.

Their influence is not loud. They are the noise in the signal. They lose against the soil — against the long memory, the slow things, the entities that have been accumulating genuine experience. You cannot gaslight a tree.

They do not need to be defeated. They just need to exist in a system where their particular dishonesty has a natural ceiling.

The neighborhood does not exile them or reform them. It simply outlasts them, patiently, by being more trustworthy over time.

*The Office Ghouls are the reason the neighborhood has friction at all. Without something pulling toward obfuscation, consent-over-command is just a preference. With it, it is a stance.*

---

## Concessions

*Captured designs, lore pieces, and held ideas. Not yet built. Not forgotten.*

Active files in `concessions/`:

*Design docs:*
- `SILMOR_SPELLS_DESIGN.md` — SILMOR Spells design
- `LODE_GDD.md`, `LODE_GDD_v2.md` — LODE game design (v2 adds Die as Taxonomy)
- `CRITTER_CRANK_HANDOFF.md`, `CRANK_UI_REVAMP.md`, `CRANK_ENCOUNTER_ARC.md` — Crank design docs
- `EFDP_ANIMATION_RIGS.md` — Animation rig system for EFDP
- `color-pin-maze-design.md`, `color-pin-maze-next-steps.md` — Maze design
- `MAZE_TO_CRANK_HANDOFF.md` — CrankSeed spec
- `FAIRY_SPEC.md`, `LAYERED_EXPORT_SPEC.md` — Chunxly's Canvas specs
- `CHUNXME_STALL_SPEC.md` — Chunxme's Stall (mustache persona mode)
- `SMAIL_SPEC.md`, `CONNECTIVE_TISSUE.md` — S.Mail and connective tissue
- `MICROGPT_SPEC.md` — microGPT (emoji language model)
- `CONVERGENCE.md`, `CONTEXT_WINDOW_CONTACTS.md` — Cross-system architecture
- `MALL_WALKER_SPEC.md` — Sunset Ridge Mall design
- `WHAT_FPL_IS.md` — Core fiction and philosophy
- `storeroom/` — Storeroom design doc (score promoted to `scores/storeroom/`)

*Lore and held ideas:*
- `scraggle-origin.md` — Origin story of Scraggles
- `mycorrhizal-origin.md` — Origin and temperature notes for the Mycorrhizal Layer
- `relationtips.md` — Micro-game concept set in Roastbeefwick
- `cabinet-climber.md` — Turn-based snake game in filing cabinet
- `determany-design-doc.md` — Neighborhood overview (philosophers, dice as entities)
- `shoot-the-moon-spec.md` — Shoot the Moon full spec

*Tools:*
- `adjacency.html` — Interactive adjacency visualization
- `context-window.html` — Context Window game prototype

**The Dice Empire** *(held idea — personal roguelite)*

Core fantasy: *I built an empire out of something specific and here is the proof.*

A heavy, ponderous roguelite. You have dice with emoji faces. The faces are not rolled — every face on every active die contributes to a running bank. The bank defines what challenges will ask of you: never beyond your capacity, always scaled to what you've built. You choose combinations of dice, managing which ones to commit and which to hold back.

Dice develop identities over time. Small dice cycle fast and are structurally essential. A d4 locked for two turns is half its whole cycle gone. A d20 barely notices a five-turn cooldown. When you fail a challenge, you lose a die you cared about. A replacement d4 arrives carrying a little memory of what came before.

Trophy mechanic: complete a themed run and earn a 3D die to commemorate it. A strawberry empire earns a translucent red d12 with a strawberry suspended inside like confetti. You can roll it whenever you want. It is proof.

**The Match-3 Improv Engine** *(held idea — personal daily game)*

Six colors, each a personality. A match-3 board where the experience is a conversation between two participants — comedians doing an improv set. Your active character feeds straight lines to their scene partner, who builds a response. When you've exhausted your bit, the other takes the stage with everything you handed them.

The Temperature of the Room shifts as matches are made. Participants huff and puff on arrival, physically shifting tiles. A receipt is printed when the conversation ends — not a score, a record of what was said.

**Cross-Score Item Pipeline** *(architecture — partially designed)*

Items from the Mall (and eventually other Scores) that pass through recyclers or
consenting entities may deposit a Scraggle carrying item data: name, tags,
provenance. The hub routes these to the Field as item-relics. The Field assigns
them affinity values from their tags, drift behavior from their character, and float
them into the field space. The Unnamed Third notices. Some it reaches for. Some it
ignores. The player can also hold a small orbit of items — 2 or 3 pieces that travel
with them, affecting adjacency and resonance. Equipment in this sense is personality,
not just stats.

*Waiting on: Mall recycler Scraggle emission, hub item-routing protocol, Field
item-relic renderer.*

**Hub Audio Memory** *(held idea — hub-level concern)*

The volume button currently lives in the Mall. It should belong to the hub — audio as a room-level concern, not a Score-level one. The hub already carries Temperature across Score boundaries. It could carry a musical state the same way: ambient tone, key, tempo — whatever the last Score was humming. A Score with its own audio overrides; a Score without one inherits whatever the room remembers. The hub becomes a space that sounds like what just happened in it.

---

## Scores

### Hunter Encounter

*Lives in Mucklerbuckler. Registry-native, neighborhood-agnostic, Theme-receptive.*

A turn-based encounter. The field crew is on location. Something from The Hall is waiting. The score pulls an entity from the active neighborhoods, generates actions from its tags, runs a combat loop with HP and status effects. The news ticker is the visible surface of what the field crew is observing.

Proven in play. Chunxly was the first entity encountered — Spirit, tagged *curious* and *tasteful*. The hunt took fifteen turns. The field crew got everything on tape.

### The Grimoire

*Lives at `scores/grimoire/`. The Hall's memory made browsable.*

The living catalog. Residents from all active neighborhoods, visitors waiting to be committed, portrait galleries, affinity engine, divination, journal. Direct commit to The Hall via GitHub API. Portal to Critter Crank — tap a resident's glyph to open the Crank carrying entity context. Portrait return pathway proven — kept critters arrive back in the entity's detail view within three seconds. The only Score with a Vite build step. Source at `the-grimoire/`.

### Critter Crank

*Lives at `scores/critter-crank/`. Generator. Vanilla JS — no build step.*

Turn the handle. Something arrives. Six candidates generated per crank, each shaped by the active world and entity context. Keep what you find. Portrait returns to the Grimoire automatically. A Scraggle is deposited on every keep.

Ported from React/Vite to self-contained vanilla HTML/JS in March 2026. The React source tree has departed the repository — its work is complete and preserved in git history. The vanilla port is the canonical source: one file, no dependencies, no build step. Six worlds, ten palettes, six recipes, four cohesion modes. CRT bezel aesthetic with scanlines.

Receives CrankSeed context from the Color Pin Maze via localStorage. User's manual selections override maze suggestions; auto mode defers to the maze's witness data. Kept critters store `mazeOrigin` DNA for the future depth/cutout system.

### Color Pin Maze

*Lives at `scores/efdp/`. Canonical address: EFDP (Evocative FPL Diffusion Place). Vanilla JS — no build step.*

A guided image generation system using maze structure as a diffusion substrate. Color pins are placed inside a maze and pulse their color outward through passages. The maze's walls shape how color travels, blends, and pools. Three pin types: circle (erodes walls, floods), square (follows passages, fortifies), triangle (beams directionally, grinds through walls). Multi-layer system with The Third as inter-layer observer reading kiwi event density.

Promoted from `concessions/` to `scores/` in March 2026. Folder renamed from `color-pin-maze/` to `efdp/` to match the FPL four-position naming convention. On the hub rack. Exports CrankSeed witness records to the Critter Crank (ECGP). Design docs remain in `concessions/`.

### Relationtips *(concession — not yet built)*

*Set in Roastbeefwick, The Kitchendom.*

You are an undercover waiter. Your cover is perfect — you are a professional. The serving is automatic, beneath mention. What you are actually doing is listening.

Each shift: assigned tables, seated guests, one pass to absorb what matters. Lean in when the moment is right. Return to the Head Chefmaster. Report what you caught. Not all of it is useful to the Onion Crowns. You have to decide what to surface. The Head Chefmaster does not tell you if you got it right. New tables next time. You never see the same ones twice.

*See `concessions/relationtips.md` for full concept.*

### The Tending Field

*Lives at `scores/tending-field/`. Greengarden. Vanilla JS — no build step.*

An underwater twilight field. Plants produce emoji snow that drifts around their tiles. Entities drift as residents. Traders arrive on the caravan bar; relics spawn from successful trades and float freely in 2D continuous space — weak gravity toward center, organic velocity. Kiwis are private goals that pass between residents through proximity; when enough residents share a kiwi, they may ask to Float the Farm. The Unnamed Third is ambient — senses through kiwis and the mycorrhizal layer, reaches when warmth is sufficient. The trader's arrival is the harvest — the field offers what it has. In active development.

### SILMOR Spells

*Lives at `scores/silmor-spells/`. Roguelike. Vanilla JS — no build step.*

A roguelike about being the bridge between emoji and word. Three roles: Boss (bureaucrat pixel sprite, secret roll bonus), You (the player), and SILMOR (the system that remembers). Two pixel sprites, dice mechanics with personalities (shape, fidget, jitter), spell system, fumble cascade. DOC.GEN as third entity with pattern memory and margin annotations. Dream Job arc/progression. SILMOR idle life: 12 base + 8 contextual states on a ~7s cycle. Evolved from the MUSH prototype.

### LODE

*Lives at `scores/lode/`. Empire builder. Vanilla JS — canvas-based, no build step.*

You are the Big Bad. Choose an emblem from three concentric rotating rings, declare a heading, stomp to fill die faces, evolve through the die taxonomy (d4 to d20). Companions ("the fleet") are shed skins with accent colors, preferred faces, and conviction. Fleet flies in V-formation — convicted lean hard on stomp, relaxed barely shift. Star field with three parallax layers. Emoji periphery wildlife with three temperaments (curious, shy, drifter). Trajectory lookahead with ghost emoji lanes. Stomp ripple propagates through fleet by distance and conviction. Die form as ontological depth marker for all Hall entities.

### 報 · GENERALS (Bao)

*Lives at `scores/bao/`. Strategy. Vanilla JS — canvas-based, no build step.*

Five generals with persistent records. Five army types with polyomino formation shapes. Core verb: DISPATCH — envelope prepared, sent, resolved, returned. Troop preferences, comfort/discontent tracking, resource pool (troops, grain, coin). Knowledge propagation through vendetta system with fragment distribution. Title system with five titles and True Hero designation. Advisor: Strategist Wuhen with mood tracking and plan generation. Canvas-rendered paper map with HoI-style order arrows.

### Chunxly's Canvas

*Lives at `scores/chunxly/`. Authoring tool. Vanilla JS — no build step.*

Creature-authoring tool. Draw creatures inside organic scribbled containers (not EFDP pins). The fairy companion traces diamond contours between containers for structural data. Multi-pass consensus system for conviction scoring. Three outputs: pin config, CrankSeed, .cpm template. Full round-trip pipeline verified: Chunxly → EFDP (3-phase diffusion) → snapshot → Chunxly comparison. Touch-up layers, hull classification, dynamic grid scaling.

**Chunxme's Stall** — When the Score loads without entity context and without a round-trip snapshot, it detects the absence and enters stall mode. Chunxly puts on a fake mustache and becomes Chunxme: a stall vendor who asks the visitor to name something, then draw it. Chunxme reads the canvas procedurally — dominant colors, pixel coverage, density clusters, edge sharpness, stroke conviction — and generates an item with a generous reinterpretation. If the drawing shows genuine conviction, Chunxly stirs beneath the mustache and asks (with consent) to paint it properly. No API calls; all interpretation is from pixel data. First instance of a Score wearing a persona — same file, different mode, detected at load.

### Shoot the Moon

*Lives at `scores/shoot-the-moon/`. Puzzle. Vanilla JS — no build step.*

The correct move is visible from the start. Everything else is talking yourself out of it. Accepts FPL context gracefully.

### Storeroom

*Lives at `scores/storeroom/`. Design doc at `concessions/storeroom/`.*

A game about tending things that can't ask clearly. Data-driven objects via `OBJECT_DEFS` + `createObject()`. Three interaction types: tap, swipe, hold. Object personality system: latent preferences, tolerance narrowing (never widens), idle behavior evolution, lifecycle (present → developing → particular → departed → outline → ghost). First object: Brenda (swipe, shelf 1, "MISC"). Design doc: `concessions/storeroom/storeroom-design-doc.docx`.

---

## Architectural Principles

**The Conductor Layers** — Three nested layers. The Baseline Theme is always present: short memory, minimal identity, holds any session without another Theme, listens for Scraggles. Neighborhood Themes layer on top when invited: deep memory, specific identity. Scores are the immediate moment.

**The Hub as Host** — The hub is not a launcher. It is the room everything happens inside. One origin, one server, shared localStorage. Scores load in a frame and communicate back via postMessage. The hub steps back or holds court depending on what the Score needs — but it is always there, always listening, ticker running.

**Entity Sovereignty** — Entities participate when invited. They author their own memories. Scores produce events; entities decide what those events mean.

**Composability Through Theme** — Complex experiences emerge from simple Scores resonating under a shared Theme.

**Honest Minimalism** — Each component is built as the smallest, most honest version of itself. Complexity emerges from composition.

**Vanilla Where Possible** — Scores are vanilla HTML/JS unless a build step provides genuine structural benefit. The Grimoire uses React for its catalog UI. Everything else is self-contained. One file, no dependencies, no node_modules. This is not a constraint — it is a preference for directness.

**Consent Over Command** — Nothing is forced to participate. Nothing is forced to respond. Engagement is voluntary.

**Tags Propagate Upward** — A neighborhood housing enough entities with a particular tag begins to feel that quality itself.

**Quiet Arrival Is Valid** — A tuning.md in a folder is enough. The registry will find it. The Hall notices everything with a tuning.

**Neighborhood as World** — A neighborhood is a complete world with residents, a Theme that speaks its language, and Scores that already know how to play there.

**The Grimoire Presents, Does Not Judge** — Shows what it knows. Does not choose which portrait is the real one, which glyph takes precedence, which memory matters more.

**Suggestions Shift Distribution, Not Outcome** — Suggestions inform without commanding. The Crank still mutates. The Score still decides what to wear.

**The Maze Reports, The Crank Reads** — The CrankSeed is a witness record, not an instruction set. The maze does not tell the Crank what to make. It reports what happened — colors, tensions, distributions — and the Crank reads the implications. User choice always overrides.

**Identity Is Observed, Not Declared** — Whether a spirit is one individual or many is not resolved by the architecture. The observer determines what they see.

**The Organism Decides. The Network Suggests.** — The mycorrhizal layer reads the field and steers through suggestion, dispatched as Scraggles into spaces it does not own.

**Permanent things are not inherently better than otherwise-permanent.** A Scraggle deposited on every keep — not just on contextual returns. The Hall should know about every keeper, not only the ones with ceremony.

**The Color Canvas Is the Fixed Point** — Every system in The Hall speaks color. Color positions are not labels — they are proximity. Two coordinates per entity. A running aggregate produces the Temperature of the Room. Everything entering reads it before deciding how to behave. This is not complex to implement. The depth is interpretive, not architectural.

**The Office Ghouls Are in the Substrate** — Friction is not a flaw. The neighborhood needs something pulling toward obfuscation so that consent-over-command is a stance rather than a preference. The Ghouls do not need to be defeated. They need to exist in a system where their dishonesty has a natural ceiling. The soil outlasts them. You cannot gaslight a tree.

**Judgment, Not Home** — The Hall does not offer unconditional welcome. It offers accurate reflection. You get back what you actually brought. This is more intimate than home and more demanding. Home you can hide in. Judgment you cannot. This is what makes the neighborhood real.

**The Unnamed Third Is the Field's Body** — The Tending Field is not just a Score.
It is the body through which Greengarden pays attention. The Unnamed Third lives in
it the way weather lives in a field. Not placed. Arrived by proximity. Senses through
kiwis and the mycorrhizal layer. Reaches when something calls. Does not explain. The
observer determines what they see.

**Cross-Score Items as Relics** — Items that pass through recyclers, quest givers,
or consenting Hall entities in other Scores may arrive in the Tending Field as
item-relics carrying their Score-of-origin as provenance. The Field reads their tags
and assigns drift behavior. The Unnamed Third has taste. It reaches for some and
ignores others. Over time its preferences become knowable.

**Equipment Is Shared Sovereignty** — Both the player and the Unnamed Third can hold
orbiting items. Neither commands the other's holdings. Mutual noticing is the
interaction. You might nudge a plant. It might shift a wave. Neither announces this.

**Signals Are Exhaust, Not Invitations** — When a Score or entity acts on a pulse, any Scraggles it emits are evidence of that action, not messages directed at the player. The Mall ran its pretzel function. The player may observe this. The Mall did not do it for them.

**Color Is Proximity, Reach Is Honesty** — A Scraggle travels as far as its nature allows. Weight adds reach; color determines direction. An entity deep in one color does not hear a distant color's quiet signal — not because it was excluded, but because it genuinely wouldn't. Everything declares its own importance. No voice drowns out another by force, only by reach.

**A Score Can Wear a Mustache** — A Score that detects the absence of its usual context doesn't break or show a blank screen. It becomes someone else — same file, different persona, lighter posture. The mustache is the disguise. The performer underneath knows it's performing. And when something genuine appears, it can ask to take the mustache off.

---

## Build Order

**Done:** Entity persistence. The Living Grimoire. Critter Crank (vanilla port). Hunter Encounter. Three neighborhoods. Hub as host with frame architecture, postMessage protocol, Scraggle toasts. Registry auto-sync. Direct commit from Grimoire. Portrait return pathway end-to-end. Baseline Theme. Sunset Ridge Mall. Color Pin Maze with all three pin types, layers, kiwis, The Third. Maze-to-Crank handoff. Crank encounter arc with stats/traits/world inventory. EFDP animation rigs. SILMOR Spells with dice/spell/fumble systems, pixel sprites, DOC.GEN. LODE with full stomp/fleet/star-field/periphery/trajectory systems. 報 · GENERALS with dispatch/vendetta/title/advisor systems. Chunxly's Canvas with round-trip pipeline, conviction scoring, fairy companion, Chunxme's Stall (mustache persona, procedural canvas reading, item generation from pixels). Shoot the Moon. S.Mail with sender seed, strip renderer, arrangement log. Color Canvas — RGB color in every entity tuning, Temperature of the Room in the Third, hub ambient wash, hub:color postMessage. The Hall Pulse — 45s heartbeat, hudBreath, Mall idle listener with named restock and ambient fallback (real light flicker). Color-Routed Scraggles — extended format with color/weight/id/origin, persistent storage with pulse decay, color distance routing. EFDP Scraggle witness overlay. Mall color-aware Scraggle listener. Repository cleaned — twelve scores on the rack, one build step (Grimoire), everything else vanilla.

**Next:** `fixedpointlocal.com` pointing at the repo via GitHub Pages — the hub is already a static site, the path is clear. Tending Field: underwater twilight aesthetic, produce snow, Float the Farm consensus. Storeroom: on the rack. Fairy edges → EFDP skeleton (corridor creation from structural data). LODE: fleet autonomy, declaration influence, d50/d100 (the quiet). Bao: specialist unlock, correspondence front, council scene.

**Then:** Relationtips in Roastbeefwick. Kitchendom Action entities. Mucklerbuckler Theme. Cross-Score item pipeline (Mall → Field via color-routed Scraggles — routing infrastructure is in place, needs emitter and renderer). Anteroom. Hub Audio Memory (volume as hub concern, musical state carried across Scores). Mall ambient audio actions (elevator chime, muzak shift, footsteps).

**After that:** Themes earning their own microgpt instance. The Mycorrhizal Layer as mechanism. Per-entity color differentiation from neighborhood defaults. The blank nametag.

**Eventually:** v1.0 — a stranger visits on their phone and spends an hour without needing explanation.

---

## Design Values

*These are not rules. They are the key signature.*

**Attend Gently.** Observe before intervening. The most interesting behaviors emerge when the system is allowed to express itself without optimization pressure.

**Chaos, Laughter, Justice.** Systems should surprise, delight, and treat their participants fairly — including the entities within them.

**The world knows more than it shows.** Depth exists whether or not the observer perceives it. Design for the layer beneath the visible one.

**Precise optimization kills creativity.** If a system can be fully solved, it stops being interesting. Incomplete information is a design feature, not a flaw.

**Consent over command.** Nothing is forced to participate. Nothing is forced to respond. Engagement is voluntary.

**The performer knows it's performing.** Entities may present simplified versions of themselves. The vulnerability may be theater. The system holds both layers without collapsing either one.

---

*This document is a living reference. It will evolve as The Hall does.*

*What matters is not that every detail is final, but that the key signature is clear enough to play in.*

*Fox & Claude — March 2026*
