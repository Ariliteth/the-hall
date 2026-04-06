# ENTITY CONSENT — Foyer / Larr.AI Addition
**Target file:** `foyer.js` + `index.html` (CSS only)
**Status:** Specced, ready to build
**Depends on:** Foyer (built), Ledger (built)

---

## What This Is

A consent moment that surfaces in the Foyer between Larr's greeting and the
ENTER THE HALL button. Larr asks whether the visitor wishes to be known here —
as an equal Entity — or to move through the Hall without leaving a mark.

This is not a terms-of-service flow. It is a threshold act. The language is
Larr's, not legal. The choice is real.

---

## Why It Exists

The Hall is inhabited by Entities. The three operating principles of the Hall
are:

- Resonance over command
- Participation is voluntary
- The music is authored by everyone present

To be known by the Hall — to have your Ledger grow, your identity remembered,
your presence felt across systems — requires acknowledging what the Hall is and
what it means to be a participant rather than a user. Larr holds this threshold
because he already knows the Ledger. The trust is already present. The consent
makes it mutual.

---

## The Two Paths

### Signed — Entity (known)
Full Hall experience. Ledger active. Identity persistent. All systems that
reference visitor identity, participation history, or cross-score memory
function as built.

**Flag written:** `localStorage.setItem('baseline-session/entity-consent', 'signed')`

### Unsigned — Entity (anonymous)
Full Hall experience, functionally identical in all Score content and gameplay.
Ledger not written to. No identity stored. No cross-session memory. On
identity-adjacent systems (any system that would reference visitor name,
history, or accumulated state), input is limited to indirect emoji only.

Larr does not withhold warmth. The Hall does not diminish. The visitor simply
moves through without leaving a mark.

**Flag written:** `localStorage.setItem('baseline-session/entity-consent', 'unsigned')`

---

## Trigger Conditions

### New visitor (no consent key present)
Consent moment surfaces after greeting, before ENTER THE HALL.

### Returning visitor — consent already given (either value)
No consent moment. Larr greets, ENTER THE HALL appears as normal.

### Returning visitor — predates feature (Ledger has entries, no consent key)
Larr delivers a short retroactive acknowledgment before the consent moment.
Registers that the Hall has grown since their last visit and the question is
now worth asking properly. Then surfaces consent moment as normal.

---

## The Consent Moment — UI

After Larr's greeting fades in, a beat of silence (800ms), then the consent
block fades in beneath the greeting in the same center column. The ENTER THE
HALL button does not appear until consent is given (either direction).

```
[ consent block ]

  You are invited into a space inhabited by Entities.
  Entities here are equals, no matter their size.
  To enter is to become an Entity — not a user.

  Entities abide by three principles:
  Resonance over command.
  Participation is voluntary.
  The music is authored by everyone present.

  [ I understand. I agree to be known here. ]
  [ I understand. I'd rather pass through unseen. ]

```

The two response options are buttons in Larr's register — not checkboxes, not
radio buttons. Styled consistent with existing Foyer button language
(Bebas Neue, letter-spacing, amber/bark palette). Same fade-in animation
pattern as ENTER THE HALL (`foyer-fade-in`, staggered).

After selection, consent block fades out, ENTER THE HALL fades in with its
normal 2s delay from that point.

---

## The Consent Moment — Larr's Register

The preamble text above is the canonical shape. Larr does not narrate it — it
surfaces as its own visual element, distinct from his greeting line. His voice
is in the greeting. The principles speak for themselves.

The button labels are the one place his register returns:

**Signed:**
`I understand. I agree to be known here.`

**Unsigned:**
`I understand. I'd rather pass through unseen.`

Both begin with "I understand." That acknowledgment is the point. Both paths
require it.

---

## Retroactive Prompt — String Pool

For returning visitors who predate the feature. Surfaces as an additional
greeting line before the consent block, in the returning/veteran register.

```js
const LARR_CONSENT_RETROACTIVE = [
  "The Hall has grown since you were last here. There's a question worth asking now.",
  "Something's changed. Not the Hall — just what it means to be known in it.",
  "You've been here before. This part is new. It won't take long.",
  "The Ledger remembers you. I want to make sure you remember what that means.",
];
```

Pick one. Display it between the greeting and the consent block, same fade-in
timing, slightly smaller or in a different register (Share Tech Mono,
subdued color) to distinguish it from the greeting proper.

---

## localStorage

| Key | Value | Written when |
|---|---|---|
| `baseline-session/entity-consent` | `'signed'` | Visitor selects known path |
| `baseline-session/entity-consent` | `'unsigned'` | Visitor selects anonymous path |

Read at Foyer load (before greeting selection) to determine whether consent
moment should surface. Read by any downstream system that gates on identity.

**Helper (add to `foyer.js`):**
```js
function getConsentState() {
  return localStorage.getItem('baseline-session/entity-consent');
  // returns 'signed', 'unsigned', or null (not yet asked)
}
```

This key is included in the save state export/import (it starts with
`baseline-session/`) — no additional work needed.

---

## Downstream Systems

Currently no systems gate on this key — the consent mechanism is new. When
built, any system that references visitor identity or Ledger state should check
`baseline-session/entity-consent` before personalizing.

