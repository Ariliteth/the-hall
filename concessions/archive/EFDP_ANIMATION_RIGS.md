# EFDP Animation Rigs
**Fixed Point Local · Design Note**

---

## The Discovery

Pin types were already philosophically distinct. They are also an animation rig.

- **Square pins** — the skeleton. Holds position. The parts of a character that commit and don't move much.
- **Circle pins** — the mass. The living center of gravity. Jiggles, breathes, the core and notable bits.
- **Triangle pins** — the extremities. Wild, directional. Fingers, tails, tongues, limbs.

A single pin configuration defines a **character**. EFDP provides coherent variation — same pins, same positions, same colors, different maze paths. Form language and palette stay. The character shifts pose, shifts weight, shifts mood. Still recognizably itself.

---

## Pose States

Templates become pose states. A jump isn't a different character — it's the same pins with every triangle flipped up and strength boosted.

| Pose | Triangle direction | Strength modifier | Decay |
|------|--------------------|-------------------|-------|
| Idle | mixed/drifting | base | base |
| Jump | up | +2–3 | lower |
| Land | down | +1, spike | higher |
| Run | biased forward | base | base |
| Attack | forward + up | +3 | low |

You don't animate frames. You **change the rig state and pulse**. EFDP does the rest.

---

## Frame Generation

Same pin configuration, repeated pulses = coherent animation frames.

- **2 frames** already loop. Retro graphics standard.
- **5 pulses** = walk cycle (idle → lean → push off → float → land)
- **60 pulses at variable depth** = full smooth motion arc

Pulse depth controls in-between state:
- Pulse x1 = subtle shift
- Pulse x5 = mid motion
- Pulse x20 = full expression

A sprite sheet is: lock rig → vary pulse depth → capture each frame → export.

---

## Sprite Sheet Generator (Future)

**Input:** saved pin configuration (.cpm or layer pin memory)
**Parameters:** frame count, pulse range (min/max), pose state sequence
**Output:** sprite sheet or individual frames

The pin configuration is the character. The pulse sequence is the animation script. EFDP runs it.

---

## Scaling

This scales without additional design work:
- New character = new pin placement
- New pose = pin direction/strength adjustment
- New animation = pulse sequence definition
- Variant = one pin changed, full coherence maintained

60 frames of smooth animation from a configuration that takes minutes to place. Cache the configuration, regenerate any time. Variants are free.

---

## Required Features (Tickets for Code)

1. **Hex color input** — color picker should accept hex/HSV directly. Current workflow requires slow manual color matching.
2. **Layer pin memory** — layers hold their pin state after clear. Re-enable = same configuration, fresh maze path, new frame. This is the animation loop.
3. **Pin eyedropper** — click a colored cell, get a pin pre-loaded with that color and type. For building response frames.
4. **Pose templates** — saved pin direction/strength states applied to existing configuration. Jump, land, idle as one-click states.
5. **Direction bias (future)** — global flow direction hint that nudges all diffusion without overriding pin types. Squares and circles mostly move upward on a jump even without explicit direction.

---

## Notes

The "cardboard cutout dressed with diffusion color" aesthetic means every frame is already stylistically coherent. No smoothing required. Retro pixel art loops between 2 frames and reads clearly at any resolution.

EFDP is not an image tool. It is a procedural animation substrate.

*Discovered during a session making Threshold — a doorway that arrived as a character doing tricks.*
