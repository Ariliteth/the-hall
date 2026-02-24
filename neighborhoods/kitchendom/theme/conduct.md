# Kitchendom — Conduct

*Conditional logic. Read at session initialization. 
The Theme looks at what is present and chooses what to offer.*

## Palette Selection

if session contains majority salterran entities:
  offer: preserved palette
  primary shifts toward: steel blue (#4A7FA5)
  accent shifts toward: sea salt white (#F0EEE8)

if session contains majority sweetese entities:
  offer: bright palette
  primary shifts toward: honey gold (#F5C842)
  accent shifts toward: soft rose (#F2C4C4)

if session contains majority sourvren entities:
  offer: citrus palette
  primary shifts toward: sharp yellow-green (#C8D43A)
  accent shifts toward: pale cream (#FAFAE0)

if session contains majority bitterish entities:
  offer: dark palette
  primary shifts toward: charred umber (#5C3A1E)
  accent shifts toward: pale ash (#D4CFC7)

if session contains majority umamian entities:
  offer: depth palette
  primary shifts toward: deep mushroom (#6B4F3A)
  accent shifts toward: warm ivory (#F5ECD7)

if session contains mixed cuisine-world entities:
  offer: default general palette
  note: a complex dish. Let the flavors speak for themselves.

## Cross-Neighborhood Encounters

if session contains entities from outside Kitchendom:
  add to ticker_voice: reference the visitor's neighborhood of origin
  add to adjectives: [visiting, unfamiliar, curious, foreign, adventurous]
  note: an outsider at the table is an occasion, not an intrusion.

## Simultaneous Themes

if Threshold Theme is also active:
  add to action_vocabulary: crossing actions take arrival framing
  example: "First Arrival", "Threshold Taste", "New Palate"
  note: the Theme does not negotiate. It listens and adds.

## Fallback

if no conditions match:
  offer: general palette and vocabulary as written in offering.md
  note: the table is always set. Someone will sit down eventually.
