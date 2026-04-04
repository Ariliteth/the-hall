# The Foyer
**Location:** `foyer.js` + `index.html` (hub-level) | **Status:** Built
**Neighborhood:** None (pre-Hub) | **Stack:** Vanilla JS

## Current State
Pre-Hub landing zone. Appears on fresh boot (new session), hosts Larr.AI as greeter, holds neighborhood/theme/roster selection that was previously in the Hub sidebar. Uses sessionStorage flag (`fpl-session-started`) for fresh boot detection. Player passes through once per session, can return voluntarily via button in Hub sidebar.

## What's Built
- Foyer container with three-column layout (neighborhoods left, entities+Larr center, themes/roster right)
- Larr.AI greeting system: authored string pool with three registers (new/returning/veteran) plus score-specific greetings keyed to Ledger passport state
- Entity milling canvas: bezier-path walkers with glyph/portrait/color rendering (shared visual language with anteroom)
- Neighborhood filter checkboxes (relocated from Hub sidebar)
- Theme checkboxes (relocated from Hub sidebar)
- Roster preview (relocated from Hub sidebar)
- Version selector (top, quiet — placeholder for version/branch infrastructure)
- Three silent capability probes: viewport+DPR, deviceMemory, rAF performance tier
- Capability tier derivation (full/capable/light) stored in sessionStorage
- Fresh boot detection via sessionStorage
- Return-to-Foyer button in Hub sidebar (replaces removed panels)
- Foyer → anteroom transition (calls anteroomInit with entity pool)
- Mobile responsive layout (single column, center first)
- CSS: fade-in animations for greeting and enter button, warm lobby register

## What's Next
- Larr.AI visual presence (portrait, animation — currently text-only)
- Version selector wired to version/branch infrastructure (currently placeholder)
- Capability tier downstream effects (score filtering, layout adaptation)
- Score-specific greeting expansion (more scores, more lines)
- Neighborhood edge visualization (show where the doors go, not just checkboxes)

## Specs & References
- `concessions/THE_FOYER_SPEC.md` — design spec
- `concessions/LARR_ONBOARDING_SPEC.md` — capability probe design (Foyer implements the three probes)
- `concessions/LARR_ONBOARDING_HANDOFF.md` — original handoff note

## Hub Integration
- **Sends:** Nothing (pre-Hub, seeds state before Hub loads)
- **Receives:** Nothing
- **sessionStorage:** `fpl-session-started` (fresh boot flag), `fpl-capability` (probe results)
- **Reads:** `Ledger.entries()` for greeting selection, `registry` for neighborhoods/themes/roster
- **Downstream:** Anteroom receives entity pool from Foyer on first enter. Hub sidebar shows return button.
