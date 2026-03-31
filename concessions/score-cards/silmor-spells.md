# SILMOR Spells
**Location:** `scores/silmor-spells/` | **Status:** Active
**Neighborhood:** None | **Stack:** Vanilla JS (~2,900 lines)

## Current State
Roguelike about being the bridge between emoji and word. Three roles: Boss (bureaucrat, numbers), You (the player, emoji+numbers), SILMOR (the system, emoji, gets excited at patterns). Dice + FIFO slot system. Spell matching with cast animations. DOC.GEN generates margin annotations. Email interludes between documents. Dice are conversationalists — they cycle, reshuffle, react to neighbors, and daydream when left alone.

## What's Built
- 4 dice (d4s) with emoji faces, unique shapes, fidget animations
- Spell system: SILMOR generates 3-emoji secret spells, player matches via dice rolls
- 3-level spell matching with animated cast and trail particles
- Boss sprite with mood tracking (jealous, suspicious, impressed), spell streak awareness
- SILMOR sprite with 12 base + 8 contextual idle states, ~7s cycle, wanders off after ~42s
- Fumble cascade system (escalating misfire chance)
- Freeze mechanic (hold die to freeze slot, 85%/50% success)
- Document system: 3 rows per document, pass/fail, completion screen
- Pattern scanning: positional repeats grant permanent value bonuses
- DOC.GEN: margin annotations noting patterns, usage, predictability
- Email interludes: emoji emails, roll to match (attachment download vs face swap)
- Die explosion on stacked attachments, orphan attachment migration
- SILMOR's wand (absorbs orphaned attachments)
- Dice cast animation with flying emoji and trail particles
- **Die personality (shape + fidget) with personality-driven cycling behavior**
- **Sequential cycling: taps advance through a shuffled face sequence (not random rolls)**
- **Personality-driven reshuffle thresholds: spin=3, bounce/rock=4, still=5 taps**
- **Sympathetic reshuffles: neighbors may rearrange when a die changes its sequence**
- **Awareness moods: curious (leans toward neighbor), sympathetic (green glow), withdrawn (dims), alert (pulse on reshuffle)**
- **Next-face hint: each die shows the coming face subtly beneath its faces**
- **Idle drift: after 3 untouched taps, dice daydream — shown as gold `~emoji`, dashed border, breathing pulse**
  - `still` → surfaces highest-value face it has (pragmatic)
  - `rock` → offers a spell-matching face it has (attentive)
  - `bounce` → best spell contribution, eager to help (sociable)
  - `spin` → may suggest a face it doesn't own (wandering, imagining growth)
- Internal mechanics (email rolls, gamble shifts, explosions) remain random

## What's Next
- SILMOR noticing drift: she's present for all of it but currently blind to the dice daydreaming — a `rock` die quietly offering the spell face, a `spin` die suggesting 🌋 it can never give. Natural next extension of the conversation layer.
- No persistence — game state is entirely ephemeral, resets on reload
- No progression beyond documents (no endgame, campaign arc, or Dream Job)

## Specs & References
- `concessions/archive/SILMOR_SPELLS_DESIGN.md` — original design

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (140, 60, 130)
- **Receives:** None
- **localStorage:** None
- **Scraggle emissions:** None
