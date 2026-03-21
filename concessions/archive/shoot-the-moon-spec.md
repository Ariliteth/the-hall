# Shoot the Moon
### Design Specification — Fixed Point Local

---

## Overview

Shoot the Moon is a standalone HTML game that lives within the Fixed Point Local ecosystem. It is self-contained by default and requires no prior knowledge of FPL to play, but is designed to accept FPL context gracefully — neighborhood pilots, entity identities, and flavor vocabularies can be introduced without architectural changes.

The game's central thesis: the correct move is visible and available from the first moment. Everything that follows is the player talking themselves out of it. The game does not judge this. It accommodates it completely.

---

## Core Loop

The player sees a moon and a rocket. Text says: **Shoot the Moon.**

Tapping the moon fires the rocket. There is a small honest chance it falls short — not as punishment, but as reality. It drifts back down gently. The moon is still there. Try again, or start wondering about the rocket.

If the player taps the rocket before shooting, they have chosen to tinker. The full system opens from there. The game never closes this door again — once tinkering has begun, all consequences flow from decisions made.

---

## Phases

### Phase 1 — Pristine

The opening state. Moon above. Rocket below. Instruction text reads *Shoot the Moon. it's right there.*

The rocket is present but quiet. Tapping the moon fires it directly. No other UI is visible.

**Miss chance:** approximately 35% on an untinkered shot. The rocket rises, slows, runs out of conviction, and glides back. A quiet note appears: *it almost made it. try again whenever.* Nothing else changes.

### Phase 2 — Tinkering

Triggered the first time the player taps their rocket. The instruction text fades. The ground line appears. Two side elements emerge after a short delay: the **Part Vendor** (left) and the **Lunch button** (right).

Once tinkering has begun, tapping the moon no longer fires automatically. Instead the rocket rises partway, stalls, and returns. This is the stall — a gentle reminder that things have gotten more complicated. It carries no penalty.

### Phase 3 — Rivals

The first time the player adds a label to their rocket, **Pell** walks in from the side and sets up next to them. Pell's rocket receives a copy of whatever labels the player has, plus one extra. Pell sneers.

After enough total labels have accumulated (suggested threshold: 5), **Corvus** arrives. Corvus's rocket is synthesized — labels drawn from both the player's rocket and Pell's, blended. A quiet notice appears: *things are getting complicated.* The scene zooms out slightly to accommodate.

Additional rivals beyond two are left open for future expansion, particularly for neighborhood-specific pilots.

### Phase 4 — Launch

Launch is triggered by the **Lunch button**, not by tapping the moon. This is intentional. The moon tap is a personal act; launch is a collective one. When the player is ready — or decides they are — they press Lunch and everyone goes.

All rockets fire simultaneously with slight staggered offsets. Their trajectories are determined by their accumulated physics stats. Some may hit the moon. Some may overshoot and continue past. Some may collide with each other mid-flight. The moon receives whatever comes.

---

## Physics System

Each label carries real numeric values across five axes. These stack additively.

| Axis | Effect |
|---|---|
| **Thrust** | Raw power. Higher thrust = faster, farther. Too much without confidence = overshoot. |
| **Wobble** | Trajectory instability. Adds lateral drift and spiral. Can be reduced below zero (stabilizing). |
| **Confidence** | Commitment to path. Low confidence introduces drift and hesitation. High confidence locks trajectory. |
| **Magnetism** | Pull toward the moon. Stacks across all rockets and affects the moon's visible behavior. |
| **Drag** | Atmospheric resistance. Negative drag (streamlining) improves efficiency; positive drag slows and destabilizes. |

### Derived Outcomes

**Underpowered:** low thrust, no labels — may fall short. The miss chance on an untinkered shot reflects this baseline.

**Overshoot:** high thrust + low confidence — rocket commits fully but overshoots the moon and continues past it. If thrust is high enough, it passes the moon entirely. Things beyond the moon are a future design space.

**Spiral:** high wobble + low confidence — corkscrews on the way up. Entertaining. Unlikely to hit.

**Locked:** high confidence + high magnetism — clean arc directly to target.

**Collision:** two rockets with conflicting trajectories (opposing wobble directions, offset timing) may intersect mid-flight. Collision produces a flash and affects both paths.

### Moon Response to Magnetism

Total magnetism across all rockets is tracked as a single accumulating value. As it rises:

- The moon's glow intensifies
- The moon begins to lean toward the side with higher magnetic concentration
- Above a threshold, the moon enters a subtle nervous state — a slow sway, a slight recoil
- The moon is patient but not indifferent. It has been here before

---

## Labels

Labels are the player's primary vocabulary for modifying rockets. They have two registers: the text (evocative, slightly absurd, internally consistent) and the effect (real physics values that stack).

### Sample Labels

| Label | Primary Effect |
|---|---|
| +20% juice | high thrust |
| +10% secondary wobble | adds wobble |
| enhanced thrust vibes | moderate thrust + small wobble + small confidence |
| +15% existential confidence | high confidence, reduces wobble |
| aerodynamic probably | reduces wobble and drag |
| bonus shimmer | small boost across all axes |
| +8% meaningful velocity | moderate thrust + small confidence |
| structural integrity (vibes) | reduces wobble, adds confidence |
| +12% moon magnetism | high magnetism |
| certified galaxy brain | moderate thrust + high confidence + magnetism |
| optimistic trajectory | thrust + confidence + magnetism |
| turbo (probably) | very high thrust, adds wobble, reduces confidence |

Labels are drawn from a shared pool. Once a label has been applied anywhere, it is no longer available. This creates natural scarcity as the session progresses.

### Stacking

