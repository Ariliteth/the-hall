# VISITOR CONSTELLATION
**Location:** `ledger.js` (storage) + `index.html` (Ledger left panel) + `foyer.js` (Larr.AI) | **Status:** Active
**Neighborhood:** None — infrastructure | **Stack:** Vanilla JS, canvas-based

## Current State
A visitor's emoji presence in the Hall, structured as a die that grows with interaction (d4 through d100). The constellation is held in localStorage, rendered in the Ledger's left side of the horizontal axis (positions 0-2: fine/mid/coarse), editable at fine grain, populated through Larr.AI word-prompt in the Foyer, and broadcast to Scores via pip 4.

## What's Built
- **Storage API** (`ledger.js`): `Ledger.readConstellation()`, `constellationAnchor()`, `constellationAdd()`, `constellationRemove()`, `constellationReplace()`, `constellationClear()`, `constellationSample()`, `constellationTier()`
- **Constellation shape**: `{ anchor: emoji, faces: [{emoji, placedBy, ts}], tier }` — tier recomputed at read time
- **Die form mapping**: 0 faces = d4, 1-3 = d6, 4-7 = d8, 8-11 = d10, 12-15 = d12, 16-19 = d20, 20-49 = d50, 50+ = d100
- **Ledger horizontal axis** (`index.html`): constellation occupies positions 0-2 of the Ledger's horizontal scroll
  - **Position 0 (fine)**: each emoji tappable with metadata (placedBy, date), SWAP/DROP actions, ADD FACE button, CLEAR CONSTELLATION
  - **Position 1 (mid)**: canvas rendering adapted from LODE's `getConstellationLayout()` — center anchor + single/double ring, no edges
  - **Position 2 (coarse)**: single large anchor emoji, centered
  - Record pips occupy positions 3-5 (canvas/coarse, mid, fine). Default opens at position 3.
- **Pip 4 broadcast**: hub delivers `hub:pip4` message with `constellation` array (1-3 emoji) to score iframe on load, weighted toward anchor and inner ring
- **LODE awareness**: pip 4 emoji placed into first stomp field on run start (tier 0, first choices), not announced
- **Bao awareness**: pip 4 nudges General pre-selection on first assign of a continent — resonance with emoji/preferredArmy, or constellation-derived position
- **Larr.AI word-prompt** (`foyer.js`): 60% chance a single word from Hall vocabulary appears to one side of the greeting (Playfair italic, same size/color). Tapping opens minimal emoji input — no label, no button. Emoji entered settles into constellation. Word fades after 15s if untapped. `larrHoldEmoji()` API for programmatic placement

## What's Next
- **Edge awareness** — visitors defining which faces connect (relationships between constellation emoji)
- **Richer Larr.AI conversation** — Larr.AI noticing conversation topics and offering to hold emoji, decline flow
- **More Score integrations** — other Scores reading pip 4 as they develop constellation awareness
- **Constellation decay** — old faces dimming or drifting outward over time without reinforcement

## Specs & References
- Constellation spec: `concessions/VISITOR_CONSTELLATION_SPEC.md`
- Ledger read spec: `concessions/LEDGER_READ_SPEC.md`
- Storage module: `ledger.js` (constellation section)
- Ledger overlay: `index.html` (horizontal axis positions 0-2)
- Foyer integration: `foyer.js` (constellation prompts)

## Hub Integration
- **Sends:** `hub:pip4` to score iframe on load (`{ type: 'hub:pip4', constellation: [emoji...] }`)
- **Receives:** Nothing (constellation is visitor-driven via Foyer and Ledger)
- **localStorage:** `baseline-session/visitor-constellation`
