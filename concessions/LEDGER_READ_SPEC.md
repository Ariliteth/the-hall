# THE LEDGER — Read Interface
*A Fixed Point Local specification*

---

*The player has been somewhere. Things happened. The Ledger holds this without judgment or arrangement. The read interface is simply the moment they look.*

---

## What It Is

The Ledger read interface is an overlay — a surface that unfurls over the Hall without displacing it. The Hall continues beneath. The Ledger opens in front of it, is read at whatever depth the player chooses, and folds back without leaving a mark on what was running below.

It is not a room. It is not a Score. It is closer to a document — something you hold up, inspect, and return.

---

## Entry and Exit

The Ledger has a presence in the Hub similar to EJECT: a persistent, unobtrusive control that is simply there when the player wants it. It does not advertise itself. It does not pulse or animate for attention. It waits.

When opened, the Ledger unfurls — a gesture that is gentle and unhurried, like a page being smoothed flat. Not a modal. Not a slide. Something that arrives without violence.

When closed, it folds back. The Hall is exactly as it was. Nothing was disturbed.

The Hub continues running beneath the overlay at all times. The Hall Pulse, any running Scores, any active iframes — nothing pauses. The Ledger is held in front of the world, not instead of it.

---

## Grain

The player moves through grain by zooming — a snappy, directional gesture that pulls the view closer or pushes it back. Not a toggle. Not a filter setting. A spatial movement. The player is moving toward the record or away from it, the way you might approach footprints in soil to read whose they are, or step back to see the whole trail.

There are exactly three depths. No intermediate positions. The zoom snaps.

---

### Coarse — Default Arrival State

A single color. The blended hue of everything in the Ledger: passport aggregate mixed with the Scraggles portrait blend from `Ledger.portrait().blend`. No entries visible. No text. No labels. Just the color of the player's time in FPL so far.

If the Ledger is empty — new player, no accumulation yet — the coarse view holds the absence honestly. Not a blank white field. Not a prompt to go do something. The color of zero, whatever that resolves to visually. The interface does not apologize for it or fill it.

The coarse view is the Ledger's natural resting state. It is what the player sees first, every time.

---

### Mid — Field View

Three categories of accumulation become visible, coexisting without hierarchy:

**Passports** appear as small hue chips — the color of each passport, arranged without ranking. Tapping or hovering a chip reveals its text if present. No issuer label prominent at this depth. The color is the identity; the text is available if the player reaches for it.

**Milestones** appear as plain dated entries. Score slug and key, timestamp, label if one exists. No emphasis on recency or significance. They are facts, listed.

**The Scraggles portrait** appears as a color spectrum — the aggregate smear of everywhere the player has been. Not individual scraggles. Not a chart. A visible distribution of hue across everything the player has done that produced exhaust. If `Ledger.portrait()` returns null (no color-bearing scraggles), this area is simply absent — no placeholder, no instruction.

Nothing at mid grain is sorted by time or weighted by importance. The player reads the field.

---

### Fine — Full Record

Individual passports open in full: hue rendered, issuer named, text readable, traits listed, portrait displayed if present. Each passport is its complete self.

Milestones show their full label alongside score and key. Timestamps are visible at this depth.

The Scraggles portrait breaks into its component origins — `Ledger.portrait().byOrigin` — so the player can see which color came from which Score. The blue-green from Taste. The warm orange from Storeroom. The record becomes specific. This is the closest the player can stand to the truth of what happened.

---

## Visual Register

The Ledger's visual language is distinct from Score UI and from Hub chrome. It does not borrow either.

Calm. Mostly space. Color is the primary carrier of information, especially at coarse and mid grain. Text appears only at the depth that warrants it.

The unfurl and fold-back gestures carry the register: this is a document, not an application. The player is reading something, not operating something.

No loading states. No empty-state illustrations. If the Ledger is sparse, the interface is sparse. Sparseness is honest.

No sorting, ranking, or directional time emphasis. No "most recent" at the top, no "most significant" highlighted. The record is a field. The player moves through it.

No locked states. No empty passport slots waiting to be filled. No suggestions. No next-action prompts. The Ledger does not tell the player what they're missing.

---

## What the Scraggles Portrait Is

The Scraggles portrait is a derived view — computed fresh from accumulated scraggle data by `Ledger.portrait()`, not stored as an image or cached value.

At mid grain it is a spectrum: the aggregate blend of every color-bearing scraggle the player has produced, across all Scores.

At fine grain it is that spectrum broken by origin: the color signature of each Score that produced scraggles, visible separately.

It is the most complete picture of the player in the Ledger because scraggles are exhaust — they record not what the player chose but what they did. The portrait does not look like the player. It is the player, in the only language FPL has for that.

---

## El

El does not have a presence in the read interface. This is one of the spaces where the player is alone with the record. El noticed the arrivals — passports, milestones, scraggles — at write time, through channels not visible here. The read interface is quiet. The player and what happened.

---

## What Entities Can Know

The read interface makes one thing newly apparent to the player: that the Ledger is readable by others. By Larr.AI. By Scores they've visited. By the Grimoire. This is not disclosed as a warning or a permissions notice. It is simply true, the way it is true that a neighborhood remembers who has been in it. The player can see what's there. So can the neighborhood. The record is shared, not surveilled.

---

## Future Layer — Three-Pip Broadcast Summary

Not part of this build. Documented here for architectural awareness so nothing built now forecloses it.

When the broadcast layer is implemented, any Score or entity querying the Ledger for a lightweight player summary will receive three pips:

- **Pip 1** — overall identity: the same blended color the coarse view shows
- **Pip 2** — short-term memory: the 6–10 most recent player-interaction scraggles, not as a strict chronological slice but weighted toward recency with some chance of displacement, analogous to the Scraggle HUD
- **Pip 3** — contextual sampling: a random sampling of scraggles from or relevant to the Score being entered

This allows Scores and entities to recognize the player without reading the full Ledger. It is the infrastructure that makes recognition structurally possible across FPL.

---

## Infrastructure Dependencies

| Dependency | Status |
|---|---|
| `Ledger.entries(filter?)` | Built — `ledger.js` |
| `Ledger.counts()` | Built — `ledger.js` |
| `Ledger.portrait()` | To build — see portrait computation brief |
| Passport renderer (hue chip → full detail) | To build |
| Milestone list renderer | To build |
| Scraggles spectrum renderer | To build |
| Grain zoom gesture (three snappy states) | To build |
| Hub overlay (unfurl / fold-back) | To build |
| Hub control trigger | To build |

---

## What It Does Not Do

To be explicit, for implementation clarity:

- Does not sort or rank entries
- Does not emphasize recency
- Does not show locked or missing states
- Does not suggest next actions
- Does not pause Hub state on open
- Does not have El presence
- Does not celebrate or mourn
- Does not cache the Scraggles portrait — computed fresh each open

---

*Spec completed April 2026*
