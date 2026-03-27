# ASPECT
**Location:** `scores/aspect/` | **Status:** Active
**Neighborhood:** None | **Stack:** Vanilla JS (~1,600 lines)

## Current State
A character engine where identity is the game. Three aspects, a name, deterministic letter-proximity resolution. Zero randomness — you see the paths and choose truth despite knowing it won't work. The name IS the system: personal stat trigrams derived from the character's name replace fixed stat codes, so every name produces a unique resolution fingerprint.

## What's Built
- 12 aspects (Vagrant, Scholar, Soldier, Merchant, Healer, Arcanist, Trickster, Sentinel, Artisan, Orator, Naturalist, Inventor), 5 skills each
- 3-slot selection: Primary (all 5 skills), Secondary (top 2), Tertiary (bottom 3)
- Name-derived personal stats: 3 trigrams from name carry CHA/WHZ/NRG values but match uniquely per character
- Tolerance window: floor 10%, ceiling 85% — skills push into the extremes
- Color Claiming: aspect colors flow into sheet, logo, tabs, skill bars, scenario UI
- Skill Tilting: after primary skill pick, "Lean?" offers remaining skills for +1-4%
- Persistence: localStorage `aspect/` namespace, character roster, resume on reload
- Fracture: branch from any log entry to create Mk.II (Roman numeral generations)
- 16 mundane scenarios, sequential per character, inner monologue outcome text
- Encounter pacing: 2.5s linger before resolution, margin note input, stillness tracking
- Tabbed sheets: Situation / Character / Log — leafable, arrow-key navigable
- Hub integration: `hub:minimize` on load, `hub:color` sends primary aspect RGB at forge time

## What's Next
- PPALs (Parallel Pals) — characters who exist alongside yours, adventuring in parallel. Roster becomes a living hallway where nobody waits.
- Absence mechanics — characters accumulate unresolved situations while you're away. PPAL pings escalate through hub channels (scraggle, S.Mail).
- Objects or companions — something in the encounter that isn't you
- Drift — aspect choices evolving over encounters, stat shift from repeated checks
- More scenarios — expand the 16 mundane adjacencies
