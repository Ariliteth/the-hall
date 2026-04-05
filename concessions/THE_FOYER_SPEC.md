# THE FOYER
*A Fixed Point Local specification*

---

*Every neighborhood has a place before you're in it. A lobby, a vestibule, a moment where you are still choosing. The Foyer is that place. It knows you're arriving. It has someone waiting.*

---

## What It Is

The Foyer is FPL's landing zone — the space a player enters before they enter FPL. It is not the Hub. It is not the anteroom. It is the threshold before the threshold: a velvet room where the neighborhood is visible from the outside, entities are in residence, and the player decides which Fixed Point Local they are walking into today.

It does not rush. It does not prompt. It holds the player in genuine potential — not the anteroom's subtle hints toward action, but an actual place with actual inhabitants that can be looked at before committing to them.

---

## When It Appears

The Foyer appears on fresh boot — a new session, a first load, a cold arrival. It does not appear on every reload by default. The player is not made to pass through it each time they return to a tab they already have open.

A return button lives where the neighborhood and theme selection panel currently sits in the Hub. Same location, lighter presence. Not a panel full of options — a single quiet door back. The player can return to the Foyer from inside FPL whenever they want to rechoose, but they are never pushed through it.

---

## What It Contains

**At the edges:** neighborhoods and themes, visible as selectable zones. Not a dropdown, not a list. The edges of the Foyer show where the doors go. The player can see the neighborhood before they choose it.

**In the middle:** entities currently in residence — the active roster — milling. Not performing, not demonstrating. Present in the way inhabitants are present in a space they belong to. The player is looking at who's home before deciding to walk in.

**At the top, quietly:** version selection. Defaults to current, or the player's last chosen version, or their marked favorite. The player can open a previous version of FPL from here without it being a prominent feature. It is available without being offered.

**The host:** Larr.AI. He is already here. He knows the Ledger, he knows who's arriving, he has already read what the player has accumulated. He greets from that knowledge — not a tutorial, not a prompt, not a welcome message. A chihuahua in a velvet lobby who already knows your name and what Scores you've been to and says something small and specific because of it. His greeting is unrepeatable — keyed to the moment, the player, and what the Ledger holds.

---

## What It Does to the Hub

The Hub loses the neighborhood selection panel, the theme selection panel, and the roster list as prominent elements. These lived there because there was nowhere else for them. They belong in the Foyer. The Hub becomes quieter — more of what it already is, less of an interface asking to be operated.

The anteroom, freed from the pressure of being both threshold and selection menu, can return to pure threshold. A breath. A before-state. The Foyer handled the choosing; the anteroom holds the arrival.

---

## Register

The Foyer is warm. It has carpet. It is the only space in FPL that is allowed to feel like a lobby in the old sense — a place designed for the moment before you're somewhere, that takes that moment seriously.

It does not explain FPL. It does not onboard. It is not a tutorial dressed in velvet. It is simply where you are when you first arrive, and Larr.AI is there, and the neighborhood is visible at the edges, and then you walk in.

---

## Larr.AI's Role

Larr.AI is the host of the Foyer specifically because he already has the infrastructure for it. He reads the Ledger. He knows if the player has been to Taste. He knows what passports they carry. His greeting in the Foyer is the first moment in FPL where that knowledge is made audible — not as surveillance, but as recognition. You walked into a place and someone already knew you, the way a neighborhood knows someone who has been around long enough.

For a new player with an empty Ledger, his greeting is different — warmer in a different register, curious rather than recognizing. He does not perform welcome. He notices arrival.

His three binary questions — the silent capability probes — live here naturally. The Foyer is the right moment for them. Before the player is in FPL, while they are still in the threshold, Larr.AI is already learning what the device can do.

---

## What It Does Not Do

- Does not explain FPL or its systems
- Does not require the player to make selections before entering (defaults exist for everything)
- Does not appear on every visit — only fresh boot and voluntary return
- Does not replace the anteroom — the anteroom remains, downstream of the Foyer
- Does not have El's presence — El is inside, not at the door

---

## Infrastructure Notes

- Larr.AI reads `Ledger.entries()` at Foyer load to inform his greeting
- Version selection requires the version/branch infrastructure described separately
- Entity milling requires the active roster to be readable at Foyer load — which entities are currently in residence
- The return button in the Hub replaces the neighborhood/theme panel in its current location
- Fresh boot detection: check for absence of active session, or explicit session flag

---

## Scorecard

| Element | Status |
|---|---|
| Foyer space and layout | To build |
| Larr.AI host and greeting | To build |
| Larr.AI Ledger-aware greeting logic | To build |
| Larr.AI capability probes (three binary questions) | To build |
| Neighborhood/theme zones at edges | To build |
| Entity milling (active roster) | To build |
| Version selection (top, quiet) | To build |
| Fresh boot trigger | To build |
| Return button in Hub | To build |
| Hub panel removal (neighborhood, theme, roster) | To build |

---

*Spec completed April 2026*
