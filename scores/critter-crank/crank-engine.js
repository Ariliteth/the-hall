// ── State ─────────────────────────────────────────────────────────────────────
var S = {
  worldKey: null,
  cohesionMode: null,
  collection: [],
  view: "crank",
  cranking: false,
  crankAngle: 0,
  selectedCritter: null,
  editingDesc: false,
  customDesc: "",
  crankContext: null,
  // Controller state
  dpadSlots: [],        // 4 world keys on d-pad
  dpadActive: null,     // index 0-3 of selected d-pad slot
  dpadHeld: false,      // is d-pad currently held (for splash mode)
  styleSlots: [],       // 4 voice keys on style buttons
  styleActive: null,    // last-toggled style index (for generation bias)
  activeStyles: [],     // all currently lit face button indices
  activeVoices: [],     // voice keys influencing generation
  // Encounter
  activePose: "idle",   // current pose key for main creature animation
  mainCreature: null,   // the big centered roll
  worldInventory: null, // { tiles, flora, items, relics, spirit } — typed rolls from creature DNA
  encounterStats: null, // { hp, atk, def, spd, traits[] } — derived from creature seed
  encounterBiomeTags: null, // [tag1, tag2] — biome affinities for display
  // Haul packets
  packets: [],          // sealed world-packets (replaces flat collection for new haul)
  activePacket: null,   // packet currently being entered
  activeWorld: null,    // compound key of world being viewed in haul
  lensMode: "sims",     // "sims" | "grid" | "platformer" | "hunter"
  // GBA upgrade
  density: 0.5,         // volume slider (0=sparse, 1=busy)
  shoulderL: null,      // voice key held on L shoulder
  shoulderR: null,      // voice key held on R shoulder
  shoulderHeldL: false, // is L currently held down
  shoulderHeldR: false, // is R currently held down
  worldMenuOpen: false, // in-screen world menu overlay
  shoulderLRevealed: false, // has L shoulder been discovered
  shoulderRRevealed: false, // has R shoulder been discovered
  _shoulderLastTap: 0,  // timestamp of last shoulder+style tap (cheat code)
  _shoulderLastSide: null, // which shoulder was used for last tap
  _shoulderCleanTap: false, // true while shoulder held, cleared if style pressed
  // Quiet squatters
  pendingSquatters: [], // delayed squatters waiting to manifest
  _cranksSinceSquatter: 0, // cranks since last delayed squatter drain
  // Binder
  binderPage: 0,        // current 0-indexed page in world detail binder
  cardsFlipped: false,   // whether cards show back face
  packetDiorama: false,  // whether packet detail shows diorama view
};

// Grid cache: stores rendered grids to avoid re-rendering on every frame
var gridCache = {};

function getCachedGrid(roll) {
  var key = roll.seed + ":" + roll.recipeKey + ":" + roll.extraShapes.join(",") + ":" + roll.palKey + ":" + roll.cohesionMode;
  if (!gridCache[key]) {
    gridCache[key] = renderCritter(roll.seed, roll.recipeKey, roll.extraShapes, roll.palKey, roll.cohesionMode);
  }
  return gridCache[key];
}

function getFrameCacheKey(roll, poseKey, depth) {
  return roll.seed + ":" + roll.recipeKey + ":" + roll.extraShapes.join(",")
    + ":" + roll.palKey + ":" + roll.cohesionMode
    + ":" + (poseKey || "idle") + ":" + (depth || 0).toFixed(2);
}

function generateFrames(roll, poseKey, frameCount) {
  var frames = [];
  for (var f = 0; f < frameCount; f++) {
    var d = frameCount <= 1 ? 0 : f / (frameCount - 1);
    var cacheKey = getFrameCacheKey(roll, poseKey, d);
    if (!gridCache[cacheKey]) {
      gridCache[cacheKey] = renderCritter(
        roll.seed, roll.recipeKey, roll.extraShapes,
        roll.palKey, roll.cohesionMode, poseKey, d
      );
    }
    frames.push(gridCache[cacheKey]);
  }
  return frames;
}

// ── Persistence ──────────────────────────────────────────────────────────────
function loadCollection() {
  try {
    var raw = localStorage.getItem("critter-collection-v2");
    if (raw) S.collection = JSON.parse(raw);
  } catch(e) {}
}

function saveCollection() {
  try { localStorage.setItem("critter-collection-v2", JSON.stringify(S.collection)); } catch(e) {}
}

function loadPackets() {
  try {
    var raw = localStorage.getItem("critter-packets-v1");
    if (raw) S.packets = JSON.parse(raw);
  } catch(e) {}
}

function savePackets() {
  try { localStorage.setItem("critter-packets-v1", JSON.stringify(S.packets)); } catch(e) {}
}

function pushScraggle(emoji, signal) {
  try {
    var raw = localStorage.getItem("baseline-session/scraggles") || "[]";
    var arr = JSON.parse(raw);
    arr.push({ emoji: emoji, signal: signal, source: "critter-crank", arrivedAt: Date.now() });
    localStorage.setItem("baseline-session/scraggles", JSON.stringify(arr));
  } catch(e) {}
}

