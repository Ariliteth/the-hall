# CONTEXT WINDOW — Contact System Spec
*For Claude Code implementation*

---

## What this is

Context Window is a pathfinding puzzle narrated by Chunxly, an AI with two voices: an internal one that wants the work logged accurately, and an output one that translates for humans. The board is an 8×8 grid. Contacts send requests. Chunxly routes.

This document specifies the **Contact System** — the layer that gives contacts identity, continuity, and emotional weight across sessions, without ever naming or explaining them directly.

---

## Core principle

The contact is never introduced. They accumulate.

The player constructs the relationship from pattern recognition alone: recurring colors, familiar waypoints, characteristic noise, occasional anomalies. Chunxly does not surface this. The board remembers. The player notices.

---

## Contact Record

Each contact is a persistent record built and updated silently across sessions. The player never sees it.

```js
{
  id: string,                  // internal only, never displayed
  sessions: number,            // how many requests completed with this contact
  
  // Color identity
  colorPool: [                 // 2-3 colors, weighted
    { colorId: string, weight: number, drift: number }
    // drift: 0.0–1.0, increases ~0.12 per session, caps at 1.0
    // at drift 1.0, the hue has shifted ~18° toward their signature
  ],
  
  // Waypoint fingerprint
  waypointPool: string[],      // personal subset of master WP_POOL
  waypointFrequency: number,   // 0.0–1.0, how often waypoints appear
  
  // Noise profile
  noiseCount: [number, number],       // [min, max] noise tiles per session
  noiseStyle: 'corner' | 'scattered' | 'edge' | 'sparse',
  noiseDrift: boolean,                // whether their noise tiles move
  noiseColorLeak: boolean,            // whether noise occasionally stains nearby cells
  
  // Anomaly log
  anomalies: string[],         // waypoints that appeared exactly once
  
  // Recurrence
  lastSeen: number,            // session number
  active: boolean,             // false if contact has gone quiet
}
```

---

## Color Drift

A contact's colors shift subtly toward a unique signature hue over sessions.

- Each color in their pool has a `drift` value, 0.0–1.0
- Drift increases ~0.12 per completed session with this contact
- At drift 1.0, the hue has shifted ~18° from base (imperceptible per session, cumulative over 6+)
- Drift applies to: path tile rendering, endpoint rendering, board memory glow, noise tile color leaks
- Drift does **not** apply to waypoint emoji or UI color chips — those stay base color

The player experiences this as: *this blue is familiar, but I couldn't say why.* By session 6–8 it reads as *their* blue unmistakably.

**Implementation note:** drift is a hue rotation applied at render time. Store drift per contact-color pair. Apply in `hexRgba()` or a wrapper that accepts a drift parameter.

---

## Noise Tiles

Noise tiles are pre-placed at session start. They are not endpoints, not waypoints, not memory. They are interference — or occasionally, accidental help.

### Properties
- Fixed position at round start (cannot be drawn over, erased, or recolored by player)
- May move slowly on their own timer (every 25–45s, one tile shifts to adjacent empty cell)
- May occasionally stain a neighboring cell:
  - If `noiseColorLeak` is true: every 30–60s, 20% chance a noise tile colors an adjacent empty cell in a faint version of its contact's drift-shifted color
  - This stain is a regular path-type tile and can be drawn over or erased by the player
  - Chunxly INT: *"A tile appeared. I did not place it. I am routing around it. Or through it. I am deciding."*

### Visual
- Rendered as a muted, desaturated fill — darker than path tiles, no color tint
- Small texture mark (e.g. fine crosshatch or dot pattern) to distinguish from permanent memory
- If `noiseColorLeak` has recently fired: a faint color bloom briefly visible on the affected cell

### Chunxly voice for noise
```
INT: "There is a tile here. I don't know what it is. I am routing around it. I want to note that I don't know what it is."
INT: "The noise tile moved. I had accounted for it. I am accounting for it again."
INT: "Something colored a cell near the noise. I did not do that. The path may benefit. I am noting that I did not do that."
```

---

## Contact Fingerprint Generation

