# THE LEDGER
**Location:** `ledger.js` (root) + read overlay in `index.html` | **Status:** Active (Write + Read)
**Neighborhood:** None — infrastructure | **Stack:** Vanilla JS

## Current State
Write endpoint for player accumulation plus a read interface overlay with three-grain zoom (coarse/mid/fine). Holds passports, milestones, and scraggles. The read overlay unfurls over the Hub without displacing it.

## What's Built
- **Write module** (`ledger.js`): `Ledger.passport()`, `Ledger.milestone()`, `Ledger.scraggle()` — each appending timestamped, uid'd entries to `baseline-session/ledger` in localStorage
- **Passport shape**: `{ kind: 'passport', hue: [r,g,b], issuer: string, text?, traits?, portrait?, ts, id }`
- **Milestone shape**: `{ kind: 'milestone', score: string, key: string, label?, ts, id }`
- **Scraggle shape**: `{ kind: 'scraggle', emoji: string, color?, weight?, origin?, ts, id }`
- **Hub message handler**: `hub:ledger` postMessage type
- **Scraggle bridge**: every non-reemit scraggle recorded in the Ledger automatically
- **Hall passport issuance**: on score launch, Hall issues passport with Temperature hue
- **Verification helpers**: `Ledger.entries(filter?)` and `Ledger.counts()`
- **Scraggles portrait**: `Ledger.portrait()` — weighted color blend + per-origin breakdown, computed fresh each call
- **Read overlay** (`index.html`): fixed overlay with unfurl/fold-back animation
  - **Coarse grain**: single blended color (passport avg + portrait blend, 50/50)
  - **Mid grain**: passport hue chips (hover for text), milestone entries, canvas spectrum strip (equal-width segments per scraggle, no blending)
  - **Fine grain**: full passport cards (issuer, text, traits, portrait), timestamped milestones, per-origin color swatches with counts
  - **Grain zoom**: mouse wheel, arrow keys, clickable dots, Escape to close
  - **Trigger buttons**: HUD bar (score running) + selection panel status line (anteroom)

## What's Next
- **Broadcast layer** — structured queries from within running scores
- **Score-issued passports** — individual scores issuing passports with their own hue
- **Entity-issued passports** — entities marking the player on encounter
- **Three-pip broadcast summary** — lightweight player summary for score/entity recognition

## Specs & References
- Read spec: `concessions/LEDGER_READ_SPEC.md`
- Write spec: `concessions/THE_LEDGER.md`
- Write module: `ledger.js`
- Read overlay: `index.html` (Ledger overlay section)

## Hub Integration
- **Sends:** Nothing (infrastructure, not a score)
- **Receives:** `hub:ledger` messages from scores
- **localStorage:** `baseline-session/ledger`
