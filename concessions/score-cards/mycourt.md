# MYCOURT
**Location:** `scores/mycourt/` | **Status:** Active
**Neighborhood:** (unassigned) | **Stack:** Vanilla JS, canvas-based (~1,500 lines)

## Current State
A slow fungal empire played from underground through a rotatable padlock dial. 20 slices. Spoires planted at specific positions within slices — where you plant determines which syndicates thrive. Syndicates emerge from the mineral composition of the soil. Buttermoths collect Sporedust along influence connector routes. The Slug stirs when balance breaks. Investigators enrich slices on completion. Guide moths orbit interactable elements as the only UI — no text instructions.

## What's Built
- **The Dial:** 20 rotatable pie-wedge slices with pointer-drag and wheel rotation, momentum/inertia, friction decay
- **Overworld (top half):** 4 biome types (city/forest/mine/coast) with distinct icons, ambient light gradients, biome labels, surface buildings from investigations
- **Underground (bottom half):** dark soil with randomized mineral specks (6 hue types). Specks bloom brighter when slice activates
- **Spoire planting:** spatial — position within slice set by tap location. Mushroom-shaped with cap, stem, root tendrils. Influence radius radiates from placed position (visible green glow). Proximity to syndicates affects dust gathering rate
- **Syndicate generation from minerals:** mineral hue composition determines which syndicate types emerge. 5 types (Finespun, Massroot, Chromaveil, Dustweaver, Deephold) each mapped to specific mineral hues. Syndicates position themselves near their source minerals
- **Syndicate rendering:** color = identity (constant), shape = development stance (circle→diamond→square→star as dust grows). Name labels below. Shape visibly shrinks when dust is drained
- **Influence connectors:** bezier curves from syndicate to surface (routed toward spoire position), glow + shadow, cooldown visualization
- **Buttermoths:** wing-flap sprites oscillating along connector routes, efficiency grows over 5 minutes in place
- **Sporedust collection:** particles drift along routes. Tracked as fineness + mass. HUD shows "SPOREDUST: X" only when non-zero, pulses golden during active production
- **Production flourish:** spoire cap brightens, root tendrils thicken, golden motes rise from cap when buttermoths are actively collecting
- **Balance system:** influence vs collection ratio drives Slug disturbance. Slow rise (0.4 * imbalance), faster decay (0.6/tick). Needs meaningful activity before engaging
- **The Slug:** bottom center, clipped ellipse, bioluminescent spots. 8-second breathing cycle. Glacial visual transitions (~5x slower than typical). States: sleep/shift/yawn/snore/peek/speak with distinct eye, mouth, and body animations per state
- **Topsiders:** walking figures with bobbing gait and stepping legs. Spawn on slices with active connectors
- **Investigators:** crouched figure with tilted head, monocle with lens glint, progress arc that fills over 30 ticks, discovery glow past 50%. On completion: claims dust, builds surface structure, enriches slice, drops disturbance. **Investigation drain:** darkness falls over target slice for 2.5s before enrichment reveals
- **Investigator misdirection:** tap an investigating topsider to misdirect. Half-speed progress, dashed arc, dim flickering monocle, floating "?". On completion, drains a random OTHER planted slice instead
- **Slice-scale decisions (binary, this or not):**
  - **Slug snore threat:** snore targets a slice — let it scatter (connections break) or sacrifice dust from another slice to calm
  - **Syndicate exodus:** flourishing syndicate wants to leave — let them colonize a new slice or keep them (trust frays)
  - **Investigation claim:** highly enriched slice gets noticed — yield it (massive enrichment, no longer yours) or refuse (slug stirs)
  - **Mycourt decree:** slug speaks, council demands abandoning least productive slice — comply (slug rests) or defy (disturbance locks)
- **Claimed slices:** slices yielded to investigators become claimed — can't be replanted, guide moths avoid them
- **Guide moths:** ambient buttermoths orbiting interactable targets. Green moths on unplanted overworld slices, syndicate-colored moths on unconnected syndicates, warm moths on unmothed connector routes, swarm moths on overworld when connector is pending. They are the UI
- **Hub integration:** `hub:minimize`, `hub:color` (25, 15, 30) on load. Score card in hub selection panel
- **Persistence:** localStorage `mycourt/*` (slices, slug, dust, dialAngle, totals, tickCount, claimedSlices). Offline catch-up capped at 5 minutes

## What's Next

### Immediate (rewarding, buildable now)
- **Syndicate negotiation:** tap a syndicate to see its offer. Trust affects delivery. Suspicion (tapping too often) damages the relationship. Give syndicates voice — a line of dialogue when tapped
- **Spoire influence overlap:** when two spoires' influence radii overlap, the shared zone should produce richer dust or attract rarer syndicates. Reward thoughtful spacing
- **Sporedust color blending:** third dust axis. Color determined by which syndicates are active and adjacent. New topsider presence introduces hues not previously available
- **Claimed slice visual:** claimed slices should look visibly different — golden overworld, no underground activity, someone else's territory now

### Next phase
- **Mycourt council screen:** when the slug speaks, a council screen with named members drawn from top syndicates. Decrees have visual weight
- **Wormtrax:** manually placed infrastructure that routes syndicate presence through the substrate in specific directions. Extends a syndicate's reach beyond its home slice
- **Surface Mushrooms:** placeable above ground to guide goods toward higher neighborhoods. Logistics layer
- **Cross-score idle:** Mycourt operates while in other scores. On return, vaults may be full or empty. What the Mycourt built or lost is observable, not always explainable

### Horizon
- **hub:scraggle** — toast messages for slug state changes, investigation completions, Mycourt decrees
- **hub:mail** — S.Mail integration for Mycourt council communications
- **Sporedust as cross-score currency**
- **Sound:** breathing slug, spoire launch, connector hum, buttermoth flutter, investigation chime

## Resolved Questions
- **Slug disturbance visualization:** body animation states (shift/yawn/snore/peek/speak) with bioluminescent intensity, eye/mouth/offset changes. Glacial transitions.
- **Syndicate cap:** determined by mineral composition per slice (1-3 emerge based on hue diversity)
- **Investigation trigger:** disturbance > 30 + topsider present + 5% random chance per tick. Progress over 30 ticks.
- **UI affordance:** guide moths replace text instructions entirely. Moths orbit what you can interact with.

## Specs & References
- Design spec (original): this file's git history / `concessions/score-cards/mycourt.md` initial commit
- Memory file: `mycourt` topic in Claude memory (to be created)

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (25, 15, 30)
- **Receives:** None yet
- **localStorage:** Reads/writes `mycourt/*` keys (slices, slug, dust, dialAngle, totalInfluence, totalCollection, tickCount, lastSave)
