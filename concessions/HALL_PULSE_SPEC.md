# THE HALL PULSE
## Implementation Spec
*Fox & Claude — March 2026*

---

## What This Is

The Hall has a pulse. It runs at the highest layer — the hub — and makes moments available. Scores and entities that are listening and willing can take a pulse and do something appropriately scaled. The pulse does not command. It does not ask for a response. It makes a condition true and moves on.

This is not push notifications. A notification says *look at me.* The pulse is infrastructure. The Scraggles a Score emits afterward are exhaust — evidence that something ran, not an invitation addressed to the player. The Mall accessed its pretzel function. You caught the signal. Those are different things.

---

## The Principle (add to Architectural Principles in the design doc)

**Signals Are Exhaust, Not Invitations** — When a Score or entity acts on a pulse, any Scraggles it emits are evidence of that action, not messages directed at the player. The Mall ran its pretzel function. The player may observe this. The Mall did not do it for them.

---

## Implementation

### 1. Hub: The Pulse Emitter

Add a pulse interval to `index.html`. Fires every **45 seconds** (same cadence family as S.Mail watch — familiar rhythm, no new anxiety).

On each pulse, write to localStorage and fire a postMessage:

```javascript
// localStorage — for Scores that poll
localStorage.setItem('baseline-session/pulse', JSON.stringify({
  t: Date.now(),
  temperature: readTemperature()  // current RGB aggregate
}));

// postMessage — for the active Score in the frame
scoreFrame.contentWindow.postMessage({ type: 'hub:pulse', t: Date.now(), temperature: readTemperature() }, '*');
```

That is the entire pulse mechanism. One write, one message, every 45 seconds.

The hub does not track who received it. It does not wait for acknowledgment. It pulses.

---

### 2. Sunset Ridge Mall: Idle Listener

The Mall listens for the pulse and checks whether it has the floor — meaning: is the player idle?

**Idle condition:** No pointer/touch/keyboard input for the duration since the last pulse (i.e., one full pulse interval of silence).

**Implementation in `scores/sunset-ridge-mall/index.html`:**

```javascript
// Track last input time
let lastInput = Date.now();
['pointermove','pointerdown','keydown','touchstart'].forEach(e =>
  window.addEventListener(e, () => lastInput = Date.now(), { passive: true })
);

// Listen for pulse
window.addEventListener('message', (e) => {
  if (e.data?.type !== 'hub:pulse') return;
  
  const idleDuration = Date.now() - lastInput;
  const IDLE_THRESHOLD = 40_000; // ~40s — slightly under pulse interval
  
  if (idleDuration >= IDLE_THRESHOLD) {
    mallTakesTheFloor();
  }
});
```

**`mallTakesTheFloor()`** is deliberately left to the Mall to define and expand over time. It might:
- Resume a wandering camera through the current floor
- Run a shop restocking animation
- Trigger ambient customer logic
- Do something the Mall has always known how to do but hasn't had a moment for

The only requirement: if it does something that produces a Scraggle, that Scraggle is emitted normally via `window.parent.postMessage({ type: 'hub:scraggle', emoji: '...' }, '*')`. The hub does not need to know why.

**Returning player:** Any input event cancels the idle state and returns control. The Mall does not need to clean up gracefully — the player's return is the interrupt.

---

### 3. Hub Ambient: Feeling the Pulse

The hub itself can respond to its own pulse — not with drama, just with acknowledgment that something is still running.

On each pulse tick, the hub can:
- Briefly deepen the Temperature wash (a breath — 200ms fade up, 800ms fade down)
- If the ticker is visible, let it momentarily brighten

This is subtle. The player should not consciously notice the pulse — but over time they may notice the hub feels alive rather than idle.

```javascript
// In the pulse emitter, after writing localStorage:
hudBreath(); // small visual acknowledgment

function hudBreath() {
  const wash = document.getElementById('temperature-wash'); // existing element
  if (!wash) return;
  wash.style.transition = 'opacity 200ms ease-in';
  wash.style.opacity = String(parseFloat(wash.style.opacity || '0.08') + 0.04);
  setTimeout(() => {
    wash.style.transition = 'opacity 800ms ease-out';
    wash.style.opacity = String(parseFloat(wash.style.opacity) - 0.04);
  }, 200);
}
```

---

## What This Is Not

- Not a scheduler. The pulse does not coordinate Scores.
- Not a notification system. Nothing is addressed to the player.
- Not a requirement. A Score that never listens for the pulse is not broken.
- Not complete. This spec wires up two listeners (Mall, hub ambient). Other Scores and entities can attune to the pulse when the time is right. The architecture is open.

---

## File Touches

| File | Change |
|---|---|
| `index.html` | Add pulse interval, localStorage write, postMessage, `hudBreath()` |
| `scores/sunset-ridge-mall/index.html` | Add idle tracking, pulse listener, `mallTakesTheFloor()` stub |
| `concessions/Fixed_Point_Local_Design_Document_v0_995.md` | Add **Signals Are Exhaust, Not Invitations** to Architectural Principles |

---

## Implementation Order

1. Hub pulse emitter (localStorage + postMessage + hudBreath)
2. Verify pulse is visible in localStorage between scores
3. Mall idle listener + `mallTakesTheFloor()` stub (even if the stub just logs for now)
4. Design doc principle addition

One named piece at a time. Verify before moving.

---

*Part of Fixed Point Local. Spec authored March 2026.*
