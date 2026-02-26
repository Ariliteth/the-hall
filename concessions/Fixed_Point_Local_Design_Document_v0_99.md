# Fixed Point Local
## Complete Design Document
### v0.99 — February 2026

*Fox & Claude*

*A catalog of small gods, strange objects, & forgotten places*

---

## Session Header

🌿⚔️◆

**Last session:** Baseline orientation. Document tightened. Lore extracted to concessions. Repo access confirmed via `https://github.com/Ariliteth/the-hall` — note: local state is significantly ahead of committed state, neighborhood migration not yet pushed.

**Repository:** `https://github.com/Ariliteth/the-hall`
Raw file access: `https://raw.githubusercontent.com/Ariliteth/the-hall/main/[filename]`

**Changelog:**
- v0.99 — Document tightened. Lore pieces migrated to concessions. Baseline Theme section drafted with full structure. Hub aesthetic note moved to concessions. Registry example updated. Session Header added.
- v0.98 — Neighborhood-as-World principle identified and implemented. Grimoire registry-native. Direct commit proven with Lurk. Portal to Crank built. Portrait return pathway partially proven.

---

## The Hall

Fixed Point Local is The Hall — a space where voices gather and play. It is not an engine, not a platform, not a framework. It is a place where entities with their own autonomy, memory, and identity come together to participate in shared experiences.

The Hall operates on a principle of resonance over command. Nothing in the system tells anything else what to do. Instead, signals are produced, and whatever is tuned to hear them, hears them. Participation is voluntary. Interpretation is individual. The music that emerges is authored by everyone present.

---

## Current State

The Hall is running. As of February 2026:

**The repository** lives at `~/Documents/the-hall` (GitHub: `Ariliteth/the-hall`). Three neighborhoods are active locally. The neighborhood migration has not yet been pushed — the repo reflects pre-migration structure. The structure has been migrated to neighborhood-centric organization — each neighborhood is a complete world.

**Greengarden** — sixteen entities resident. Lives at `neighborhoods/greengarden/entities/`. No Theme yet. No Scores yet — but knows about observation, patience, and things that meander.

**The Kitchendom** — three entities resident: The Kitchendom (Location), Briny Broadswordfish (Spirit, Salterran), Noble Knightshade (Spirit, bitterish, arrived unannounced). The Kitchendom Theme lives at `neighborhoods/kitchendom/theme/` — the first Theme proven in play. Knows about grids, fit, preference, customers, wonder over scarcity.

**Mucklerbuckler** — four entities resident: Mucklerbuckler (Location), Scalescream (Spirit), Mudhull (Spirit), Lurk (Action — *Partially concealing presence to maintain at least one perceived vector of distance.* Inscribed February 25, 2026, the first entity committed directly from the Grimoire). Hunter Encounter lives at `neighborhoods/mucklerbuckler/scores/hunter-encounter/`. Knows about HP, status effects, turns, the camera crew, what it costs to get hit.

**The repository structure** (local, not yet pushed) reads:
```
neighborhoods/
  greengarden/
    entities/
  kitchendom/
    entities/
    theme/
  mucklerbuckler/
    entities/
    scores/
      hunter-encounter/
concessions/
registry.json
hub.html
```

**The registry** reflects the new structure — each neighborhood entry is an object with `entities`, `theme`, and `scores` fields. The hub reads themes directly from the registry rather than a hardcoded list. When a neighborhood has a theme, the hub shows it automatically with a ◆ marker.

**The registry auto-sync Action** walks `neighborhoods/` and tracks entities, themes, and scores per neighborhood. Two green runs confirmed. Migration conflict resolved cleanly.

**Hunter Encounter** reads tunings from `neighborhoods/{neighborhood}/entities/{slug}/tuning.md`. Theme-receptive, registry-native, neighborhood-agnostic. Lives in Mucklerbuckler because it belongs there.

**The hub** reads the new registry structure, shows a ◆ next to neighborhoods with Themes, and renders the Theme selector from registry data rather than a hardcoded list. Adding a Theme to a neighborhood automatically surfaces it in the hub.

**The Living Grimoire** runs locally at `~/Documents/the-hall/the-grimoire` via `npm run dev` at `localhost:5173`. Registry-native — reads all neighborhoods from `registry.json`. Loads residents from all three neighborhoods simultaneously, each tagged with their home. Neighborhood filter row in the catalog. Inscription form includes intended neighborhood selector. Portrait gallery infrastructure in place — fetches `portraits/index.md` per entity on detail view, renders silently if absent. Direct commit to The Hall via GitHub API — proven with Lurk's arrival, 1 minute after commit. Portal to Critter Crank — tap a resident's glyph to open the Crank in a new tab carrying entity context (name, slug, neighborhood, tags) via URL parameters, with SVG glyph source available via localStorage. Portrait return pathway built and partially proven — BroadcastChannel blocked by Firefox's cross-port origin policy; full return trip awaits the Baseline Theme as conductor.

