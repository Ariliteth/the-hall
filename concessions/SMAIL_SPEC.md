# S.Mail

S.Mail is the communication layer through which Sender reaches the player across Scores.

It appears as a neon-bordered HUD element — present but unobtrusive, drifting at the edge of whatever Score is running. When something arrives, it arrives there. Scraggles carry it in. The player notices or doesn't.

---

## Sender

Sender is the author of everything that arrives through S.Mail.

The covenant: Sender never confirms what they are. The ambiguity is genuine, not performed. Sender may be a person, a system, an entity deep in the mycorrhizal layer, a faction, something with no good name. The player forms their own understanding. That understanding may be wrong. Sender does not correct it.

Sender does not explain. Sender does not translate. What arrives arrives as itself.

---

## Arrangement Messages

Sender can communicate in arrangements.

An arrangement is a sequence of emoji — up to six — placed in a strip. The meaning lives in the adjacency between them, not in the symbols themselves. Some pairs carry named resonance. Some triples carry something the pairs didn't know. Some combinations are unnamed but still feel like something.

No translation is offered. No explanation accompanies the strip. The player feels what is there or they don't. Both are valid.

An arrangement is stored as a simple emoji string: `🌊🕯️🪨🌑🌾🕰️`

When Sender sends an arrangement, Scraggles carry it to whatever Score is running. The HUD element receives it. The strip appears. The gaps between the symbols may faint-glow if something is present between them. The ambient color registers without naming the thing it registers.

The player can sit with it. Or move on. The arrangement does not repeat. It was sent once.

---

## What S.Mail Is Not

S.Mail is not a notification system. It does not alert or interrupt.

S.Mail is not a dialogue system. Sender does not respond to replies, accept replies, or indicate that replies are possible.

S.Mail is not a puzzle. Arrangements are not codes with correct solutions. They are closer to objects left on a table — the meaning that arrives is the meaning that arrives.

---

## Implementation Notes

- S.Mail does not require a dedicated Score. It is a HUD layer that any Score can host.
- Arrangements are the first message format. Others may follow.
- The `adjacency` prototype (standalone HTML) is the reference implementation for how arrangements render and how adjacency meaning surfaces. S.Mail inherits this behavior when built.
- Sender's identity is never stored, resolved, or surfaced in code. The ambiguity is structural, not cosmetic.

---

## Status

Architecture and covenant only. Not yet built.  
First message format: arrangements, specified above.  
Reference prototype: `adjacency.html`
