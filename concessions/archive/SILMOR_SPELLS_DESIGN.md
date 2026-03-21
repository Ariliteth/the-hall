# SILMOR SPELLS
*a roguelike about being the bridge*

> Predecessor concept: `concessions/MUSH_DESIGN.md` (historical)
> Score: `scores/silmor-spells/index.html`

---

## The Fantasy

You are the only one in the room who speaks both languages. The Boss sees numbers.
SILMOR sees emoji and speaks words. You see everything but control nothing cleanly.
You roll dice, fill slots, and hope the gamble lands. SILMOR watches what you place
and gets excited when she recognizes a pattern — a spell. Her excitement is real
information, not flavor.

---

## Three Roles

- **The Boss** — sees only the numbers on your dice. Needs the total to exceed a
  threshold. Does not care about emoji. Pixel sprite bureaucrat with glasses,
  tie, and clipboard. Nods when you pass, frowns when you fall short, gets
  jealous when SILMOR's spells do all the work.
- **You** — speak emoji, roll dice, fill slots via FIFO tap selection. You see both
  emoji and numbers. You choose which dice to roll and when to commit.
- **SILMOR** — speaks words, knows secret spells (emoji combinations). Cannot hand
  you the answer but gets visibly excited when you're close. She is the primordial
  Clippy — a pixel sprite with a wand, cycling between expressions and thought
  bubbles in her own cadence.

---

## Core Mechanics

### Dice & Slots
- Player has a dice bag (starts with 4x d4, each with 4 emoji faces)
- Each face has both an emoji and a number value
- Tap a die key to roll it into the FIFO slot queue (3 slots)
- Newest roll pushes oldest out if queue is full
- SILMOR reacts in real-time as the slot contents change

### The Commit Gamble
- Committing resolves each slot sequentially (500ms stagger, left to right)
- Each die has a 50/50 chance to **hold** (keep face) or **shift** (change to a
  different face on the same die)
- Shift always picks a DIFFERENT face — never the same one
- High rolls are risky (can only shift down), low rolls are favorable (can shift up)
- Visual: held slots get green border, shifted slots get amber with faded old emoji
- Dice visually "cast" from bag to slots before resolution (see Visual Characters)

### Spells
- Each section has a secret spell — a combination of emoji faces
- SILMOR watches slots and reacts at 4 levels:
  - **Level 0** (no match): "SILMOR studies the mold."
  - **Level 1** (1 match): "SILMOR murmurs to herself." + vocabulary word
  - **Level 2** (2 matches): "SILMOR leans toward you." + urgent speech
  - **Level 3** (full match): "SILMOR is vibrating." + "YES!! CAST IT!!"
- Matching uses multiset logic (handles duplicate emoji correctly)
- **Cast Spell** button appears at level 3 — commits with NO gamble, auto-satisfies
  the boss regardless of number total. Golden slots.
- After cast: "SILMOR beams. Perfect."
- **Secret spell roll**: dice are secretly rolled on spell cast. If the total also
  beats the boss's threshold, SILMOR acknowledges it: "...and the numbers were
  there too." Boss goes impressed. Total shown as subtle bonus text.

### Boss Jealousy
- `S.boss.spellStreak` tracks consecutive spell casts within a document
- Streak 1: boss nods (normal acknowledgment)
- Streak 2: suspicious — "Another spell." (adjusts glasses)
- Streak 3+: jealous — "She's doing all the work." (crosses arms, background tints)
- Any gamble commit resets streak to 0, boss returns to neutral
- `impressed` expression (from secret beat) takes priority over jealousy
- Streak resets on new document but persists across rows within a document

### SILMOR's Vocabulary
- Each section generates a fresh emoji-to-word mapping
- Words are consistent within a section (same emoji = same word every time)
- This lets the player deduce which emoji SILMOR is excited about through the FIFO

---

## The Dungeon: Documents

A dungeon is a **document**. You transcribe it one row at a time — 3+ sections
(levels) per document. What you committed sits visible above, like a page of
translated text. You wrote that. For better or worse.

### Document Completion Bonus
When a document is finished, SILMOR reads what you wrote and learns from patterns:

- **Positional patterns**: same emoji in the same slot across multiple rows
  (e.g. mushroom in slot 1 for all 3 lines → mushroom gets +1)
- **Adjacency patterns**: two emoji next to each other on multiple rows
  (e.g. mushroom and wave adjacent on 2 lines → new spell or combo for SILMOR)

The spells emerge from the work itself. SILMOR doesn't learn from a skill tree.
She learns from reading what you wrote.

---

## Email Interludes

Between documents, before the next one arrives, you respond to **emails**.

- Each email is a single emoji prompt, looking for a specific face from one of
  your dice
- You just roll, hoping to match. No slots, no strategy — just hope
- If you **don't** match: the conversation emoji **swaps** with whatever you rolled.
  That face on your die is now the email's emoji, and your old face is gone.
- This happens for a few exchanges before the next document arrives

### Design Intent
Email swaps are not punishment. They are the world talking back. Your dice absorb
the conversation whether you cleared it or not. Contact leaves residue. This is the
same logic as SILMOR's panic-learning — she sees a new emoji and scrambles to find
a word for it. Your dice see a new conversation and absorb its vocabulary.

The player who enters a document with `mushroom frog wave moon` may leave the emails
with `mushroom flower wave moon` — and that flower might be exactly what SILMOR needs
for a spell in the next document. The failure gave you something.

---

## Visual Characters

