# ANTEROOM — ONE VOICE IN THE DARK

*Fox & Claude — April 7, 2026*

---

## What the anteroom currently does

Entities from the Hall cross the canvas on purposeful paths — color washes, glyphs, names. The Third's scan sweeps once warm across the floor, then settles into a slow pulse. "YOU ARE HERE" sits lower-right, rotated, almost illegible. "ENTER" appears after four seconds, ghost-white at the bottom. The visitor can tap through immediately once ENTER is visible.

The system is working. The experience is not landing.

---

## Why it doesn't land

The anteroom attends to the visitor. Nothing in the anteroom makes the visitor feel attended to. The walkers are on their own paths. The Third's pulse is ambient. The text is geographic, not relational. A visitor who doesn't already understand the Hall encounters pure darkness with a whispered button, and taps through.

The anteroom was meant to prepare you to arrive. It currently functions as a loading screen with aesthetics.

---

## The intervention: one line, once, only here

Before ENTER appears, the anteroom speaks once. A single line surfaces on the canvas — not UI, not ticker, not label. Text that belongs to this space and no other.

It arrives quietly. It addresses no one directly. It is something the Hall says to the dark that you happen to overhear. Then it fades. Then ENTER comes.

This is the minimum intervention. One considered thing.

---

## The line

```
something is already here
```

Lowercase. No punctuation. No star prefix. It is not a ticker message. It does not perform. It observes.

It is true of the walkers, true of the Third, true of the Hall's memory. It reframes the darkness from empty to inhabited without explaining itself.

---

## Timing

```
0:00   — anteroom opens, canvas begins, Third's scan starts
0:00   — walkers begin spawning per mood
2:50   — scan completes, grid settles into pulse
3:20   — the line begins fading in (1.5s fade)
4:80   — the line holds (~1s)
5:80   — the line begins fading out (1.5s fade)
5:80   — ENTER timer fires (shifted from current 4000ms to 5800ms)
7:30   — line fully faded, ENTER visible
```

The line and ENTER must not overlap. ENTER arriving into the silence left by the line is the beat.

---

## Rendering

The line renders **on the canvas itself**, not as a DOM element. This keeps it in the anteroom's visual layer — subject to the same darkness, the same grain, not floating above it. No DOM element to clean up, no z-index interaction.

**Position:** Horizontal center, vertical center of the canvas or slightly above. Not near "YOU ARE HERE" — they must not compete. YOU ARE HERE is a floor marking. The line is something different.

**Font:** `Share Tech Mono`, consistent with anteroom typography.

**Size:** Slightly larger than YOU ARE HERE but still restrained. A murmur, not a headline. Approximately `0.7rem` equivalent at canvas scale.

**Color:** `rgba(212, 200, 168, alpha)` — the bone/warm tone at low peak opacity (~0.35). It should feel found, not placed.

**Fade:** In and out via canvas alpha, driven by `linePhase` state. Not CSS.

---

## Implementation

Add the following state to `anteroomState`:

```javascript
anteroomState.linePhase = null;  // null | 'in' | 'hold' | 'out' | 'done'
anteroomState.lineAlpha = 0;
anteroomState.lineStart = null;
```

Inside `anteroomInit`, add a timer after the scan window:

```javascript
setTimeout(() => {
  anteroomState.linePhase = 'in';
  anteroomState.lineStart = performance.now();
}, 3200);
```

Inside `anteroomDraw`, after existing draw calls, add:

```javascript
// — Anteroom voice —
if (anteroomState.linePhase && anteroomState.linePhase !== 'done') {
  const elapsed = (performance.now() - anteroomState.lineStart) / 1000;
  const FADE_DUR = 1.5;
  const HOLD_DUR = 1.0;

  if (anteroomState.linePhase === 'in') {
    anteroomState.lineAlpha = Math.min(1, elapsed / FADE_DUR);
    if (elapsed >= FADE_DUR) {
      anteroomState.linePhase = 'hold';
      anteroomState.lineStart = performance.now();
    }
  } else if (anteroomState.linePhase === 'hold') {
    anteroomState.lineAlpha = 1;
    if (elapsed >= HOLD_DUR) {
      anteroomState.linePhase = 'out';
      anteroomState.lineStart = performance.now();
    }
  } else if (anteroomState.linePhase === 'out') {
    anteroomState.lineAlpha = Math.max(0, 1 - elapsed / FADE_DUR);
    if (elapsed >= FADE_DUR) {
      anteroomState.linePhase = 'done';
      anteroomState.lineAlpha = 0;
    }
  }

  if (anteroomState.lineAlpha > 0) {
    const peakOpacity = 0.35;
    ctx.save();
    ctx.font = `11px 'Share Tech Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(212, 200, 168, ${anteroomState.lineAlpha * peakOpacity})`;
    ctx.fillText('something is already here', W / 2, H * 0.44);
    ctx.restore();
  }
}
```

Shift the ENTER timer from `4000` to `5800`:

```javascript
setTimeout(() => {
  document.getElementById('anteroom-enter').classList.add('visible');
}, 5800);
```

Inside `anteroomShow` (return-visit re-entry), reset line state so the voice speaks each visit:

```javascript
anteroomState.linePhase = null;
anteroomState.lineAlpha = 0;
anteroomState.lineStart = null;
```

And add the re-trigger timer inside `anteroomShow`'s restart block:

```javascript
setTimeout(() => {
  anteroomState.linePhase = 'in';
  anteroomState.lineStart = performance.now();
}, 3200);
```

---

## What this does

A visitor who taps ENTER immediately will miss the line entirely. That's fine — the anteroom does not demand attention. A visitor who pauses for five seconds will catch the line surfacing. The moment of coincidence — *I happened to be here when it said something* — is the anteroom doing its job.

Familiars will know to wait. New visitors might, once. That's enough.

---

## What this does not do

- Does not explain the anteroom
- Does not greet or address the visitor directly
- Does not add navigation, buttons, or UI chrome
- Does not appear anywhere else in the Hall
- Does not loop or repeat within a single anteroom visit
- Does not prevent or delay the visitor from proceeding

---

## Only file touched

`index.html` — anteroomState initialization, anteroomDraw, anteroomInit timer, anteroomShow reset, ENTER timer value.

No other files. No new files.

---

*The anteroom has been attended to before. It just hadn't been spoken to yet.*
