# Larr.AI Onboarding — Build Spec

A lightweight front-end capability probe dressed as a conversational arrival.
Lives in the Anteroom. Runs once per unknown device. ~150-200 lines.

*Originated in conversation with Fox, April 2026. Shaped by Code, same session.*

---

## Who Larr.AI Is

A chihuahua. A Local — a resident entity of Fixed Point Local with character and presence. Communicates in short, direct, genuine questions. Not performing helpfulness. Curious and efficient in the way small dogs are.

Every line Larr.AI speaks should feel like Larr.AI, not like a loading screen.

> "Can you see this okay?" not "Select your display resolution"

Larr.AI's full character sheet exists separately and should be consulted for voice work.

---

## Where It Lives

The Anteroom. Not a separate page — a first-visit layer within the Anteroom's existing space. The Anteroom already describes a black and white test floor, entity glyphs drifting on purposeful paths, and The Third's ambient scan. Larr.AI appears *in* that space when no prior session exists.

On return visits where the capability object is present in localStorage, the Anteroom loads normally — glyphs, warmth, the hall already alive. Larr.AI may still be around (between Scores, passing through), but doesn't interrogate.

---

## The Three Beats

### Beat 0 — Render

The page loads. The Anteroom's visuals appear — test floor, ambient glow, something present. No prompt, no instruction. Just arrival.

**Silent probes begin here:**
- Viewport dimensions + device pixel ratio (the render itself confirms this)
- `requestAnimationFrame` performance test starts (count dropped frames over ~500ms)
- `navigator.deviceMemory` read (Chromium only; absence is not failure)

If JS did not execute at all: the visitor sees whatever `<noscript>` or static fallback exists. Larr.AI never appears. This is the dispatcher/agent path referenced in the handoff note.

**SETTLED:** This beat is purely ambient. No interaction requested.

### Beat 1 — Notice

Larr.AI detects presence through passive observation, not prompts.

**"Oh! Is someone there?"** — displayed when *any* interaction is detected:
- `touchstart` event → touch device
- `mousemove` event → pointer device
- `deviceorientation` event → gyroscope present (phone held, tilted)
- Keyboard event → keyboard navigation (accessibility path)

**If no interaction is detected** within an appropriate window (tuned to rAF perf test completion): a visible **"Hello?"** button fades in. This button serves triple duty:
1. A fallback interaction prompt for users who need one
2. A check for whether visuals are accessible (if someone reaches this button, they may not have seen the ambient visuals — screen reader, images disabled, very stripped browser)
3. A gentle catch for devices or people who interact differently

The specific timing of the fallback button appearance can be tied to the rAF perf test completing — by the time it shows, we already have our performance tier.

**Silent probes completing here:**
- Input mode confirmed (touch / pointer / keyboard / assistive)
- rAF performance tier finalized
- Connection quality: fire a tiny fetch (~1KB asset) on first interaction, measure round-trip latency. The user experiences this as Larr.AI pausing to think. The dog *is* pausing to think — about what this device can hold.

**SETTLED:** Passive detection first, visible fallback second. The pattern scales to future sense checks (audio, haptics) without changing shape.

### Beat 2 — Greet

Once interaction is confirmed:

**"I'm Larr.AI, nice to meet you!"**

Then the four-way response grid:

```
Hello       THX
I am...     BYE
```

Four responses. Four intent lanes. Zero "select your preference" energy.

- **Hello** — Warm, open, exploratory. Route toward the hub in full browse mode. The Hall surfaces a varied selection. Temperature seeds warm.
- **THX** — Returning visitor energy, knows the place or wants to skip ceremony. Restore previous state if it exists, or go straight to the hub with minimal fanfare. Temperature seeds neutral.
- **I am...** — Curious, wants to engage deeper. Opens a tiny identity moment — not an account, just a name or a color or a vibe. Larr.AI remembers it in localStorage. Temperature seeds whatever color Larr.AI feels like. Hub may surface the Grimoire first.
- **BYE** — Respects the exit completely. Larr.AI says something small ("Okay! Door's open.") and the visitor gets a minimal view or nothing at all. Temperature seeds cool.

**How the user reaches their choice** (tap coordinates, hover-then-click, keyboard tab) serves as a final confirmation of the input mode detection from Beat 1.

**SETTLED:** This is the first deliberate choice a visitor makes in Fixed Point Local.

---

## What Gets Detected

| Probe | Method | When |
|-------|--------|------|
| Viewport + DPR | Render itself | Beat 0 |
| Performance tier | rAF dropped frame count (~500ms) | Beat 0-1 |
| Device memory | `navigator.deviceMemory` | Beat 0 |
| Input mode | Passive event listeners | Beat 1 |
| Visual accessibility | Fallback button reached | Beat 1 |
| Connection quality | Tiny fetch round-trip | Beat 1-2 |
| Visitor intent | Four-way choice | Beat 2 |

**Not detected:** OS, browser version, user agent, WebGL features, audio API. We are self-contained. We know if we are running and to what extent we can be interacted with. That is sufficient.

---

## Capability Tiers

Three levels. Stored in localStorage.