### SILMOR (bottom of screen)
- Canvas pixel sprite: PX=5, 16x16 logical grid, 80x80px rendered
- Pointed hat, round face, robe body, arm reaching to wand with star tip
- 9 expression variants: neutral, blink, murmur, excited, vibrate, beam,
  held, wince, exhale
- Features: blush when excited, wand sparkles when vibrating/beaming
- Layout: canvas LEFT, bubble RIGHT — she looks up at the document from below
- Squiggly red "...oh" annotation near failed gambles

### The Boss (top of screen)
- Same canvas grid (PX=5, 16x16, 80x80px). Own palette (`BOSS_C`): grey hair,
  blue-grey glasses, red tie, grey jacket, clipboard in hand
- 7 expressions: neutral, blink, nod (3-frame head dip via yOff), frown,
  impressed (wide eyes + smile), suspicious (narrowed eyes), jealous
  (narrowed eyes + blush + tight mouth)
- Layout: bubble LEFT, canvas RIGHT — reversed from SILMOR, boss faces down
  at the document from above. Document sandwiched between authority and helper.
- Boss threshold ("needs > X") lives in his thought bubble — it's literally
  what he's thinking. Running total stays below slots (that's what *you* see).
- Background tints on jealousy (red) and suspicion (grey)

### Shared Animation
- Single 10fps `setInterval` drives both `silmorAnim.tick()` and `bossAnim.tick()`
- Each anim object tracks its own `baseExpr`, `blinkTimer`, and pose-specific
  timers (SILMOR: `vibTimer`; Boss: `nodTimer`)
- Blink fires randomly at ~1.5% per tick for both characters

### Dice Casting Animation
- Web Animations API (`element.animate()`) with `getBoundingClientRect()`
- Temporary fixed-position emoji `<div>`s fly from dice bag to slots in
  `#cast-overlay` (pointer-events: none, z-index: 100)
- **Spell cast**: all 3 fly simultaneously (~400ms), golden glow filter,
  small ✦ trail particles
- **Gamble cast**: staggered (150ms apart, ~350ms each)
- Both commit paths are async — `animateDiceCast(mode)` returns a Promise

---

## Future / Open

- **Crit-to-learn**: rolling max face on a die gives SILMOR a chance to learn
  a new emoji. Lower dice = easier crits = encourages using smaller dice to teach.
- **Dice growth** (implemented via email explosion): When a die with an existing
  attachment matches the same emoji again, a secret roll happens. If the secret
  roll does NOT land on that emoji, the die explodes — gains 2 new faces of that
  emoji (d4→d6→d8...). The inversion means early explosions are likely (~75% on
  d4) but taper as the die fills with that face (~50% on d6, ~37% on d8). The die
  settles into what it's becoming. Bigger dice = more faces = harder to NOT match =
  harder crits = tension between power and teaching.
- **Boss attention / distraction**: The boss can see the board. He silently
  compares your running total to his threshold during the selecting phase —
  reacting, mumbling, emoting as he watches. Sometimes he turns his back or
  leaves a cardboard cut-out of himself while he plays golf. When he can't see,
  it's harder for him to catch mistakes — you might get advantage on gamble rolls
  (higher hold probability). His attention level becomes a game variable.
- **SILMOR gets spooked**: After a few documents of heavy boss attention, SILMOR
  suggests splitting — maybe she's seen a new job posting, maybe she thinks you
  two need to move on. If the player agrees, you get a new boss with new
  interests (different threshold patterns, personality, tolerance for magic).
  SILMOR stays. The boss changes. The dynamic resets but SILMOR carries her
  accumulated spell memory and wand magic forward.
- **Boss anger accumulation**: failures stack toward "fired / SILMOR deleted" —
  the pressure that makes spells matter.
- **EFDP crossover**: maze diffusion generating spell patterns or evolving
  SILMOR's animation frames.
- **Document-as-dungeon scroll**: committed rows stay visible, ambient decoration,
  the page grows downward as you work.
- **SILMOR's old spell memory**: `S.oldSpells` accumulates across documents.
  She remembers what she's cast before. What she does with that memory is open.
- **SILMOR's wand**: When an email swap removes a face that had an attachment,
  SILMOR catches the orphaned magic. She migrates it to another die with that face
  if possible; otherwise she absorbs it into her wand. The wand accumulates magic
  over a full run. Future: at run end, the wand is imbued with its collected magic.
  New runs could let SILMOR (or the player) choose a wand from her collection —
  each carrying the residue of a past run's email conversations.
- **SILMOR's personal business**: When the player is idle too long or repeating
  the same action, SILMOR stops paying attention and tends to her own affairs —
  shuffling notes, examining her wand, staring into middle distance. She stops
  responding to slot changes during this time. Breaking your pattern (rolling a
  different die, waiting, or doing something unexpected) snaps her back.
  "Oh — sorry. I was somewhere else."

---

## Technical

- Single HTML file: `scores/silmor-spells/index.html` (~2080 lines)
- Vanilla JS, no build step (Hall convention)
- State object `S` holds all game state, including `S.boss` (status, speech, spellStreak)
- Hub integration: `postMessage({ type: 'hub:minimize' })` on load
- Canvas rendering: `imageSmoothingEnabled = false`, `image-rendering: pixelated`
- Two sprite canvases sharing one `setInterval` at 10fps
- Async commit flow: `animateDiceCast()` returns Promise, commit functions chain `.then()`
- Web Animations API for dice flight (no external dependencies)

---

*SILMOR SPELLS. She watches you work. She knows things she can't say clearly.
Her excitement is the only honest signal in the room.*
