# The Hall — Roadmap
*Last updated: March 25, 2026*

---

## Now
Items actively in development or immediately next. The deployment sequence is the through-line.

**Deployment sequence:** Inscription pipeline → six remaining entities → Crank shapes → fixedpointlocal.com

- [x] **El's Grimoire: inscription pipeline** — Built and internalized (hidden behind `?inscribe` param). All founding eight inscribed with registry, tunings, journals. Locals section added (Sender, microGPT, Mycorrhizal Layer). ([score card](score-cards/els-grimoire.md))
- [ ] **Crank: Kitchendom shapes** — Founding eight need Crank output. Briny Broadswordfish complete (first full pipeline entity). All entities inscribed — Crank shapes are the remaining gap.
- [ ] **fixedpointlocal.com** — GitHub Pages deployment. Hub is already a static site, path is clear. Blocked on: founding eight having pages.
- [ ] **Tending Field: color canvas visualization** — Trader gifts landed. Remaining: relationship/influence visualization via color. ([score card](score-cards/tending-field.md) | [spec](tending-field-workin-spec.md))
- [ ] **Fairy → EFDP skeleton** — Chunxly's fairy structural data creates corridors in EFDP. ([chunxly card](score-cards/chunxly.md) | [efdp card](score-cards/efdp.md) | [FAIRY_SPEC.md](FAIRY_SPEC.md))

## Next
Items with clear specs or obvious next steps, ready to build.

- [ ] **LODE: fleet autonomy** — Companions act independently, declaration influence on trajectory. ([score card](score-cards/lode.md) | [LODE_GDD_v2.md](LODE_GDD_v2.md))
- [ ] **LODE: d50/d100 (the quiet)** — Post-d20 ascending phase (currently empty `case 'ascending'`).
- [ ] **LODE: emoji passives** — Only Mushroom exists. `EMOJI_PASSIVES` has room for more.
- [ ] **Bao: specialist unlock** — Expand general capabilities. ([score card](score-cards/bao.md))
- [ ] **Bao: correspondence front** — Diplomatic layer.
- [ ] **Bao: council scene** — Multi-general deliberation.
- [ ] **Bao: GAB voices** — Only Glacius (1/5) has voice lines. Other 4 generals are silent.
- [ ] **Mall: Scraggle response** — `mallRespondsToScraggle()` is empty. Ideas: themed stock, ambient shift, named back rooms. ([score card](score-cards/sunset-ridge-mall.md))
- [ ] **Mall: ambient audio** — Elevator chime, muzak shift, footsteps. (Muzak system exists, effects partially built.)
- [ ] **Storeroom: persistence** — No save across reloads. Also: new objects after departures. ([score card](score-cards/storeroom.md))
- [ ] **Taste: next magazine issue** — Potato issue teased in Citrus Issue. ([score card](score-cards/taste.md))
- [ ] **EFDP: configurable layers** — Layer settings (blend mode, press, pin density, decay rate). ([color-pin-maze-next-steps.md](color-pin-maze-next-steps.md))

## Then
Items that need speccing first or depend on Now/Next.

- [ ] **Relationtips** — Undercover waiter in Roastbeefwick. Design incomplete, open questions. ([relationtips.md](relationtips.md))
- [ ] **Kitchendom Action entities** — New entity category for The Kitchendom.
- [ ] **Mucklerbuckler Theme** — No Theme yet for Mucklerbuckler. Hunter Encounter would consume it.
- [ ] **El's Exploration** — Entity creation Theme. Filters hub to pipeline scores (Grimoire, Chunxly, Crank), persistent field card tracks entity progress across scores. First cross-score orchestration mode. ([ELS_EXPLORATION.md](ELS_EXPLORATION.md))
- [ ] **Cross-Score item pipeline** — Mall → Field via color-routed Scraggles. Routing infra in place, needs emitter + renderer.
- [ ] **Anteroom** — Hub entrance score. Spec exists ([archive/ANTEROOM_SPEC.md](archive/ANTEROOM_SPEC.md)), implementation pending.
- [ ] **Hub Audio Memory** — Volume as hub concern, musical state carried across Scores.
- [ ] **Shoot the Moon: progression** — No persistence, binary outcome, no scoring. ([score card](score-cards/shoot-the-moon.md))
- [ ] **SILMOR: persistence + Dream Job** — No save, no campaign arc. ([score card](score-cards/silmor-spells.md))

