# WORM AND MOUSE
**Location:** `scores/worm-and-mouse/` | **Status:** Active (Briefing + Planning Loop + Execution phases)
**Neighborhood:** TBD (pending — may affect gnome dialogue register and tile vocabulary) | **Stack:** Vanilla JS (~2600 lines)

## Current State
A dispatcher watches two autonomous agents raid office filing cabinets. The player places stickers on a photocopied blueprint to guide them, but agents act on their own. The gap between the blueprint (what the dispatcher knows) and the live signal (what's actually happening) is the game — this gap is intentional and load-bearing; do not close it in the name of clarity. Mimeograph aesthetic — cream paper, mold green ink, aged brass.

## What's Built
- **Three-phase state machine**: `briefing -> planning -> execution` per floor (v2 spec). One-directional transitions. Briefing ends when all sticky notes resolved, planning ends when the loop completes clean twice (the send), execution ends on floor clear.
- **Briefing phase**: Typewriter-paced log lines (Mouse reports 2-3 clipped lines, Worm 0-1 terse), then sticky notes appear staggered on blueprint. Dispatcher resolves each note by tapping left/right half (option A/B). Mouse has a preference (shown via small indicator) — overriding her reduces her queue length in execution.
- **Sticky notes**: Canvas-rendered cream paper rectangles with slight rotation, handwriting-style italic text, dashed divider, two-option tap interaction. 5 note templates (metal-floor, hardware-room, closet, deep-objective, bottleneck) matched against floor room data. Resolved notes show checkmark + strikethrough. Notes generate gameplay effects (agent speed, gnome count/speed, tile swaps) applied at execution start.
- **Blueprint grid**: 12x10 canvas, DPR-aware, mimeograph aesthetic (paper grain, uneven ink lines, room outlines with weight variation)
- **Dual state architecture**: `S.blueprint` (dispatcher-authored) vs `S.world` (agent-truth) — separate data structures as spec demands
- **6 sticker types**: OBJECTIVE, CAUTION, WALL, CLEAR, TRUST ME, CONTACT — desktop drag + mobile tap-to-place, two precision states (quick tap = approximate/dashed, held = confident/solid)
- **Contextual pins manifest**: File, Key, Intel — sidebar with limited supply per floor, moveable after placement
- **Mouse**: slow deliberate agent (1800ms tick), plans 5-7 chips ahead, respects stickers, reports thoughtfully ("Checking Filing A. paper."), dashed freeze ring when conversation-trapped. Queue max reduced by briefing overrides (min 3).
- **Worm**: steady burrowing agent (1300ms tick, never stops), 1-3 chip queue constantly refreshing, persistent body as infrastructure — every cell the worm passes through becomes a tripwire node with cross-mark visual
- **Worm body mechanics**: body segments block gnome movement ("gnome tripped on something. rerouting."), body between gnome and Mouse shields her from conversation traps ("worm body shielded mouse from conversation."), tripwire detection when gnomes cross body segments
- **Cabignomes**: spawn at edges, drift inward, 8 office conversation topics ("Do you know where the toner is?", "The fax machine is doing that thing again."). Adjacent gnome = conversation trap (agent queue freezes for N ticks). Mouse fully trapped; Worm barely paused
- **5 tile types**: metal (diagonal hatching), paper (horizontal lines), cardboard (crosshatch), wood (curved grain), hardware (dot grid) — known to world, hidden from blueprint, revealed through agent behavior
- **Queue strips**: Mouse's long ordered queue vs Worm's short refreshing queue. Chip tap = "are you sure?" query — Mouse reconsiders 60%, Worm 15%
- **Log thread**: two registers — agent reports (clipped first-person) and dispatcher INT (smaller monospace, system messages). Interleaved, scrolling
- **Pause-for-witness moments**: freeze all timers on gnome first presence, floor cleared, etc.
- **3-floor cabinet structure**: briefing phase between floors, stickers/pins reset, new schematic
- **Trust persistence**: `localStorage` key `worm-and-mouse/trust`, TRUST ME effectiveness grows across runs
- **Gnomaction cost**: sticker placement during execution phase triggers gnome tick before sticker resolves (developing fade-in animation)
- **Room nodes**: tappable mode cycling at room centers during planning — 6 modes (explore/sneak/quick/follow-worm/hold/avoid). Drawn as small mold-green circles with mode letter at room center, offset below room label. Tap near room center cycles through modes. Unset rooms show `?`. Any node change resets the planning loop.
- **Worm path generation**: DFS contiguous walk from entry through all rooms via doors. Each transition goes through a real door — path never cuts through walls. Waypoints are center→door→center pairs. Drawn as rectilinear dotted brown line on blueprint during planning. Currently Normal Worm only (auto-generated).
- **Planning loop**: animated dry-run of the plan on the blueprint. Mouse (blue) and Worm (brown) blips move through waypoints at mode-dependent speeds (explore=900ms, sneak=850ms, quick=400ms, follow=650ms per waypoint). Rectilinear interpolation — blips move horizontal-then-vertical between waypoints. Loop pauses at rooms with no node set (pulsing red `?` ring + glyph at conflict room). Resumes when dispatcher sets the missing node. Must complete clean all the way through before execution unlocks. Loop alpha rises from 0.5 to 0.7 after first clean pass (visual "ready" shift). Entry point glows softly when ready. Mouse trail drawn as thin dashed blue line; worm progress drawn as solid brown line over the dotted path.
- **The send**: two-pass mechanism — first clean completion proves the plan, second clean completion IS the mission. Loop's final frame becomes execution's first real tick. Mouse and Worm positions, visited cells, and worm body segments transfer seamlessly from loop state to execution state. No button, no flash, no log line naming the transition. Phase flag flips internally. The dispatcher discovers they're in execution because the world keeps moving. Old "Send Them In" button removed entirely.
- **Hub integration**: `hub:minimize`, `hub:color { r:90, g:105, b:75 }` (mold green)

## What's Next (v2 spec remaining, priority order)
- **Execution AI alignment**: agents in execution currently use the old greedy `agentThink` pathfinder, which doesn't follow the plan the loop just showed. Mouse should honor room node modes during execution; Worm should follow the selected path. The loop shows a promise — execution should try to keep it.
- **Visual register split**: papers (briefing/planning) vs CRT (execution/`!!!`)
- **Execution map mode**: blueprint as primary surface during execution, CRT only on `!!!`
- **`!!!` moments**: conflict detector, CRT surface forward, contextual options, "follow agent intuition"
- **Worm type selection**: full picker UI (Normal/Fuzzy/Blitz/Ghost/Stub/Slow) — currently auto-generates Normal path via DFS. Ghost worm (optimal unobstructed reference) not yet drawn.
- Closet mechanic (flag small rooms, guarantee content, single-entry risk)
- Mouse uses worm body as traversal

## Specs & References
- Spec v2: `concessions/WORM_AND_MOUSE_v2.md` (current)
- Spec v1: `concessions/WORM_AND_MOUSE.md` (superseded — score card and v2 spec are truth)
- Design pivots: memory file `worm-and-mouse.md`

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color`
- **Receives:** None
- **localStorage:** `worm-and-mouse/trust`