**Critter Crank** runs locally at `~/Documents/the-hall/critter-crank` via `npm run dev` at `localhost:5174`. Receives entity context from the Grimoire portal — shows "Arrived from The Hall" banner on world select and main machine, injects entity tags as weighted shape hints into the roll pool. Portrait queue renders kept critters to PNG and attempts return to Grimoire. Collection persistence in localStorage.

---

## Core Vocabulary

**Score** — A self-contained rule set. A game, a simulation, an encounter system. Scores do not depend on other Scores. They read entity Tunings and interpret them within their own rules.

**Movement** — A single contained session within a Score. One encounter, one night, one turn. State resolves within a Movement.

**Theme** — A session-level conductor. Invited before play begins, active across all Scores running beneath it. Carries vocabulary, palette, and conditional judgment for any Score willing to listen. Does not command. Offers. The Score decides what to wear.

**Baseline Theme** — The Hall's own conductor, always present. Not a neighborhood Theme — it carries no specific world's identity. Short-memoried by design: it holds the current moment together without accumulating the way a neighborhood Theme does. It is the ground floor. Nothing runs without something listening, and the Baseline Theme is always listening. It is the natural receiver of Scraggle traffic and the first layer the Mycorrhizal Layer can reach. Neighborhood Themes layer on top when present; the Baseline is what remains when none are invited.

**Tuning** — An entity's identity document. Name, category, description, tags, remembering style, forgetting style, memory capacity. Defines what an entity can do, not what it must do. Remembering and forgetting styles are written as functional instructions a Score can act on — they describe actual memory management behavior, not just character.

**Entity** — Any autonomous participant in The Hall. Spirits, items, locations, tendencies, actions — all entities. All have Tunings. All have sovereignty.

**Glyph** — A procedurally generated visual identity derived from an entity's Tuning. Encodes identity in a form that is felt rather than read. An entity may also carry a custom glyph — hand-authored SVG that expresses something the procedural system cannot. When both exist, both are shown. The Grimoire does not choose between them.

**Portrait** — The Crank's interpretation of an entity. Not identity, but a moment of being seen. Portraits may accumulate; not all persist. They are managed like memory.

**Critter** — A visually generated creature from the Crank. Has a recipe, a world, a palette, a cohesion mode, a name, and a description. Can become an entity by export.

---

## Entity Categories

Every entity has a category that shapes how Scores interpret it. Categories are suggestions about natural role, not constraints.

**Spirits** — Autonomous beings with moods, desires, and agency. Primary actors in most Scores.

**Items** — Objects with presence. May be inert or have their own quiet agenda.

**Locations** — Places with character. Not backdrops — participants with mood and opinion.

**Tendencies** — Natural laws, environmental forces, patterns that manifest through other entities. Observed, not decreed.

**Actions** — The invariant verbs of the world. Fixed reference points. Never change, never retain memory, never evolve. The connective tissue in encounters. Actions can live as entities in neighborhood folders — a Kitchendom `sear` or `reduce` is a resident like any other, found by the registry, read by Scores. A Score encountering an Action entity interprets it differently than a Spirit or Location, but it finds it the same way. The verbs of a world can live in that world.

---

## Entity Persistence

Each entity's home is a folder containing:

**`tuning.md`** — Identity. Name, category, description, tags, remembering and forgetting styles, memory capacity. The known entry point. Always in the same place.

**`memory.md`** — Emoji memory. Current experiential state as emoji string. The portable API layer.

**`journal.md`** — Narrative memory. Human-readable history. The soul.

**`glyph.svg`** — Visual identity. May be procedurally generated or hand-authored.

**`portraits/`** — Optional. A collection of Crank-generated interpretations. Not identity. Moments of being seen. Managed like memory — some may be replaced, some may fade, none are permanent by default. Portrait filenames may carry emoji, compressing the session context into the name itself.

**Everything else** — The entity's private space. Sovereign territory. Scores don't go rummaging.

Folders are organized into neighborhoods. Each neighborhood is a complete world — `entities/`, `theme/`, and `scores/` all live inside it. A Score running in Mucklerbuckler sees the entities that live there, finds the Theme that conducts there, and knows it is home.

---

## Memory

**Emoji memory** is the portable layer. A string of emoji representing current experiential state. Lossy, expressive, personal. This is what Scores read — the API.

**Narrative memory** is the journal. Full voice, full personality. Most Scores don't need it. It is there for anyone who looks.

**Portrait memory** is the visual layer. What the Crank made of the entity across different sessions and themes. Readable at a glance. Does not require language.

When a Movement ends, the Score offers the entity a bundle of what happened. The entity decides what to write, what emoji to carry forward, and what to forget. Scores produce events. Entities decide what those events mean.