Labels stack without limit. A rocket with five juice labels has very high thrust. A rocket with five wobble labels corkscrews dramatically. This is intended. The game does not warn the player. It simply reflects their choices.

---

## The Rivals

Rivals are not adversaries. They are companions who showed up because the player created conditions for them to exist. They are enthusiastic about rockets. The sneer is nerves, or showing off. By the time there are three rockets covered in labels, nobody is racing. Everyone is just here.

### Rival Behavior

When the player adds a label to their own rocket, each existing rival adds one label to theirs in response (drawn from the remaining pool). When the player adds a label to a rival's rocket, the rival adds a label to the player's in return.

If no labels remain, the rival says something quietly deflated instead of sneering. This is the end of the label economy, not a failure state.

### Sneer Vocabulary

Rivals speak in short lines. Tone: competitive confidence shading into something more uncertain as the session deepens. Examples:

- *heh, I'll win.*
- *mine is better. obviously.*
- *bold choice. bold.*
- *sure. sure sure sure.*
- *thought so.* (when no labels remain to counter with)
- *heh, yeah.* (same)

Rival dialogue is a first-class design surface. Neighborhood pilots brought into the game should speak in their own voice — Chunxly would not sneer the way Pell sneers.

---

## The Part Vendor

Appears on the left side of the screen shortly after tinkering begins. Represented by a simple glyph (🧰 or equivalent). Has a recommendation.

Tapping the vendor applies their gadget to the player's rocket and, at the vendor's discretion, to one or more other rockets present. The vendor is not neutral — they have opinions about which rockets deserve the upgrade. They refresh with a new recommendation after each application.

Vendor gadgets follow the same physics axis structure as labels. They tend toward interesting combinations: high magnetism, wobble dampening, mystery effects. They are not clearly better than labels — just different, and arrived at differently.

### Vendor Lines

Short, understated. *got something for you. fresh in. trust me on this one. anything else?*

---

## The Lunch Button

Appears on the right side of the screen several seconds after tinkering begins. Very quiet — dim, easy to miss. Does nothing until pressed.

When pressed: everyone launches. This is the collective act. The player did not have to do this. They also did not have to do any of the rest of it.

The name is intentional and not explained.

---

## The Moon

The moon is present throughout. It breathes — a slow, subtle scale pulse, continuous from the start. It is not decorative.

As magnetism accumulates across the launchpad, the moon responds:

- Glow intensifies proportionally
- Leans toward the side with greater magnetic concentration
- Enters a nervous state (gentle sway) when rocket count or total magnetism exceeds a threshold
- Returns to calm if rockets are launched or removed

When hit, the moon receives a bandage. It asks: **nice** or **sorry.** Either resets the game cleanly. The moon does not hold it against you. It was always going to be okay.

---

## The Stall

When tinkering is active and the player taps the moon, their rocket rises partway, loses momentum, and drifts back down. This is not a punishment. It is the game being honest about what tinkering means.

The stall uses a gentle drift path with slight lateral movement. A quiet note appears briefly. The rocket lands softly. Nothing is reset. The player can try again immediately, add more labels, or press Lunch.

The stall is also the discovery moment for first-time players who shoot without tinkering, miss, and wonder what happened. The rocket went up. It came back. The rocket is still there.

---

## Launch Sequence

All present rockets fire with slight staggered timing. Each follows a trajectory derived from its accumulated physics stats:

- High thrust + high confidence: clean arc to moon or beyond
- High wobble: spiral path, collision-prone
- High magnetism: pulled toward center, more reliable impact
- Low everything: may fall short
- Massive thrust: overshoots, continues past moon into open sky

Rockets can collide mid-flight. Collision produces a visual flash and alters both trajectories. Whether this is desirable is entirely a function of the player's label choices.

After all rockets have resolved, the moon responds. If it was hit, the bandage appears and the nice/sorry choice is offered. If no rockets hit (all overshot or fell short), the moon is simply still there. The player can try again, or they can sit with what they built.

---

## The Moon Choice

After a hit, the screen dims and the moon appears large with its bandage. Two buttons: **nice** and **sorry.**

Both reset the game. The choice is purely expressive. The moon appreciates it either way.

---

## FPL Integration Notes

Shoot the Moon is a standalone HTML file and requires no FPL context to function. When FPL context is available, the following integrations are natural extension points:

**Neighborhood pilots as rivals.** Instead of generic Pell and Corvus, a rival slot can be filled by a named FPL entity brought in from a neighborhood. The entity brings its own sneer vocabulary, its own label preferences (a Kitchendom entity might prefer flavor-coded labels; Chunxly might suggest labels about the rocket's inner life), and its own visual identity.

**Flavor vocabularies.** Labels are currently physics-first with evocative names. Neighborhoods could introduce label sets that use their own language — culinary terms from Kitchendom, correspondence metaphors from MUSH. The physics values remain consistent; only the text and color change.

**Pilot identity.** The player's rocket could optionally carry a pilot identity drawn from their FPL profile — affecting default label affinity, sneer responses from rivals, and possibly the vendor's recommendations.

**Beyond the moon.** High-thrust overshoot currently sends rockets past the moon and off-screen. This is a designed door. What exists past the moon is a future question — potentially other neighborhoods, other destinations, other games. The launch is always available. Nobody has to go anywhere. But if you try, there might be something further out.

---

## What This Is Not

Shoot the Moon is not a game about winning. There is no score. There is no failure state. There is no timer.

It is a game about the moment before you do the simple thing, and everything that can happen in that moment if you let it.

The moon is patient. It will be there whenever you're ready.

---

*Spec authored during travel. Prototype: three iterations in HTML/JS. Ready for Code.*
