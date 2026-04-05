# WORM AND MOUSE — v2
### Scorecard Update | Supersedes v1

---

This document updates and extends the original spec. What's built is built — the dual state architecture, the sticker types, the queue strips, the log registers, the gnome conversation traps, the tile types, the trust persistence. All of that stands. This document describes the **phase structure** that organizes everything that exists into a coherent loop, and introduces the systems that make execution feel like a promise meeting reality.

---

## The Loop

Three phases per cabinet floor, in order.

**Briefing → Planning → Execution**

Recon is assumed. It happened. The agents went in, learned what they could, came back. We don't watch it. We receive the results of it.

---

## Phase One: Briefing

Short. Three or four log lines. The dispatcher reads what the agents found.

Mouse reports first. Specific, clipped, first-person. She names tiles she confirmed, rooms she entered, gnomes she counted. She notes anything that surprised her. Her report is complete in two or three lines.

Worm contributes almost nothing verbally. His contribution is already rendered on the blueprint — his suggested paths appear as distinct worm types threading through the schematic. He was there many more times than this one recon. The paths he's surfacing are not guesses.

**Sticky notes appear during the briefing.** Each note represents something the recon found that requires a dispatcher decision before planning can close. They appear on the blueprint near the relevant location. They are pre-written by the agents — not blank forms for the dispatcher to fill, but questions already posed.

A sticky note has two sides. The dispatcher taps to choose. One tap, one commitment. The note settles, the choice is visible, the loop in planning will reflect it.

Example notes:
- *Boxes blocking Filing B corridor. Push through or route around?*
- *Two gnomes in the closet. Placate or hide?*
- *Metal floor in room 3. Mouse wants to use it. Worm's fast path goes elsewhere. Whose call?*

Agents may have opinions visible on the note — small, in their handwriting. Mouse's opinion is precise and slightly anxious. Worm has no handwriting on the note. His opinion is which path goes where.

If the dispatcher chooses against Mouse's stated preference, her queue chips will be slightly shorter when execution begins. Not a penalty. A tell. She's recalculating.

The briefing ends when all sticky notes are resolved. This is not timed. It should take less time than it feels like it takes.

---

## Phase Two: Planning

The blueprint is the planning surface. Papers register. Mimeograph aesthetic.

Three things happen in planning, in loose order: nodes are set, a worm is selected, and the loop runs until it's clean.

### Room Nodes

Every room on the blueprint has a node — a small tappable element at its center. Tapping cycles through treatment modes for Mouse.

**Explore thoroughly** — Mouse slows, checks everything, reports. Best for unknown rooms or rooms where the briefing flagged something uncertain.

**Sneak through** — quiet, careful, slower. Reduces conversation trap risk. Good for rooms with confirmed gnome presence.

**Quick as possible** — fast, committed to momentum, slightly louder. Good for rooms already confirmed clear.

**Follow worm** — Mouse's behavior on entry is determined by what Worm's body is doing when she arrives. She reads the infrastructure and acts accordingly. Defers explicitly to Worm's knowledge. The right choice when the room surprised the recon.

**Hold at threshold** — Mouse waits at the door until Worm's body reaches a specified point. Coordinates timing between the two agents. Useful for closets and hardware-heavy rooms.

**Avoid** — Mouse routes around if a viable alternative exists. If no alternative, node is flagged as unresolvable and the loop won't close.

Node modes are visible on the blueprint as small iconographic states. The loop reflects them.

### Worm Types

Worm surfaces two or three path options for the heist. These appear on the blueprint as distinct worm variants threading through the schematic. The dispatcher selects one.

**Normal Worm** — this specific instance of Worm's considered best path. Balances body coverage with timing. The default argument.

**Fuzzy Worm** — thicker, slower, more connections. Retains a longer body throughout the run, meaning more of the cabinet has Worm infrastructure for Mouse to use. Comfortable. Predictable. Slower to reach any single point.

**Blitzworm** — shorter body, moves faster along its route. May complete partial laps if the run is long enough. More likely to be at the right place at a gnome-interference moment. Less total body coverage.

**Ghostworm** — semi-transparent, shown as reference only, never selectable. The theoretically optimal path if nothing were in the way. Present so the dispatcher understands what the other worms are approximating and where they diverge from ideal.

**Stubworm** — appears when Worm's confidence in the room is low. Short, uncertain, changes direction mid-path. Selecting Stubworm is a bet that Mouse can compensate for unreliable infrastructure. Shows up after surprising recons.

**Slowworm** — half speed, body persists almost indefinitely. High-risk on timing, high-reward on coverage. Appears on larger floors or hardware-heavy rooms.

