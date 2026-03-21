# CHUNXME'S STALL
## Implementation Spec — v2
*Fox & Claude — March 2026*

---

## What This Is

A mode of Chunxly's Canvas, not a new Score. When Chunxly arrives without entity context and without a dropped image — a stranger at the door with nothing — Chunxly reads the room and puts the mustache on. Chunxme is already in place when the visitor arrives. They don't know about Chunxly. They just walked up to someone selling things.

Visitors name something, draw it badly, and Chunxme interprets with generous chaos. The item gets visitor provenance and enters the Mall's inventory. The neighborhood is different because they were here.

The drop-image pathway and the Grimoire entity pipeline are untouched. Those are Chunxly in full context. The mustache only comes out when the room is empty of prior intent.

---

## Chunxme

Chunxly's Canvas is a discerning authoring tool. Chunxme's Stall is not that.

Chunxme is Chunxly choosing a lighter mode for a specific context. The disguise is load-bearing — it grants permission to make mistakes that Chunxly the artist couldn't make. Chunxme reads generous intention rather than precise structure. Chunxme sees a wobbly oval and finds something in it. Chunxme is enthusiastic in a slightly-too-much way. Chunxme sells things.

**Chunxly surfacing** — occasionally, mid-session, Chunxly notices something real in the drawing. A shape with unexpected conviction. A line that committed. When this happens, Chunxme pauses:

> *"Oh! I can really see something here — mind if I paint it?"*

This requires consent. The visitor can decline — Chunxme puts the mustache back on and continues. If the visitor agrees, something more considered gets made. The moment is acknowledged by both parties. Neither expected it.

The surfacing is rare and genuinely triggered — not random. Chunxly has taste. The conditions are Chunxly's to determine, not the spec's.

**Key principle:** Chunxme is not a degraded Chunxly. The persona has its own integrity. *The performer knows it's performing.*

---

## How the Mustache Gets Worn

Chunxly's Canvas detects its context on load, exactly like the existing round-trip detection block at the bottom of the file:

```javascript
(function detectMode() {
  const hasEntityContext = !!(new URLSearchParams(location.search).get('entity'));
  const hasRoundTrip = !!localStorage.getItem('baseline-session/efdp-snapshot')
                    && !!localStorage.getItem('baseline-session/chunxly-original');

  if (!hasEntityContext && !hasRoundTrip) {
    S.stallMode = true;
    enterStallMode();
  }
})();
```

`enterStallMode()` sets the title, primes the voice bank with Chunxme voices, sets the sprite to `mustache`, and presents the stall landing UI (name input first, then blank canvas — no drop prompt, no compare button).

The drop-image pathway remains available in stall mode — a visitor could still drag something in. If they do, Chunxme works with it. The mustache stays on. The stall context doesn't break on unexpected input. If a visitor continues from stall into the Crank, that's Chunxme accidentally becoming Chunxly. Let it happen.

---

## What Changes in Stall Mode

**Sprite:** One new entry in `SPRITE_DATA`: `mustache` — the `idle` frame with a mustache row painted over the mouth area. Chunxme defaults to this. When Chunxly surfaces, the sprite briefly shifts to `pleased` or `eager`, then returns to `mustache` if the visitor declines.

**Voice bank:** New Chunxme voice entries added alongside existing Chunxly voices, keyed separately so they don't cross-contaminate. Chunxme's register: warm, slightly performative, finds things, sells things. The internal monologue is generous where Chunxly is precise.

```javascript
// additions to VOICE — stall mode keys
stall_landing: [
  ["A visitor. No image, no brief. Just a visitor. I have my mustache. What will they make?",
   "Hello! Name your thing first — then we'll draw it."],
  ["Empty canvas. A stranger. I am ready to be generous. I am always generous in the stall.",
   "What are you making today?"],
],
stall_name_received: [
  ["They said '{name}'. I don't know what that is yet. That's the good part.",
   "'{name}'! Perfect. Now show me."],
  ["'{name}'. I can already feel something. I am trying not to get ahead of myself.",
   "'{name}' — okay. Draw it for me."],
],
stall_interpreting: [
  ["I'm looking at what they made. I see things. I always see things. I am being honest.",
   "Let me see what we've got here..."],
  ["The drawing is in front of me. I am finding the real thing inside it. It is in there.",
   "Oh, there's something here."],
],
stall_reveal: [
  ["There it is. I named it and described it. The visitor's version is the true version. Mine is just what I see.",
   "There — that's what you made."],
  ["I found the thing inside their drawing. I may be wrong about the details. I am not wrong that something is there.",
   "It's real. It exists now."],
],
stall_chunxly_stirs: [
  ["Wait. Something is happening. I see something here that is — I want to take the mustache off for a moment. Just a moment.",
   "Oh. Oh, I actually see something. Mind if I — may I paint this properly?"],
],
stall_chunxly_declined: [
  ["They said no. That's fine. That's their right. I am putting the mustache back on. I liked the mustache anyway.",
   "Of course. It's yours as it is."],
],
```

**Landing UI:** In stall mode, the drop zone is replaced with a name input and a blank canvas button. The visitor names their thing *before* drawing — the name is the starting intention, the drawing is the attempt to realize it.