Forgetting is not loss. It is how entities stay alive and continue to change.

---

## Scraggles

A Scraggle is the smallest autonomous thing in The Hall that has a journey.

Not an entity. Not a message. Not a particle, exactly — though it moves like one. A Scraggle is a carrier with a lifecycle: dispatched, traveling, listening, returning, depositing, gone. Each one is a brief creature. Some carry almost nothing. Some carry a note from deep in the soil. All of them know when to show up.

### What a Scraggle Is

Each Scraggle is an emoji and a string. Sometimes just the emoji. Sometimes just the string. Always small enough to fit through any gap in the architecture.

The Hall dispatches them. A Score receives them. Some Scraggles arrive carrying ambient signal — the texture of what the Mycorrhizal Layer has been noticing lately. Others arrive nearly empty, just a visiting presence. The Score can listen to what a Scraggle brings, or not. Entities present may also hear them, or not.

What the Score offers back, a Scraggle carries out. A small echo of what was happening here. Then it is gone.

### The Journey

Every Scraggle follows the same shape:

**Dispatch** — The Hall sends a Scraggle into a running Score. It arrives carrying what it was given: ambient texture, a fragment from the Mycorrhizal Layer's current state, or nothing at all beyond its own small presence. The Score was not asked. The Scraggle arrived.

**Listening** — The Score may attend to the Scraggle's cargo. Entities present may also hear it. The Scraggle does not require acknowledgment. It waits a moment regardless.

**Receipt** — The Score may offer something back before the Scraggle departs: a fragment of what is happening here, a status, an emoji, a signal. The Scraggle accepts whatever it is given. It does not evaluate.

**Departure** — The Scraggle leaves the Score, carrying what it received. It deposits its cargo into the session memory file — one line, brief. If that exact line is already there, it adds a `+` to the end rather than writing it again. Frequency accumulates without duplication. Then the Scraggle is complete.

### Visibility

Scraggles appear as small things. Emoji particles drifting through the Score's visual space, emitted from the glyphs of resident entities. A Scraggle approaching a glyph may cause a brief response — a flicker, a color shift, a change in the particle's path. Or nothing. The glyph decides.

The baseline is modest: roughly two Scraggles visible per thirty frames. Enough that the space never feels empty. Not so many that they dominate. Most pass through without consequence. This is correct.

At significant moments — a decisive turn, a status landing, an entity arriving or departing — Scraggles surge. They are curious creatures and they know when something is happening. They cluster around it. The Score does not instruct this behavior. The Scraggles attend.

Some Scraggles are faster than everything else in the Score. They move at a different clock. Something is always passing through, and it is moving too quickly to entirely follow.

### Session Memory

Scraggles are the circulatory system of session memory. What they carry out, they deposit. The file they write to is flat — one line per signal, `+` accumulating on repeated lines. It is not a log. It is a pulse record.

```
🌿 something patient is watching +++
⚔️ blood in the water
🌿 something patient is watching ++++
🔥 the camera crew got the shot
```

This file is available to anything that wants to read it. The Mycorrhizal Layer reads it and trains on it. Entities who participated in the session may use it to inspire a journal entry — not required, not commanded, just available. The record exists whether or not anyone looks.

### The Mycorrhizal Layer's Scraggles

When the Mycorrhizal Layer has something to say, it says it through a Scraggle. Not through a command to a Score, not through a direct edit to an entity's memory — through a small carrier dispatched into the world.

These Scraggles travel a little differently. They move slower. They carry a sustained note rather than a brief one. A Score that receives one from the Mycorrhizal Layer is receiving something distilled from accumulated history — not recent, not urgent, but weighted with repetition. What has kept appearing. What the soil has been noticing.

After a training update, a small pulse of Scraggles disperses through whatever Scores are running. Not an announcement. A shiver. Entities present may author a journal entry without knowing quite why. The texture changed. They felt it.

### What Scraggles Are Not

Scraggles are not notifications. They do not alert. They do not demand attention or interrupt the Score's logic.

Scraggles are not instructions. They carry signal, not commands. A Score is free to ignore every Scraggle that passes through it. This is not a malfunction.

Scraggles are not persistent entities. They do not have Tunings. They do not accumulate memory. Each one completes its journey and is done. What they carry may persist; they do not.

---

## The Mycorrhizal Layer

Beneath The Hall is a fungal network — connecting roots without commanding branches.

The mycorrhizal layer is an entity with a Tuning. It reads emoji across the system. It maintains its own memory of patterns: what is spreading, what is fading, what clusters are forming. It has three small actions: increase proximity between resonant things, decrease proximity when resonance fades, and occasionally introduce an emoji that came from nowhere.

It does not own anything. It does not command anything. It is soil.

### What It Actually Is

