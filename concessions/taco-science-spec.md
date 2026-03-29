# TACO SCIENCE — Score Spec
*A Fixed Point Local Score. Standalone, Hall-connected.*

---

## What This Is

A research lab disguised as a taco stand. The player is the lead researcher and recipe designer. Three scientist NPCs execute the recipes. The goal is the discovery of pure sauce colors — specifically the foundational ones that caused the first Explosion. Nobody knows what those are yet, including the player.

---

## Core Loop

### PREP
- Player configures 4–5 ingredient troughs from available stock
- Player authors recipe cards: vessel + ordered ingredient layers + sauce recommendation
- Player may combine 2 existing sauce vials to create a new one
- New ingredients can be acquired and dragged into trough slots; they must be used that day
- Unchosen trough ingredients may persist or rotate out

### DAY
- Researchers receive recipe cards and execute them buffet-style
- Execution is imperfect — researchers may add, skip, or reorder ingredients based on personality
- Completed recipes are evaluated for quality, flavor coherence, and structural integrity
- Recipes that exceed their vessel's capacity **explode**
- Explosions produce a residue: a new sauce vial added to the archive

### END OF DAY
- Sauce archive updates
- Researcher states may drift based on day's events
- Notable outcomes (pure color discovery, spectacular explosion) may emit a Scraggles toast to the Hall

---

## Vessels

Vessels govern three things: **capacity** (how many ingredient layers before explosion risk), **concentration** (how intensely flavors express), and **diffusion** (how much ingredients influence each other).

| Vessel | Shape | Capacity | Concentration | Diffusion |
|---|---|---|---|---|
| Taco | Large triangle | Medium | High | Medium |
| Nacho | Small triangle | Low | Very high | Low |
| Burrito | Rectangle | High | Medium | Low — sealed |
| Bowl/Salad | Circle | High | Low | High |

---

## Ingredients

Each ingredient has:
- **Code** — shorthand (MEA, VEG, TOM, CHE, LET, ION, BEN, JAL, etc.)
- **Color** — its natural hue; some ingredients have variants (red/green TOM, red/white/purple ION)
- **Amount** — how much is applied; affects layer weight and explosion risk
- **Cooperativeness** — how much the ingredient participates in the whole vs. asserts itself
  - High cooperativeness: diffuses, lifts neighbors, recedes into the recipe
  - Low cooperativeness: expresses loudly, crowds adjacent layers
- **Layer sensitivity** — some ingredients prefer upper layers (more expressive there), others perform better low (more cooperative when grounded)

Color proximity between adjacent ingredients creates **affinity**: similar hues may enhance each other; clashing hues create tension or dissonance depending on cooperativeness.

---

## Troughs

Troughs hold one ingredient each and affect how researchers interact with them.

| Material | Effect |
|---|---|
| Metal | Preserves ingredient fidelity. No drift, no bonus. The honest trough. |
| Colorful plastic | Tempts researchers to add the ingredient even when off-recipe |
| Bedazzled | Researchers feel elevated when choosing it. Builds ingredient loyalty over time. |

Bedazzled troughs are a primary driver of researcher preference formation.

---

## Sauces

Sauces are **colored vials**. Color is the complete description — no other stats.

- Sauces can be added to any recipe without contributing to explosion risk, but excess sauce volume or too many distinct sauces in one recipe has its own quality effect
- During PREP, player may combine 2 vials to produce a new color
- Explosions always produce a residue vial — color determined by the ingredients and layers involved
- All vials are stored in the **sauce archive**, which persists across days

**Purity** is the goal. A vial that is unambiguously, cleanly one affinity color — no muddiness, no edge-drift — is a discovery. Each of the five Kitchendom affinities (Umamian, Salterran, Sourvren, Bitterish, Sweetese) has 2–3 pure colors within it. Finding any is significant. Finding all of one affinity's pure colors produces something more.

The archive may eventually contain a vial that appears empty. It is not.

---

## Researchers

Three founding scientists. Distinct personalities that drift over time based on experiences, explosions, and discoveries.

Defined at implementation with:
- Starting preference set (ingredients, vessels, layer positions)
- Deviation tendency (how likely to go off-recipe, and in which direction)
- Explosion response (inspired vs. methodical vs. rattled)
- Loyalty triggers (what builds or breaks their attachment to a specific ingredient)

Researchers remember particularly successful recipes. Repeated success with a specific ingredient — especially one in a bedazzled trough — builds deep loyalty. Removing that ingredient is a professional disruption.

---

## Hall Connectivity

- This is a standalone Score accessible from the Hall
- **Brenda** (or other Hall Locals) may enter and participate as a researcher
- Significant discoveries — pure color found, foundational sauce approached, spectacular explosion — emit **Scraggles toasts** to the Hall via existing pulse infrastructure
- Researcher personality states are available as readable signals if other Scores want to reference them

---

## What Is Not In This Document

The three foundational sauces that caused the first Explosion are not specified here. They are not known. The lab does not know it has a chance of finding them. This is by design.

---

*Spec authored for Code handoff. Philosophy lives elsewhere.*
