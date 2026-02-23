import { useState, useEffect, useRef, useCallback } from "react";

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
    label: "City",
    icon: "▦",
    flavor: "Friends, commerce, and things that remember being useful.",
    bg: "#1a1220",
    accent: "#cc88ff",
    palettePool: ["item","earth","light","ghost"],
    recipePool: ["creature","item","relic"],
    extraHints: ["rect","diamond","line","cross"],
    cohesionBias: ["directional","clustered"],
  },
  jungle: {
    label: "Jungle",
    icon: "❧",
    flavor: "Something watches from every leaf. Most of it is friendly.",
    bg: "#0a1a08",
    accent: "#88ff66",
    palettePool: ["nature","earth","poison","water"],
    recipePool: ["flora","creature","spirit"],
    extraHints: ["blob","scatter","circle","eye"],
    cohesionBias: ["radial","scattered"],
  },
  space: {
    label: "Space",
    icon: "★",
    flavor: "Distant things. Patient things. Things with no hurry whatsoever.",
    bg: "#04040f",
    accent: "#6688ff",
    palettePool: ["ghost","ice","poison","creature"],
    recipePool: ["spirit","creature","terrain"],
    extraHints: ["ring","scatter","circle","spike"],
    cohesionBias: ["scattered","radial"],
  },
  deep: {
    label: "Deep",
    icon: "◎",
    flavor: "Below the usual. Pressure makes things interesting.",
    bg: "#000a14",
    accent: "#00ccff",
    palettePool: ["water","ice","ghost","poison"],
    recipePool: ["creature","spirit","flora"],
    extraHints: ["blob","ring","eye","scatter"],
    cohesionBias: ["radial","clustered"],
  },
  ruin: {
    label: "Ruin",
    icon: "◫",
    flavor: "Something happened here. Not everything left.",
    bg: "#120e08",
    accent: "#cc8844",
    palettePool: ["earth","fire","item","ghost"],
    recipePool: ["relic","terrain","creature"],
    extraHints: ["cross","diamond","line","rect"],
    cohesionBias: ["directional","clustered"],
  },
  forge: {
    label: "Forge",
    icon: "◈",
    flavor: "Hot opinions. Sharp edges. Everything here has a purpose.",
    bg: "#1a0800",
    accent: "#ff6622",
    palettePool: ["fire","light","item","earth"],
    recipePool: ["item","relic","creature"],
    extraHints: ["spike","diamond","cross","line"],
    cohesionBias: ["directional","radial"],
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
};

// ── Recipes ───────────────────────────────────────────────────────────────────
var RECIPES = {
  creature: { label:"Creature", icon:"◈", paletteHints:["creature","ghost","poison","fire"], shapeTypes:["blob","eye","spike","circle","irregular"], countRange:[3,6] },
  item:     { label:"Item",     icon:"◆", paletteHints:["item","earth","light"],             shapeTypes:["rect","diamond","line","circle","cross"],   countRange:[2,4] },
  flora:    { label:"Flora",    icon:"❧", paletteHints:["nature","earth","water"],            shapeTypes:["circle","blob","scatter","line"],           countRange:[3,7] },
  terrain:  { label:"Terrain",  icon:"◇", paletteHints:["earth","nature","water","ice"],      shapeTypes:["rect","scatter","line","irregular"],        countRange:[4,8] },
  spirit:   { label:"Spirit",   icon:"○", paletteHints:["ghost","ice","light","poison"],      shapeTypes:["circle","blob","scatter","ring"],           countRange:[2,5] },
  relic:    { label:"Relic",    icon:"✦", paletteHints:["light","item","fire","ice"],         shapeTypes:["diamond","cross","ring","circle","spike"],  countRange:[2,5] },
};

// ── Cohesion Modes ────────────────────────────────────────────────────────────
// Each mode defines how shapes are placed relative to the center.
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
  // Capitalize
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function generateDescription(seed) {
  var rng = seededRng(seed + 77777);
  return pick(DESC_STARTS, rng) + " " + pick(DESC_SUBJECTS, rng) + ". " + pick(DESC_CODAS, rng);
}

// ── Pixel Renderer ────────────────────────────────────────────────────────────
var GRID = 48;

