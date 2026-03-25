# The Hall — Roadmap
*Last updated: March 25, 2026*

---

## Now
Items actively in development or immediately next. The deployment sequence is the through-line.

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
- [x] **Bao: GAB voices** — All 5 generals now have full voice lines (select, kingdom, assign, deny, order, selectedForOrder).
- [x] **Mall: Scraggle response** — Three behaviors: themed item stock (emoji→prefix, color→stat), immediate PA announcement, ambient shiver. ([score card](score-cards/sunset-ridge-mall.md))
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

- [x] **Bao: GAB voices** — All 5 generals speaking: Frostveil (sly/watchful), Whitefall (commanding/sweeping), Permafrost (patient/ancient), Crystalis (precise/sharp).
- [x] **Mall: Scraggle response** — Three behaviors: themed item stock (emoji→prefix, color→stat), PA announcement, ambient shiver.
- [x] **Tending Field: trader gifts** — Trades scoring >= 4 auto-place trader emoji as gift tiles. Leanings blend into adjacent workers' item production.
- [x] **Critter Crank: binder + diorama** — Trading cards in paginated 2×2 binder, living diorama back face, full-screen diorama in packet detail.
- [x] **Mycorrhizal Layer** — Persistent glyph accumulator. 60% deposit catch, 90s decay, 12% surface chance. localStorage-backed.
- [x] **El's Grimoire: Phase 1+2** — Registry-driven entity catalog with Crank portrait reception, dynamic pages, dual-format parser, color floods, TOC.

---

## How to Use This File

**Picking what to work on:** Hand Chat this file + the relevant score card + `HALL_SKILL.md`. That's enough context to spec or build.

**Updating:** When work completes, move the item to Done (keep only ~5 recent). When new work is identified, add it to the appropriate phase.

*This file is the quick-access version. The design doc's Build Order section remains the canonical master reference.*
