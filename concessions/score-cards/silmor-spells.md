# SILMOR Spells
**Location:** `scores/silmor-spells/` | **Status:** Active
**Neighborhood:** None | **Stack:** Vanilla JS (~2,730 lines)

## Current State
Roguelike about being the bridge between emoji and word. Three roles: Boss (bureaucrat, numbers), You (the player, emoji+numbers), SILMOR (the system, emoji, gets excited at patterns). Dice + FIFO slot system. Spell matching with cast animations. DOC.GEN generates margin annotations. Email interludes between documents.

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
- Die personality (shape + fidget behavior)

## What's Next
- No persistence — game state is entirely ephemeral, resets on reload
- No progression beyond documents (no endgame, campaign arc, or Dream Job)
- Build Order mentions no specific SILMOR items — largely complete as designed

## Specs & References
- `concessions/archive/SILMOR_SPELLS_DESIGN.md` — original design

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (140, 60, 130)
- **Receives:** None
- **localStorage:** None
- **Scraggle emissions:** None
