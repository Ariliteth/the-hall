# WORM AND MOUSE
**Location:** `scores/worm-and-mouse/` | **Status:** Active (Planning + Recon phases)
**Neighborhood:** TBD | **Stack:** Vanilla JS (~1500 lines)

## Current State
A dispatcher watches two autonomous agents raid office filing cabinets. The player places stickers on a photocopied blueprint to guide them, but agents act on their own. The gap between the blueprint (what the dispatcher knows) and the live signal (what's actually happening) is the game. Mimeograph aesthetic — cream paper, mold green ink, aged brass.

## What's Built
- **Blueprint grid**: 12x10 canvas, DPR-aware, mimeograph aesthetic (paper grain, uneven ink lines, room outlines with weight variation)
- **Dual state architecture**: `S.blueprint` (dispatcher-authored) vs `S.world` (agent-truth) — separate data structures as spec demands
- **6 sticker types**: OBJECTIVE, CAUTION, WALL, CLEAR, TRUST ME, CONTACT — desktop drag + mobile tap-to-place, two precision states (quick tap = approximate/dashed, held = confident/solid)
- **Contextual pins manifest**: File, Key, Intel — sidebar with limited supply per floor, moveable after placement
- **Mouse**: slow deliberate agent (1800ms tick), plans 5-7 chips ahead, respects stickers, reports thoughtfully ("Checking Filing A. paper."), dashed freeze ring when conversation-trapped
- **Worm**: steady burrowing agent (1300ms tick, never stops), 1-3 chip queue constantly refreshing, persistent body as infrastructure — every cell the worm passes through becomes a tripwire node with cross-mark visual
- **Worm body mechanics**: body segments block gnome movement ("gnome tripped on something. rerouting."), body between gnome and Mouse shields her from conversation traps ("worm body shielded mouse from conversation."), tripwire detection when gnomes cross body segments
- **Cabignomes**: spawn at edges, drift inward, 8 office conversation topics ("Do you know where the toner is?", "The fax machine is doing that thing again."). Adjacent gnome = conversation trap (agent queue freezes for N ticks). Mouse fully trapped; Worm barely paused
- **5 tile types**: metal (diagonal hatching), paper (horizontal lines), cardboard (crosshatch), wood (curved grain), hardware (dot grid) — known to world, hidden from blueprint, revealed through agent behavior
- **Queue strips**: Mouse's long ordered queue vs Worm's short refreshing queue. Chip tap = "are you sure?" query — Mouse reconsiders 60%, Worm 15%
- **Log thread**: two registers — agent reports (clipped first-person) and dispatcher INT (smaller monospace, system messages). Interleaved, scrolling
- **Pause-for-witness moments**: freeze all timers on gnome first presence, floor cleared, etc.
- **3-floor cabinet structure**: planning phase between floors, stickers/pins reset, new schematic
- **Trust persistence**: `localStorage` key `worm-and-mouse/trust`, TRUST ME effectiveness grows across runs
- **Gnomaction cost**: sticker placement during active phase triggers gnome tick before sticker resolves (developing fade-in animation)
- **Hub integration**: `hub:minimize`, `hub:color { r:90, g:105, b:75 }` (mold green)

## Design Pivots (from first playtest)
- **Recon/Heist two-phase**: current loop is recon. Next: add deliberate heist execution phase where dispatcher plans the real run based on what was learned. Things may shift between phases.
- **Worm identity**: body as infrastructure, not fast scout. Slow, steady, never stops. Body = tripwires, safe paths, gnome blockers.
- **Gnomes as social obstacles**: conversation traps, not combat. Office gnomes who waste your time.
- **Closets as high-value risk**: small rooms guaranteed interesting content, single-entry danger (gnome could block exit)
- **Badges system**: limited recon actions/time budget, ascending/descending importance
- **Visual register**: CRT monitor feel or hand-drawn emphasis (direction TBD)

## What's Next
- Recon/Heist two-phase restructure (biggest design shift — needs conversation)
- Closet mechanic (flag small rooms, guarantee content, single-entry risk)
- Agent-gathered pins (agents spot things during recon, not the dispatcher)
- Mouse uses worm body as traversal (spec: "climb Worm's body as infrastructure")
- Gnome conversation variety (personality without labels, per the spec)
- Visual register push (CRT or hand-drawn)

## Specs & References
- Spec: `concessions/WORM_AND_MOUSE.md`
- Design pivots: memory file `worm-and-mouse.md`

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color`
- **Receives:** None
- **localStorage:** `worm-and-mouse/trust`