## Horizon
Held ideas, vision pieces, long-term.

- [ ] Themes earning their own microGPT instance
- [x] ~~The Mycorrhizal Layer as mechanism~~ (moved to Done)
- [ ] Per-entity color differentiation from neighborhood defaults
- [ ] The blank nametag
- [ ] Convergence — cross-score meta-experience ([CONVERGENCE.md](CONVERGENCE.md))
- [ ] Context Window Contacts system ([CONTEXT_WINDOW_CONTACTS.md](CONTEXT_WINDOW_CONTACTS.md))
- [ ] Determany neighborhood ([determany-design-doc.md](determany-design-doc.md))
- [ ] Cabinet Climber (shelved 2026-03-05) ([archive/cabinet-climber.md](archive/cabinet-climber.md))

## Done (recent)
Last completed milestones for context.

- [x] **Tending Field: trader gifts** — Trades scoring >= 4 auto-place trader emoji as `gift` tiles on the nearest empty slot. Gift leanings blend into adjacent workers' item production via adjacency tags and influence emoji provenance. Rendered with amber tint, draggable, persistent.
- [x] **Critter Crank: binder + diorama** — Caught critters shown as trading cards in paginated 2×2 binder pages. Clean front face (pixel art + name + badges), living diorama back face (creature + 5 world companions placed spatially, animated). Full-screen diorama in packet detail view with all companions breathing. Shoulder buttons page in binder, FLIP button contextual. Stat-specific bar colors.
- [x] **Mycorrhizal Layer** — Persistent glyph accumulator beneath all Hall systems. 60% deposit catch, 90s decay cycle, 12% surface chance. localStorage-backed, each visitor grows their own soil. Soil-sourced scraggles don't re-deposit (no feedback loops).
- [x] **Entity journals** — First words for 14 entities: 3 Locals, 7 Kitchendom, 1 Mucklerbuckler, 3 Greengarden. Each speaks from their own nature.
- [x] **Locals: Fixed Point Local** — Hall-level entity section in Grimoire. Sender, microGPT, Mycorrhizal Layer inscribed with tunings, journals, registry. Fourth TOC section with "On This Place" divider.
- [x] **Inscription internalized** — Hidden from normal Grimoire browsing, accessible via `?inscribe` URL parameter.
- [x] **El's Grimoire: Phase 1+2** — Registry-driven entity catalog with Crank portrait reception. Dynamic pages from tuning.md, dual-format parser, portrait gallery with cycling, Crank portal, color floods, TOC, hub:minimize + hub:color + hub:scraggle. Supersedes Vite/React Grimoire.
- [x] **Tending Field: Workin' Integration** — Named item economy, crafting personality, trader preferences/memory/rhythm, Strange Visitor as Third herald, trade consequence gradient, emoji provenance. Particles become atmospheric weather, not currency.
- [x] **Storeroom Scraggles** — Three emission points (departure, first perfect, trophy arrival). Storeroom promoted to Hall participant. (v0.999)
- [x] **Chunxme's Stall** — Mustache persona, procedural canvas reading, item generation. First Score wearing a persona. (v0.998)
- [x] **The Hall Pulse** — 45s heartbeat, hudBreath, Mall idle listener, color-routed Scraggles. (v0.997)
- [x] **Color Canvas** — RGB in every entity tuning, Temperature of the Room, hub ambient wash. (v0.996)

---

## How to Use This File

**Picking what to work on:** Hand Chat this file + the relevant score card + `HALL_SKILL.md`. That's enough context to spec or build.

**Updating:** When work completes, move the item to Done (keep only ~5 recent). When new work is identified, add it to the appropriate phase.

*This file is the quick-access version. The design doc's Build Order section remains the canonical master reference.*