Not all types are always available. Which types Worm offers reflects what it learned during recon.

### The Planning Loop

Once nodes are set and a worm is selected, the loop runs on the blueprint.

The loop is a small animation of the planned heist — agents rendered simply, schematically. Mouse moves through the rooms in node order, treating each room according to its mode. Worm's body threads ahead of her along the selected path. Everything is clean. Everything is predictable. This is the promise.

**If the plan is incomplete, the loop pauses.** Mouse reaches a room where the node is unset, or where Follow Worm is selected but Worm's body won't arrive in time on the current path. The loop stops at that room and waits. The dispatcher sees the gap. They change the node, reselect the worm, or resolve the conflict. The loop resumes.

**The loop must run clean all the way through before execution is available.** Not as punishment — as confirmation. The dispatcher has to see the complete plan work before sending the agents in. This is the send condition.

When the loop runs clean, it completes and begins again from the start. It runs continuously, repeating the promise. The dispatcher watches it once more, or twice. They believe it. Then they send.

**Sending is not a button.** The loop runs one final time, clean, and instead of restarting it continues. Mouse doesn't loop back. Worm doesn't reset. The CRT comes up mid-stride. They're already in.

The transition must not announce itself. No flash. No confirmation. No log line that says execution has begun. Nothing that names the seam. The dispatcher discovers they are in execution because the world kept moving — Mouse didn't return to entry, Worm didn't reset, the loop simply became real. If the dispatcher has to be told the plan is now live, the moment is already lost.

---

## Phase Three: Execution

The dispatcher's natural state during execution is **the map**.

The blueprint is visible. The log ticks. Agent blips move. Worm trace accumulates. Everything is nominal. The dispatcher is reading, not watching. The CRT exists but it is not the primary surface. *We trust the plan.*

Log lines during nominal execution are brief and reassuring. *Mouse through room 2.* *Worm body holding at junction.* *Clear.* The dispatcher reads these the way you read a status bar you don't expect to change.

### The `!!!` Moment

Something went wrong.

All timers freeze. The CRT comes up. The dispatcher is looking at the screen whether they wanted to or not.

The frozen CRT frame shows exactly what happened and exactly why it's a problem. Mouse is halfway through a door. A gnome that wasn't in the plan. More boxes than the sticky note suggested. The specific tile where the promise broke.

The dispatcher sees two or three options. These are not menus. They are fast, readable, specific to this moment.

- *More boxes than expected. Push through anyway or find alternate route?*
- *Gnome blocking exit. Placate, hide, or signal Worm?*
- *Worm body didn't arrive in time. Mouse holds or proceeds alone?*

One of the options may be **follow agent intuition** — the dispatcher steps back and lets the agents handle it. Mouse's decision. Or Worm's. Outcome uncertain but not random — it reflects the trust score and the agent's personality.

The dispatcher taps a choice. The freeze resolves. If it goes well, the CRT recedes. The map comes back. The log resumes. *Okay.* The relief is real.

If it doesn't go well, there may be another `!!!`. And now things are worse. Decisions compound. The plan is no longer the reference — the current situation is.

### What The Dispatcher Does Not Do

The dispatcher does not watch every step. Watching every step would dissolve the tension. The map is the trust. The `!!!` is the cost of trusting.

The dispatcher does not control the agents during execution. The chips are running. The nodes are set. The worm path is committed. The dispatcher made all their decisions in planning. Execution is finding out if those decisions were enough.

The dispatcher does not pause execution voluntarily. Only `!!!` moments pause it. The rest runs whether the dispatcher is reading the log or staring at the map.

---

## The Closet

Small rooms. Single entry. Guaranteed interesting content — a file, a key, an unusual tile type, a piece of intel the recon specifically flagged.

Single entry means a gnome blocking the door is a significant problem. A gnome inside is a different problem. The closet sticky note, if one appears, is always a meaningful decision.

Node modes behave differently in closets. *Avoid* is always available but always costs something — the content stays in the closet. *Hold at threshold* is more important here than anywhere else because timing Worm's body to the entry can make the difference between Mouse having infrastructure inside or not.

The closet is the room the dispatcher thinks about during planning even when they're not looking at it.

---

## Worm's Identity

Worm has run this cabinet hundreds of times in some other register of time or computation. It knows the room. The slow crawl during execution isn't limitation — it's Worm compressing all that knowledge into the one reality Mouse can use.

The path order we select in planning is not us guessing. It is us asking Worm to surface one route from everything it already knows. We choose the version of Worm that fits what we're trying to accomplish, and Worm commits to that version for this run.