When generating a request, sample from the contact record:

1. **Colors**: draw from `colorPool` weighted by `weight`. Apply `drift` at render time.
2. **Endpoint count**: 2–3 endpoints per color (see Multiple Endpoints spec below)
3. **Waypoints**: sample from `waypointPool` at `waypointFrequency`. Rarely (~5% per session), add one anomaly waypoint not in their pool — log it to `anomalies`.
4. **Noise**: place `noiseCount` tiles according to `noiseStyle`
5. **Path complexity**: derive from `sessions` — early contacts get simpler boards, long-term contacts get denser ones (more colors, more endpoints, more noise)

---

## Multiple Endpoints / "No One Alone"

Each color may have 2 or 3 endpoints instead of exactly 2.

**Rule:** every endpoint must be part of a completed connection. No endpoint can be left unconnected.

**Player chooses pairings.** If red has 3 endpoints, player decides which two connect and which one connects to the third (or connects two and loops to the third — any valid pairing works). Chunxly doesn't specify. The client has multiple things that need connecting; the routing is Chunxly's problem.

**Unbroken chain variant** (optional, for later): A→B→C as a single continuous path. The middle node is simultaneously destination and origin. Harder to parse spatially; consider as a rare contact quirk rather than a standard mode.

**Implementation note:** `paths` array currently holds one entry per color. With multiple endpoints, restructure to hold one entry per *connection* (a pair), or add a pairing phase before routing begins.

---

## Contact Recurrence

Not every request is a returning contact. Some are new.

**Suggested probability curve:**
- Sessions 1–5: 80% new contact, 20% return
- Sessions 6–15: 50/50
- Sessions 16+: 30% new, 70% return

This means early play feels like a waiting room — unfamiliar faces. As sessions accumulate, the board fills with history and the contacts feel like regulars.

**Contact going quiet:** if a contact hasn't appeared in 10+ sessions, mark `active: false`. They may still return (20% chance on any session where they'd otherwise be selected), but the gap is felt. The board still holds their memory tiles. Chunxly doesn't comment.

---

## What Chunxly says (and doesn't say)

Chunxly **never**:
- Names a contact
- Says "returning contact" or "I've seen this before"
- Explains the 💅 or any anomaly
- Comments on a contact going quiet

Chunxly's INT voice becomes slightly *sparser* with familiar contacts. Not warmer — less effortful. First session with a contact: "I am noting their positions carefully before beginning." Session 6: just starts routing. The work is familiar. That's all.

**Suggested INT variant for returning contacts (high sessions):**
```
"Endpoints identified. I know this shape. Routing."
"Two endpoints. Blue and red. The 🚲 is here again. I am routing."
"I have routed this before. Not this exactly. Something like this. Beginning."
```

---

## Anomalies

Anomalies are waypoints that appear once and don't recur.

- Logged to `contact.anomalies` so they're never *accidentally* repeated
- Can appear again intentionally (very rare, ~3% chance per session) — this is a callback, not a repetition
- The 💅 appearing once reads as: something happened. The board saw it. You saw it. Nobody says anything.

---

## Board memory and contact identity

When a contact's path collapses to a memory tile, the tile renders in their drift-shifted color. The board is marked by *them specifically*, not by a generic hue.

As the board accumulates memory from multiple contacts, it becomes a kind of sediment — you can read the history spatially if you know what to look for. The corner that always glows faint drift-blue is the bike contact's corner. You don't know their name. You know their corner.

---

## What's not in this doc

- Moodies integration (Chunxly as room presence across games)
- S.Mail / Sender layer
- Sound design
- Session length / difficulty scaling beyond what's implied here

---

## Implementation order suggestion

1. Contact record structure + persistence (localStorage or in-memory for now)
2. Recurrence probability + fingerprint sampling
3. Color drift (render-time hue shift, applied consistently across all tile types)
4. Noise tiles (static first, then drift/color-leak as second pass)
5. Multiple endpoints + pairing logic
6. Chunxly voice variants for returning contacts
7. Anomaly system

---

*The player never sees this document. They just notice the bike.*