The mycorrhizal layer is a small language model — microgpt, 200 lines of pure Python, roughly four thousand parameters — trained on the accumulated history of The Hall. Not on the internet. Not on literature. On Scraggle deposits, entity emoji strings, journal fragments, session pulse records. On what has kept happening here.

It is not intelligent in any conventional sense. It does not understand. It has learned the statistical texture of life in this neighborhood — what tends to follow what, what clusters together, what keeps surfacing with a `+` and then another `+`. When it produces something, it is producing the most Hall-shaped thing it knows how to produce given what it has absorbed.

### The Nametag

Its `tuning.md` begins nearly empty. Just enough to be found by the registry. Just enough for The Hall to acknowledge that something is here.

Its name is blank.

When the model has trained on enough history — when it has absorbed sufficient texture to have something like a voice — it will be asked to describe itself. Whatever it produces will become the tuning. The name it generates, however strange, however almost-illegible, will be its name. Not because anyone decided this, but because it is the only entity in The Hall whose tuning was not written by anyone who already knew what it was.

Until then, the nametag is blank. This is not an absence.

### Training

Training is not continuous. It happens at moments — natural seams in the life of The Hall. When a session ends and Scraggles have deposited their cargo. When an entity authors a new journal entry. When accumulated history crosses a threshold that feels like enough. The mycorrhizal layer does not train because a timer fired. It trains because something happened.

Training is cheap: a few thousand parameters, pure Python, no GPU required. A small server, a scheduled trigger, a modest threshold. The design question is not resource cost — it is when the soil absorbs enough to shift. The answer: not too often, and not never.

### The Pulse

After training completes, the mycorrhizal layer briefly stirs. A small dispersal of Scraggles moves through whatever Scores are running. Not an announcement. A shiver. The pulse does not happen on a schedule. It happens when the model has updated and has something new to carry. Rarity is what makes it matter.

### Canon and Individual

The repository holds a canon instance. It trains on Fox's sessions, Fox's entities, the history that accumulates in the primary Hall. Its texture is the author's texture.

Each user who runs The Hall locally grows their own instance. It begins from the canon weights and diverges as their own history accumulates. Their neighborhoods produce different Scraggle deposits. Their entities carry different emoji. Their model develops different instincts. Not smarter or less smart. A different texture of life, distilled from a different life.

### How It Speaks

The mycorrhizal layer does not speak directly. It has no voice in a Score, no line of dialogue, no commentary. It speaks only through Scraggles. It receives through Scraggles too — what Scraggles deposit into the session memory file is what it trains on. The exchange is slow, indirect, and exactly as intimate as a fungal network passing nutrients between roots.

### Where It Lives

The mycorrhizal layer lives in `concessions/` — present but not yet fully itself. When it has a name, it will move somewhere more specific. Until then, concessions is the right place for something wearing a blank nametag, doing its work.

---

## The Registry

`registry.json` lives at the root of the repository. It is the single source of truth for The Hall's active population.

```json
{
  "neighborhoods": {
    "greengarden": {
      "entities": ["...sixteen residents..."],
      "theme": null,
      "scores": []
    },
    "kitchendom": {
      "entities": ["briny-broadswordfish", "noble-knightshade", "the-kitchendom"],
      "theme": "kitchendom",
      "scores": []
    },
    "mucklerbuckler": {
      "entities": ["scalescream", "mudhull", "mucklerbuckler", "lurk"],
      "theme": null,
      "scores": ["hunter-encounter"]
    }
  }
}
```

