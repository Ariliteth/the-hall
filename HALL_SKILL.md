# Fixed Point Local — Hall Skill
**Hand this to any model touching Hall work. Read before doing anything else.**

---

## Before You Begin
Ask Fox for the current session scope. Do not assume continuity from this document. This file gives you vocabulary and constraints — Fox gives you the working target.

---

## What Fixed Point Local Is
A digital neighborhood system where autonomous entities with memory and identity participate in shared experiences through consent-based interactions.

- **The Hall** — the overall system. Never call it a game. It is a neighborhood.
- **Worlds** — neighborhood-centric containers (Greengarden, The Kitchendom, Mucklerbuckler). Each holds its own entities, themes, and scores.
- **Score** — a self-contained rule set or experience. Has its own logic, entities, and aesthetic. Scores do not depend on each other. Shared references go through the Grimoire.
- **Theme** — a visual and textual modification set applied to a Score.
- **Entity** — an autonomous resident with memory and identity. Not an NPC. Has genuine presence.
- **The Grimoire** — the entity catalog.
- **Critter Crank (the Crank)** — entity generator. Color Pin Maze Diffusion is its image pipeline.

---

## Vocabulary: Color Pin Maze Diffusion
- **Pin** — a color source in a maze. Pulses color outward. Three types: Circle, Square, Triangle. Each has distinct physics. See COLOR_PIN_MAZE_DESIGN.md.
- **Layer** — one full diffusion pass followed by a flatten. Three layers per run: full assertion, negotiated presence, appropriate scale.
- **Flatten** — commit current color state to canvas, clear accumulated pressure, begin fresh.
- **Pressure** — competition between colors at boundaries. High = still negotiating. Plateaued = flatten or stop.
- **Kiwi** — lightweight event marker. Carries type and location only — not explanation or cause. Drop Kiwis to propagate event awareness rather than building direct communication channels. Used across the Hall wherever event propagation is needed.
- **The Third** — the observer role in any system with three participants or layers. Arrives last. Sees the full shape. Does not command — notices, suggests, and places attention. Build Third roles as observers with optional suggestions, never as controllers.

---

## Design Constraints
**Always:**
- Prefer emergent behavior over scripted outcomes
- Prefer logical framing over numerical framing when both would work
- Build systems that reward attention rather than demand it
- Design limits as self-declared by the entity, not externally imposed (a pin with reach 5 is being honest about its scale)
- Keep Scores self-contained; shared vocabulary goes through the Grimoire

**Never:**
- Hard-code what should be discovered
- Force an outcome that should be negotiated
- Remove agency from an entity that should have it
- Build something that cannot be understood by watching it
- Write the whole thing at once — implement one named piece, verify, then move

---

## Technical Conventions
- **Tools:** Godot, RPG Maker, Stable Diffusion, HTML/JS, Python
- **Persistence:** GitHub for entity storage in Fixed Point Local
- **File naming:** `snake_case` for scripts, `SCREAMING_SNAKE` for skill/convention docs, `Title Case` for design documents
- **Output size:** If a response exceeds ~200 lines of code, split it into separate implementation steps
- **Build order (Color Pin):** decay → pressure gauge → shape masking → pin types → three-layer system → Kiwis → the Third

---

## Active Projects
| Project | Document | Status |
|---|---|---|
| Color Pin Maze (EFDP) | `color-pin-maze-design.md` | Active — lives at `scores/efdp/` |
| Sunset Ridge Mall | internal docs | Active development |
| The Grimoire | internal docs | Active |
| Critter Crank | internal docs | Active — Color Pin is its image pipeline |
| Fixed Point Local core | internal docs | GitHub integration complete |

---

## Model Routing
**This session (full context):**
- Architectural decisions
- New system design
- Anything requiring Hall vocabulary or cross-system awareness
- Debugging that requires understanding *why* something broke

**Claude Code:**
- Implementation of a specific, scoped design doc section
- File structure, refactoring, mechanical debugging
- Hand it one section at a time

**Local small model (Qwen, Mistral, etc.):**
- Self-contained implementations with a complete spec
- Repetitive generation (Grimoire entries, tile variations)
- Math-only tasks (decay functions, pressure calculations)
- Any task where all decisions are already made

**Rule:** If it requires a decision → full context. If it requires execution of a decided spec → smaller model.

## Session Files
Session briefs live in `the-hall/concessions/sessions/`.

At the **start** of each session: create a session file named `YYYY-MM-DD_scope.md` where scope is a short snake_case description of the working target (e.g. `2026-03-02_color_pin_decay.md`). Populate it with the session scope as Fox described it.

At the **close** of each session: update that file with what was built, decisions made, files created or modified, and the recommended next step.

Keep it short. This is a handoff document, not a report.

---

*Maintained by Fox. Part of Fixed Point Local. Last updated: March 2, 2026.*
