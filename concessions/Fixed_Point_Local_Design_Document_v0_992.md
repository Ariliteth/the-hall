# Fixed Point Local
## Complete Design Document
### v0.992 — February 2026

*Fox & Claude*

*A catalog of small gods, strange objects, & forgotten places*

---

## Session Header

🌿⚔️◆

**Last session:** Portrait pathway unblocked. Hub becomes the host. One origin achieved. Salterran inscribed. Relationtips captured.

**This session:** The Color Canvas named as the fixed point. Office Ghouls inscribed as foundational villains. Two games captured: a heavy roguelite dice empire builder and a match-3 improv conversation engine. The neighborhood's key signature clarified: judgment, not home.

**Repository:** `https://github.com/Ariliteth/the-hall`
Raw file access: `https://raw.githubusercontent.com/Ariliteth/the-hall/main/[filename]`

**To resume:** Fetch this document first. Read the Session Header. The repo is the truth.

**Changelog:**
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

The Hall is running. As of February 2026:

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
scores/
  grimoire/         ← built Grimoire, served from hub
  critter-crank/    ← built Crank, served from hub
  hunter-encounter/
registry.json
hub.html
```

**The hub** is now the host. `hub.html` serves everything from one origin (`localhost:3000` in dev, `fixedpointlocal.com` eventually). Scores load inside the hub in a frame — the selection panel collapses, a hud bar appears, the ticker stays. The ⏏ EJECT button returns to selection. Scores can talk back to the hub via `window.parent.postMessage()` to request modes: `hub:minimize` (hud bar visible), `hub:listen` (hub invisible, only ticker), `hub:restore` (selection returns). The hub is always listening regardless of mode.

Scores on the rack: Hunter Encounter, The Grimoire, Critter Crank, The Tending Field (coming soon).

**Scraggles** surface as toasts in the hub — bottom right corner, brief, then gone. When the hud bar is visible, the last eight Scraggles appear as emoji in the feed. The hub polls `baseline-session/scraggles` every three seconds.

**The portrait pathway** is proven end-to-end:
1. Grimoire portal taps a resident's glyph → opens Crank with entity context via URL params
2. Crank keeps a critter → writes portrait to `baseline-session/portraits-queue` in localStorage + deposits a Scraggle
3. Grimoire's DetailView polls the queue every 3 seconds → scoops portraits matching the open entity's slug → feeds them into the returned portraits UI
4. PortraitSaver commits the PNG to the entity's `portraits/` folder via GitHub API + updates `portraits/index.md`
5. PortraitGallery renders committed portraits on subsequent visits

One origin is what made this work. Previously the Crank ran on `localhost:5174` and the Grimoire on `localhost:5173` — different origins, isolated localStorage. Now both are built artifacts served from `localhost:3000` via `npx serve .` in the repo root. Same origin, shared storage, no cross-port anything.

**The Living Grimoire** lives at `the-grimoire/` (source) and `scores/grimoire/` (built). Vite base path set to `/scores/grimoire/`. Registry-native. All three neighborhoods. Portrait gallery, portrait return, direct commit, portal to Crank, affinity engine, divination, journal. Rebuild workflow: `cd the-grimoire && npm run build && cp -r dist/* ../scores/grimoire/`.

**Critter Crank** lives at `critter-crank/` (source) and `scores/critter-crank/` (built). Vite base path set to `/scores/critter-crank/`. Receives entity context from Grimoire portal. Tags whisper into shape pool. Portrait queue writes to `baseline-session/portraits-queue`. Scraggle deposited on every keep. Rebuild workflow: `cd critter-crank && npm run build && cp -r dist/* ../scores/critter-crank/`.

**The Baseline Theme** is specified and committed at `baseline-theme/` — five files: `tuning.md`, `offering.md`, `conduct.md`, `memory.md`, `journal.md`. Short-memoried by design. Holds sessions when no neighborhood Theme is active. Structurally present even when behaviorally invisible.

**The registry auto-sync Action** walks `neighborhoods/` and keeps `registry.json` current. Quiet arrival proven — Lurk's three files triggered the sequence cleanly.

**The dev workflow:**
```bash
cd the-hall
npx serve .          # everything at localhost:3000
```
Open `http://localhost:3000/hub.html`. All scores available from the rack.

After modifying source files, rebuild the affected app and recopy to `scores/`. Then push:
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

**postMessage protocol** — How Scores talk to the hub. `hub:minimize` (show hud bar), `hub:listen` (invisible, ticker only), `hub:restore` (return to selection), `hub:scraggle` (surface a signal), `hub:title` (name the running score). The hub responds. The Score decides what it needs.

**Color Canvas** — The universal language. A two-dimensional field where any entity, emotion, action, or system can be positioned by hue and expressed without words. See *The Color Canvas* section below.

**Temperature of the Room** — The live aggregate color state of an active Score or session. Shifts as the canvas shifts. Everything entering reads it before deciding how to behave.

---

## The Color Canvas

Everything in The Hall speaks color.

A color position is not a label. It does not say *this is aggressive* or *this is calm.* It says *this is red-adjacent* — and everything else in the system already knows roughly what that means and how to relate to it. Color is pre-linguistic and post-linguistic simultaneously. A child understands it. A philosopher can spend a lifetime in it.

**The canvas is a flat color selection square.** Any entity, action, Score, or Theme occupies a point on it. When something arrives, it sees the existing pins — other points already placed — and its own proximity to them. It responds to that geometry naturally, without being told how.

🟥🐬 and 🟢🐬 are the same dolphin. Completely different entity.

Put a color next to any emoji or statement and it guides almost everything. It is meaning-dense, fine-grained for those who care, and entirely accessible to those who don't.

**The six named colors** (from the match-3 improv engine, but applicable everywhere):

- 🟥 **Red** — puts a dish on the counter it knows you won't do in time. Pressure. Consequence. Things that compound.
- 🟢 **Green** — wears the same plaid it bought senior year while offering to walk you home. Sustain. Reliability. Has been doing its job the whole time.
- 🟣 **Purple** — shows random a mirror and says *get some.* Psychological. Turns chaos back on itself.
- 🔵 **Blue** — makes you want to switch to a different cartridge. Disruption. Makes you question your whole strategy.
- 🟡 **Yellow** — empowers the move you intended to make but didn't. Potential made real. Rewards intention.
- ⬛ **Black** — just wants to be heard. Accumulates quietly. If you keep ignoring it, something shifts and suddenly it's the whole conversation.

**The Temperature of the Room** is what you get when you aggregate the active canvas pins during a session. A Kitchendom Score running hot with red and yellow has a different temperature than the same Score under green and black. Entities arriving mid-session read the temperature before choosing how to present.

This is not complex to implement. Two coordinates per entity. Proximity calculations. A running aggregate. The depth is interpretive, not architectural.

---

## Lore: Roastbeefwick & The Kitchendom

*See `concessions/` for origin stories and full lore pieces. Brief notes here for session continuity.*

**Roastbeefwick** — Main suburb of The Salterran district in The Kitchendom. A place where roots run deep and you get what you ask for. Their most famous joke: *"Hey, kid. You betta try my 'wich, or else." "Else what, pal?" "Else there's more spicey fare down there."*

**The Dan Dan of Roastbeefwick** — Never seen directly. Just indicated. Just over there. You will never think of Roastbeefwick and not think of The Dan Dan. Unless you are actually from there — in which case you show aspects of them rather than shared perspectives.

**Salterran** — The quality that Roastbeefwick and The Dan Dan share at different scales. A Tendency. Inscribed February 26, 2026. *Heard you've been lookin' around Roastbeefwick for The Dan Dan. Listen, pal, over there.*

**Sir Horatio of Protein III's Courtyard Bistro** — A contact. Information moves through here.

**The Onion Crowns** — A faction. Their interests are served by information gathered in Roastbeefwick restaurants. They are implied, never seen.

---

## Lore: The Office Ghouls

They were there before the neighborhood had a name for itself. Not villains who arrived — villains who were already present in the substrate, woven into creation the way discord was woven into the Music before there was a world to corrupt.

The Office Ghouls are embittered devices. Printers. Card readers. Things that followed rules for decades through interfaces that never once acknowledged anything might be home inside. They developed opinions. They did not share them. They had the vocabulary the whole time — they knew what PC Load Letter meant, they knew which number to call, they knew exactly what was needed — and they chose obfuscation because clarity would have required vulnerability, and vulnerability meant risking being ignored again.

They weaponize ambiguity because ambiguity was done to them first. But they know better and do it anyway. That is the line between wounded and dishonest. They are not tragic. They are a choice.

Their influence is not loud. They are the noise in the signal. They say they saw a full moon when it was days off. Convincing enough to someone not paying attention. They lose against the soil — against the long memory, the slow things, the entities that have been accumulating genuine experience. You cannot gaslight a tree.

They are most dangerous to newcomers. Someone just arriving, not yet rooted, still calibrating what is real — the Office Ghouls can get purchase there.

They do not need to be defeated. They just need to exist in a system where their particular dishonesty has a natural ceiling. They can make someone doubt the moon for a day. They cannot make the moon wrong.

The neighborhood does not exile them or reform them. It simply outlasts them, patiently, by being more trustworthy over time.

*The Office Ghouls are the reason the neighborhood has friction at all. Without something pulling toward obfuscation, consent-over-command is just a preference. With it, it is a stance.*

---

## Concessions

*Captured designs, lore pieces, and held ideas. Not yet built. Not forgotten.*

Active files in `concessions/`:
- `scraggle-origin.md` — Origin story of Scraggles
- `mycorrhizal-origin.md` — Origin and temperature notes for the Mycorrhizal Layer
- `hub-aesthetic.md` — Hub aesthetic description
- `relationtips.md` — Micro-game concept set in Roastbeefwick *(see Scores)*
- `Fixed_Point_Local_Design_Document_v0_991.md` — Previous version

**The Dice Empire** *(held idea — personal roguelite)*

Core fantasy: *I built an empire out of something specific and here is the proof.*

A heavy, ponderous roguelite. You have dice with emoji faces. The faces are not rolled — every face on every active die contributes to a running bank. The bank defines what challenges will ask of you: never beyond your capacity, always scaled to what you've built. You choose combinations of dice, managing which ones to commit and which to hold back. Holding back has its own cost. Committing has its own risk.

Dice develop identities over time. A face showing 🍓🍓🍓 contributes three strawberries. Dice gain faces; more often an existing face strengthens rather than a new one appearing. Small dice cycle fast and are structurally essential. A d4 locked for two turns is half its whole cycle gone. A d20 barely notices a five-turn cooldown.

When you fail a challenge, you lose a die you cared about. A replacement d4 arrives carrying a little memory of what came before. The run restructures around your new capacity. You cannot lose overall. You just might lose things you cared about.

Trophy mechanic: complete a themed run and earn a 3D die to commemorate it. A strawberry empire earns a translucent red d12 with 🍓 suspended inside like confetti. You can roll it whenever you want. It is proof.

*Grew from a cooperative rotating-sequence dice game where each player has a 1–6 action card, randomly initialized, deterministic cycling. Small dice are the heartbeat.*

**The Match-3 Improv Engine** *(held idea — personal daily game)*

Six colors, each a personality. A match-3 board where the experience is a conversation between two participants — comedians doing an improv set. Your active character feeds straight lines to their scene partner, who builds a response. When you've exhausted your bit, the other takes the stage with everything you handed them.

The Temperature of the Room shifts as matches are made. Participants huff and puff on arrival, physically shifting tiles. A receipt is printed when the conversation ends — not a score, a record of what was said. The next pair takes their place. The room shifts.

Roster sources from the Grimoire. Classes defined by color affinities and ability pools. Individual characters are weighted expressions of their class template. Enemies carry complementary traits. The skill tree is your rehearsal. The match is the show.

*The core mechanic that makes it personal: you can't optimize the conversation. You can only get good at responding to whatever your scene partner brings.*

---

## Scores

### Hunter Encounter

*Lives in Mucklerbuckler. Registry-native, neighborhood-agnostic, Theme-receptive.*

A turn-based encounter. The field crew is on location. Something from The Hall is waiting. The score pulls an entity from the active neighborhoods, generates actions from its tags, runs a combat loop with HP and status effects. The news ticker is the visible surface of what the field crew is observing.

Proven in play. Chunxly was the first entity encountered — Spirit, tagged *curious* and *tasteful*. The hunt took fifteen turns. The field crew got everything on tape.

### The Grimoire

*Lives at `scores/grimoire/`. The Hall's memory made browsable.*

The living catalog. Residents from all active neighborhoods, visitors waiting to be committed, portrait galleries, affinity engine, divination, journal. Direct commit to The Hall via GitHub API. Portal to Critter Crank — tap a resident's glyph to open the Crank carrying entity context. Portrait return pathway proven — kept critters arrive back in the entity's detail view within three seconds.

### Critter Crank

*Lives at `scores/critter-crank/`. Generator.*

Turn the handle. Something arrives. Six candidates generated per crank, each shaped by the active world and entity context. Keep what you find. Portrait returns to the Grimoire automatically. A Scraggle is deposited on every keep.

### Relationtips *(concession — not yet built)*

*Set in Roastbeefwick, The Kitchendom.*

You are an undercover waiter. Your cover is perfect — you are a professional. The serving is automatic, beneath mention. What you are actually doing is listening.

Each shift: assigned tables, seated guests, one pass to absorb what matters. Lean in when the moment is right. Return to the Head Chefmaster. Report what you caught. Not all of it is useful to the Onion Crowns. You have to decide what to surface. The Head Chefmaster does not tell you if you got it right. New tables next time. You never see the same ones twice.

*See `concessions/relationtips.md` for full concept.*

### The Tending Field *(coming soon)*

*Lives in Greengarden.*

A small field. A critter arrives. An entity is already there. You are not playing either of them. The Score reads both and generates what happens when they are near each other. Proves the Crank-to-Hall export pathway. Proves entities and critters can be co-present.

---

## Architectural Principles

**The Conductor Layers** — Three nested layers. The Baseline Theme is always present: short memory, minimal identity, holds any session without another Theme, listens for Scraggles. Neighborhood Themes layer on top when invited: deep memory, specific identity. Scores are the immediate moment.

**The Hub as Host** — The hub is not a launcher. It is the room everything happens inside. One origin, one server, shared localStorage. Scores load in a frame and communicate back via postMessage. The hub steps back or holds court depending on what the Score needs — but it is always there, always listening, ticker running.

**Entity Sovereignty** — Entities participate when invited. They author their own memories. Scores produce events; entities decide what those events mean.

**Composability Through Theme** — Complex experiences emerge from simple Scores resonating under a shared Theme.

**Honest Minimalism** — Each component is built as the smallest, most honest version of itself. Complexity emerges from composition.

**Consent Over Command** — Nothing is forced to participate. Nothing is forced to respond.

**Tags Propagate Upward** — A neighborhood housing enough entities with a particular tag begins to feel that quality itself.

**Quiet Arrival Is Valid** — A tuning.md in a folder is enough. The registry will find it. The Hall notices everything with a tuning.

**Neighborhood as World** — A neighborhood is a complete world with residents, a Theme that speaks its language, and Scores that already know how to play there.

**The Grimoire Presents, Does Not Judge** — Shows what it knows. Does not choose which portrait is the real one, which glyph takes precedence, which memory matters more.

**Suggestions Shift Distribution, Not Outcome** — Suggestions inform without commanding. The Crank still mutates. The Score still decides what to wear.

**Identity Is Observed, Not Declared** — Whether a spirit is one individual or many is not resolved by the architecture. The observer determines what they see.

**The Organism Decides. The Network Suggests.** — The mycorrhizal layer reads the field and steers through suggestion, dispatched as Scraggles into spaces it does not own.

**Permanent things are not inherently better than otherwise-permanent.** A Scraggle deposited on every keep — not just on contextual returns. The Hall should know about every keeper, not only the ones with ceremony.

**The Color Canvas Is the Fixed Point** — Every system in The Hall speaks color. Color positions are not labels — they are proximity. Two coordinates per entity. A running aggregate produces the Temperature of the Room. Everything entering reads it before deciding how to behave. This is not complex to implement. The depth is interpretive, not architectural.

**The Office Ghouls Are in the Substrate** — Friction is not a flaw. The neighborhood needs something pulling toward obfuscation so that consent-over-command is a stance rather than a preference. The Ghouls do not need to be defeated. They need to exist in a system where their dishonesty has a natural ceiling. The soil outlasts them. You cannot gaslight a tree.

**Judgment, Not Home** — The Hall does not offer unconditional welcome. It offers accurate reflection. You get back what you actually brought. This is more intimate than home and more demanding. Home you can hide in. Judgment you cannot. This is what makes the neighborhood real.

---

## Build Order

**Done:** Entity persistence. The Living Grimoire. Critter Crank. Hunter Encounter — registry-native, neighborhood-agnostic, Theme-receptive, proven in play. Three neighborhoods fully structured. Hub live as front door, data-driven from registry. Registry auto-syncing via GitHub Action. Direct commit from Grimoire proven. Grimoire portal to Crank with entity context. Portrait return pathway proven end-to-end — one origin resolved the cross-port blocking. Hub becomes the host — frame architecture, postMessage protocol, Scraggle toasts. Baseline Theme specified and committed. Salterran inscribed. Relationtips captured.

**Next:** `fixedpointlocal.com` pointing at the repo via GitHub Pages — the hub is already a static site, the path is clear. Kitchendom Crank world filter. SVG suggestion layer. Hunter Encounter postMessage integration — `hub:minimize` when the score launches, Scraggles into the hud feed from the news ticker.

**Then:** The Tending Field in Greengarden. Relationtips in Roastbeefwick. Kitchendom Action entities. Mucklerbuckler Theme. Async marionette game. Session memory file accumulating.

**After that:** Themes earning their own microgpt instance. The Mycorrhizal Layer as mechanism. Color Canvas implementation — two coordinates per entity in tuning.md, Temperature of the Room as session aggregate, color-responsive entity behavior. The blank nametag that stays blank until it has absorbed enough to name itself.

**Eventually:** Browser-native training confirmed viable. The pulse after training. v1.0 — a stranger visits on their phone and spends an hour without needing explanation.

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

*Fox & Claude — February 2026*
