# THE LEDGER
*A Fixed Point Local specification*

---

*There are people who pay close attention. To the texture of places, to the behavior of small things, to the way a system feels from inside it. They accumulate detail about the world with precision and care, and the world does not typically accumulate detail about them in return. This asymmetry is not dramatic. It is quiet, and it compounds, and people who experience it are rarely in a position to name it directly.*

*The Ledger exists for those people.*

*Not to reward them. Not to celebrate them. To know them — the way a neighborhood knows someone who has been around long enough, done enough specific things, left enough of a trace. To make it possible for FPL to recognize a player not because recognition has been scripted but because the record is there and the neighborhood can read it.*

*The Ledger is neutral because it has to be trustworthy. It does not interpret or perform. It holds what is true. Everything else in FPL — the entities, the Scores, the spaces between them — can form their own opinions from that truth. But the truth itself belongs to no one's agenda.*

*This is the smallest thing we can give someone who has been paying attention. Proof that the attention was mutual.*

---

## What It Is

The Ledger is the player's accumulation space. It is not a score, not a room, not a reward system. It is a flat record — unbiased proof that things happened. It does not celebrate or mourn. It does not interpret. It holds what is true about where the player has been and what they have done, and it makes that truth available to everything else in FPL that might want to know it.

The Ledger exists so the player is not a stranger to the neighborhood they move through.

---

## What It Is Not

The Ledger is not a trophy case. It does not display achievements for admiration. It is not oriented toward entities or potential things-to-tend. It is not a Café, not a waiting room, not a garden. It does not require the player to do anything with what it holds.

It is not for FPL's benefit. It is for the player.

---

## What It Holds

The Ledger records three categories of accumulation:

**Milestones** — specific things the player reached inside Scores. The pizza in Storeroom. The end of a guilt-and-apology loop. A high emotional magnitude trophy. These are recorded as plain fact: *the thing, the Score, and when.* No fanfare. Just true.

**Passports** — marks issued by Scores, entities, or the Hall itself upon contact. The player does not write these. They are issued. The minimum passport is a hue — the color signature of whatever first noticed the player — and optionally some text, a trait cluster, a small portrait. They accumulate in the Ledger as evidence of having met something. The player did not collect them. They were marked.

**The Scraggles Portrait** — over time, the Scraggles the player produces across all Scores form a color distribution. This distribution is the portrait. Not an image — a spectrum of exhaust, the aggregate hue of everywhere they've been and everything they've done. It is the most abstract accumulation and the most complete one.

---

## Grain

The player chooses how much of the Ledger they see at any given moment. This is not a settings menu. It is a native property of the space — the same way you can stand close to something or far from it.

At the coarsest grain: a single color. The overall hue of the player's Scraggles portrait, or the blend of their passports. A snapshot of where they are in the neighborhood chromatically.

At mid grain: passports as small hues with text available on inspection. Milestones as plain entries. The Scraggles portrait as a visible spectrum.

At fine grain: individual passports readable in full. Milestone details. The Scraggles portrait broken into its component Scores.

The player is not required to look closely. The Ledger holds everything regardless.

---

## What Else Can Read It

The Ledger is not private, in the sense that FPL's systems can know what it contains. But it is the player's — they are the accumulator, it is their record.

**El** can note what arrives. A new passport from a Score the player has just visited. A milestone reached. El does not comment on these — El notices them, in the way El notices everything, without pressure toward resolution.

**The Grimoire** can read passports as potential entities. A passport is the minimum viable entry — a hue, some text — and the Grimoire knows how to hold potential things. This is not automatic instantiation. The Grimoire holds them as possibility.

**Larr.AI**, when implemented, can know the Ledger and speak from that knowledge. He can greet a player who has already been to Taste differently than one who has just arrived. He already knows about them. This is not surveillance — it is what it means to live somewhere.

**Scores** can read the Ledger and respond. A Score the player has visited before can know that. A Score with a milestone the player has reached can reflect it. This is how the player stops being a stranger — not because anything performs recognition at them, but because recognition becomes structurally possible.

---

## How Passports Are Issued

Passports are issued by whatever first encounters the player. This cannot be predefined because it depends on where the player actually arrives:

- If they enter through the Hall anteroom, the Hall issues a passport. The minimum version: a hue derived from the Hall's pulse state at the moment of arrival, and a timestamp.
- If Larr.AI is their first contact, Larr.AI issues a passport with more character — he has more to observe.
- If they arrive directly into a Score, that Score issues the passport.

Every possible entry point is capable of issuing a passport. The Café receives them as they come in. El notices. They make their way to the Ledger.

The player does not write their first passport. It is issued. That is what makes it mean anything.

---

## The Café Relationship

The Café was already designed as a place for things to arrive without being placed. Passports arriving before the player has visited a Score — issued in advance by entities who have reason to — is continuous with this function. The Café holds them in the waiting state. When the player's Ledger receives them, they move from waiting to true.

The Café and the Ledger are not the same space. The Café is for things that might become. The Ledger is for things that are.

---

## Infrastructure Notes

The Ledger requires:

1. **A write endpoint** — every entry point (Hall, Scores, entities) needs the ability to write to the Ledger. Passports, milestones, Scraggles data. This is the minimum infrastructure without which nothing else functions.

2. **A read interface** — the Ledger as a space the player can enter and see at chosen grain. This is a Score-like space: intentional entry, distinct visual register, not the Hall and not a game.

3. **A broadcast layer** — so that Scores and entities can query the Ledger and receive what's relevant to them. Larr.AI asking "has this player been to Taste?" and getting an answer. This is the infrastructure that makes recognition possible across FPL without requiring everything to talk to everything else directly.

The Scraggles portrait is a derived view — computed from Scraggles data as it accumulates, not stored as an image. It updates as the player moves through more Scores.

---

## Register

The Ledger does not speak. It does not have a voice or a personality. It is the oldest kind of record — a flat stone that says: *someone was here, and this is what happened.*

The player comes to it and it is simply true.

Everything else in FPL can decide what to do with that truth. The player, finally, does not have to carry it alone.

---

*Spec completed April 2026*