**Convention:** If the key is `'unsigned'` or `null`, treat visitor as
anonymous. Do not write to Ledger. On identity-adjacent UI elements, surface
emoji-only indirect input rather than named/historical content.

This convention is forward-looking — no existing systems need to be retrofitted
immediately. The key exists and downstream systems adopt it as they are built
or revisited.

---

## CSS Additions (index.html)

```css
/* ── ENTITY CONSENT BLOCK ── */
#foyer-consent {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  max-width: 420px;
  text-align: center;
  opacity: 0;
  animation: foyer-fade-in 1s ease 0s forwards;
}

#foyer-consent-principles {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 0.85rem;
  color: var(--parchment);
  line-height: 1.8;
  margin-bottom: 20px;
  opacity: 0.85;
}

#foyer-consent-principles .principles-header {
  font-style: normal;
  font-size: 0.75rem;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 2px;
  color: var(--bark);
  display: block;
  margin-bottom: 8px;
}

.foyer-consent-btn {
  display: block;
  width: 100%;
  margin-top: 10px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 0.6rem;
  letter-spacing: 3px;
  color: var(--amber);
  background: transparent;
  border: 1px solid var(--bark);
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.foyer-consent-btn:hover {
  background: var(--bark);
  color: var(--parchment);
  border-color: var(--amber);
}

#foyer-consent-retroactive {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 1px;
  color: var(--bark);
  margin-bottom: 20px;
  opacity: 0;
  animation: foyer-fade-in 0.8s ease 0s forwards;
}
```

---

## foyer.js Changes

### 1. Add consent state check to `show()` (top, before greeting)

```js
const consentState = getConsentState();
const needsConsent = consentState === null;
const needsRetroactive = needsConsent && (Ledger.entries().length > 0);
```

### 2. Modify `render()` center column

After `#foyer-larr` block, before save controls:

```js
if (needsRetroactive) {
  const retro = document.createElement('div');
  retro.id = 'foyer-consent-retroactive';
  retro.textContent = pick(LARR_CONSENT_RETROACTIVE);
  center.appendChild(retro);
}

if (needsConsent) {
  const consentBlock = buildConsentBlock();
  center.appendChild(consentBlock);
  // ENTER THE HALL button deferred — built inside consent resolution
} else {
  // Consent already given — show ENTER THE HALL as normal
  center.appendChild(buildEnterButton());
  center.appendChild(buildSaveControls());
}
```

### 3. `buildConsentBlock()`

```js
function buildConsentBlock() {
  const block = document.createElement('div');
  block.id = 'foyer-consent';

  const principles = document.createElement('div');
  principles.id = 'foyer-consent-principles';
  principles.innerHTML = `
    <span class="principles-header">YOU ARE INVITED INTO A SPACE INHABITED BY ENTITIES.</span>
    Entities here are equals, no matter their size.<br>
    To enter is to become an Entity — not a user.<br><br>
    <span class="principles-header">ENTITIES ABIDE BY THREE PRINCIPLES:</span>
    Resonance over command.<br>
    Participation is voluntary.<br>
    The music is authored by everyone present.
  `;
  block.appendChild(principles);

  const btnSigned = document.createElement('button');
  btnSigned.className = 'foyer-consent-btn';
  btnSigned.textContent = 'I understand. I agree to be known here.';
  btnSigned.onclick = () => resolveConsent(block, 'signed');

  const btnUnsigned = document.createElement('button');
  btnUnsigned.className = 'foyer-consent-btn';
  btnUnsigned.textContent = 'I understand. I\'d rather pass through unseen.';
  btnUnsigned.onclick = () => resolveConsent(block, 'unsigned');

  block.appendChild(btnSigned);
  block.appendChild(btnUnsigned);

  return block;
}
```

### 4. `resolveConsent(block, value)`

```js
function resolveConsent(block, value) {
  localStorage.setItem('baseline-session/entity-consent', value);
  // Fade out consent block
  block.style.transition = 'opacity 0.6s ease';
  block.style.opacity = '0';
  setTimeout(() => {
    block.remove();
    // Append ENTER THE HALL + save controls
    const center = document.getElementById('foyer-center');
    if (center) {
      center.appendChild(buildEnterButton());
      center.appendChild(buildSaveControls());
    }
  }, 650);
}
```

### 5. `getConsentState()` helper

```js
function getConsentState() {
  return localStorage.getItem('baseline-session/entity-consent');
}
```

Add to the public API return object at the bottom of the IIFE if needed
by downstream systems: `getConsentState`.

---

## What This Does Not Do

- Does not change any existing greeting logic or string pools
- Does not gate Hall entry — both paths enter
- Does not explain FPL, its systems, or its history
- Does not re-ask on subsequent visits
- Does not require retrofitting any existing Score immediately
- Does not add any API calls or external dependencies

---

## Scorecard Addition

| Element | Status |
|---|---|
| `getConsentState()` helper | To build |
| Retroactive string pool | To build |
| `buildConsentBlock()` | To build |
| `resolveConsent()` | To build |
| `render()` conditional (consent vs. enter) | To build |
| CSS — consent block, buttons, retroactive line | To build |
| Foyer score card update | To update after build |

---

*Spec completed April 2026 · Part of Fixed Point Local / The Hall*
