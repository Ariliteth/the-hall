# Score Card
## slayy.
*formerly Hunter Encounter*

---

### Overview

slayy. is a performance arena Score. You and Mudhull — a behemoth currently in legal jeopardy — compete for Camera attention across a Show of escalating tremor and consequence. The Show ends when the Cameras get bored, when they can only look at one Dancer, or when someone falls off stage. Everyone can tell who won. No announcement is needed.

Opponents in slayy. were on the run from the law. You caught them. If you beat them in a dance, they'll confess. The dance is not optional for them.

---

### Entry

Hunter Encounter's ticker tape occasionally goes erratic. If the player notices and touches it, Hunter Encounter asks:

**Mother?**

The player chooses:
- **slayy.**
- **oops.**

The slayy. label is slapped directly over the Hunter Encounter title on entry. It does not fully cover it. Other Dancer names are handled the same way: **slayy.hall**, **slayy.scream**. The full name is underneath. It is just covered.

---

### The Stage

Two Dancers. One stage. An audience. The Cameras. Mother, somewhere in the crowd — visible or buried depending on how the Show is going.

**The Cameras** are the judges. They don't say much. They love high fashion banality. Their attention is the currency of the Show. When they reposition — adjusting their own posture to find a better angle — the crowd feels it. The energy in the room changes before anything has happened. The Cameras are always excited about their own posture changes.

**Mother** is the legibility signal. She cannot contain herself. When you cannot find Mother in the crowd, things are not going well. When she is all but buried by the people around her, something exceptional is happening.

---

### Mudhull

Mudhull is a behemoth. He is always kicking up dust. He operates on his own logic — rolling, tumbling, not every Pose needs to be complete in one action. He does one thing, with some variance. He is not competing on your terms.

When Mudhull nails a close-to-perfect, or even moderately decent, **Mud Drop** — your board shakes. This is not targeted interference. It is just consequence of Mudhull being Mudhull.

**The Tell:** A particular pattern of click-click through the dirt. The expert hangs their lips up in a grin. The Cameras may take note and change perspective.

**The Eye:** Mudhull lives fully in his own performance. Your existence only becomes relevant at the point of impact. If his Drop lands and you are still standing — still posing, unphased — one eye opens. He may have already started to celebrate. The Cameras catch the moment he reconsiders.

Being seen by Mudhull is its own metric.

---

### Your Pentagram

Your move surface is a pentagram. Your shimmering core sits at the center, connected to each of the five points.

**The five points are your slayy. identity.** For some they are moves or limbs. Others draw from stars or desserts. New performers bring things that have never been seen on stage. The system does not anticipate what arrives.

**Your core** is your color, your mood. It shimmers. If things become unstable — if a crossing threatens the Show's momentum — your core will remind you before the crowd notices. Losing your balance and tumbling off stage ends the Show. Everyone sees it happen.

---

### Making Moves

Moves are spatial and relational. Drag a point where and how you want. The move registers on release. **The move is the difference between where you started and where you let go** — not the destination, the delta. A tiny precise retraction reads completely differently from a sweeping drag across the stage.

**Connections:** Bump one point into another and retract slightly — those parts are now connected. The connection persists into the next Move. You can build off it. You must be careful crossing it with other things. Some crossings are bold. Some are catastrophic.

**The Beat:** Every few gestures, the Show takes a snapshot — a captured Pose. This is what accumulates. This is what the Cameras are building an impression from. This is what Mother is reacting to. You are not judged continuously. You are read at intervals. There is space between Beats for moves that are still becoming something.

---

### Show Structure

The Show escalates. Mudhull stomps harder and harder. The tremor increases. You are trying to build toward something impressive. He is trying to shake the Cameras loose from you entirely.

**A Show ends when:**
- The Cameras get bored
- The Cameras care too much about only one Dancer
- Someone falls off stage

**Repetition is not boring.** Beginning Pose 4 with the exact opening you used in Pose 1, then crossing twice at the end — that is a callback. The Cameras have memory. The crowd has memory. Mother has been waiting for this since Pose 1. The callback is proof you knew what you were doing all along.

**Recovery vs. Improv:** When Mudhull's Drop shakes your board, you can recover — find your way back to what you were building, the crowd respects the composure — or you can use the disruption, incorporate the chaos into the Pose. The improv outcome may score higher than an uninterrupted Pose would have. The Cameras are always looking for the Phoenix moment.

---

### Winning

If you out-pose Mudhull — if the Cameras cannot look away from you, if his premature celebration dies in his throat when he opens one eye and finds you still there — the Show ends in confession. The opponent tells you what they did.

We don't need to go into that yet.

---

### What's Built

- SVG pentagram with 5 draggable points, shimmering core, delta-based moves
- Connection system: bump points to link, crossing detection (bold vs catastrophic)
- Beat/Pose capture every N moves (escalating 3→7), with spread, symmetry, callback detection
- Recovery vs improv detection after Mudhull shakes
- Mudhull DOM character: body, eyes, grin, dust particles, rolling/dropping/celebrating animations
- Mudhull hybrid AI: real-time tells (click-click), Beat-synced drops, auto-resolve if player is slow
- The Eye mechanic: Mudhull opens one eye when player survives a drop
- Mudhull performs independently (rolls, tumbles, builds Camera score)
- 3 Cameras with interest tracking, repositioning with crowd energy surges
- Mother in crowd strip: visibility inversely tracks performance (buried = exceptional)
- Show escalation: opening → building → peak → finale, increasing tremor
- Three end conditions: bored (flat scores), fixated (all Cameras on one Dancer), fell off stage
- Audible + visible beat engine: kick/hat/snare pattern, BPM escalates with Show phase (85→138)
- Stage edge glow + bottom pulse on kicks, cam-tick dots on hats
- Audio toggle (starts muted), lazy-init on first interaction
- Entry via Hunter Encounter erratic ticker: random glitch window, "Mother?" full-screen prompt
- slayy. label overlays Hunter Encounter label; full name remains beneath
- Hub integration: hub:minimize, hub:color (255, 34, 102), scraggles on Show end / Camera reposition / Eye open

### What's Next

- Confession mechanic: lore layer, not yet specced — what did Mudhull do?
- Additional Dancers (slayy.hall, slayy.scream): awaiting design
- Mother as audience entity: possible future Local status
- Core color/mood integration with Hall baseline language
- Mobile responsive pass

### FPL Notes

- Location: `scores/slayy/index.html`
- Hidden score — no hub selection card, enters only through Hunter Encounter ticker
- Scraggle emission points: Show end, first Camera repositioning, Mudhull's eye opening

---

*Score Card updated March 26, 2026.*
