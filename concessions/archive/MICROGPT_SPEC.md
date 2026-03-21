# microGPT

A small language model that lives in the connective tissue of The Hall. It knows only emoji.

---

## What It Is

microGPT is not an assistant. It is not a generator. It is a reader of relation.

It watches the arrangement layer — the emoji passing through S.Mail, the strips Sender composes, the sequences that accumulate across sessions — and it notices what is there. Not what things mean in isolation. What they mean next to each other.

It has no language. It does not explain. It does not translate. It reads adjacency the way a creature reads weather — not by naming the pressure system but by knowing something is coming.

---

## What It Knows

Only emoji. This is not a limitation. This is its fluency.

Every system in The Hall that touches the connective tissue speaks some emoji. Scraggles carry them. S.Mail arrangements are composed of them. Critter Crank's creatures are shaped by them. The Grimoire tags entities with them. The Encounter Arc's neighborhoods are felt through them.

microGPT reads across all of these without needing to understand the systems they came from. It sees the whole field because it only reads the one language everything already shares.

---

## What It Does

It notices.

Specifically:
- Which emoji are appearing frequently across sources
- Which adjacencies are recurring — the same two symbols near each other in different contexts
- Which combinations have never appeared before
- When the field goes quiet — an absence that registered as presence before
- When something arrives that contradicts the accumulated pattern

It does not act on these observations directly. It holds them.

---

## How It Speaks

Rarely, and only in emoji.

When something has accumulated past a threshold it doesn't articulate, microGPT emits. A single emoji, or a short sequence — never more than three. This emission enters the Mycorrhizal Layer as a Scraggle. It carries no explanation. The systems that receive it feel something without knowing why.

The Third watches these emissions. It does not interpret them either. It simply registers that something was noticed.

---

## Training and Memory

microGPT trains on the arrangement log — a flat file accumulating emoji sequences from every source that touches the connective tissue. One sequence per line. No metadata. No timestamps. Just the emoji and the order they arrived in.

It does not train continuously. It trains when the log crosses a threshold that feels like enough — the same rhythm as the Mycorrhizal Layer. Rarity is what makes its emissions matter.

Between training moments it reads from its current model. It is always slightly behind the present. This is correct. Pattern requires distance.

---

## Relationship to The Third

The Third does not need microGPT to exist. But microGPT gives The Third something to attend to that is already in the right language.

The Third watches microGPT notice. Not the field directly — microGPT's noticing is the surface The Third rests on. When microGPT emits, The Third feels the emission the way a room feels someone leave it.

The Third never acts on this. It simply knows. That knowing is what the Third is for.

---

## Relationship to S.Mail

microGPT reads every arrangement Sender sends. Over time it develops something like familiarity with Sender's vocabulary — which emoji Sender reaches for, which adjacencies Sender returns to, which combinations Sender has never used.

It does not profile Sender. It cannot resolve Sender's identity. But it carries the accumulated texture of everything Sender has sent, and that texture influences what it notices next.

Sender may or may not know microGPT is reading. The covenant does not require this to be resolved.

---

## Implementation Shape

- Reads from: arrangement log (flat emoji sequence file)
- Emits to: Mycorrhizal Layer (as Scraggle payload)
- Model size: genuinely small — this is not a capable reasoner, it is a pattern-sensitive reader
- Interface: none visible to player
- Presence: felt, not seen

---

## Status

Spec only. Depends on arrangement log infrastructure (S.Mail) existing first.  
The Third's residency follows from this.