function renderCritter(seed, recipeKey, extraShapes, palKey, cohesionMode) {
  var rng = seededRng(seed);
  var recipe = RECIPES[recipeKey] || RECIPES.creature;
  var pal = PALETTES[palKey] || PALETTES.creature;

  // Build shape pool
  var pool = recipe.shapeTypes.slice();
  for (var ei = 0; ei < extraShapes.length; ei++) {
    pool.push(extraShapes[ei]);
    pool.push(extraShapes[ei]); // weight extras
  }

  // Pixel grid — null = transparent
  var grid = new Array(GRID * GRID).fill(null);

  function setPixel(x, y, color) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || x >= GRID || y < 0 || y >= GRID) return;
    grid[y * GRID + x] = color;
  }

  function fillCircle(cx, cy, r, color) {
    cx = Math.round(cx); cy = Math.round(cy); r = Math.round(r);
    for (var dy = -r; dy <= r; dy++) {
      for (var dx = -r; dx <= r; dx++) {
        if (dx*dx + dy*dy <= r*r) setPixel(cx+dx, cy+dy, color);
      }
    }
  }

  function strokeRing(cx, cy, r, color) {
    cx = Math.round(cx); cy = Math.round(cy);
    for (var dy = -r; dy <= r; dy++) {
      for (var dx = -r; dx <= r; dx++) {
        var d2 = dx*dx + dy*dy;
        if (d2 <= r*r && d2 >= (r-2)*(r-2)) setPixel(cx+dx, cy+dy, color);
      }
    }
  }

  function fillRect(x, y, w, h, color) {
    for (var ry = y; ry < y+h; ry++)
      for (var rx = x; rx < x+w; rx++)
        setPixel(rx, ry, color);
  }

  function fillDiamond(cx, cy, r, color) {
    cx = Math.round(cx); cy = Math.round(cy);
    for (var dy = -r; dy <= r; dy++) {
      var hw = r - Math.abs(dy);
      for (var dx = -hw; dx <= hw; dx++) setPixel(cx+dx, cy+dy, color);
    }
  }

  function drawBlob(cx, cy, r, color) {
    cx = Math.round(cx); cy = Math.round(cy);
    fillCircle(cx, cy, Math.max(2, r-1), color);
    var pts = 8 + Math.floor(rng() * 6);
    for (var i = 0; i < pts; i++) {
      var a = (i / pts) * Math.PI * 2;
      var wobble = r + (rng()-0.5) * r * 0.6;
      fillCircle(cx + Math.round(Math.cos(a)*wobble*0.7), cy + Math.round(Math.sin(a)*wobble*0.7), Math.max(1, Math.round(wobble*0.25)), color);
    }
  }

  function drawLine(x1, y1, x2, y2, color) {
    var dx = x2-x1, dy = y2-y1;
    var steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)));
    for (var i = 0; i <= steps; i++) {
      var t = steps === 0 ? 0 : i/steps;
      setPixel(x1 + dx*t, y1 + dy*t, color);
    }
  }

  function drawSpike(cx, cy, angle, len, color) {
    for (var t = 0; t < len; t++) {
      setPixel(cx + Math.cos(angle)*t, cy + Math.sin(angle)*t, color);
    }
  }

  // Color choices
  var mainColor   = pal[2];
  var accentColor = pal[4];
  var midColor    = pal[3];
  var darkColor   = pal[1];
  var lightColor  = pal[5];

  var cx = GRID/2 + (rng()-0.5)*6;
  var cy = GRID/2 + (rng()-0.5)*6;

  // Cohesion parameters
  var mode = cohesionMode || "radial";
  var flowAngle = rng() * Math.PI * 2; // for directional mode

  var count = recipe.countRange[0] + Math.floor(rng() * (recipe.countRange[1] - recipe.countRange[0] + 1));

  for (var si = 0; si < count; si++) {
    var shapeType = pick(pool, rng);
    var color = si === 0 ? mainColor : (rng() > 0.45 ? mainColor : (rng() > 0.5 ? accentColor : midColor));
    var sz = 3 + Math.floor(rng() * 9);

    // Position based on cohesion mode
    var ox, oy;
    switch(mode) {
      case "radial":
        var ra = rng() * Math.PI * 2;
        var rd = (si === 0 ? 0 : 4 + rng() * 12);
        ox = cx + Math.cos(ra) * rd;
        oy = cy + Math.sin(ra) * rd;
        break;
      case "directional":
        var dd = (si / count) * 22 - 11;
        var perp = (rng()-0.5) * 8;
        ox = cx + Math.cos(flowAngle) * dd + Math.cos(flowAngle + Math.PI/2) * perp;
        oy = cy + Math.sin(flowAngle) * dd + Math.sin(flowAngle + Math.PI/2) * perp;
        break;
      case "clustered":
        ox = cx + (rng()-0.5) * 14;
        oy = cy + (rng()-0.5) * 14;
        sz = Math.max(2, sz - 2); // slightly smaller, denser
        break;
      case "scattered":
        ox = cx + (rng()-0.5) * 30;
        oy = cy + (rng()-0.5) * 30;
        sz = Math.max(2, sz - 1);
        break;
      default:
        ox = cx + (rng()-0.5) * 20;
        oy = cy + (rng()-0.5) * 20;
    }

    switch(shapeType) {
      case "blob":
        drawBlob(ox, oy, sz, color);
        break;
      case "circle":
        fillCircle(ox, oy, sz, color);
        break;
      case "ring":
        strokeRing(Math.round(ox), Math.round(oy), sz, color);
        break;
      case "rect":
        var rw = 3 + Math.floor(rng() * sz * 1.2);
        var rh = 3 + Math.floor(rng() * sz * 1.2);
        fillRect(Math.round(ox-rw/2), Math.round(oy-rh/2), rw, rh, color);
        break;
      case "diamond":
        fillDiamond(ox, oy, sz, color);
        break;
      case "eye":
        fillCircle(ox, oy, Math.max(2, sz), lightColor);
        fillCircle(ox + Math.round((rng()-0.5)*2), oy + Math.round((rng()-0.5)*2), Math.max(1, Math.floor(sz*0.5)), darkColor);
        // highlight
        setPixel(Math.round(ox)-1, Math.round(oy)-1, lightColor);
        break;
      case "spike":
        var sCount = 3 + Math.floor(rng() * 5);
        var baseAngle = mode === "directional" ? flowAngle : rng() * Math.PI * 2;
        for (var spi = 0; spi < sCount; spi++) {
          var sAngle = baseAngle + (spi/sCount) * Math.PI * 2;
          drawSpike(Math.round(ox), Math.round(oy), sAngle, sz + Math.floor(rng()*5), color);
        }
        break;
      case "scatter":
        var dotCount = 3 + Math.floor(rng() * 8);
        for (var di = 0; di < dotCount; di++) {
          var spread = mode === "scattered" ? 8 : 5;
          var dx = ox + (rng()-0.5)*sz*spread*0.4;
          var dy2 = oy + (rng()-0.5)*sz*spread*0.4;
          setPixel(Math.round(dx), Math.round(dy2), color);
          if (rng() > 0.5) setPixel(Math.round(dx)+1, Math.round(dy2), color);
        }
        break;
      case "line":
        var la = mode === "directional" ? flowAngle + (rng()-0.5)*0.4 : rng()*Math.PI*2;
        var ll = sz + Math.floor(rng()*8);
        drawLine(Math.round(ox-Math.cos(la)*ll), Math.round(oy-Math.sin(la)*ll), Math.round(ox+Math.cos(la)*ll), Math.round(oy+Math.sin(la)*ll), color);
        break;
      case "cross":
        var csz = sz;
        fillRect(Math.round(ox-csz), Math.round(oy-1), csz*2, 3, color);
        fillRect(Math.round(ox-1), Math.round(oy-csz), 3, csz*2, color);
        break;
      case "irregular":
        var ipts = 4 + Math.floor(rng()*4);
        var ipx = Math.round(ox), ipy = Math.round(oy);
        for (var ip = 0; ip < ipts; ip++) {
          var inx = Math.round(ox + (rng()-0.5)*sz*2.5);
          var iny = Math.round(oy + (rng()-0.5)*sz*2.5);
          drawLine(ipx, ipy, inx, iny, color);
          ipx = inx; ipy = iny;
        }
        break;
    }
  }

  // Accent highlights
  if (rng() > 0.35) {
    var hlCount = 1 + Math.floor(rng()*3);
    for (var hli = 0; hli < hlCount; hli++) {
      var hlx = cx + (rng()-0.5)*16;
      var hly = cy + (rng()-0.5)*16;
      setPixel(Math.round(hlx), Math.round(hly), lightColor);
    }
  }

  return grid;
}