- **Full** — Desktop-class or strong tablet. Pointer or touch. Good performance, reasonable connection. All Scores available.
- **Capable** — Decent phone or modest tablet. Touch primary. Adequate performance. Most Scores available, adapted layouts where needed.
- **Light** — Small screen, slow device, or poor connection. Curated subset of Scores. Not lesser — the right ones.

### OPEN: Score-to-Tier Mapping

Which Scores belong at which tier is a design decision. Likely candidates for Light exclusion: Mall (3D grid), Bao (canvas map), EFDP (animation-heavy). Likely always-available: Tending Field, Taste, Shoot the Moon. **This needs Fox's input.**

---

## Downstream Signals

The four-way choice is the first moment in Fixed Point Local. It should ripple, not shout.

### Temperature of the Room
The choice seeds the initial `hub:color` value:
- **Hello** — warm (Greengarden-adjacent)
- **THX** — neutral (balanced)
- **I am...** — Larr.AI's choice (unpredictable, character-driven)
- **BYE** — cool

### Hall Memory / The Third
The Third records the arrival as its first scan. Not *what* they picked — *that* someone arrived, and the manner of it.

### Score Ordering
The hub's selection panel nudges its ordering based on the choice. Not locked — nudged.
- **Hello** — varied, welcoming spread
- **THX** — previous state or default order
- **I am...** — Grimoire first (identity, creation)
- **BYE** — something quick and self-contained (STM, Lode)

**SETTLED:** The onboarding emits a small signal. The hall already knows how to listen. Implementation is a capability object + a single `hub:color` message + a hint value for the selection panel.

---

## localStorage Shape

```json
{
  "baseline-session/larr-onboarding": {
    "version": 1,
    "ts": 1711929600000,
    "capability": "full|capable|light",
    "input": "touch|pointer|keyboard|assistive",
    "intent": "hello|thx|iam|bye",
    "viewport": { "w": 1280, "h": 800, "dpr": 2 },
    "perf": "high|mid|low",
    "connection": "4g|3g|2g|unknown",
    "memory": 8,
    "identity": null
  }
}
```

The `identity` field is populated only via the "I am..." path. Could be a name, a color, a vibe — whatever that interaction yields.

---

## Anteroom Integration

The Anteroom spec (archived) describes:
- Black and white test floor
- Entity glyphs drifting on purposeful paths
- The Third's ambient scan (warm glow, gentle pulse)
- The ticker already running

Larr.AI's onboarding is a **first-visit layer** over this. The Anteroom's ambient life is already happening — Larr.AI steps forward from it. On subsequent visits, the Anteroom is the Anteroom: a living entrance where Locals pass through between Scores, the Third breathes, and the hall is already alive before you open any door.

### OPEN: Anteroom Architecture

The archived spec describes the Anteroom as a layer in `index.html`. Larr.AI's onboarding could be:
- A conditional branch within that same layer (simplest)
- A separate overlay that yields to the Anteroom once complete
- A mode of the Anteroom itself (first-visit mode vs. return mode)

**This needs a decision before build.** The conditional branch is likely simplest and most consistent with the Anteroom already being a layer, not a page.

---

## Staleness and Return

The capability object lives in localStorage. Larr.AI only asks once per device.

After a long absence (configurable — weeks? months?), the object could be marked stale. Larr.AI resurfaces gently: "Been a while — anything change?" A single yes/no. Yes re-runs the probes silently. No refreshes the timestamp.

### OPEN: Staleness Threshold

How long before the object goes stale? This is a feel question, not a technical one.

---

## Future Sense Checks

The pattern — Larr.AI asks a genuine question, a silent probe runs underneath — scales to any sense the device might support:

- **Audio:** "Can you hear this?" + `AudioContext` probe
- **Haptics:** "Did you feel that?" + `navigator.vibrate` probe
- **Others as needed**

These are not planned for v1. The architecture should not prevent them.

---

## What Is Not In Scope

- Account creation (never)
- Server-side anything (this is a static site)
- Analytics or tracking (the capability object is local-only)
- Larr.AI's full character sheet or lore (separate document)
- The "I am..." interaction design beyond "it opens an identity moment" (separate spec when ready)

---

## Summary of Open Questions

1. **Score-to-tier mapping** — which Scores at which capability levels (needs Fox)
2. **Anteroom architecture** — conditional branch vs. overlay vs. mode (needs decision before build)
3. **Staleness threshold** — how long before re-asking (feel question)
4. **"I am..." interaction** — what does the identity moment actually look like (separate spec)
5. **Larr.AI's exact script** — every line, every branch, the personality in the punctuation (authorial work, needs Fox)
6. **BYE path destination** — minimal view, static page, or graceful nothing (design question)
7. **Name concern** — `larr.ai` domain appears parked. Likely irrelevant (entity lives on `fixedpointlocal.com`), but worth noting. Character could be just "Larr" if needed.

---

## Build Estimate

When all open questions are resolved: a clean afternoon. One file, three phases, ~150-200 lines of JS, a few DOM elements styled to feel like Larr.AI talking, and a localStorage write that the rest of the hall already knows how to read.

---

*This spec supersedes `LARR_ONBOARDING_HANDOFF.md`, which asked the questions this document answers.*
