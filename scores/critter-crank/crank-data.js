// ── Seeded RNG ────────────────────────────────────────────────────────────────
function hashStr(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h | 0;
  }
  return Math.abs(h);
}

function seededRng(seed) {
  var s = Math.abs(seed) || 1;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function pickN(arr, n, rng) {
  var copy = arr.slice(), result = [];
  for (var i = 0; i < Math.min(n, copy.length); i++) {
    result.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  }
  return result;
}

// ── Worlds ────────────────────────────────────────────────────────────────────
var WORLDS = {
  city: {
    label: "City", icon: "\u25A6",
    flavor: "Friends, commerce, and things that remember being useful.",
    bg: "#1a1220", accent: "#cc88ff",
    palettePool: ["item","earth","light","ghost"],
    recipePool: ["creature","item","relic"],
    extraHints: ["rect","diamond","line","cross"],
    cohesionBias: ["directional","clustered"],
    // Crystal violet — tight city grid, rectangular
    body: {
      radius: "10px 10px 14px 14px",
      gradient: "linear-gradient(180deg,rgba(160,80,220,0.55) 0%,rgba(110,40,180,0.65) 100%)",
      glow: "0 24px 60px rgba(120,40,200,0.4), 0 0 0 2px rgba(200,140,255,0.15) inset",
      border: "rgba(200,140,255,0.3)",
      screenGlow: "rgba(204,136,255,0.12)",
      hardware: "radial-gradient(ellipse at 30% 20%, rgba(255,200,255,0.08) 0%, transparent 60%), repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(180,100,255,0.04) 8px, rgba(180,100,255,0.04) 9px)",
    },
  },
  jungle: {
    label: "Jungle", icon: "\u2767",
    flavor: "Something watches from every leaf. Most of it is friendly.",
    bg: "#0a1a08", accent: "#88ff66",
    palettePool: ["nature","earth","poison","water"],
    recipePool: ["flora","creature","spirit"],
    extraHints: ["blob","scatter","circle","eye"],
    cohesionBias: ["radial","scattered"],
    // Crystal green — asymmetric, grew around the screen
    body: {
      radius: "18px 28px 22px 32px",
      gradient: "linear-gradient(170deg,rgba(40,160,20,0.5) 0%,rgba(20,120,10,0.65) 100%)",
      glow: "0 24px 60px rgba(20,140,20,0.4), 0 0 0 2px rgba(100,255,60,0.2) inset",
      border: "rgba(100,220,60,0.3)",
      screenGlow: "rgba(136,255,102,0.1)",
      hardware: "radial-gradient(ellipse at 70% 30%, rgba(180,255,100,0.07) 0%, transparent 55%), repeating-linear-gradient(-30deg, transparent, transparent 12px, rgba(60,200,20,0.04) 12px, rgba(60,200,20,0.04) 13px)",
    },
  },
  space: {
    label: "Space", icon: "\u2605",
    flavor: "Distant things. Patient things. Things with no hurry whatsoever.",
    bg: "#04040f", accent: "#6688ff",
    palettePool: ["ghost","ice","poison","creature"],
    recipePool: ["spirit","creature","terrain"],
    extraHints: ["ring","scatter","circle","spike"],
    cohesionBias: ["scattered","radial"],
    // Crystal midnight blue — very round, floats
    body: {
      radius: "32px 32px 40px 40px",
      gradient: "linear-gradient(180deg,rgba(40,60,180,0.5) 0%,rgba(20,30,140,0.65) 100%)",
      glow: "0 30px 80px rgba(40,60,200,0.45), 0 0 0 2px rgba(100,140,255,0.2) inset",
      border: "rgba(100,140,255,0.25)",
      screenGlow: "rgba(102,136,255,0.12)",
      hardware: "radial-gradient(ellipse at 50% 15%, rgba(180,200,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(60,80,220,0.06) 0%, transparent 40%)",
    },
  },
  deep: {
    label: "Deep", icon: "\u25CE",
    flavor: "Below the usual. Pressure makes things interesting.",
    bg: "#000a14", accent: "#00ccff",
    palettePool: ["water","ice","ghost","poison"],
    recipePool: ["creature","spirit","flora"],
    extraHints: ["blob","ring","eye","scatter"],
    cohesionBias: ["radial","clustered"],
    // Crystal teal — compressed top, heavy bottom
    body: {
      radius: "8px 8px 28px 28px",
      gradient: "linear-gradient(180deg,rgba(0,100,160,0.5) 0%,rgba(0,60,120,0.7) 100%)",
      glow: "0 32px 80px rgba(0,120,180,0.45), 0 0 0 2px rgba(0,200,240,0.2) inset",
      border: "rgba(0,180,220,0.3)",
      screenGlow: "rgba(0,200,255,0.12)",
      hardware: "radial-gradient(ellipse at 50% 80%, rgba(0,220,255,0.08) 0%, transparent 50%), repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(0,140,200,0.03) 16px, rgba(0,140,200,0.03) 17px)",
    },
  },
  ruin: {
    label: "Ruin", icon: "\u25EB",
    flavor: "Something happened here. Not everything left.",
    bg: "#120e08", accent: "#cc8844",
    palettePool: ["earth","fire","item","ghost"],
    recipePool: ["relic","terrain","creature"],
    extraHints: ["cross","diamond","line","rect"],
    cohesionBias: ["directional","clustered"],
    // Crystal amber — irregular worn corners
    body: {
      radius: "20px 8px 18px 12px",
      gradient: "linear-gradient(165deg,rgba(180,100,20,0.5) 0%,rgba(140,60,10,0.65) 100%)",
      glow: "0 20px 50px rgba(160,80,20,0.45), 0 0 0 2px rgba(220,150,60,0.2) inset",
      border: "rgba(200,130,50,0.3)",
      screenGlow: "rgba(200,130,60,0.1)",
      hardware: "radial-gradient(ellipse at 20% 40%, rgba(255,180,80,0.07) 0%, transparent 50%), repeating-linear-gradient(20deg, transparent, transparent 10px, rgba(180,100,20,0.04) 10px, rgba(180,100,20,0.04) 11px)",
    },
  },
  forge: {
    label: "Forge", icon: "\u25C8",
    flavor: "Hot opinions. Sharp edges. Everything here has a purpose.",
    bg: "#1a0800", accent: "#ff6622",
    palettePool: ["fire","light","item","earth"],
    recipePool: ["item","relic","creature"],
    extraHints: ["spike","diamond","cross","line"],
    cohesionBias: ["directional","radial"],
    // Crystal ember — hard angles, almost no rounding
    body: {
      radius: "4px 4px 6px 6px",
      gradient: "linear-gradient(180deg,rgba(200,60,0,0.5) 0%,rgba(160,30,0,0.7) 100%)",
      glow: "0 20px 50px rgba(200,60,0,0.5), 0 0 0 2px rgba(255,120,40,0.2) inset",
      border: "rgba(255,100,30,0.3)",
      screenGlow: "rgba(255,100,30,0.12)",
      hardware: "radial-gradient(ellipse at 50% 50%, rgba(255,140,40,0.06) 0%, transparent 60%), repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(200,60,0,0.05) 6px, rgba(200,60,0,0.05) 7px)",
    },
  },
  kitchendom: {
    label: "Kitchendom", icon: "\u25C9",
    flavor: "Where tastes argue and seasons win. Everything here has been prepared.",
    bg: "#1a0f08", accent: "#d4a574",
    palettePool: ["umamian","salterran","sourvren","bitterish","sweetese"],
    recipePool: ["creature","flora","item"],
    extraHints: ["blob","circle","diamond","irregular"],
    cohesionBias: ["clustered","radial"],
    // Crystal terra cotta — asymmetric, hand-formed, warm
    body: {
      radius: "16px 20px 18px 22px",
      gradient: "linear-gradient(170deg,rgba(185,95,45,0.5) 0%,rgba(140,65,25,0.65) 100%)",
      glow: "0 20px 50px rgba(185,95,45,0.45), 0 0 0 2px rgba(210,160,80,0.2) inset",
      border: "rgba(200,140,60,0.3)",
      screenGlow: "rgba(210,160,80,0.1)",
      hardware: "radial-gradient(ellipse at 30% 60%, rgba(210,160,80,0.07) 0%, transparent 55%), repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(185,95,45,0.04) 10px, rgba(185,95,45,0.04) 11px)",
    },
  },
};

var WORLD_KEYS = Object.keys(WORLDS);

// ── Palettes ──────────────────────────────────────────────────────────────────
var PALETTES = {
  nature:   ["#1a2a0a","#2d6a2d","#5a9e3a","#a8d060","#e8f0a0","#ffffff"],
  creature: ["#0a0a1a","#1a1a2e","#0f3460","#e94560","#f5a623","#f0f0f0"],
  item:     ["#0a0805","#3d2010","#8b4513","#cd853f","#ffd700","#ffffff"],
  fire:     ["#0a0000","#3a0000","#8b0000","#dc143c","#ff6600","#ffdd00"],
  ice:      ["#00050f","#001428","#003366","#0066cc","#66b3ff","#e8f4ff"],
  poison:   ["#080010","#1a0028","#4b0082","#800080","#da70d6","#e8ffe8"],
  ghost:    ["#040408","#0d0d1a","#1a1a3e","#5050a0","#b0b0e0","#f0f0ff"],
  earth:    ["#080400","#1a0f00","#3d2b1f","#6b4226","#c4956a","#ffe8c0"],
  water:    ["#000508","#001428","#003366","#0088cc","#44ccee","#c0eeff"],
  light:    ["#080800","#1a1400","#3d3300","#ccaa00","#ffdd33","#fffff0"],
  // ── Kitchendom affinities ──
  umamian:  ["#0a0600","#1f1000","#4a2800","#8b5e3c","#c49a6c","#f5ddb0"],  // deep brown-gold, savory richness
  salterran:["#050a0f","#0d1f2d","#1a3a4a","#4a8a9a","#a0d0d8","#e8f5f8"],  // mineral blue-white, preserved
  sourvren: ["#050a02","#0f2008","#2a5a10","#5a9e20","#b8e060","#f0ffd0"],  // fermented green-yellow, volatile
  bitterish:["#080408","#1a0a1a","#3a1040","#6a2060","#b060a0","#e8c0e0"],  // dark purple-black, resistant
  sweetese: ["#0a0802","#221800","#5a3800","#d4884a","#f5c080","#fff5e0"],  // warm amber-cream, abundant
};

// ── Kitchendom affinity translation (paletteKey → affinity) ──
var KITCHENDOM_AFFINITY_MAP = {
  earth:    "umamian",
  creature: "umamian",
  ice:      "salterran",
  item:     "salterran",
  poison:   "sourvren",
  nature:   "sourvren",
  ghost:    "bitterish",
  fire:     "bitterish",
  light:    "sweetese",
  water:    "sweetese",
};

// ── Recipes ───────────────────────────────────────────────────────────────────
var RECIPES = {
  creature: { label:"Creature", icon:"\u25C8", paletteHints:["creature","ghost","poison","fire"], shapeTypes:["blob","eye","spike","circle","irregular"], countRange:[3,6] },
  item:     { label:"Item",     icon:"\u25C6", paletteHints:["item","earth","light"],             shapeTypes:["rect","diamond","line","circle","cross"],   countRange:[2,4] },
  flora:    { label:"Flora",    icon:"\u2767", paletteHints:["nature","earth","water"],            shapeTypes:["circle","blob","scatter","line"],           countRange:[3,7] },
  terrain:  { label:"Terrain",  icon:"\u25C7", paletteHints:["earth","nature","water","ice"],      shapeTypes:["rect","scatter","line","irregular"],        countRange:[4,8] },
  spirit:   { label:"Spirit",   icon:"\u25CB", paletteHints:["ghost","ice","light","poison"],      shapeTypes:["circle","blob","scatter","ring"],           countRange:[2,5] },
  relic:    { label:"Relic",    icon:"\u2726", paletteHints:["light","item","fire","ice"],         shapeTypes:["diamond","cross","ring","circle","spike"],  countRange:[2,5] },
};

// ── Cohesion Modes ────────────────────────────────────────────────────────────
var COHESION_MODES = {
  radial:      { label:"Radial",      desc:"emanating from center" },
  directional: { label:"Directional", desc:"aligned flow" },
  clustered:   { label:"Clustered",   desc:"tight mass" },
  scattered:   { label:"Scattered",   desc:"sparse and distant" },
};

// ── Name + Description Generation ────────────────────────────────────────────
var PREFIXES = ["Glob","Mur","Fez","Wyx","Blit","Snor","Quib","Zal","Pog","Vel","Trix","Oom","Skit","Drab","Flum","Grix","Hob","Jib","Krel","Lux","Brem","Cov","Dwin","Efp","Skiv"];
var MIDS = ["al","ox","un","im","esh","orb","ik","ula","ven","ax"];
var SUFFIXES = ["ble","kin","ox","ish","en","ar","um","ix","le","ot","us","on","ig","ub","az","ep","orf","unk","eel","ap"];

var DESC_STARTS = ["Prefers","Has strong opinions about","Cannot remember","Occasionally dreams of","Is quietly proud of","Refuses to acknowledge","Collects","Has survived","Suspects","Genuinely enjoys"];
var DESC_SUBJECTS = ["corners","bridges","the color of certain clouds","being watched","small containers","early mornings","the sound of keys","being almost somewhere","soft textures","the concept of Tuesday","things left behind","particular silences","what's beneath floors","doorways","reflected light"];
var DESC_CODAS = ["Harmless, probably.","Waiting for something specific.","The feeling is mutual.","Means well.","No one has asked.","It's complicated.","Has been this way for a while.","Not in any rush.","Keeps to itself, mostly.","You'd like each other."];

function generateName(seed) {
  var rng = seededRng(seed + 9999);
  var name = pick(PREFIXES, rng);
  if (rng() > 0.4) name += pick(MIDS, rng);
  name += pick(SUFFIXES, rng);
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function generateDescription(seed) {
  var rng = seededRng(seed + 77777);
  return pick(DESC_STARTS, rng) + " " + pick(DESC_SUBJECTS, rng) + ". " + pick(DESC_CODAS, rng);
}

// ── Tag → Shape Hint Map ─────────────────────────────────────────────────────
var TAG_SHAPE_MAP = {
  subtle: ["scatter","line"], shifting: ["irregular","blob"], attentive: ["eye","ring"],
  fierce: ["spike","diamond"], bold: ["diamond","cross"], territorial: ["rect","cross"],
  quiet: ["circle","ring"], patient: ["ring","scatter"], watching: ["eye","circle"],
  mighty: ["blob","irregular"], large: ["blob","rect"], heavy: ["rect","diamond"],
  ancient: ["irregular","ring"], poisonous: ["scatter","blob"], toxic: ["scatter","ring"],
  quick: ["scatter","spike"], swift: ["spike","line"], nimble: ["line","scatter"],
  curious: ["eye","blob"], tasteful: ["circle","diamond"], meandering: ["irregular","scatter"],
  seeking: ["eye","line"],
  // Stall analysis tags (from Chunxly pixel analysis)
  delicate: ["scatter","line"], confident: ["blob","circle"], focused: ["circle","ring"],
  restless: ["irregular","scatter"], pure: ["circle","ring"], considered: ["diamond","circle"],
  vivid: ["cross","diamond"], gentle: ["ring","circle"], textured: ["irregular","blob"],
  defined: ["spike","diamond"], towering: ["rect","line"], sprawling: ["blob","irregular"],
  suggested: ["scatter","line"], substantial: ["blob","rect"],
};

// ── All Shape Names ──────────────────────────────────────────────────────────
var ALL_SHAPES = ["blob","eye","spike","scatter","ring","cross","line","diamond","rect","circle","irregular"];

// ── Voices ───────────────────────────────────────────────────────────────────
var VOICES = {
  // ── original 16 ──
  wave:    { emoji:"🌊", palette:"water",  shapes:["ring","blob"],      cohesion:"radial",      affinities:["tide","deep"],    displaces:["ember","forge"] },
  ember:   { emoji:"🔥", palette:"fire",   shapes:["spike","scatter"],  cohesion:"directional", affinities:["forge","spark"],   displaces:["wave","frost"] },
  tangle:  { emoji:"🕸️", palette:"poison", shapes:["scatter","line"],   cohesion:"scattered",   affinities:["spore","gloom"],  displaces:["spark","gleam"] },
  grove:   { emoji:"🌿", palette:"nature", shapes:["blob","irregular"], cohesion:"radial",      affinities:["spore","wave"],   displaces:["forge","ember"] },
  spark:   { emoji:"⚡", palette:"ice",    shapes:["cross","spike"],    cohesion:"directional", affinities:["gleam","ember"],  displaces:["tangle","gloom"] },
  stone:   { emoji:"🪨", palette:"earth",  shapes:["rect","irregular"], cohesion:"clustered",   affinities:["forge","gloom"],  displaces:["wave","spark"] },
  gleam:   { emoji:"✨", palette:"light",  shapes:["scatter","ring"],   cohesion:"scattered",   affinities:["spark","frost"],  displaces:["gloom","stone"] },
  gloom:   { emoji:"🌑", palette:"ghost",  shapes:["ring","eye"],       cohesion:"scattered",   affinities:["tangle","deep"],  displaces:["gleam","spark"] },
  spore:   { emoji:"🍄", palette:"poison", shapes:["blob","scatter"],   cohesion:"clustered",   affinities:["grove","tangle"], displaces:["spark","forge"] },
  frost:   { emoji:"❄️", palette:"ice",    shapes:["diamond","ring"],   cohesion:"directional", affinities:["wave","gleam"],   displaces:["ember","forge"] },
  deep:    { emoji:"🕳️", palette:"ghost",  shapes:["irregular","ring"], cohesion:"scattered",   affinities:["gloom","wave"],   displaces:["gleam","spark"] },
  forge:   { emoji:"⚙️", palette:"item",   shapes:["diamond","cross"],  cohesion:"directional", affinities:["ember","stone"],  displaces:["grove","wave"] },
  tide:    { emoji:"🌀", palette:"water",  shapes:["ring","blob"],      cohesion:"radial",      affinities:["wave","deep"],    displaces:["ember","stone"] },
  verdant: { emoji:"🌱", palette:"nature", shapes:["line","scatter"],   cohesion:"radial",      affinities:["grove","spore"],  displaces:["forge","ember"] },
  soot:    { emoji:"🌫️", palette:"earth",  shapes:["scatter","irregular"],cohesion:"scattered",  affinities:["gloom","stone"],  displaces:["gleam","spark"] },
  gilded:  { emoji:"💛", palette:"light",  shapes:["diamond","circle"], cohesion:"clustered",   affinities:["gleam","forge"],  displaces:["gloom","deep"] },
  // ── creature / organic ──
  tentacle:{ emoji:"🐙", palette:"poison", shapes:["blob","ring"],      cohesion:"radial",      affinities:["deep","tide"],    displaces:["forge","spark"] },
  scale:   { emoji:"🦎", palette:"nature", shapes:["rect","spike"],     cohesion:"directional", affinities:["grove","stone"],  displaces:["frost","gleam"] },
  larva:   { emoji:"🐛", palette:"poison", shapes:["blob","line"],      cohesion:"clustered",   affinities:["spore","tangle"], displaces:["gleam","forge"] },
  flutter: { emoji:"🦋", palette:"light",  shapes:["scatter","circle"], cohesion:"scattered",   affinities:["gleam","verdant"],displaces:["stone","deep"] },
  plume:   { emoji:"🪶", palette:"creature",shapes:["line","scatter"],  cohesion:"directional", affinities:["flutter","spark"],displaces:["stone","tide"] },
  shell:   { emoji:"🐚", palette:"earth",  shapes:["circle","ring"],    cohesion:"clustered",   affinities:["tide","stone"],   displaces:["ember","spark"] },
  fang:    { emoji:"🦷", palette:"ghost",  shapes:["spike","diamond"],  cohesion:"directional", affinities:["skull","forge"],  displaces:["grove","flutter"] },
  bone:    { emoji:"🦴", palette:"earth",  shapes:["line","cross"],     cohesion:"directional", affinities:["skull","stone"],  displaces:["grove","spore"] },
  // ── environmental ──
  summit:  { emoji:"🏔️", palette:"ice",    shapes:["diamond","rect"],   cohesion:"clustered",   affinities:["frost","stone"],  displaces:["deep","tide"] },
  eruption:{ emoji:"🌋", palette:"fire",   shapes:["spike","blob"],     cohesion:"radial",      affinities:["ember","stone"],  displaces:["frost","wave"] },
  coral:   { emoji:"🪸", palette:"creature",shapes:["blob","scatter"],  cohesion:"clustered",   affinities:["tide","shell"],   displaces:["soot","forge"] },
  wither:  { emoji:"🍂", palette:"earth",  shapes:["scatter","irregular"],cohesion:"scattered",  affinities:["soot","grove"],   displaces:["gleam","spark"] },
  grain:   { emoji:"🌾", palette:"nature", shapes:["line","scatter"],   cohesion:"directional", affinities:["verdant","grove"],displaces:["deep","gloom"] },
  bubble:  { emoji:"🫧", palette:"water",  shapes:["circle","scatter"], cohesion:"scattered",   affinities:["wave","flutter"], displaces:["forge","stone"] },
  // ── celestial / abstract ──
  oracle:  { emoji:"🔮", palette:"ghost",  shapes:["circle","ring"],    cohesion:"radial",      affinities:["gloom","gleam"],  displaces:["forge","bone"] },
  gem:     { emoji:"💎", palette:"ice",    shapes:["diamond","rect"],   cohesion:"clustered",   affinities:["gilded","frost"], displaces:["soot","spore"] },
  prism:   { emoji:"🪩", palette:"light",  shapes:["scatter","diamond"],cohesion:"scattered",   affinities:["gleam","spark"],  displaces:["gloom","deep"] },
  comet:   { emoji:"☄️", palette:"fire",   shapes:["spike","line"],     cohesion:"directional", affinities:["ember","spark"],  displaces:["grove","tide"] },
  mask:    { emoji:"🎭", palette:"ghost",  shapes:["eye","circle"],     cohesion:"radial",      affinities:["gloom","oracle"], displaces:["verdant","grain"] },
  ward:    { emoji:"🧿", palette:"water",  shapes:["eye","ring"],       cohesion:"radial",      affinities:["oracle","tide"],  displaces:["ember","comet"] },
  // ── mood / visceral ──
  skull:   { emoji:"💀", palette:"ghost",  shapes:["cross","eye"],      cohesion:"scattered",   affinities:["bone","fang"],    displaces:["verdant","flutter"] },
  pulse:   { emoji:"🫀", palette:"fire",   shapes:["blob","circle"],    cohesion:"radial",      affinities:["ember","skull"],  displaces:["frost","gem"] },
  think:   { emoji:"🧠", palette:"creature",shapes:["blob","irregular"],cohesion:"clustered",   affinities:["oracle","pulse"], displaces:["stone","forge"] },
  gaze:    { emoji:"👁️", palette:"light",  shapes:["eye","ring"],       cohesion:"radial",      affinities:["oracle","ward"],  displaces:["soot","deep"] },
  ichor:   { emoji:"🩸", palette:"fire",   shapes:["blob","scatter"],   cohesion:"scattered",   affinities:["pulse","tangle"], displaces:["frost","gleam"] },
  // ── playful / strange ──
  circus:  { emoji:"🎪", palette:"creature",shapes:["cross","scatter"], cohesion:"scattered",   affinities:["prism","mask"],   displaces:["stone","bone"] },
  magnet:  { emoji:"🧲", palette:"item",   shapes:["rect","cross"],     cohesion:"directional", affinities:["forge","spark"],  displaces:["grove","bubble"] },
  hook:    { emoji:"🪝", palette:"item",   shapes:["spike","line"],     cohesion:"directional", affinities:["forge","fang"],   displaces:["flutter","bubble"] },
  vessel:  { emoji:"🏺", palette:"earth",  shapes:["circle","rect"],    cohesion:"clustered",   affinities:["shell","stone"],  displaces:["spark","flutter"] },
  charm:   { emoji:"🪬", palette:"ghost",  shapes:["eye","diamond"],    cohesion:"radial",      affinities:["ward","oracle"],  displaces:["forge","magnet"] },
};
var VOICE_KEYS = Object.keys(VOICES);

