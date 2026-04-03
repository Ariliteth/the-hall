# THE LEDGER
**Location:** `ledger.js` (root) | **Status:** Active (Write endpoint only)
**Neighborhood:** None — infrastructure | **Stack:** Vanilla JS (~160 lines)

## Current State
The Ledger's write endpoint. Neutral storage for player accumulation — passports, milestones, and scraggles data. No interpretation, no derived views, no synthesis at write time. It receives facts and holds them.

## What's Built
- **Write module** (`ledger.js`): three methods — `Ledger.passport()`, `Ledger.milestone()`, `Ledger.scraggle()` — each appending timestamped, uid'd entries to `baseline-session/ledger` in localStorage
- **Passport shape**: `{ kind: 'passport', hue: [r,g,b], issuer: string, text?, traits?, portrait?, ts, id }`
- **Milestone shape**: `{ kind: 'milestone', score: string, key: string, label?, ts, id }`
- **Scraggle shape**: `{ kind: 'scraggle', emoji: string, color?, weight?, origin?, ts, id }`
- **Hub message handler**: `hub:ledger` postMessage type — scores write via `window.parent.postMessage({ type: 'hub:ledger', action: 'passport'|'milestone'|'scraggle', ...fields }, '*')`
- **Scraggle bridge**: every non-reemit scraggle that arrives at the hub is also recorded in the Ledger automatically
- **Hall passport issuance**: on score launch, the Hall issues a passport with the current Temperature hue and the score slug as text
- **Verification helpers**: `Ledger.entries(filter?)` and `Ledger.counts()` for confirming writes

## What's Next
- **Read interface** — the Ledger as a visitable space with grain control (coarse/mid/fine)
- **Broadcast layer** — so Scores and entities can query the Ledger (`Ledger.entries({ kind: 'passport' })` is the seed, but the broadcast is about structured queries from within running scores)
- **Score-issued passports** — individual scores issuing passports with their own hue on first visit
- **Entity-issued passports** — entities marking the player on encounter
- **Scraggles portrait** — derived color distribution computed from accumulated scraggle data

## Specs & References
- Spec: `concessions/THE_LEDGER.md`
- Write module: `ledger.js`

## Hub Integration
- **Sends:** Nothing (infrastructure, not a score)
- **Receives:** `hub:ledger` messages from scores
- **localStorage:** `baseline-session/ledger`
