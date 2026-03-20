# COLOR-ROUTED SCRAGGLES
## Implementation Spec
*Fox & Claude — March 2026*

*Builds on: HALL_PULSE_SPEC.md — read that first.*

---

## What This Is

Scraggles already travel without mandatory receivers. This spec gives them a color position and a weight — so what they reach is determined by their nature, not by address. A deep blue entity doesn't hear a bright red Scraggle. Not because it was filtered out. Because it genuinely wouldn't.

Importance adds reach. Color determines direction. Everything is honest about what it is.

---

## The Extended Scraggle Format

Current Scraggle format (unchanged, still valid):
```json
"🥨"
```

Extended Scraggle format (optional fields — old Scraggles without them behave exactly as before):
```json
{
  "emoji": "🥨",
  "color": [185, 95, 45],
  "weight": 1.0,
  "id": "mall-pretzel-001",
  "origin": "sunset-ridge-mall"
}
```

**Fields:**
- `emoji` — the signal, as always
- `color` — RGB position of the sender on the Color Canvas. Defaults to neighborhood color of origin if omitted. If no neighborhood is known, defaults to Temperature of the Room at time of emission.
- `weight` — importance, 0.0 to 1.0. Determines reach (how far from the sender's color position the Scraggle propagates) and persistence (how many pulse cycles it re-emits). Defaults to 0.5 if omitted.
- `id` — unique identifier, used to track re-emission cycles and prevent duplicate processing. `origin-emoji-timestamp` is fine.
- `origin` — which Score or entity emitted it. Optional but useful.

**Nothing breaks.** A plain emoji string in the scraggles array is still valid. Receivers that don't understand the extended format ignore the extra fields. The hub handles both gracefully.

---

## Color Reach: The Propagation Model

A Scraggle's reach is determined by two things: its `weight` and the color distance between the Scraggle and the potential receiver.

**Color distance** is Euclidean distance in RGB space, normalized to 0.0–1.0:
```javascript
function colorDistance(a, b) {
  return Math.sqrt(
    Math.pow(a[0]-b[0], 2) +
    Math.pow(a[1]-b[1], 2) +
    Math.pow(a[2]-b[2], 2)
  ) / 441.67; // max possible distance (√(255²×3))
}
```

**Reach radius** = `weight` mapped to color distance. A weight of 1.0 reaches everything within distance 1.0 (the entire canvas). A weight of 0.1 reaches only very close colors.

```javascript
function scraggleReaches(scraggle, receiverColor) {
  if (!scraggle.color || !scraggle.weight) return true; // legacy format — always reaches
  const dist = colorDistance(scraggle.color, receiverColor);
  return dist <= scraggle.weight;
}
```

This is the EFDP diffusion model as math. High weight = wide flood. Low weight = local pool. The physics already existed — this borrows them.

---

## Persistence: Re-emission on Pulse

Important Scraggles (weight > 0.5) re-emit on subsequent pulse cycles with decaying weight. They say what they have to say, then get quieter.

**Re-emission logic in the hub** (runs on each `hub:pulse`):

```javascript
function processPersistentScraggles() {
  const scraggles = JSON.parse(localStorage.getItem('baseline-session/scraggles') || '[]');
  const persistent = JSON.parse(localStorage.getItem('baseline-session/persistent-scraggles') || '[]');
  
  const stillActive = [];
  
  for (const s of persistent) {
    if (typeof s === 'string') continue; // legacy, skip
    
    s.weight = s.weight * 0.6; // decay per pulse cycle
    s.pulseCount = (s.pulseCount || 0) + 1;
    
    if (s.weight >= 0.15 && s.pulseCount <= 4) {
      // Re-emit into scraggles with current (decayed) weight
      scraggles.push({ ...s, reemit: true });
      stillActive.push(s);
    }
    // Below threshold or too many cycles: Scraggle is done. It said what it had to say.
  }
  
  localStorage.setItem('baseline-session/scraggles', JSON.stringify(scraggles.slice(-24))); // keep last 24
  localStorage.setItem('baseline-session/persistent-scraggles', JSON.stringify(stillActive));
}
```

**Enrolling a Scraggle for persistence** — a Score emits a persistent Scraggle by including `weight > 0.5` and a unique `id`. The hub detects this on receipt and adds it to `baseline-session/persistent-scraggles`:

```javascript
// In hub's scraggle receiver (hub:scraggle postMessage handler)
if (s.weight > 0.5 && s.id) {
  const persistent = JSON.parse(localStorage.getItem('baseline-session/persistent-scraggles') || '[]');
  if (!persistent.find(p => p.id === s.id)) {
    persistent.push({ ...s, pulseCount: 0 });
    localStorage.setItem('baseline-session/persistent-scraggles', JSON.stringify(persistent));
  }
}
```

---

## Receiver-Side: Color Filtering

Any Score or entity that wants to filter incoming Scraggles by color reach can do so. This is opt-in. Receivers that don't filter see all Scraggles as before.

**Pattern for a receiver with a known color position:**

```javascript
const MY_COLOR = [45, 90, 180]; // this Score's or entity's color position
const PULSE_INTERVAL = 3000; // existing Scraggle poll interval

function getRelevantScraggles() {
  const all = JSON.parse(localStorage.getItem('baseline-session/scraggles') || '[]');
  return all.filter(s => scraggleReaches(s, MY_COLOR));
}
```

A Score deep in blue listens to all Scraggles that reach its color position. A very local, low-weight Scraggle from a neighboring blue Score arrives. A bright red Scraggle at weight 0.3 does not. A bright red Scraggle at weight 0.9 does — importance overcomes distance, but only just.

---

## The Mall as Dynamic Listener

The Mall, now listening for pulses during any Score, can also listen for Scraggles that reach its color position — and act on what it hears.

**Example: Moon opens in the Mall**

When Shoot the Moon emits a notable Scraggle (say, on a successful shot — weight 0.75, color near Shoot the Moon's canvas position), the Mall's color-aware listener may receive it. If it does, `mallTakesTheFloor()` (or a new `mallRespondsToScraggle(s)`) can decide what to do — create a new store, stock a new item, do nothing. The Mall decides.

The player, mid-game in Shoot the Moon, may later see: 🏪

That Scraggle is not addressed to them. The Mall opened a store. They caught the exhaust.

**This is the Cross-Score Item Pipeline's nervous system.** Items and events from Scores don't need a direct pipe to the Mall — they emit Scraggles with color and weight, and the Mall hears what reaches it.

---

## EFDP Visualization (Optional Listener)

EFDP can optionally render active Scraggle propagation as a live diffusion — showing how far a Scraggle's color is currently reaching across the canvas. This is one listener among many. EFDP does not need to be open for routing to work.

**When EFDP opts in:**

On receiving `hub:pulse`, EFDP checks `baseline-session/persistent-scraggles` for any active entries. For each, it places a temporary pin at the Scraggle's color position with strength proportional to current weight, runs a single-layer diffusion pass, and renders the reach as a faint overlay. This is not interactive — it's a witness view. A live picture of what is currently resonating through the Hall.

This could be a toggle within EFDP: *Show active Scraggle field.* Off by default. Available to anyone who knows to look.

---

## New Principle (add to Architectural Principles in the design doc)

**Color Is Proximity, Reach Is Honesty** — A Scraggle travels as far as its nature allows. Weight adds reach; color determines direction. An entity deep in one color does not hear a distant color's quiet signal — not because it was excluded, but because it genuinely wouldn't. Everything declares its own importance. No voice drowns out another by force, only by reach.

---

## File Touches

| File | Change |
|---|---|
| `index.html` | Extended Scraggle format support in receiver; persistent Scraggle storage; `processPersistentScraggles()` on each pulse; `scraggleReaches()` utility |
| `scores/sunset-ridge-mall/index.html` | Color-aware Scraggle listener; `mallRespondsToScraggle(s)` stub alongside existing `mallTakesTheFloor()` |
| `scores/efdp/index.html` | Optional pulse listener; persistent Scraggle overlay toggle; single-layer witness diffusion pass |
| `concessions/Fixed_Point_Local_Design_Document_v0_995.md` | Add **Color Is Proximity, Reach Is Honesty** to Architectural Principles |

---

## Implementation Order

1. Extended Scraggle format support in hub (backward compatible — verify old Scraggles still work)
2. `scraggleReaches()` utility — test with a few color pairs before wiring anywhere
3. Persistent Scraggle storage and pulse re-emission with decay
4. Mall color-aware listener + `mallRespondsToScraggle()` stub
5. EFDP witness overlay (last — optional, verify pulse and routing work first)
6. Design doc principle addition

One named piece at a time. Verify before moving.

---

## What Stays Open

- What the Mall actually does with a Scraggle is the Mall's business. The stub is a door.
- Per-entity color differentiation (entities having their own color rather than neighborhood default) is already in the build order under *After that*. When that lands, receiver-side filtering becomes genuinely individual rather than neighborhood-wide.
- The blank nametag and microGPT instances connect here eventually — a Theme with its own color position, listening to only what reaches it.

---

*Part of Fixed Point Local. Spec authored March 2026.*
*Builds on HALL_PULSE_SPEC.md.*