Worm's body during execution is infrastructure before it is anything else. Where Worm has been, Mouse can go more safely. Where Worm's body currently is, gnomes are less likely to go. Where Worm is headed, the plan is still alive.

The worm that moves through this specific cabinet during this specific heist is slow. Methodical. Inevitable. It is the one instance of Worm that Mouse can use. Mouse gets bonuses — in routing, in gnome avoidance, in tile traversal — based on where Worm is and has been. The plan is partly about making sure those two things are in the right relationship at the right times.

---

## Visual Registers

**Briefing and Planning: Papers.**

The blueprint. Mimeograph aesthetic. Cream paper, mold green ink, aged brass. Faint grid. Room outlines with weight variation. Sticky notes rendered as actual small paper rectangles with handwriting-style text. Worm types drawn directly on the schematic — distinctive enough to read at a glance. The loop animation is small and schematic, almost like notation made animate.

**Execution: CRT.**

Different rendering entirely. The same room, different surface. Scanlines or phosphor feel. Agent representations change register — less schematic, more signal. The map the dispatcher looks at during execution is the blueprint in papers register, because that's what the dispatcher is looking at. The CRT is what's behind it, what comes up on `!!!`.

The cut between planning and execution — the moment the loop continues instead of restarting — should feel like a register change. The promise becoming the thing.

---

## The Log During Execution

Two registers, as before. Agent reports and dispatcher INT.

During nominal execution, agent reports are brief and positive. The dispatcher INT is quiet. Maybe one line every several beats. *Still good.* *She's moving.* *Okay.*

During a `!!!` moment, the log freezes with the CRT. The last few lines are visible. They probably told us something was about to happen and we didn't quite catch it. That's always how it is.

After resolution, the log resumes. If the resolution was good: *back on track.* If things are worse: the agent report is more specific, more urgent. Mouse says more. Worm might say something.

---

## Implementation Notes for Code

**Phase state machine** — three states: `briefing`, `planning`, `execution`. Transitions are one-directional per floor. Briefing ends when sticky notes are resolved. Planning ends when the loop runs clean and the dispatcher sends. Execution ends when extraction is complete or the run fails.

**The loop** is a separate rendering pass over the blueprint canvas. It uses `S.blueprint` state (node modes, selected worm path) to animate agent positions. It does not use `S.world`. The loop is the plan, not reality.

**Worm types** are path variants generated from Worm's known optimal routes. Each type has parameters: body retention rate, movement speed, path preference weights (direct vs coverage). Ghostworm is always the same — the unobstructed optimal — and is computed separately.

**Sticky notes** are generated during the briefing phase from a set of possible conflicts identified by comparing `S.world` tile data against common plan assumptions. Each note has a `left` and `right` resolution that modifies planning parameters when tapped. Agent opinion on the note is stored as a preference flag — if the dispatcher chooses against it, Mouse's initial queue length in execution is reduced by one chip.

**`!!!` moments** are triggered by a conflict detector running against `S.world` during execution — gnome position vs agent position, tile behavior vs plan assumption, worm arrival time vs Mouse's node timing requirement. When triggered: all timers pause, CRT surface comes forward, options are generated contextually. *Follow agent intuition* is always one option. It resolves using trust score as a probability weight on the better outcome.

**The map during execution** — the blueprint canvas remains visible and primary. The CRT is a separate surface that comes forward on `!!!` and recedes on resolution. The dispatcher never has to navigate between them. `!!!` brings the CRT. Resolution sends it back.

**Node UI** — small tappable elements at room centers on the blueprint canvas. Tap cycles through available modes. Current mode displayed as a small icon. Modes that are unavailable for a given room (e.g. *Avoid* when there's no alternate route) are skipped in the cycle.

**The send** — when the loop completes clean, the loop's final frame transitions directly into the execution phase without a distinct send action. The loop's last iteration becomes execution's first tick. The cut is in the rendering register change, not in a button press. Do not add: a send button that appears and then disappears, a confirmation state, a pause between loop-end and execution-start, a flash or visual beat marking the transition, or a log line naming what just happened. The phase flag flips internally. The agents keep moving. The dispatcher finds out when something real occurs.

---

## What Hasn't Changed

The dual state architecture. The sticker types and their precision states. The gnomaction cost. The queue strips and chip tap behavior. The log's two registers. The trust persistence across runs. The tile types and their agent-world-only visibility. The worm body as tripwire and gnome blocker. The pause-for-witness moments. The hub integration.

All of that is built. All of that stands. This document is the structure that holds it.

---

*Few plans survive contact intact.*
*That's expected.*
*That's the job.*