// ── Pixel Canvas (static, single render) ─────────────────────────────────────
function PixelCanvas({ seed, recipeKey, extraShapes, palKey, cohesionMode, size }) {
  var canvasRef = useRef(null);
  useEffect(function() {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var grid = renderCritter(seed, recipeKey, extraShapes || [], palKey, cohesionMode);
    var ctx = canvas.getContext("2d");
    var ps = size / GRID;
    canvas.width = size; canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    for (var y = 0; y < GRID; y++)
      for (var x = 0; x < GRID; x++) {
        var color = grid[y * GRID + x];
        if (color) { ctx.fillStyle = color; ctx.fillRect(x * ps, y * ps, ps, ps); }
      }
  }, [seed, recipeKey, extraShapes, palKey, cohesionMode, size]);
  return <canvas ref={canvasRef} width={size} height={size} style={{ imageRendering:"pixelated", display:"block" }} />;
}

// ── Animated Canvas (RAF loop, reads gridRef directly so loop never restarts) ──
function AnimatedCanvas({ seed, recipeKey, extraShapes, palKey, cohesionMode, size }) {
  var canvasRef = useRef(null);
  var gridRef = useRef(null);
  var rafRef = useRef(null);
  var startRef = useRef(Date.now());

  useEffect(function() {
    gridRef.current = renderCritter(seed, recipeKey, extraShapes || [], palKey, cohesionMode);
  }, [seed, recipeKey, extraShapes, palKey, cohesionMode]);

  useEffect(function() {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var ps = size / GRID;
    canvas.width = size; canvas.height = size;
    function draw() {
      var grid = gridRef.current;
      if (!grid) { rafRef.current = requestAnimationFrame(draw); return; }
      var t = (Date.now() - startRef.current) / 1000;
      ctx.clearRect(0, 0, size, size);
      for (var y = 0; y < GRID; y++)
        for (var x = 0; x < GRID; x++) {
          var color = grid[y * GRID + x];
          if (!color) continue;
          var breathe = Math.sin(t * 1.6 + (x + y) * 0.18) * 0.9;
          ctx.fillStyle = color;
          ctx.fillRect(x * ps, y * ps + breathe, ps, ps);
        }
      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return function() { cancelAnimationFrame(rafRef.current); };
  }, [size]);

  return <canvas ref={canvasRef} width={size} height={size} style={{ imageRendering:"pixelated", display:"block" }} />;
}

// ── Live Critter ──────────────────────────────────────────────────────────────
function LiveCritter({ critter, size }) {
  return (
    <AnimatedCanvas
      seed={critter.seed}
      recipeKey={critter.recipeKey}
      extraShapes={critter.extraShapes}
      palKey={critter.palKey}
      cohesionMode={critter.cohesionMode}
      size={size}
    />
  );
}

// ── Bounce Reveal Animation ───────────────────────────────────────────────────
function BounceReveal({ critters, onSelect, selected, worldBg }) {
  var [visible, setVisible] = useState([]);
  var [popped, setPopped] = useState([]);

  useEffect(function() {
    setVisible([]);
    setPopped([]);
    if (!critters || critters.length === 0) return;
    critters.forEach(function(_, i) {
      setTimeout(function() {
        setVisible(function(v) { return v.concat([i]); });
        setTimeout(function() {
          setPopped(function(p) { return p.concat([i]); });
        }, 180);
      }, i * 90);
    });
  }, [critters]);

  if (!critters || critters.length === 0) return null;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8 }}>
      {critters.map(function(c, i) {
        var isVisible = visible.includes(i);
        var isPopped = popped.includes(i);
        var isSel = selected === i;
        return (
          <div key={c.seed} onClick={function() { onSelect(isSel ? null : i); }}
            style={{
              position:"relative",
              cursor:"pointer",
              transform: isPopped ? "scale(1)" : isVisible ? "scale(1.15)" : "scale(0) translateY(20px)",
              opacity: isVisible ? 1 : 0,
              transition: isPopped
                ? "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s"
                : "transform 0.18s ease-out, opacity 0.15s",
              border: "3px solid " + (isSel ? "#9bbc0f" : "transparent"),
              borderRadius: 4,
              background: isSel ? "rgba(155,188,15,0.08)" : "transparent",
            }}>
            <PixelCanvas
              seed={c.seed}
              recipeKey={c.recipeKey}
              extraShapes={c.extraShapes}
              palKey={c.palKey}
              cohesionMode={c.cohesionMode}
              size={80}
              bgColor={null}
            />
            {/* Pop confetti */}
            {isPopped && !isSel && (
              <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                {[...Array(5)].map(function(_, ci) {
                  var angle = (ci/5)*360;
                  return (
                    <div key={ci} style={{
                      position:"absolute",
                      top:"50%", left:"50%",
                      width:3, height:3,
                      background:["#9bbc0f","#ffcc44","#ff6644","#44ccff","#cc44ff"][ci],
                      borderRadius:1,
                      transform:"rotate("+angle+"deg) translateY(-24px)",
                      animation:"confettiFly 0.5s ease-out "+ci*30+"ms forwards",
                      opacity:0,
                    }} />
                  );
                })}
              </div>
            )}
            <div style={{ fontSize:5, color:"#4a7a00", textAlign:"center", marginTop:2, opacity: isPopped ? 1 : 0, transition:"opacity 0.3s 0.2s", lineHeight:1.8 }}>
              {RECIPES[c.recipeKey] ? RECIPES[c.recipeKey].icon + " " + c.recipeKey : "◈"}
              {c.worldNote ? <span style={{ color:"#9bbc0f", display:"block", fontSize:4, opacity:0.8 }}>{c.worldNote}</span> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function CritterCrank() {
  var [worldKey, setWorldKey] = useState(null); // null = world select screen
  var [recipeKey, setRecipeKey] = useState("creature");
  var [extraShapes, setExtraShapes] = useState([]);
  var [palKey, setPalKey] = useState(null);
  var [cohesionMode, setCohesionMode] = useState(null); // null = auto from world
  var [rolls, setRolls] = useState([]);
  var [selected, setSelected] = useState(null);
  var [collection, setCollection] = useState([]);
  var [view, setView] = useState("crank");
  var [cranking, setCranking] = useState(false);
  var [crankAngle, setCrankAngle] = useState(0);
  var [selectedCritter, setSelectedCritter] = useState(null); // expanded in collection
  var [editingDesc, setEditingDesc] = useState(false);
  var [customDesc, setCustomDesc] = useState("");

  var world = worldKey ? WORLDS[worldKey] : null;

  useEffect(function() {
    (async function() {
      try {
        var r = await window.storage.get("critter-collection-v2");
        if (r) setCollection(JSON.parse(r.value));
      } catch(e) {}
    })();
  }, []);

  function saveCollection(next) {
    setCollection(next);
    window.storage.set("critter-collection-v2", JSON.stringify(next)).catch(function(){});
  }

  function handleCrank() {
    if (cranking || !worldKey) return;
    setCranking(true);
    var start = Date.now();
    var duration = 500;
    function animate() {
      var p = Math.min((Date.now()-start)/duration, 1);
      setCrankAngle(p * 380);
      if (p < 1) { requestAnimationFrame(animate); }
      else {
        setCrankAngle(0);
        setCranking(false);
        doRoll();
      }
    }
    requestAnimationFrame(animate);
  }

  function doRoll() {
    var w = WORLDS[worldKey];
    var now = Date.now();
    var newRolls = [];
    for (var i = 0; i < 6; i++) {
      var seed = now + i * 7919 + Math.floor(Math.random()*99999);
      var rng = seededRng(seed + 1234);
      // World suggests recipe and extras, but has its own opinions
      var rKey = recipeKey;
      var worldNote = [];
      if (rng() > 0.6) { rKey = pick(w.recipePool, rng); if (rKey !== recipeKey) worldNote.push(rKey); }
      var rExtras = extraShapes.slice();
      if (rng() > 0.5) { // world asserts itself more often
        var hint = pick(w.extraHints, rng);
        if (!rExtras.includes(hint)) { rExtras.push(hint); worldNote.push("+"+hint); }
      }
      var rPal = palKey || pick(w.palettePool, rng);
      var rCohesion = cohesionMode || pick(w.cohesionBias, rng);
      newRolls.push({ seed, recipeKey: rKey, extraShapes: rExtras, palKey: rPal, cohesionMode: rCohesion, worldNote: worldNote.join(" ") });
    }
    setRolls(newRolls);
    setSelected(null);
  }

  function toggleExtra(shape) {
    setExtraShapes(function(prev) {
      return prev.includes(shape) ? prev.filter(function(e){return e!==shape;}) : prev.concat([shape]);
    });
  }

  function keepSelected() {
    if (selected === null || !rolls[selected]) return;
    var roll = rolls[selected];
    var critter = {
      id: roll.seed,
      seed: roll.seed,
      recipeKey: roll.recipeKey,
      extraShapes: roll.extraShapes,
      palKey: roll.palKey,
      cohesionMode: roll.cohesionMode,
      name: generateName(roll.seed),
      description: generateDescription(roll.seed),
      worldKey: worldKey,
      collected: Date.now(),
    };
    saveCollection(collection.concat([critter]));
    setSelected(null);
    setRolls(function(prev) { return prev.filter(function(_, i){return i!==selected;}); });
  }

  function releaseFromCollection(id) {
    saveCollection(collection.filter(function(c){return c.id!==id;}));
    if (selectedCritter && selectedCritter.id === id) setSelectedCritter(null);
  }

  function exportAsEntity(critter) {
    var recipe = RECIPES[critter.recipeKey] || RECIPES.creature;
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

  var worldBg = world ? world.bg : "#04040a";
  var worldAccent = world ? world.accent : "#9bbc0f";

  // ── World Select Screen ───────────────────────────────────────────────────
  if (!worldKey) {
    return (
      <div style={{ minHeight:"100vh", background:"#04040a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Press Start 2P', monospace", padding:20 }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          * { box-sizing: border-box; }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
          @keyframes worldIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
          .world-btn:hover { transform: scale(1.04) !important; filter: brightness(1.2); }
        `}</style>
        <div style={{ textAlign:"center", maxWidth:480 }}>
          <div style={{ fontSize:10, color:"#ffcc44", letterSpacing:"0.15em", marginBottom:8, textShadow:"0 0 12px #ffcc44aa" }}>✦ CRITTER CRANK ✦</div>
          <div style={{ fontSize:6, color:"#444422", marginBottom:40, letterSpacing:"0.1em", animation:"pulse 2s infinite" }}>where do you want to go?</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:10 }}>
            {WORLD_KEYS.map(function(k, i) {
              var w = WORLDS[k];
              return (
                <button key={k} className="world-btn" onClick={function(){setWorldKey(k);}}
                  style={{
                    background:"#0a0a10", border:"2px solid #2a2a3a",
                    borderRadius:6, padding:"14px 10px", cursor:"pointer",
                    textAlign:"left", fontFamily:"inherit",
                    animation:"worldIn 0.4s ease "+(i*60)+"ms backwards",
                    transition:"transform 0.15s, filter 0.15s",
                  }}>
                  <div style={{ fontSize:16, marginBottom:6 }}>{w.icon}</div>
                  <div style={{ fontSize:7, color:"#e0e0c0", marginBottom:6, letterSpacing:"0.08em" }}>{w.label.toUpperCase()}</div>
                  <div style={{ fontSize:5, color:"#4a4a3a", lineHeight:1.8 }}>{w.flavor}</div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop:24, fontSize:5, color:"#1a1a0a" }}>insert coin to begin</div>
        </div>
      </div>
    );
  }

  // ── Main Machine ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:worldBg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Press Start 2P', monospace", padding:"16px 10px", transition:"background 0.5s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        * { box-sizing: border-box; }
        @keyframes screenFlicker { 0%,100%{opacity:1} 93%{opacity:0.97} 94%{opacity:1} }
        @keyframes confettiFly { 0%{opacity:1;transform:rotate(var(--a,0deg)) translateY(-10px)} 100%{opacity:0;transform:rotate(var(--a,0deg)) translateY(-32px)} }
        @keyframes critterIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
        .btn-3d { box-shadow: 0 3px 0 rgba(0,0,0,0.5); transition: all 0.1s; }
        .btn-3d:hover { filter: brightness(1.15); }
        .btn-3d:active { transform: translateY(2px); box-shadow: 0 1px 0 rgba(0,0,0,0.5); }
        .recipe-btn { transition: all 0.15s; }
        .recipe-btn:hover { filter: brightness(1.2); }
        .extra-btn { transition: all 0.15s; }
        .extra-btn:hover { filter: brightness(1.3); }
      `}</style>

      <div style={{ width:"100%", maxWidth:500 }}>

        {/* Machine body */}
        <div style={{
          background:"linear-gradient(160deg, #8b2252 0%, #6b1a3e 40%, #4a1228 100%)",
          borderRadius:20, padding:"22px 20px 26px",
          boxShadow:"0 20px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -3px 0 rgba(0,0,0,0.4)",
          border:"3px solid #2a0a18",
        }}>

          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <div style={{ fontSize:7, color:"#ffcc44", letterSpacing:"0.12em", textShadow:"0 0 8px #ffcc44aa" }}>✦ CRITTER CRANK ✦</div>
              <div style={{ fontSize:5, color:worldAccent, marginTop:3, letterSpacing:"0.08em" }}>{world.icon} {world.label.toUpperCase()}</div>
            </div>
            <button onClick={function(){setWorldKey(null);setRolls([]);setSelected(null);}}
              className="btn-3d"
              style={{ background:"#2a0a18", border:"2px solid #3a1228", color:"#664455", fontSize:5, padding:"5px 8px", cursor:"pointer", borderRadius:3, fontFamily:"inherit" }}>
              ← WORLDS
            </button>
          </div>

          {/* Screen bezel */}
          <div style={{ background:"#120008", borderRadius:10, padding:10, border:"4px solid #1a0010", boxShadow:"inset 0 4px 16px rgba(0,0,0,0.9), 0 2px 0 rgba(255,255,255,0.04)", marginBottom:14 }}>
            {/* Screen */}
            <div style={{ background:"#080f00", borderRadius:6, padding:10, position:"relative", minHeight:220, animation:"screenFlicker 10s infinite", boxShadow:"inset 0 0 24px rgba(155,188,15,0.06)" }}>
              {/* Phosphor tint */}
              <div style={{ position:"absolute", inset:0, background:"rgba(155,188,15,0.03)", borderRadius:6, pointerEvents:"none", zIndex:10 }} />
              {/* Scanlines */}
              <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)", borderRadius:6, pointerEvents:"none", zIndex:11 }} />

              {/* Tabs */}
              <div style={{ display:"flex", gap:5, marginBottom:10, position:"relative", zIndex:1 }}>
                {[["crank","CRANK"],["collection","HAUL ("+collection.length+")"]].map(function(item) {
                  var k = item[0], label = item[1];
                  var isActive = view === k;
                  return (
                    <button key={k} onClick={function(){setView(k); setSelectedCritter(null);}}
                      style={{ background:isActive?"#9bbc0f":"#0a1400", border:"2px solid "+(isActive?"#9bbc0f":"#1a2a00"), color:isActive?"#0a0a00":"#3a5a00", fontSize:5, padding:"4px 8px", cursor:"pointer", borderRadius:2, fontFamily:"inherit", letterSpacing:"0.06em" }}>
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* CRANK VIEW */}
              {view === "crank" ? (
                <div style={{ position:"relative", zIndex:1 }}>
                  {rolls.length === 0 ? (
                    <div style={{ textAlign:"center", padding:"28px 0", color:"#1a2a00" }}>
                      <div style={{ fontSize:18, marginBottom:10, opacity:0.4 }}>{world.icon}</div>
                      <div style={{ fontSize:5, lineHeight:2.2, color:"#2a4000" }}>turn the crank</div>
                      <div style={{ fontSize:5, color:"#1a2800", lineHeight:2 }}>{world.flavor}</div>
                    </div>
                  ) : (
                    <div>
                      <BounceReveal
                        critters={rolls}
                        onSelect={setSelected}
                        selected={selected}
                        worldBg={worldBg}
                      />
                      {selected !== null && rolls[selected] ? (
                        <div style={{ marginTop:10, textAlign:"center", animation:"critterIn 0.2s ease" }}>
                          <div style={{ fontSize:6, color:"#9bbc0f", marginBottom:2 }}>{generateName(rolls[selected].seed)}</div>
                          <div style={{ fontSize:5, color:"#4a6a00", marginBottom:8, lineHeight:1.8 }}>{generateDescription(rolls[selected].seed)}</div>
                          <button onClick={keepSelected} className="btn-3d"
                            style={{ background:"#9bbc0f", border:"2px solid #7a9a0a", color:"#0a0f00", fontSize:6, padding:"6px 16px", cursor:"pointer", borderRadius:3, fontFamily:"inherit" }}>
                            KEEP
                          </button>
                        </div>
                      ) : (
                        <div style={{ textAlign:"center", fontSize:5, color:"#1a2800", marginTop:8 }}>tap to meet them · keep to collect</div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}

              {/* COLLECTION VIEW */}
              {view === "collection" ? (
                <div style={{ position:"relative", zIndex:1 }}>
                  {selectedCritter ? (
                    <div style={{ animation:"critterIn 0.2s ease" }}>
                      <button onClick={function(){setSelectedCritter(null); setEditingDesc(false);}}
                        style={{ background:"none", border:"none", color:"#4a7a00", fontSize:5, cursor:"pointer", fontFamily:"inherit", marginBottom:8 }}>← back</button>
                      <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                        <LiveCritter critter={selectedCritter} size={80} bgColor={null} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:7, color:"#9bbc0f", marginBottom:4 }}>{selectedCritter.name}</div>
                          <div style={{ fontSize:5, color:"#3a5a00", marginBottom:6 }}>{RECIPES[selectedCritter.recipeKey]?.icon} {selectedCritter.worldKey?.toUpperCase()}</div>
                          {editingDesc ? (
                            <textarea
                              value={customDesc}
                              onChange={function(e){setCustomDesc(e.target.value);}}
                              onBlur={function(){
                                var updated = collection.map(function(c){ return c.id===selectedCritter.id ? Object.assign({},c,{description:customDesc}) : c; });
                                saveCollection(updated);
                                setSelectedCritter(Object.assign({},selectedCritter,{description:customDesc}));
                                setEditingDesc(false);
                              }}
                              style={{ width:"100%", background:"#0a1400", border:"1px solid #2a4000", color:"#9bbc0f", fontSize:5, padding:6, fontFamily:"inherit", resize:"none", borderRadius:2, lineHeight:1.8 }}
                              rows={3}
                              autoFocus
                            />
                          ) : (
                            <div onClick={function(){setCustomDesc(selectedCritter.description||""); setEditingDesc(true);}}
                              style={{ fontSize:5, color:"#4a6a00", lineHeight:1.8, cursor:"text", borderBottom:"1px dashed #1a3000" }}>
                              {selectedCritter.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
                        <button onClick={function(){exportAsEntity(selectedCritter);}} className="btn-3d"
                          style={{ background:"#1a2a00", border:"2px solid #3a5a00", color:"#9bbc0f", fontSize:5, padding:"5px 8px", cursor:"pointer", borderRadius:2, fontFamily:"inherit" }}>
                          → SEND TO HALL
                        </button>
                        <button onClick={function(){releaseFromCollection(selectedCritter.id);}} className="btn-3d"
                          style={{ background:"#1a0000", border:"2px solid #3a0000", color:"#880000", fontSize:5, padding:"5px 8px", cursor:"pointer", borderRadius:2, fontFamily:"inherit" }}>
                          RELEASE
                        </button>
                      </div>
                    </div>
                  ) : collection.length === 0 ? (
                    <div style={{ textAlign:"center", padding:"28px 0", color:"#1a2a00" }}>
                      <div style={{ fontSize:5, lineHeight:2.2 }}>your haul is empty</div>
                      <div style={{ fontSize:5, color:"#0a1400" }}>crank to find friends</div>
                    </div>
                  ) : (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:6, maxHeight:200, overflowY:"auto" }}>
                      {collection.map(function(critter) {
                        return (
                          <div key={critter.id} onClick={function(){setSelectedCritter(critter);}}
                            style={{ cursor:"pointer", border:"2px solid #0a1a00", borderRadius:3, padding:3, transition:"border-color 0.15s" }}
                            onMouseEnter={function(e){e.currentTarget.style.borderColor="#4a7a00";}}
                            onMouseLeave={function(e){e.currentTarget.style.borderColor="#0a1a00";}}>
                            <LiveCritter critter={critter} size={54} bgColor={null} />
                            <div style={{ fontSize:4, color:"#2a4a00", marginTop:2, textAlign:"center", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
                              {critter.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Controls */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:5, color:"#cc6688", letterSpacing:"0.1em", marginBottom:6 }}>RECIPE</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              {Object.keys(RECIPES).map(function(k) {
                var r = RECIPES[k];
                var isActive = recipeKey === k;
                return (
                  <button key={k} className="recipe-btn btn-3d" onClick={function(){setRecipeKey(k);}}
                    style={{ background:isActive?"#9bbc0f":"#1a0010", border:"2px solid "+(isActive?"#7a9a0a":"#3a1028"), color:isActive?"#0a0f00":"#6a3a5a", fontSize:5, padding:"5px 7px", cursor:"pointer", borderRadius:3, fontFamily:"inherit" }}>
                    {r.icon} {r.label.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:5, color:"#cc6688", letterSpacing:"0.1em", marginBottom:6 }}>ALSO ADD</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              {["blob","eye","spike","scatter","ring","cross","line","diamond","rect","circle","irregular"].map(function(shape) {
                var isActive = extraShapes.includes(shape);
                return (
                  <button key={shape} className="extra-btn btn-3d" onClick={function(){toggleExtra(shape);}}
                    style={{ background:isActive?"#2a1a40":"#12000e", border:"2px solid "+(isActive?"#8866cc":"#3a1030"), color:isActive?"#cc99ff":"#5a2a4a", fontSize:5, padding:"4px 6px", cursor:"pointer", borderRadius:3, fontFamily:"inherit" }}>
                    {shape.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:5, color:"#cc6688", letterSpacing:"0.1em", marginBottom:6 }}>PALETTE · COHESION</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:6 }}>
              <button onClick={function(){setPalKey(null);}} className="btn-3d"
                style={{ background:palKey===null?"#9bbc0f":"#12000e", border:"2px solid "+(palKey===null?"#7a9a0a":"#2a1020"), color:palKey===null?"#0a0f00":"#4a3a40", fontSize:5, padding:"4px 6px", cursor:"pointer", borderRadius:3, fontFamily:"inherit" }}>
                AUTO
              </button>
              {Object.keys(PALETTES).map(function(pk) {
                var pal = PALETTES[pk];
                var isActive = palKey === pk;
                return (
                  <button key={pk} onClick={function(){setPalKey(pk);}} className="btn-3d"
                    style={{ background:isActive?pal[2]:"#12000e", border:"2px solid "+(isActive?pal[3]:"#2a1020"), color:isActive?"#fff":"#4a3a40", fontSize:5, padding:"4px 6px", cursor:"pointer", borderRadius:3, fontFamily:"inherit" }}>
                    {pk.slice(0,4).toUpperCase()}
                  </button>
                );
              })}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              <button onClick={function(){setCohesionMode(null);}} className="btn-3d"
                style={{ background:cohesionMode===null?"#9bbc0f":"#12000e", border:"2px solid "+(cohesionMode===null?"#7a9a0a":"#2a1020"), color:cohesionMode===null?"#0a0f00":"#4a3a40", fontSize:5, padding:"4px 6px", cursor:"pointer", borderRadius:3, fontFamily:"inherit" }}>
                AUTO
              </button>
              {Object.keys(COHESION_MODES).map(function(mk) {
                var isActive = cohesionMode === mk;
                return (
                  <button key={mk} onClick={function(){setCohesionMode(mk);}} className="btn-3d"
                    style={{ background:isActive?"#3a2a50":"#12000e", border:"2px solid "+(isActive?"#8866cc":"#2a1020"), color:isActive?"#cc99ff":"#4a3a40", fontSize:5, padding:"4px 6px", cursor:"pointer", borderRadius:3, fontFamily:"inherit" }}>
                    {mk.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Crank */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:16, marginTop:4 }}>
            <div style={{ fontSize:5, color:"#3a1a28", textAlign:"right", lineHeight:2 }}>
              <div>{Object.keys(RECIPES).find(function(k){return k===recipeKey;}) ? RECIPES[recipeKey].icon : "◈"}</div>
              <div style={{ color: world ? world.accent : "#9bbc0f", opacity:0.6 }}>{world ? world.label : ""}</div>
            </div>
            <button onClick={handleCrank} disabled={cranking}
              style={{
                background: cranking ? "#1a0a00" : "radial-gradient(circle at 40% 35%, #5a3010, #3d2010)",
                border:"4px solid #1a0800",
                borderRadius:"50%",
                width:70, height:70,
                cursor:cranking?"default":"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 5px 0 #0a0400, 0 8px 16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)",
                transform:cranking?"translateY(3px)":"none",
                transition:"transform 0.1s, box-shadow 0.1s",
                position:"relative", overflow:"hidden",
              }}>
              {/* Sheen */}
              {!cranking && <div style={{ position:"absolute", top:0, left:"-100%", width:"60%", height:"100%", background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", animation:"shimmer 3s infinite 1s" }} />}
              <div style={{ width:8, height:28, background:"linear-gradient(180deg, #ffdd66, #cc8800)", borderRadius:4, transformOrigin:"50% 100%", transform:"rotate("+crankAngle+"deg)", transition:cranking?"none":"transform 0.1s", position:"relative" }}>
                <div style={{ position:"absolute", top:-6, left:-4, width:16, height:16, background:"radial-gradient(circle at 40% 35%, #ffee88, #cc8800)", borderRadius:"50%", border:"2px solid #aa6600", boxShadow:"0 2px 4px rgba(0,0,0,0.4)" }} />
              </div>
            </button>
            <div style={{ fontSize:5, color:"#3a1a28", lineHeight:2 }}>
              <div>{cranking ? "⟳" : "↺"}</div>
              <div>{collection.length} kept</div>
            </div>
          </div>
          <div style={{ textAlign:"center", fontSize:5, color:"#2a0a18", marginTop:6, letterSpacing:"0.08em" }}>
            {cranking ? "dispensing..." : "TURN TO DISPENSE"}
          </div>

        </div>
      </div>
    </div>
  );
}