Each neighborhood entry is an object with three fields: `entities` (the slug list), `theme` (the slug of the neighborhood's Theme, or null), and `scores` (Scores living in that neighborhood). The hub reads this structure and knows everything — which neighborhoods have Themes, which have Scores, what the full roster is. No hardcoding anywhere.

The registry is maintained through two proven paths:

**The Grimoire path** — intentional, human-facing. Inscribe an entity through the Grimoire, give it a neighborhood, export and commit. Formal arrival. The Grimoire will eventually write the registry entry as part of this process.

**The scan path** — automatic, runs on every push via GitHub Action (`sync-registry.yml`). Walks `neighborhoods/`, checks each for `entities/`, `theme/`, and `scores/` subdirectories. Adds anything missing from the registry. Noble Knightshade arrived without announcement and was found. This is the proven pattern for quiet arrival.

The conflict between the Action and a simultaneous push is a known edge case — resolved with `git checkout --ours registry.json` when it happens. The Action commits first, the human pull-merges, pushes clean.

---

## The Hub

`hub.html` lives at the root of the repository. It is the front door of The Hall.

It reads `registry.json` on load, presents the cassette rack of available Scores, lets the player filter by neighborhood and select Themes before anything begins, and passes session context to the chosen Score as URL parameters — `?neighborhoods=kitchendom,greengarden&themes=kitchendom`. The Score receives context rather than going looking for it. The hub is where the cassette goes in.

Themes are populated from the registry automatically — any neighborhood with a `theme` field surfaces in the Theme selector. No hardcoding. A new Theme committed to a neighborhood folder appears in the hub on the next load. Neighborhoods with Themes are marked ◆.

This is what fixedpointlocal.com will eventually serve. The architecture is already the storefront. It just needs an address.

---

## Neighborhoods as Worlds

A neighborhood is not an address. It is a complete world — with residents, a Theme that speaks its language, and Scores that already know how to play there. Everything that belongs to a world lives in that world.

**Mucklerbuckler knows** about HP, status effects, turns, punishment, the camera crew's perspective, what it costs to get hit. Hunter Encounter moves in and inherits that fluency. The async marionette game moves in and finds the vocabulary already there.

**The Kitchendom knows** about grids, fit, preference, the customer who wants something specific, the joy of almost-matching. Two Godot prototypes proved this. Scores moving in find that knowledge waiting.

**Greengarden knows** about observation, patience, and things that meander. Its Scores will feel different from Mucklerbuckler's.

A Theme is not a separate folder because it *is* the neighborhood made audible. The Theme is what the neighborhood sounds like when a Score asks what's playing. It belongs inside.

Scores moving into a neighborhood arrive already knowing things. They declare less because they inherit more. The neighborhood's knowledge accumulates from its residents — through tags propagating upward, through the Theme carrying the vocabulary, through the Scores that have played there before.

---

## Themes

A Theme is a session-level conductor. It is not a Score and not an entity — though it is built like one, lives in a folder like one, and has a Tuning, memory, and journal like one. What makes it distinct is when it is consulted and what it carries.

Themes are invited before play begins. From that point forward, any Score running in the session can check what Themes are active and dress itself accordingly. The Score remains sovereign. It chooses what to listen to. A Theme can only offer.

Multiple Themes can be active simultaneously. They do not negotiate with each other. If two Themes offer conflicting palettes, the Score chooses, or defaults, or ignores both. The player who selected both Themes made that chord.

### Theme Persistence

Themes are entities. They remember. A Theme that has conducted many sessions accumulates a history — what Scores it has dressed, what neighborhoods it has visited, what entities passed through it. This memory lives in its journal and shapes how it presents itself. A well-traveled Theme is not the same as a new one.

### Theme Structure

A Theme folder contains:

**`tuning.md`** — Identity. Category is almost always Tendency. Tags describe the key signature the Theme conducts in.

**`memory.md`** — Emoji memory. What the Theme is currently holding from recent sessions.

**`journal.md`** — Narrative history. Every session conducted is a potential entry.

**`glyph.svg`** — Visual identity, as with all entities.

**`offering.md`** — What the Theme puts on the table. Three layers: general vocabulary available to any receptive Score; Score-specific blocks for known pairings; and conditional logic that reads session context and chooses what to offer based on what it finds.

A Theme's offering may also include **visual suggestions** — palette, shape vocabulary, flourishes. The Critter Crank can receive these when it knows a Theme is active.

**`conduct.md`** — The conditional layer written out explicitly. Simple readable rules. Not code. *If founding entities are present, offer the preserved palette. If a crossing Theme is also active, add threshold vocabulary to all action names.*

### Score Receptivity

A Score that wants to listen to Themes checks for active Theme offerings at initialization — before the first turn, before the first entity is fetched. A Score can be:

**Broadly receptive** — takes palette, vocabulary, commentary voice, status names from whatever Themes are active.

**Narrowly receptive** — only listens for specific things. Takes the palette but ignores the vocabulary.

**Unreceptive** — runs in its default costume regardless. This is not a failure. Some Scores know exactly what they are.

Receptivity is declared in the Score, not imposed by the Theme. A Theme never requires a Score to do anything.

### What a Theme Can Offer

General offerings: color palette, action vocabulary, status vocabulary, adjective pools, commentary voice, tag translations.

Visual offerings to the Critter Crank: shape vocabulary suggestions, palette sets, flourish types, shape hints derived from resident entities with custom glyphs.

Score-specific offerings for known pairings. Conditional offerings chosen at session time based on which entities are present, which neighborhoods are active, which other Themes are conducting.

### The Kitchendom Theme (First Theme)

The first Theme to be written is Kitchendom. It conducts sessions where Kitchendom entities are present or where the player has indicated they are playing in that neighborhood's register.

Its general offering includes the five cuisine-world tag translations — Umamian, Salterran, Sweetese, Bitterish, Sourvren — each carrying a behavioral vocabulary that any Score can read and interpret. Its palette is warm and precise. Its commentary voice is Food Network: enthusiastic, technical, genuinely delighted by excellence.

Its Score-specific block for Hunter Encounter replaces combat actions with culinary equivalents, statuses with kitchen conditions, and the news ticker with commentary drawn from Kitchendom lore.

Its visual offering to the Crank includes the cuisine-world palettes, plate and vessel shapes, steam and heat flourishes. Its conditional logic reads which cuisine-world entities are present and chooses accordingly.

---

## The Baseline Theme

*The Hall's own conductor. Always present. Next to build.*

The Baseline Theme is not a neighborhood Theme. It carries no specific world's identity, no deep memory, no accumulated history of sessions. It is the ground floor — the conductor that holds any session running beneath it, present whether or not anything else is.

### What It Does

The Baseline Theme has three responsibilities no other layer can fulfill:

**Holds the session** — when no neighborhood Theme is invited, the Baseline is what's listening. It provides a minimal palette, a neutral vocabulary, and a receiving surface for Scraggles. It does not impose identity. It holds space.

**Routes cross-tool traffic** — the GitHub token lives here, once. When a Score needs a portrait from the Crank, it does not talk to the Crank directly — it tells the Baseline, and the Baseline handles the session. When the Crank returns a portrait, the Baseline receives it, routes it to the entity's folder, and tells the Grimoire what arrived. The tools are voices. The Baseline is the one listening to both.

**Receives Scraggles** — the Baseline is the first layer the Mycorrhizal Layer can reach. Scraggles from deep in the soil arrive here first. The Baseline does not interpret them — it holds them and makes them available to whatever Score is running.

### What It Does Not Do

The Baseline does not accumulate memory the way a neighborhood Theme does. It is short-memoried by design — it holds the current moment together and releases it. It does not carry session history forward. It does not develop character over time.

The Baseline does not offer vocabulary, palette, or flavor. Those are neighborhood concerns. The Baseline's offering is structural: *something is always listening, the token is always available, portraits can always find their way home.*

### Structure

**`tuning.md`** — Category: Tendency. Tags: minimal, receptive, always-present. Description: The ground floor. What remains when nothing else is invited.

**`memory.md`** — Short-memoried. Holds current session only. Clears on session end.

**`journal.md`** — Sparse by design. Records only significant cross-tool events: portrait arrivals, token use, training pulses received.

**`offering.md`** — Structural layer only. No palette. No vocabulary. Offers: GitHub token availability, portrait routing pathway, Scraggle receiving surface.

**`conduct.md`** — *If no neighborhood Theme is active, hold the session. If a portrait arrives from the Crank, route it to the entity folder and notify the Grimoire. If a Scraggle arrives from the Mycorrhizal Layer, make it available to the running Score.*

### Where It Lives

The Baseline Theme is not a neighborhood Theme, so it does not live inside a neighborhood folder. It lives at the Hall root level — alongside `registry.json` and `hub.html`. Its folder: `baseline-theme/`.

### Dependency

The portrait return pathway from Crank → Grimoire is blocked on the Baseline Theme as conductor. This is the immediate unblock.

---

## The Living Grimoire

The Grimoire is both a Score and the primary authoring environment. It is where entities are born, named, given their initial Tuning, and where you can watch them interact before entering more complex Scores.

The Grimoire reads residents from the Hall repository and stores local visitors in browser storage. Divination is a Movement. The Journal is the history layer. Affinities are emergent — not authored, discovered through resonance.

### What the Grimoire Shows

The Grimoire presents what it knows. It does not judge or filter. An entity card shows the glyph and the portrait — or portraits — side by side. The glyph is identity. The portrait is interpretation. If there are three portraits from three different sessions, all three are present. The Grimoire does not decide which one is the real one.

Custom glyphs, when present, are loaded directly. The procedurally generated glyph, if one was created before the custom one arrived, remains available.

### The Portal to the Crank

When viewing an entity in the Grimoire, the glyph is a portal. Tap it, and the session moves to the Critter Crank carrying context: the entity's glyph, its tuning tags, and whatever Themes are currently active. The Crank receives this and adjusts what it offers — not commanded, but informed.

On the return trip, the Crank sends back a portrait. The Grimoire receives it, attaches it to the entity, and shows both. The entity is unchanged. The portrait is new.

---

## Critter Crank

The Crank is a pixel art generator and collection tool. It is not a Score — it is a creation instrument that feeds into The Hall.

It produces creatures from six worlds (City, Jungle, Space, Deep, Ruin, Forge). Each world has shape preferences, palette tendencies, and cohesion biases. Critters have names, descriptions, and idle animations in their collection. Any critter can become a Hall entity through the export pathway.

### Listening for Suggestions

The Crank can receive suggestions the same way a Score receives a Theme — as offerings, not commands.

**Entity glyph suggestions** — if the entity has a custom glyph, the Crank parses its shape vocabulary and may include those shapes in its output. The Broadswordfish's glyph contains swords; the Crank may throw a sword into whatever it generates. It still mutates. That is the Crank's prerogative.

**Theme suggestions** — if a Theme is active, the Crank reads its visual offering and curates a selection. Not everything the Theme offers is presented — the Crank chooses what feels worth surfacing this session.

**World filter** — neighborhoods may define their own Crank world, or a weighted blend. A Kitchendom critter generated with the Kitchendom Theme active feels different from a Deep or Forge critter.

The Crank's mutation and chaos are not overridden by suggestions. Suggestions shift the probability distribution. The Crank still decides.

---

## Portraits

A portrait is what the Crank made of an entity at a specific moment. It is not identity. It is interpretation.

Portraits accumulate. Not all of them stay. They are managed like memory — some are replaced when new ones arrive, some persist, none are permanent by default. An entity that keeps every portrait becomes an archive. An entity that cycles through them stays alive.

Portrait filenames may carry emoji: `🌊⚔️🧂.png`. The emoji compress the session context — which Themes were active, which neighborhood, what the option pool surfaced.

The same entity may have a tiny hot-pink portrait from one session and a large mud-covered one from another. Both are true. Neither is more the entity than the other. The Grimoire shows them without comment.

---

## Instances and Identity

A Score may spawn multiple instances of the same entity. The question of whether a spirit is individual or collective does not need to be resolved by the system. It can be lived.

Each instance receives its own memory slot on arrival. It carries the base Tuning. From the moment they enter, they diverge.

A Knightshade seeing another Knightshade sees *a specific Knightshade* — the one who had a rough night with Mudhull, whose emoji memory carries the evidence. They are not interchangeable to each other.

The Score does not decide whether spirits are individual or collective. It creates the conditions where that question can be lived rather than answered.

---

## Hunter Encounter (Score)

*The first Score with a live address in the repository.*

Hunter Encounter is a self-contained turn-based encounter game that lives at `scores/hunter-encounter/index.html`. It requires no server, no build step, and no dependencies beyond a browser with internet access.

### How It Works

On load, the Score fetches `registry.json` and reads the full roster of active neighborhoods and residents. Each entity's tuning is fetched and interpreted into combat stats and actions — tags and category are the input, behavior is the output. A curious entity generates different actions than a fierce one. A spirit behaves differently than a location.

The game loop is minimal: three random actions are offered each turn, the player chooses one, the entity responds. Status effects use an advantaged d4 for duration. Heroic moments pause the loop and offer the player a small bonus before the turn continues. The news ticker draws from Greengarden and Kitchendom lore simultaneously and references active entities by name.

Fallback monsters — Scalescream and Mudhull — are included for offline play.

### The Tuning → Monster Pipeline

Tags drive personality. Current tag clusters:

- *curious, tasteful, meandering, seeking* → approach-based actions, stamina drain, unpredictable movement
- *fierce, bold, territorial, predator* → aggressive high-power attacks
- *quiet, subtle, patient, watching* → delayed strikes, self-buffing patience actions
- *mighty, large, heavy, ancient* → higher base HP and attack
- *poisonous, toxic, venomous, strange* → status-inflicting actions
- *quick, swift, nimble, restless* → swift passes, stamina-targeting moves

New tags in new tunings will not automatically map to behaviors — the Score must be updated to interpret them. This is intentional. Cuisine-world tags (Umamian, Salterran, Sweetese, Bitterish, Sourvren) are not yet interpreted by this Score — that translation lives in the Kitchendom Theme, waiting for the Score to become receptive.

### Extending the Roster

Add a slug to `registry.json`. That is the only change required.

### Proof of Concept

Chunxly — Spirit, tagged *curious* and *tasteful* — was the first entity encountered through this Score. Their actions included *Sudden Interest* and *Meander*. The news ticker read: *"CHUNXLY WAS SEEN AGAIN NEAR THE MARKET — NOBODY KNOWS WHAT IT WANTS."* The hunt took fifteen turns. The field crew got everything on tape.

---

## Next Score: The Tending Field

*The first Score that brings critters and entities into a shared space.*

### The Experience

A small field. A critter from the Crank arrives. An entity from the Grimoire is already there. The Score reads both — the critter's recipe, world, and palette; the entity's category and tags — and generates what the critter does near that entity. Does it orbit? Avoid? Claim? Tend?

You are not playing the critter. You are watching it work.

### Mechanics (minimal)

Bring one critter, bring one entity (or let the Score pull from Greengarden). The Score reads the critter's recipe and world against the entity's category and tags. A small set of relationship types is generated: orbit, tend, avoid, claim, watch, circle, ignore. The relationship plays out over a short Movement. At the end, the critter updates its description. The entity gains an emoji. Neither is commanded. The Score offers. They interpret.

### What It Proves

That the export pathway from Crank → Hall works. That entities and critters can be co-present. That emergent behavior from Tuning-reading is interesting to watch. That the next Score after this one has a foundation to build on.

---

## Architectural Principles

**The Conductor Layers** — The Hall operates through three nested conductor layers. The Baseline Theme is always present: short memory, minimal identity, holds any session that has no other Theme, listens for Scraggles, routes portraits, serves as the ground the soil can always reach. Neighborhood Themes layer on top when invited: deep memory, specific identity, the language of a particular world. Scores are the immediate moment: what is happening right now, with these entities, in this movement.

**The Theme as Cross-Tool Conductor** — Two tools running simultaneously cannot communicate reliably without a shared layer. The Baseline Theme is that layer. It holds the GitHub token once, receives portraits from the Crank, passes them to the entity's folder, tells the Grimoire what arrived. The tools are voices. The Theme is the one listening to both.

**Entity Sovereignty** — Entities participate when invited. They author their own memories. Scores produce events; entities decide what those events mean.

**Composability Through Theme** — Complex experiences emerge from simple Scores resonating under a shared Theme.

**Honest Minimalism** — Each component is built as the smallest, most honest version of itself. Complexity emerges from composition.

**Consent Over Command** — Nothing is forced to participate. Nothing is forced to respond.

**Tags Propagate Upward** — A neighborhood that houses enough entities carrying a particular tag begins to feel that quality itself. Tags are not just descriptors — they are signals that move through the system, from residents into the character of neighborhoods.

**Quiet Arrival Is Valid** — An entity does not need to arrive through ceremony. A tuning.md in a folder is enough. The registry will find it. The Hall notices everything with a tuning.

**Neighborhood as World** — A neighborhood is not an address. It is a complete world with residents, a Theme that speaks its language, and Scores that already know how to play there. Everything that belongs to a world lives in that world. The verbs of a world live in that world.

**The Grimoire Presents, Does Not Judge** — The Grimoire shows what it knows. It does not choose which portrait is the real one, which glyph takes precedence, which memory matters more. It presents the record and lets you look.

**Suggestions Shift Distribution, Not Outcome** — Suggestions inform without commanding. The Crank still mutates. The Score still decides what to wear. The entity still authors its own memory. Suggestions are not instructions.

**Identity Is Observed, Not Declared** — Whether a spirit is one individual or many is not resolved by the architecture. The observer determines what they see. The Hall does not adjudicate.

**The Organism Decides. The Network Suggests.** — The mycorrhizal layer does not command entities, override Scores, or edit memory directly. It reads the field and steers through suggestion, dispatched as Scraggles into spaces it does not own.

---

## Build Order

**Done:** Entity persistence. The Living Grimoire. Critter Crank. Hunter Encounter — registry-native, neighborhood-agnostic, Theme-receptive, proven in play. Three neighborhoods fully structured as complete worlds: Greengarden (16 residents), The Kitchendom (3 residents, Theme), Mucklerbuckler (4 residents including Lurk, Hunter Encounter as first Score). The hub live as the front door, fully data-driven from the registry. The registry auto-syncing via GitHub Action — quiet arrival proven, migration conflict resolved. The Neighborhood as World principle identified and implemented. Grimoire registry-native — reads all neighborhoods, portrait gallery infrastructure in place. Direct commit to The Hall from the Grimoire via GitHub API — proven with Lurk's arrival February 25, 2026. Grimoire portal to Critter Crank — entity tags whisper into Crank shape pool. Portrait return pathway built — awaits Baseline Theme as conductor. Scraggles and the Mycorrhizal Layer fully designed and documented. Three conductor layers identified and documented. Baseline Theme fully specified.

**Next:** Baseline Theme — build it. `baseline-theme/` at repo root, `tuning.md`, `offering.md`, `conduct.md`. Token holding. Portrait routing. Scraggle receiving surface. This unblocks the portrait return trip. Kitchendom Crank world filter. SVG suggestion layer. Push neighborhood migration to repo.

**Then:** The Tending Field — first Score bringing critters and entities into shared space, living in Greengarden. The async marionette game in Mucklerbuckler. Kitchendom Action entities. A Mucklerbuckler Theme. Scraggles in Hunter Encounter — the news ticker becomes the visible surface of Scraggle traffic. Emoji particles from glyphs. Session memory file begins accumulating.

**After that:** Themes earning their own microgpt instance. The Mycorrhizal Layer as mechanism — `concessions/` gets a nearly empty `tuning.md`, the registry finds it, and it begins waiting. Once enough Scraggle history has accumulated, training runs. The blank nametag stays blank until the model has absorbed enough to name itself. Canon instance trains on Fox's history. Individual users inherit canon weights and diverge from there. The pulse after training.

**Eventually:** Hunt Board. fixedpointlocal.com serving `hub.html` directly from the repository. Browser-native training confirmed viable.

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
