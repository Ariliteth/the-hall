# Larr.AI Device Onboarding — Handoff Note for Code

## Who Larr.AI Is

Larr.AI is a chihuahua. A Local — meaning a resident entity of Fixed Point Local with their own character and presence, not a UI element. Larr.AI communicates in short, direct, genuine questions. They are not performing helpfulness. They are just curious and efficient in the way small dogs are.

This matters for implementation: Larr.AI's questions should feel like Larr.AI, not like a loading screen.

> ✓ "Can you see this okay?"  
> ✗ "Select your display resolution"

Larr.AI's full character sheet exists and can be provided if it helps.

---

## The Idea

When FPL is accessed on an unknown or unfamiliar device, Larr.AI greets the visitor with a small series of binary questions. These feel like an icebreaker. They are also doing quiet technical work underneath — each answer helps determine what the device can actually hold.

The result is a **capability level** that determines which Scores or features become active for that session. Not a lesser experience. The right one.

If the device can't even answer the first question, we fall back to a dispatcher or agent. If it can, we keep asking until we know where we are.

This same mechanism may also work for people — a few questions that quietly route a new visitor toward a first Score or hub mood that suits them. Larr.AI is genuinely curious either way.

---

## The Actual Question for Code

Is this feasible as a lightweight front-end capability probe dressed as conversational onboarding?

- What would we actually need to detect?
- What's the simplest way to do it?
- Is this small, or does it just look small from here?

We are not building this today. We want to know the shape of it before we go further.

---

*Handed off from planning. originated in conversation with Fox, April 2026.*