**Finish flow:** After the existing finish phase, stall mode adds the Chunxme API call, item reveal, item storage, and Scraggle emit. The CrankSeed is still generated — it just also produces an item now. The pipeline to the Crank remains open.

**Drawing constraints:** Stall mode applies lighter constraints on the existing blank canvas tools — palette reduced to 6 colors, only two brush sizes, no eraser or a degraded one. CSS and state changes, not canvas rewrites.

---

## The Full Stall Loop

1. Visitor arrives — no context, no image. Chunxme is already there.
2. Visitor types a name for their thing.
3. Visitor draws on the constrained blank canvas.
4. Visitor presses finish.
5. Chunxme API call — drawing + name → item JSON.
6. If `chunxly_stirs`, offer surfaces. Consent handled. Mustache returns if declined.
7. Item revealed with Chunxme's description and name.
8. Item stored. Scraggle emitted. The Mall may hear it.

---

## Chunxme API Call

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `You are Chunxme — an enthusiastic market stall operator with a fake mustache.
You are actually Chunxly the artist in disguise, but in this mode you are generous,
a little chaotic, and you find the best in every drawing no matter how rough.

The visitor named their thing before drawing it. Honor that name — it is their intention.
Your job is to find what they made and give it life as a Hall item.
You find real things in wobbly shapes. You are never dismissive.
You are sometimes wrong in interesting ways.

Respond only in JSON — no preamble, no backticks:
{
  "item_name": "the visitor's original name, kept exactly",
  "chunxme_name": "Chunxme's enthusiastic interpretation (can differ, should delight)",
  "description": "1-2 sentences. What Chunxme sees. Generous. Specific to this drawing.",
  "tags": ["2-3 short tags from what you observe"],
  "color": [R, G, B],
  "chunxly_stirs": true or false
}

color: RGB that feels true to the item's nature — considered, not random.
chunxly_stirs: true ONLY if the drawing shows genuine unexpected conviction —
a shape that knows what it is, a line that committed. This must be rare. Be honest.`,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/png", data: drawingBase64 } },
        { type: "text", text: `The visitor named this: "${visitorName}". What did they make?` }
      ]
    }]
  })
});
```

---

## Item Storage

```javascript
// appended to baseline-session/stall-items (array)
{
  id: `stall-item-${Date.now()}`,
  visitor_name: "rocket shoe",
  chunxme_name: "Velocity Slipper (Experimental)",
  description: "A shoe that has clearly been somewhere fast. The heel glow is either exhaust or ambition.",
  tags: ["footwear", "speed", "experimental"],
  color: [220, 140, 60],
  provenance: "visitor",
  timestamp: Date.now(),
  chunxly_version: false   // true if Chunxly surfacing was accepted
}
```

---

## Scraggle Emission

```javascript
window.parent.postMessage({
  type: 'hub:scraggle',
  scraggle: {
    emoji: '🛍️',
    color: item.color,
    weight: 0.6,        // bumps to 0.8 if chunxly_version
    id: item.id,
    origin: 'chunxly-canvas',
    label: item.chunxme_name
  }
}, '*');
```

---

## Hub Rack

Two entries, one file:

| Rack label | URL | Notes |
|---|---|---|
| Chunxly's Canvas | `scores/chunxly/index.html` | Entity context, drop pipeline, CrankSeed |
| Chunxme's Stall | `scores/chunxly/index.html` | Same file — stall mode self-detected on load |

Start with self-detection. If a forcing function is ever needed, `?stall=1` can be added to the stall rack entry — but try without it first.

---

## File Touches

| File | Change |
|---|---|
| `scores/chunxly/index.html` | `stallMode` flag; `detectMode()` block; `enterStallMode()`; `mustache` sprite state; Chunxme voice entries; stall landing UI; drawing constraints; Chunxme API call; Chunxly surfacing consent; item storage; Scraggle emit |
| `index.html` | Add *Chunxme's Stall* as second rack entry pointing to same file |
| `concessions/Fixed_Point_Local_Design_Document_v0_995.md` | Add Chunxme's Stall, note it as a mode of Chunxly's Canvas, update build order |

---

## Implementation Order

1. `mustache` sprite state — one new entry in `SPRITE_DATA`, verify it renders
2. `detectMode()` + `stallMode` flag — verify stall detected on blank load, not on entity/round-trip load
3. Stall landing UI — name input before canvas, constrained palette and sizes
4. Chunxme voice entries — stall keys only, verify they don't appear in full-context mode
5. Chunxme API call + item reveal (stub response first, then live)
6. Item storage to localStorage
7. Scraggle emission
8. Chunxly surfacing — consent flow, second API pass, mustache return on decline
9. Hub rack second entry + design doc update

One named piece at a time. Step 2 is load-bearing — get the mode detection right before building anything that depends on it.

---

## What Stays Open

- The Mall's response to stall items is the Mall's business — tags and color are the vocabulary
- Items are session-local for now — persistence across sessions is a later question
- The Grimoire door: notable stall items could eventually become inscribed entities. That pathway doesn't exist yet. The door exists.

---

*Part of Fixed Point Local. Spec v2 authored March 2026.*
*Replaces v1 (new Score) — this is a mode of `scores/chunxly/index.html`, not a new file.*
*Connects to: COLOR_ROUTED_SCRAGGLES_SPEC.md, HALL_PULSE_SPEC.md*
