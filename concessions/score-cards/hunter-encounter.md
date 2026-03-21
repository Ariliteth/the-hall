# Hunter Encounter
**Location:** `neighborhoods/mucklerbuckler/scores/hunter-encounter/` | **Status:** Active
**Neighborhood:** Mucklerbuckler | **Stack:** Vanilla JS

## Current State
Turn-based monster hunting score themed as a 1990s TV show ("HUNT! EXTREME"). Fetches entity tunings from the Hall registry and converts them into combat encounters — stats derived from tags (curious, aggressive, subtle, mighty, swift, toxic). Kitchendom Theme integration renames all actions to food metaphors and shifts the color palette. Two fallback monsters (Scalescream, Mudhull) for offline play.

## What's Built
- Dynamic monster roster from Hall registry via GitHub API
- 19 player actions across 4 types (attack, defend, utility, status)
- Crowd Flash / Heroic Moment system with star choices
- Rage meter, status effects, advantaged d4 dice for durations
- Kitchendom Theme: renames all actions/statuses to food metaphors
- Animated monster art (shake, lunge), damage floaters, combat log
- Ticker bar with Greengarden + Kitchendom + active monster news lines
- VHS scanline aesthetic
- Win/lose overlay with restart

## What's Next
- No incomplete features or stubs found in code
- Mucklerbuckler Theme support (Build Order: "Mucklerbuckler Theme")
- Could benefit from Scraggle listening (currently outbound only)

## Specs & References
- No dedicated spec file — described in design doc Scores section

## Hub Integration
- **Sends:** `hub:minimize`, `hub:color` (180, 50, 40), `hub:scraggle` (win/lose)
- **Receives:** None (uses URL params for neighborhoods/themes context)
- **localStorage:** None
- **Scraggle emissions:** Film camera on win, ambulance on lose
