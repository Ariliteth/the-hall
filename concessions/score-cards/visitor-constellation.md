# VISITOR CONSTELLATION
**Location:** `ledger.js` (storage) + `index.html` (Ledger left panel) + `foyer.js` (Larr.AI) | **Status:** Active
**Neighborhood:** None — infrastructure | **Stack:** Vanilla JS, canvas-based

## Current State
A visitor's emoji presence in the Hall, structured as a die that grows with interaction (d4 through d100). The constellation is held in localStorage, rendered in the Ledger's left panel, editable at fine grain, populated through Larr.AI conversation in the Foyer, and broadcast to Scores via pip 4.

## What's Built
- **Storage API** (`ledger.js`): `Ledger.readConstellation()`, `constellationAnchor()`, `constellationAdd()`, `constellationRemove()`, `constellationReplace()`, `constellationClear()`, `constellationSample()`, `constellationTier()`
- **Constellation shape**: `{ anchor: emoji, faces: [{emoji, placedBy, ts}], tier }` — tier recomputed at read time
- **Die form mapping**: 0 faces = d4, 1-3 = d6, 4-7 = d8, 8-11 = d10, 12-15 = d12, 16-19 = d20, 20-49 = d50, 50+ = d100
- **Ledger left panel** (`index.html`): two-panel layout mirroring right panel grain structure
  - **Coarse grain**: single large anchor emoji, centered
  - **Mid grain**: canvas rendering adapted from LODE's `getConstellationLayout()` — center anchor + single/double ring, no edges
  - **Fine grain**: each emoji tappable with metadata (placedBy, date), SWAP/DROP actions, ADD FACE button, CLEAR CONSTELLATION
- **Pip 4 broadcast**: hub delivers `hub:pip4` message with `constellation` array (1-3 emoji) to score iframe on load, weighted toward anchor and inner ring
- **LODE awareness**: pip 4 emoji placed into first stomp field on run start (tier 0, first choices), not announced
- **Bao awareness**: pip 4 nudges General pre-selection on first assign of a continent — resonance with emoji/preferredArmy, or constellation-derived position
- **Larr.AI constellation access** (`foyer.js`): 60% chance prompt on Foyer visit (new: "What did you bring?" / returning: "Anything new?"), emoji input held as anchor (first) or face (subsequent), `larrHoldEmoji()` API for programmatic placement
- **Foyer constellation UI**: input row below greeting, current constellation shown as emoji string, visual feedback on submission

## What's Next
- **Edge awareness** — visitors defining which faces connect (relationships between constellation emoji)
- **Richer Larr.AI conversation** — Larr.AI noticing conversation topics and offering to hold emoji, decline flow
- **More Score integrations** — other Scores reading pip 4 as they develop constellation awareness
- **Constellation decay** — old faces dimming or drifting outward over time without reinforcement

## Specs & References
- Constellation spec: `concessions/VISITOR_CONSTELLATION_SPEC.md`
- Ledger read spec: `concessions/LEDGER_READ_SPEC.md`
- Storage module: `ledger.js` (constellation section)
- Ledger overlay: `index.html` (left panel)
- Foyer integration: `foyer.js` (constellation prompts)

## Hub Integration
- **Sends:** `hub:pip4` to score iframe on load (`{ type: 'hub:pip4', constellation: [emoji...] }`)
- **Receives:** Nothing (constellation is visitor-driven via Foyer and Ledger)
- **localStorage:** `baseline-session/visitor-constellation`