function readCrankContext() {
  try {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get("slug");
    var name = params.get("name");
    if (slug && name) {
      var tags = params.get("tags") ? params.get("tags").split(",").filter(Boolean) : [];
      var neighborhood = params.get("neighborhood") || "";
      var ctx = { slug: slug, name: name, tags: tags, neighborhood: neighborhood };
      var hasGlyph = params.get("hasGlyph") === "1";
      if (hasGlyph) {
        try {
          var glyphRaw = localStorage.getItem("crank-glyph-source");
          if (glyphRaw) {
            var glyphData = JSON.parse(glyphRaw);
            if (glyphData.slug === slug && (Date.now() - glyphData.writtenAt) < 5 * 60 * 1000) {
              ctx.glyphSvg = glyphData.svg;
            }
          }
        } catch(e) {}
      }
      ctx._fromGrimoire = true;
      S.crankContext = ctx;
    }
  } catch(e) {}

  // Check localStorage for efdp seed (if no Grimoire context)
  if (!S.crankContext) {
    try {
      var seedRaw = localStorage.getItem("baseline-session/crank-seed");
      if (seedRaw) {
        var seed = JSON.parse(seedRaw);
        if (seed.source === "efdp" || seed.source === "chunxly") {
          var recipeMap = {
            circle:["creature","spirit"], square:["item","terrain"],
            triangle:["relic","creature"]
          };
          seed.recipePool = recipeMap[seed.dominantPinType] || ["flora","spirit"];
          // carry entity identity from Chunxly (slug + name for portrait export)
          if (seed.slug && !seed.name && seed.entityName) {
            seed.name = seed.entityName;
          }
          // build custom palette from Chunxly color clusters (direct mode)
          if (seed.source === "chunxly" && seed.colorClusters && seed.colorClusters.length > 0) {
            var c0 = seed.colorClusters[0].color; // largest cluster (e.g. red body)
            var c1 = seed.colorClusters.length > 1 ? seed.colorClusters[1].color : c0;  // second (e.g. green wings)
            var c2 = seed.colorClusters.length > 2 ? seed.colorClusters[2].color : c1;  // third (e.g. gold accent)
            function toHex(r,g,b) { return "#" + [r,g,b].map(function(v){return Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0");}).join(""); }
            function darken(c, f) { return [c[0]*f, c[1]*f, c[2]*f]; }
            function lighten(c, f) { return [c[0]+(255-c[0])*f, c[1]+(255-c[1])*f, c[2]+(255-c[2])*f]; }
            var d0 = darken(c0, 0.15);  // very dark
            var d1 = darken(c0, 0.45);  // dark
            var lt = lighten(c0, 0.7);  // lightest tint
            PALETTES["_chunxly"] = [
              toHex(d0[0],d0[1],d0[2]),   // [0] darkest — deep shadow of dominant
              toHex(d1[0],d1[1],d1[2]),   // [1] dark — shadow of dominant
              toHex(c0[0],c0[1],c0[2]),   // [2] main — dominant cluster color
              toHex(c2[0],c2[1],c2[2]),   // [3] mid — third cluster (gold/accent)
              toHex(c1[0],c1[1],c1[2]),   // [4] accent — second cluster (green)
              toHex(lt[0],lt[1],lt[2]),   // [5] lightest — tint of dominant
            ];
            seed._hasDirectPalette = true;
          }
          S.crankContext = seed;
        }
      }
    } catch(e) {}
  }
}

function exportPortrait(critter, grid) {
  if (!S.crankContext || !S.crankContext.slug) return;
  try {
    var canvas = document.createElement("canvas");
    canvas.width = 96; canvas.height = 96;
    var ctx = canvas.getContext("2d");
    var ps = 96 / 48;
    for (var y = 0; y < 48; y++) {
      for (var x = 0; x < 48; x++) {
        var color = grid[y * 48 + x];
        if (color) { ctx.fillStyle = color; ctx.fillRect(x * ps, y * ps, ps, ps); }
      }
    }
    var dataUrl = canvas.toDataURL("image/png");
    var portrait = {
      slug: S.crankContext.slug,
      neighborhood: S.crankContext.neighborhood || "",
      name: critter.name,
      dataUrl: dataUrl,
      worldKey: S.worldKey,
      seed: critter.seed,
      keptAt: Date.now(),
    };
    var qRaw = localStorage.getItem("baseline-session/portraits-queue");
    var queue = qRaw ? JSON.parse(qRaw) : [];
    queue.push(portrait);
    localStorage.setItem("baseline-session/portraits-queue", JSON.stringify(queue));
    // Single-keep: clear Grimoire portal context after first portrait export
    // so subsequent keeps in this session are free exploration, not stacked on one entity
    if (S.crankContext && S.crankContext._fromGrimoire) {
      localStorage.removeItem("crank-glyph-source");
      S.crankContext = { slug: "", neighborhood: "", name: "", tags: [] };
    }
  } catch(e) {}
}

// ── Game Logic ───────────────────────────────────────────────────────────────
function getWorldVoices(worldKey) {
  var w = WORLDS[worldKey];
  if (!w) return [];
  return VOICE_KEYS.filter(function(vk) {
    return w.palettePool.indexOf(VOICES[vk].palette) >= 0;
  });
}

function selectWorld(key) {
  var wasWorldSelect = !S.worldKey;
  S.worldKey = key;
  S.mainCreature = null;
  S.worldInventory = null;
  S.encounterStats = null;
  S.encounterBiomeTags = null;
  S.worldMenuOpen = false;
  S.shoulderL = null;
  S.shoulderR = null;
  gridCache = {};
  // Initialize d-pad with this world + 3 random others
  var others = WORLD_KEYS.filter(function(k) { return k !== key; });
  fisherYates(others);
  S.dpadSlots = [key, others[0], others[1], others[2]];
  S.dpadActive = 0;
  // Initialize style slots: ~60% world-fitting, ~40% general
  var worldVoices = getWorldVoices(key);
  var generalVoices = VOICE_KEYS.filter(function(k) { return worldVoices.indexOf(k) < 0; });
  fisherYates(worldVoices);
  fisherYates(generalVoices);
  var slots = [];
  // Fill ~2-3 from world pool, rest from general
  var worldCount = Math.min(worldVoices.length, Math.random() < 0.5 ? 2 : 3);
  for (var i = 0; i < worldCount && i < worldVoices.length; i++) slots.push(worldVoices[i]);
  var gi = 0;
  while (slots.length < 4 && gi < generalVoices.length) slots.push(generalVoices[gi++]);
  // Pad with any remaining if needed
  while (slots.length < 4) {
    var fallback = VOICE_KEYS[Math.floor(Math.random() * VOICE_KEYS.length)];
    if (slots.indexOf(fallback) < 0) slots.push(fallback);
  }
  fisherYates(slots);
  S.styleSlots = slots;
  S.styleActive = null;
  S.activeStyles = [];
  S.activeVoices = [];
  S._machineEntrance = wasWorldSelect;
  invalidateShell();
  render();
  S._machineEntrance = false;
}

// ── Fisher-Yates shuffle ─────────────────────────────────────────────────────
function fisherYates(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

// ── Generation Pipeline ──────────────────────────────────────────────────────
var MAIN_RECIPE_POOL   = ["creature","creature","creature","spirit","spirit","flora"];

// Chunxly-direct roll: trusts the seed completely, no world/voice blending
function generateChunxlyRoll() {
  var ms = S.crankContext;
  var seed = Date.now() + Math.floor(Math.random() * 99999);
  // shape hints: seed's own + stall tags mapped through TAG_SHAPE_MAP
  var shapes = (ms.extraShapeHints || []).slice();
  if (ms.stallTags) {
    ms.stallTags.forEach(function(tag) {
      var hints = TAG_SHAPE_MAP[tag];
      if (hints) hints.forEach(function(h) {
        if (shapes.indexOf(h) < 0) shapes.push(h);
      });
    });
  }
  return {
    seed: seed,
    recipeKey: "creature",
    extraShapes: shapes,
    palKey: ms._hasDirectPalette ? "_chunxly" : (ms.paletteKey || "creature"),
    cohesionMode: ms.cohesionMode || "clustered",
    worldNote: "chunxly-direct",
    voiceEmoji: "",
    worldIcon: WORLDS[S.worldKey] ? WORLDS[S.worldKey].icon : ""
  };
}

function generateRoll(bias) {
  // bias: "creature" (main slot) or "inventory" (right column)
  // Falls back to world pool if no bias given
  var w = WORLDS[S.worldKey];
  if (!w) return null;
  var now = Date.now();
  var seed = now + Math.floor(Math.random() * 99999);
  var rng = seededRng(seed + 1234);
  var worldNote = [];

  // 1. Recipe pick — biased by slot type
  var rKey;
  if (bias === "creature") {
    rKey = pick(MAIN_RECIPE_POOL, rng);
  } else {
    rKey = pick(w.recipePool, rng);
  }
  worldNote.push(rKey);

  // 2. World shape extras — density-scaled
  // At density 0 (sparse): 0-1 extras. At density 1 (busy): 2-4 extras.
  var rExtras = [];
  var maxExtras = Math.round(1 + S.density * 3); // 1-4
  var extraRolls = Math.round(S.density * 3 + rng() * 1.5); // 0-4ish
  for (var ei = 0; ei < Math.min(extraRolls, maxExtras); ei++) {
    var hint = pick(w.extraHints, rng);
    if (rExtras.indexOf(hint) < 0) { rExtras.push(hint); worldNote.push("+" + hint); }
  }

  // 3. Entity context hints (if present)
  var entityHints = [];
  if (S.crankContext && S.crankContext.tags) {
    S.crankContext.tags.forEach(function(tag) {
      var hints = TAG_SHAPE_MAP[tag];
      if (hints) entityHints = entityHints.concat(hints);
    });
  }
  // Stall analysis tags (from Chunxly pixel analysis of PNG)
  if (S.crankContext && S.crankContext.stallTags) {
    S.crankContext.stallTags.forEach(function(tag) {
      var hints = TAG_SHAPE_MAP[tag];
      if (hints) entityHints = entityHints.concat(hints);
    });
  }
  if (entityHints.length > 0 && rng() > 0.4) {
    var entityHint = pick(entityHints, rng);
    if (rExtras.indexOf(entityHint) < 0) { rExtras.push(entityHint); worldNote.push("~" + entityHint); }
  }

  // 4. Voice shapes + palette + auto-derive cohesion
  var rPal = pick(w.palettePool, rng);
  // Auto-derive cohesion: blend voice cohesion with world bias
  var rCohesion = pick(w.cohesionBias, rng);
  var voiceEmoji = "";
  var worldIcon = w.icon;

  S.activeVoices.forEach(function(vk) {
    var voice = VOICES[vk];
    if (!voice) return;
    voice.shapes.forEach(function(sh) {
      if (rExtras.indexOf(sh) < 0) { rExtras.push(sh); worldNote.push("v:" + sh); }
    });
    rPal = voice.palette;
    voiceEmoji = voice.emoji;
    // Auto-derive: voice cohesion wins ~60% of the time
    if (voice.cohesion && rng() > 0.4) rCohesion = voice.cohesion;
  });

  // 5. Maze/Canvas seed overrides (if present)
  if (S.crankContext && (S.crankContext.source === "efdp" || S.crankContext.source === "chunxly")) {
    var ms = S.crankContext;
    if (rng() > 0.5 && ms.recipePool) { rKey = pick(ms.recipePool, rng); worldNote.push("m:" + rKey); }
    rPal = ms.paletteKey || rPal;
    rCohesion = ms.cohesionMode || rCohesion;
    if (ms.extraShapeHints) ms.extraShapeHints.forEach(function(h) {
      if (rExtras.indexOf(h) < 0) rExtras.push(h);
    });
    // Kitchendom: if Canvas seed, resolve affinity palette
    if (ms.source === "chunxly") {
      var affinity = KITCHENDOM_AFFINITY_MAP[ms.paletteKey];
      if (affinity && PALETTES[affinity]) {
        rPal = affinity;
        worldNote.push("k:" + affinity);
      }
    }
  }

  return { seed: seed, recipeKey: rKey, extraShapes: rExtras, palKey: rPal, cohesionMode: rCohesion, worldNote: worldNote.join(" "), voiceEmoji: voiceEmoji, worldIcon: worldIcon };
}

// ── World Inventory Generation ────────────────────────────────────────────────
// Deterministic: same creature seed always produces the same 5-slot world portrait
var WORLD_INV_CATS = [
  { key: "tiles",  recipeKey: "terrain", icon: "\u25A6" },
  { key: "flora",  recipeKey: "flora",   icon: "\u2767" },
  { key: "items",  recipeKey: "item",    icon: "\u25C6" },
  { key: "relics", recipeKey: "relic",   icon: "\u2726" },
  { key: "spirit", recipeKey: "spirit",  icon: "\u25CB" },
];

function generateWorldInventory(creatureRoll) {
  var w = WORLDS[S.worldKey];
  if (!w) return null;
  var inv = {};

  WORLD_INV_CATS.forEach(function(cat) {
    var catSeed = creatureRoll.seed + hashStr(cat.key);
    var rng = seededRng(catSeed + 1234);
    var recipe = RECIPES[cat.recipeKey];

    // Extra shapes: drawn from creature's DNA + world hints
    var hintPool = creatureRoll.extraShapes.concat(w.extraHints);
    var rExtras = [];
    var maxExtras = 1 + Math.floor(S.density * 2);
    for (var i = 0; i < maxExtras; i++) {
      var hint = pick(hintPool, rng);
      if (rExtras.indexOf(hint) < 0) rExtras.push(hint);
    }

    // Palette: 60% creature, 40% recipe's own
    var rPal = rng() > 0.4 ? creatureRoll.palKey : pick(recipe.paletteHints, rng);
    // Cohesion: 50/50 creature vs world bias
    var rCohesion = rng() > 0.5 ? creatureRoll.cohesionMode : pick(w.cohesionBias, rng);

    inv[cat.key] = {
      seed: catSeed,
      recipeKey: cat.recipeKey,
      extraShapes: rExtras,
      palKey: rPal,
      cohesionMode: rCohesion,
      worldNote: cat.key + " (inv)",
      voiceEmoji: creatureRoll.voiceEmoji,
      worldIcon: creatureRoll.worldIcon,
    };
  });

  return inv;
}

// ── Encounter Stats ──────────────────────────────────────────────────────────
// Derived deterministically from creature seed — same creature, same stats always
function deriveEncounterStats(roll) {
  var rng = seededRng(roll.seed + 33333);

  var STAT_BIAS = {
    creature: { hp: 2, atk: 1, def: 0, spd: 0 },
    spirit:   { hp: -1, atk: 0, def: -1, spd: 2 },
    flora:    { hp: 3, atk: -2, def: 2, spd: -2 },
    item:     { hp: 0, atk: 2, def: 1, spd: -1 },
    terrain:  { hp: 3, atk: -2, def: 3, spd: -3 },
    relic:    { hp: -1, atk: 1, def: 0, spd: 1 },
  };
  var bias = STAT_BIAS[roll.recipeKey] || { hp: 0, atk: 0, def: 0, spd: 0 };

  function stat(b) { return Math.max(1, Math.min(10, b + Math.floor(rng() * 6) + 3)); }

  var hp = stat(bias.hp), atk = stat(bias.atk), def = stat(bias.def), spd = stat(bias.spd);

  // Traits from cohesion + shapes
  var traits = [];
  var cohTraits = { radial: "centered", directional: "focused", clustered: "grounded", scattered: "restless" };
  if (cohTraits[roll.cohesionMode]) traits.push(cohTraits[roll.cohesionMode]);

  var shapeTraits = { eye: "watchful", spike: "sharp", blob: "soft", ring: "resonant", scatter: "diffuse", diamond: "faceted", cross: "branching", irregular: "strange", circle: "round", rect: "solid", line: "drawn" };
  roll.extraShapes.forEach(function(sh) {
    if (shapeTraits[sh] && traits.indexOf(shapeTraits[sh]) < 0 && traits.length < 3) traits.push(shapeTraits[sh]);
  });

  return { hp: hp, atk: atk, def: def, spd: spd, traits: traits };
}

// ── Biome Tags ───────────────────────────────────────────────────────────────
// Each creature gets 2 biome tags derived deterministically from its DNA.
// The sorted pair forms a compound world key (e.g. "city+deep").
var BIOME_KEYS = ["city","deep","forge","jungle","ruin","space"];

var PALETTE_BIOME_AFF = {
  nature:   { jungle: 2 },
  creature: { space: 2 },
  item:     { city: 2, ruin: 2, forge: 2 },
  fire:     { ruin: 2, forge: 2 },
  ice:      { space: 2, deep: 2 },
  poison:   { jungle: 2, space: 2, deep: 2 },
  ghost:    { city: 2, space: 2, deep: 2, ruin: 2 },
  earth:    { city: 2, jungle: 2, ruin: 2, forge: 2 },
  water:    { jungle: 2, deep: 2 },
  light:    { city: 2, forge: 2 },
};

var COHESION_BIOME_AFF = {
  directional: { city: 1, forge: 1, ruin: 1 },
  clustered:   { city: 1, forge: 1, deep: 1 },
  radial:      { jungle: 1, deep: 1, space: 1 },
  scattered:   { space: 1, jungle: 1, ruin: 1 },
};

var GEOMETRIC_SHAPES = ["rect","diamond","line","cross"];
var ORGANIC_SHAPES = ["blob","eye","scatter","ring","circle","irregular","spike"];

function deriveBiomeTags(roll) {
  var scores = { city: 0, deep: 0, forge: 0, jungle: 0, ruin: 0, space: 0 };
  if (roll.worldKey && scores[roll.worldKey] !== undefined) scores[roll.worldKey] += 3;
  var palAff = PALETTE_BIOME_AFF[roll.palKey];
  if (palAff) { for (var b in palAff) scores[b] += palAff[b]; }
  var cohAff = COHESION_BIOME_AFF[roll.cohesionMode];
  if (cohAff) { for (var b in cohAff) scores[b] += cohAff[b]; }
  var geoCount = 0, orgCount = 0;
  (roll.extraShapes || []).forEach(function(s) {
    if (GEOMETRIC_SHAPES.indexOf(s) >= 0) geoCount++;
    if (ORGANIC_SHAPES.indexOf(s) >= 0) orgCount++;
  });
  geoCount = Math.min(geoCount, 2); orgCount = Math.min(orgCount, 2);
  scores.city += geoCount; scores.forge += geoCount; scores.ruin += geoCount;
  scores.jungle += orgCount; scores.deep += orgCount; scores.space += orgCount;
  var sorted = BIOME_KEYS.slice().sort(function(a, b) { return scores[b] - scores[a]; });
  return [sorted[0], sorted[1]];
}

function compoundWorldKey(tags) {
  return tags[0] < tags[1] ? tags[0] + "+" + tags[1] : tags[1] + "+" + tags[0];
}

function compoundWorldIcon(tags) {
  return (WORLDS[tags[0]] ? WORLDS[tags[0]].icon : "") + (WORLDS[tags[1]] ? WORLDS[tags[1]].icon : "");
}

// ── World Name Generation ────────────────────────────────────────────────────
var WORLD_ADJ = {
  city:   ["Neon","Civic","Wired","Storied","Cobbled","Lamplit","Paved"],
  deep:   ["Sunken","Abyssal","Pressured","Still","Hollow","Fathom","Buried"],
  forge:  ["Tempered","Molten","Annealed","Wrought","Smelted","Hardened","Keen"],
  jungle: ["Overgrown","Tangled","Verdant","Humid","Canopy","Root","Feral"],
  ruin:   ["Crumbled","Forgotten","Eroded","Mossy","Broken","Faded","Worn"],
  space:  ["Orbital","Distant","Drifting","Void","Stellar","Quiet","Vast"],
};
var WORLD_NOUN = {
  city:   ["Quarter","District","Crossing","Block","Terminal","Arcade","Row"],
  deep:   ["Trench","Basin","Shelf","Vent","Cavern","Floor","Well"],
  forge:  ["Crucible","Furnace","Anvil","Chamber","Kiln","Works","Hearth"],
  jungle: ["Canopy","Thicket","Grove","Hollow","Clearing","Tangle","Basin"],
  ruin:   ["Foundation","Remnant","Arch","Corridor","Hall","Threshold","Court"],
  space:  ["Drift","Orbit","Nebula","Station","Field","Ring","Expanse"],
};

function generateWorldName(compKey) {
  var parts = compKey.split("+");
  var rng = seededRng(hashStr(compKey) + 42);
  return pick(WORLD_ADJ[parts[0]], rng) + " " + pick(WORLD_NOUN[parts[1]], rng);
}

// ── World Pool Computation ───────────────────────────────────────────────────
function deriveBiomeTagsForPacket(pkt) {
  var m = pkt.main || {};
  return deriveBiomeTags({
    worldKey: pkt.worldKey || m.worldKey,
    palKey: m.palKey,
    cohesionMode: m.cohesionMode,
    extraShapes: m.extraShapes || [],
  });
}

function computeWorldPools(packets) {
  var pools = {};
  packets.forEach(function(pkt, idx) {
    var tags = pkt.biomeTags || deriveBiomeTagsForPacket(pkt);
    var key = compoundWorldKey(tags);
    if (!pools[key]) {
      pools[key] = {
        compoundKey: key,
        tags: key.split("+"),
        name: generateWorldName(key),
        icon: compoundWorldIcon(key.split("+")),
        residents: [],
      };
    }
    pools[key].residents.push({ packet: pkt, index: idx });
  });
  var sorted = Object.keys(pools).map(function(k) { return pools[k]; });
  sorted.sort(function(a, b) {
    if (b.residents.length !== a.residents.length) return b.residents.length - a.residents.length;
    return a.compoundKey < b.compoundKey ? -1 : 1;
  });
  return sorted;
}

function enterWorld(compoundKey) {
  S.activeWorld = compoundKey;
  S.activePacket = null;
  S.binderPage = 0;
  S.cardsFlipped = false;
  render();
}

function exitWorld() {
  S.activeWorld = null;
  S.binderPage = 0;
  S.cardsFlipped = false;
  render();
}

function doSingle() {
  if (!S.worldKey || S.dpadActive === null) return;

  // ── Quiet squatter: does the outgoing creature want to stay? ──
  if (S.mainCreature) {
    var squat = checkSquatter(S.mainCreature);
    if (squat) handleSquatter(S.mainCreature, squat);
  }

  // ── Drain pending squatters after enough cranks ──
  S._cranksSinceSquatter++;
  if (S.pendingSquatters.length > 0 && S._cranksSinceSquatter >= 3) {
    var pkt = S.pendingSquatters.shift();
    S.packets.unshift(pkt);
    savePackets();
    savePendingSquatters();
    pushScraggle("\uD83D\uDEAA", "something moved in.");
    S._cranksSinceSquatter = 0;
  }

  var roll = (S.crankContext && S.crankContext.source === "chunxly" && S.crankContext._hasDirectPalette)
    ? generateChunxlyRoll()
    : generateRoll("creature");
  if (!roll) return;
  S.mainCreature = roll;
  S.worldInventory = generateWorldInventory(roll);
  S.encounterStats = deriveEncounterStats(roll);
  S.encounterBiomeTags = deriveBiomeTags({
    worldKey: S.worldKey, palKey: roll.palKey,
    cohesionMode: roll.cohesionMode, extraShapes: roll.extraShapes || [],
  });
  render();
  playPose("land");
  setTimeout(function() { bounceReveal(); }, 10);
}

function doSplash() {
  // Splash mode = same as single encounter now
  doSingle();
}

// ── Shuffle Functions ────────────────────────────────────────────────────────
function shuffleDpad(keepIdx) {
  // Keep the pressed slot, replace other 3 with random worlds
  var kept = S.dpadSlots[keepIdx];
  var pool = WORLD_KEYS.filter(function(k) { return k !== kept; });
  fisherYates(pool);
  var pi = 0;
  for (var i = 0; i < 4; i++) {
    if (i === keepIdx) continue;
    S.dpadSlots[i] = pool[pi++];
  }
  // 30% chance: shuffle 1-2 style slots (excluding active)
  if (Math.random() < 0.3) {
    var stylePool = VOICE_KEYS.filter(function(k) { return S.styleSlots.indexOf(k) < 0; });
    fisherYates(stylePool);
    var count = Math.random() < 0.5 ? 1 : 2;
    var si = 0;
    for (var i = 0; i < 4 && count > 0; i++) {
      if (i === S.styleActive) continue;
      if (si < stylePool.length) { S.styleSlots[i] = stylePool[si++]; count--; }
    }
  }
}

function shuffleStyle(keepIdx) {
  // Keep the pressed slot, replace other 3 with voices
  // Prefer world-fitting voices (~60% chance per slot)
  var kept = S.styleSlots[keepIdx];
  var worldPool = getWorldVoices(S.worldKey).filter(function(k) { return k !== kept; });
  var generalPool = VOICE_KEYS.filter(function(k) { return k !== kept && worldPool.indexOf(k) < 0; });
  fisherYates(worldPool);
  fisherYates(generalPool);
  var wi = 0, gi = 0;
  var used = [kept];
  for (var i = 0; i < 4; i++) {
    if (i === keepIdx) continue;
    var picked;
    if (Math.random() < 0.6 && wi < worldPool.length) {
      picked = worldPool[wi++];
    } else if (gi < generalPool.length) {
      picked = generalPool[gi++];
    } else if (wi < worldPool.length) {
      picked = worldPool[wi++];
    } else {
      picked = VOICE_KEYS[Math.floor(Math.random() * VOICE_KEYS.length)];
    }
    // Avoid duplicates
    while (used.indexOf(picked) >= 0 && (wi < worldPool.length || gi < generalPool.length)) {
      picked = wi < worldPool.length ? worldPool[wi++] : generalPool[gi++];
    }
    used.push(picked);
    S.styleSlots[i] = picked;
  }
  // 20% chance: shuffle 1 d-pad slot (excluding active)
  if (Math.random() < 0.2) {
    var dpadPool = WORLD_KEYS.filter(function(k) { return S.dpadSlots.indexOf(k) < 0; });
    if (dpadPool.length > 0) {
      fisherYates(dpadPool);
      for (var i = 0; i < 4; i++) {
        if (i === S.dpadActive) continue;
        S.dpadSlots[i] = dpadPool[0];
        break;
      }
    }
  }
}

// ── Controller Event Handlers ────────────────────────────────────────────────
function pressDpad(idx) {
  S.dpadActive = idx;
  S.worldKey = S.dpadSlots[idx];
  document.body.style.background = WORLDS[S.worldKey].bg;
  shuffleDpad(idx);
  if (S.dpadHeld) doSplash();
  else doSingle();
}

function holdShoulder(side) {
  // In binder: shoulder taps page instead of voice-hold
  if (isInWorldDetail()) {
    if (side === 'L') binderPagePrev();
    else binderPageNext();
    return;
  }
  S['shoulderHeld' + side] = true;
  S._shoulderCleanTap = true;
  // First press: reveal the shoulder button via in-place DOM patch (no full re-render)
  if (!S['shoulder' + side + 'Revealed']) {
    S['shoulder' + side + 'Revealed'] = true;
    var el = document.getElementById('shoulder-' + side);
    if (el) {
      el.classList.add('revealed');
      el.style.width = '52px';
      el.style.height = '20px';
      el.style.borderRadius = '8px 8px 0 0';
      el.style.background = '#2a0a18';
      el.style.border = '2px solid #4a1a30';
      el.style.borderBottom = 'none';
      el.style.fontSize = '6px';
      el.style.color = '#5a3010';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.boxShadow = '0 -2px 6px rgba(0,0,0,0.3)';
      el.textContent = side;
    }
  }
}
function releaseShoulder(side) {
  S['shoulderHeld' + side] = false;
  // Clean tap (no style interaction while held) → run pose
  if (S._shoulderCleanTap && S.mainCreature) {
    S._shoulderCleanTap = false;
    playPose("run");
  }
}

function pressStyle(idx) {
  // Shoulder intercept: hold/deposit voice
  if (S.shoulderHeldL || S.shoulderHeldR) {
    S._shoulderCleanTap = false; // style was pressed while holding — not a clean tap
    var side = S.shoulderHeldL ? 'L' : 'R';
    var shoulderKey = 'shoulder' + side;
    if (S[shoulderKey] === null) {
      S[shoulderKey] = S.styleSlots[idx];
      S._shoulderLastTap = Date.now();
      S._shoulderLastSide = side;
    } else {
      S.styleSlots[idx] = S[shoulderKey];
      S[shoulderKey] = null;
    }
    render();
    return;
  }

  // PASSIVE TOGGLE — face buttons are influence flags, not triggers.
  // Multiple can be active at once. D-pad press is what generates.
  if (S.activeStyles.indexOf(idx) >= 0) {
    // Already active — deactivate it
    S.activeStyles = S.activeStyles.filter(function(i) { return i !== idx; });
  } else {
    S.activeStyles.push(idx);
  }
  // Update activeVoices from all active style slots
  S.activeVoices = S.activeStyles.map(function(i) { return S.styleSlots[i]; });
  // If nothing active, default to slot 0 so generation always has something
  if (S.activeVoices.length === 0) S.styleActive = null;
  else S.styleActive = S.activeStyles[S.activeStyles.length - 1];

  // In-place DOM update ONLY — no full render, no layout shift
  updateStyleButtonsInPlace();
}

function updateStyleButtonsInPlace() {
  // Update each face button's visual state without touching the DOM tree above it
  document.querySelectorAll(".style-btn").forEach(function(btn) {
    var idx = parseInt(btn.getAttribute("data-style-idx"));
    if (isNaN(idx)) return;
    var isActive = S.activeStyles.indexOf(idx) >= 0;
    btn.style.background = isActive ? '#1a2a10' : '#12000e';
    btn.style.borderColor = isActive ? '#9bbc0f' : '#3a1028';
    btn.style.boxShadow = isActive
      ? '0 0 14px rgba(155,188,15,0.7),0 3px 0 rgba(0,0,0,0.4)'
      : '0 3px 0 rgba(0,0,0,0.4),0 1px 0 rgba(255,200,100,0.05)';
  });
}

// ── Density Dial ─────────────────────────────────────────────────────────────
var DENSITY_DETENTS = [0, 0.25, 0.5, 0.75, 1.0];
function cycleDensity() {
  var ci = DENSITY_DETENTS.indexOf(S.density);
  S.density = DENSITY_DETENTS[(ci + 1) % DENSITY_DETENTS.length];
  // In-place DOM update: shift wheel shade
  var wheel = document.getElementById("density-wheel");
  if (wheel) {
    wheel.style.background = densityWheelBg();
    // Re-apply knurled texture over new background
    wheel.style.backgroundImage = 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.04) 3px,rgba(255,255,255,0.04) 4px)';
    wheel.style.animation = 'none';
    wheel.offsetHeight; // force reflow
    wheel.style.animation = 'knobDetent 0.15s';
  }
}

// ── World Menu ──────────────────────────────────────────────────────────────
function toggleWorldMenu() {
  S.worldMenuOpen = !S.worldMenuOpen;
  render();
}
function selectWorldFromMenu(key) {
  S.worldMenuOpen = false;
  selectWorld(key);
}

// ── Lens Cycling ─────────────────────────────────────────────────────────────
var LENS_ORDER = ["sims", "grid", "platformer", "hunter"];
var LENS_LABELS = { sims: "SIMS", grid: "GRID", platformer: "PLATFORM", hunter: "HUNTER" };
var LENS_ICONS  = { sims: "👁", grid: "⊞", platformer: "▶", hunter: "⚔" };

function cycleLens() {
  var idx = LENS_ORDER.indexOf(S.lensMode);
  S.lensMode = LENS_ORDER[(idx + 1) % LENS_ORDER.length];
  // If we're inside a packet, re-enter with new lens
  if (S.view === "packet") render();
  else {
    // Flash the lens label on screen briefly
    var el = document.getElementById("lens-label");
    if (el) {
      el.textContent = LENS_ICONS[S.lensMode] + " " + LENS_LABELS[S.lensMode];
      el.style.opacity = "1";
      setTimeout(function() { if (el) el.style.opacity = "0"; }, 800);
    }
  }
}

// ── Binder: Constants, Paging, Flip ─────────────────────────────────────────
var STAT_COLORS = { hp: '#cc5555', atk: '#cc8844', def: '#5588bb', spd: '#55aa55' };
var CARDS_PER_PAGE = 4;

function isInWorldDetail() {
  return S.view === 'collection' && !!S.activeWorld && !S.activePacket;
}

function binderPagePrev() {
  if (S.binderPage > 0) {
    S.binderPage--;
    S.cardsFlipped = false;
    render();
  }
}

function binderPageNext() {
  var pools = computeWorldPools(S.packets);
  var pool = null;
  for (var i = 0; i < pools.length; i++) {
    if (pools[i].compoundKey === S.activeWorld) { pool = pools[i]; break; }
  }
  if (!pool) return;
  var totalPages = Math.ceil(pool.residents.length / CARDS_PER_PAGE);
  if (S.binderPage < totalPages - 1) {
    S.binderPage++;
    S.cardsFlipped = false;
    render();
  }
}

function toggleCardFlip() {
  S.cardsFlipped = !S.cardsFlipped;
  document.querySelectorAll('.card-flip-inner').forEach(function(el) {
    el.classList.toggle('flipped', S.cardsFlipped);
  });
  // Draw back-face canvases after CSS transition completes
  if (S.cardsFlipped) {
    setTimeout(function() { postRender(); }, 550);
  }
}

function handleFlipButton() {
  if (isInWorldDetail()) {
    toggleCardFlip();
  } else {
    cycleLens();
  }
}

// ── Quiet Squatter Logic ─────────────────────────────────────────────────────
// Some creatures decide to stay even when you crank past them.
// The creature's seed decides — ~15% are squatters.

function checkSquatter(roll) {
  var rng = seededRng(roll.seed + 7919); // offset so squatter fate ≠ creature appearance
  rng(); rng(); rng(); // warm up — LCG needs several iterations to decorrelate nearby seeds
  var chance = rng();
  if (chance >= 0.15) return null;       // ~85% leave normally
  var mode = rng();
  if (mode < 0.50) return "silent";      // silent immediate — discover in haul later
  if (mode < 0.80) return "noted";       // soft scraggle notification
  return "delayed";                       // appears after a few more cranks
}

function buildSquatterPacket(roll) {
  if (!roll) return null;
  var world = WORLDS[S.worldKey];
  if (!world) return null;

  function nameRoll(r) {
    return Object.assign({}, r, {
      name: generateName(r.seed),
      description: generateDescription(r.seed),
      worldKey: S.worldKey,
      collected: Date.now(),
    });
  }

  var wi = {};
  if (S.worldInventory) {
    WORLD_INV_CATS.forEach(function(cat) {
      wi[cat.key] = nameRoll(S.worldInventory[cat.key]);
    });
  }

  var packet = {
    id: Date.now(),
    worldKey: S.worldKey,
    palette: world.bg,
    accent:  world.accent,
    worldLabel: world.label,
    worldIcon:  world.icon,
    main:  nameRoll(roll),
    world: wi,
    stats: S.encounterStats,
    biomeTags: S.encounterBiomeTags || null,
    compoundWorld: S.encounterBiomeTags ? compoundWorldKey(S.encounterBiomeTags) : null,
    sealed: Date.now(),
    squatter: true,
  };

  if (S.crankContext && (S.crankContext.source === "efdp" || S.crankContext.source === "chunxly")) {
    var ms = S.crankContext;
    packet.mazeOrigin = {
      meanStrength: ms.meanStrength, calcifiedRatio: ms.calcifiedRatio,
      dominantHex: ms.dominantHex,
    };
  }

  return packet;
}

function handleSquatter(roll, mode) {
  var packet = buildSquatterPacket(roll);
  if (!packet) return;

  if (mode === "delayed") {
    S.pendingSquatters.push(packet);
    savePendingSquatters();
  } else {
    S.packets.unshift(packet);
    savePackets();
    if (mode === "noted") {
      pushScraggle("\uD83D\uDEAA", "something moved in.");
    }
  }
}

function savePendingSquatters() {
  try { localStorage.setItem("critter-pending-squatters", JSON.stringify(S.pendingSquatters)); } catch(e) {}
}

function loadPendingSquatters() {
  try {
    var raw = localStorage.getItem("critter-pending-squatters");
    if (raw) S.pendingSquatters = JSON.parse(raw);
  } catch(e) {}
}

function drainPendingSquatters() {
  if (S.pendingSquatters.length === 0) return;
  while (S.pendingSquatters.length > 0) {
    var pkt = S.pendingSquatters.shift();
    S.packets.unshift(pkt);
    pushScraggle("\uD83D\uDEAA", "something moved in.");
  }
  savePackets();
  savePendingSquatters();
}

// ── Packet Sealing ────────────────────────────────────────────────────────────

function sealPacket() {
  if (!S.mainCreature) return null;
  var world = WORLDS[S.worldKey];

  function nameRoll(roll) {
    return Object.assign({}, roll, {
      name: generateName(roll.seed),
      description: generateDescription(roll.seed),
      worldKey: S.worldKey,
      collected: Date.now(),
    });
  }

  var wi = {};
  if (S.worldInventory) {
    WORLD_INV_CATS.forEach(function(cat) {
      wi[cat.key] = nameRoll(S.worldInventory[cat.key]);
    });
  }

  var packet = {
    id: Date.now(),
    worldKey: S.worldKey,
    palette: world.bg,
    accent:  world.accent,
    worldLabel: world.label,
    worldIcon:  world.icon,
    main:  nameRoll(S.mainCreature),
    world: wi,
    stats: S.encounterStats,
    biomeTags: S.encounterBiomeTags || null,
    compoundWorld: S.encounterBiomeTags ? compoundWorldKey(S.encounterBiomeTags) : null,
    sealed: Date.now(),
  };

  // Maze origin if present
  if (S.crankContext && (S.crankContext.source === "efdp" || S.crankContext.source === "chunxly")) {
    var ms = S.crankContext;
    packet.mazeOrigin = {
      meanStrength: ms.meanStrength, calcifiedRatio: ms.calcifiedRatio,
      dominantHex: ms.dominantHex,
    };
  }

  return packet;
}

// ── Crank Save ───────────────────────────────────────────────────────────────
// ── Catch: seal the encounter and save ────────────────────────────────────────
function handleCatch() {
  if (!S.mainCreature || S.cranking) return;
  playPose("attack");

  S.cranking = true;
  var start = Date.now();
  var duration = 500;
  var handle = document.getElementById("crank-handle");
  var btn = document.getElementById("crank-btn");

  function animate() {
    var p = Math.min((Date.now() - start) / duration, 1);
    var ease = 1 - (1 - p) * (1 - p);
    S.crankAngle = ease * 360;
    if (handle) handle.style.transform = "rotate(" + S.crankAngle + "deg)";
    if (btn) {
      var sink = Math.min(p * 1.2, 1) * 4;
      btn.style.transform = "translateY(" + sink + "px)";
    }
    if (p < 1) {
      requestAnimationFrame(animate);
    } else {
      S.crankAngle = 0;
      S.cranking = false;
      if (handle) handle.style.transform = "rotate(0deg)";
      if (btn) {
        btn.style.transition = "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)";
        btn.style.transform = "translateY(0)";
        setTimeout(function() { if (btn) btn.style.transition = ""; }, 250);
      }

      // Seal the encounter
      var packet = sealPacket();
      if (packet) {
        S.packets.unshift(packet);
        savePackets();
        pushScraggle("\u2728", "caught: " + packet.main.name);
        // Export portrait to Grimoire queue (grab grid before cache clears)
        var portraitGrid = getCachedGrid(S.mainCreature);
        exportPortrait(packet.main, portraitGrid);
      }

      // Clear encounter
      S.mainCreature = null;
      S.worldInventory = null;
      S.encounterStats = null;
      S.encounterBiomeTags = null;
      gridCache = {};
      render();
    }
  }
  requestAnimationFrame(animate);
}
// Legacy alias — the physical crank button now catches
function handleCrank() { handleCatch(); }

function setView(v) {
  S.view = v;
  S.selectedCritter = null;
  S.editingDesc = false;
  S.activePacket = null;
  S.activeWorld = null;
  render();
}

function selectCritterInCollection(critter) {
  S.selectedCritter = critter;
  S.editingDesc = false;
  render();
}

function backFromCritterDetail() {
  S.selectedCritter = null;
  S.editingDesc = false;
  render();
}

function startEditDesc() {
  S.customDesc = S.selectedCritter.description || "";
  S.editingDesc = true;
  render();
  // Focus textarea
  setTimeout(function() {
    var ta = document.getElementById("desc-edit");
    if (ta) ta.focus();
  }, 10);
}

function saveDesc() {
  if (!S.selectedCritter) return;
  var ta = document.getElementById("desc-edit");
  if (ta) S.customDesc = ta.value;
  for (var i = 0; i < S.collection.length; i++) {
    if (S.collection[i].id === S.selectedCritter.id) {
      S.collection[i].description = S.customDesc;
      break;
    }
  }
  saveCollection();
  S.selectedCritter = Object.assign({}, S.selectedCritter, { description: S.customDesc });
  S.editingDesc = false;
  render();
}

function releaseFromCollection(id) {
  S.collection = S.collection.filter(function(c){ return c.id !== id; });
  saveCollection();
  if (S.selectedCritter && S.selectedCritter.id === id) S.selectedCritter = null;
  render();
}

function exportAsEntity(critter) {
  var catMap = { creature:"spirit", item:"item", flora:"tendency", terrain:"location", spirit:"spirit", relic:"item" };
  var entity = {
    id: critter.id.toString(36),
    name: critter.name,
    category: catMap[critter.recipeKey] || "spirit",
    description: critter.description,
    tags: [critter.worldKey, critter.recipeKey, critter.palKey, critter.cohesionMode].filter(Boolean),
    created: critter.collected,
    source: "critter-crank",
  };
  var blob = new Blob([JSON.stringify({ grimoire:"The Living Grimoire", version:1, exported:new Date().toISOString(), entries:[entity], journal:[] }, null, 2)], {type:"application/json"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = critter.name.toLowerCase().replace(/\s+/g,"-")+".json";
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function dismissContext() {
  S.crankContext = null;
  render();
}

// ── Bounce Reveal ────────────────────────────────────────────────────────────
function bounceReveal(skipAnimation) {
  var slots = document.querySelectorAll(".bounce-slot");
  if (!slots.length) return;

  // Static burst on the screen scanlines
  if (!skipAnimation) {
    var scanlines = document.querySelector('[style*="repeating-linear-gradient"]');
    if (scanlines) {
      scanlines.style.animation = 'staticBurst 0.12s ease-out';
      setTimeout(function() { if (scanlines) scanlines.style.animation = ''; }, 140);
    }
  }

  slots.forEach(function(slot, i) {
    if (skipAnimation) {
      slot.classList.add("visible", "popped");
      return;
    }
    slot.classList.remove("visible", "popped");
    var tumble = (Math.random() - 0.5) * 6;
    slot.style.transform = 'scale(0) rotate(' + tumble + 'deg)';
    setTimeout(function() {
      slot.classList.add("visible");
      slot.style.transform = 'scale(1.15) rotate(' + tumble + 'deg)';
      setTimeout(function() {
        slot.classList.add("popped");
        slot.style.transform = '';
      }, 180);
    }, i * 90);
  });
}

