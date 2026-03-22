# El's Exploration — Entity Creation Theme

*Held concept. Not yet built. Captured March 21, 2026.*

---

## What It Is

A Theme — not a Score — that turns the Hall into an entity creation workbench. When active, it filters available Scores to only those that participate in the entity pipeline (Grimoire, Chunxly, Crank, possibly EFDP) and provides a persistent field card that tracks the entity being formed across all of them.

El's Exploration is a mode. It says: *everything happening right now is in service of this entity.*

## How It Differs From Existing Themes

Current Themes are neighborhood-flavored. Kitchendom changes palettes, encounter pools, recipe distributions. El's Exploration is **entity-flavored**. The Theme isn't "we're in the Kitchendom" — the Theme is "we're building Briny Broadswordfish."

This is the first Theme that spans scores rather than modifying one.

## The Field Card

A persistent UI element (popup/popdown from the HUD) that follows the user across scores while the Theme is active. It shows:

- **Entity name** (or "unnamed — observing" if starting from scratch)
- **Color swatch** — the entity's color, or a neutral placeholder
- **Progress markers** — what exists so far:
  - Name only
  - Drawing from Chunxly
  - Crank body (portrait)
  - Full tuning
  - Grimoire page inscribed
- **Current score** and what it's contributing to the process
- **Quick-jump** links to the other pipeline scores

The field card is the visible thread connecting the scores. It carries context so the user doesn't have to.

## Score Participation

When El's Exploration is active:

| Score | Role | Behavior |
|-------|------|----------|
| El's Grimoire | Inscribe, view, launch | Start here. Choose an entity to observe, or begin a blank page. Portal to Crank carries entity context. |
| Chunxly's Canvas | Draw | Draw the entity. Name-match resolves to entity slug. PNG analysis feeds Crank. |
| Critter Crank | Generate body | Receives entity context. First keep maps to entity portrait. Context clears after keep — further cranking is free exploration. |
| EFDP | Color field (future) | Pin placement could seed from entity color. Diffusion output could inform Crank palette. |

All other scores dim or hide in the hub selection panel. The hub knows to filter because the Theme is active.

## Activation

- From the Grimoire: tap an entity → "Explore this entity" option → Theme activates with that entity loaded
- From the hub: select El's Exploration Theme manually → starts with a blank entity
- Deactivation: complete the inscription, or dismiss the field card, or select a different Theme

## What It Replaces

Nothing. The manual pipeline (Grimoire → Crank → back to Grimoire) works today. El's Exploration is the orchestration layer that makes that round-trip intentional and guided. It compresses the steps and makes the creation process feel like a single continuous act rather than score-hopping.

## Dependencies

- Grimoire Phase 1+2 (done — entity pages, Crank portal, portrait queue)
- Single-keep-clears-context behavior in Crank
- Hub Theme filtering (new — hub currently doesn't hide scores by Theme)
- Field card HUD element (new — persistent across score changes)
- Chunxly name-to-slug resolution

## Design Notes

- The field card should feel like a naturalist's specimen tag clipped to the edge of the book. Not a progress bar — an observation in progress.
- "Unnamed — observing" is a valid state. You can enter Exploration with nothing but curiosity and let the entity emerge from what the Crank produces.
- The Theme should be removable without losing work. Everything written to localStorage and the portrait queue persists regardless of Theme state.
- This is the first cross-score orchestration in the Hall. Build it carefully — it sets the pattern for future modes.

---

*Proposed by Fox. Shaped in conversation, March 21, 2026.*
