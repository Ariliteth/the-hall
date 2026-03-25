// ── Pixel Renderer ───────────────────────────────────────────────────────────
var GRID = 48;

// Pose vocabulary — mirrors EFDP's 5 poses as procedural transform params.
// dx/dy = body lean, sizeMod = radius delta, spreadMod = feature distance mult,
// angleBias = feature angle shift (radians). All scaled by pulseDepth (0–1).
var CRANK_POSES = {
  idle:   { dx: 0,  dy: -1,  sizeMod: 0.5,  spreadMod: 0.08, angleBias: 0,            label: "idle" },
  jump:   { dx: 0,  dy: -2,  sizeMod: 0.5,  spreadMod: 0.2,  angleBias: -Math.PI/2,   label: "jump" },
  land:   { dx: 0,  dy: 2,   sizeMod: -0.5, spreadMod: -0.15,angleBias: Math.PI/2,    label: "land" },
  run:    { dx: 2,  dy: 0,   sizeMod: 0,    spreadMod: 0.1,  angleBias: 0,            label: "run" },
  attack: { dx: 2,  dy: -1,  sizeMod: 1,    spreadMod: 0.25, angleBias: -Math.PI/4,   label: "attack" }
};

// Per-creature idle tempo — derived from seed so each creature breathes at its own pace.
// SPD stat biases faster, DEF biases slower, seed adds ±0.3 jitter.
// Range: ~2.0–4.5 fps. Most land near 3 (current default).
function creatureIdleFps(roll) {
  var rng = seededRng(roll.seed + 51749);  // offset prime — independent from visual + stats RNG
  rng(); rng(); rng();                      // warm up LCG
  var stats = deriveEncounterStats(roll);
  // base 3fps, SPD pulls up (+0.15 per point above 5), DEF pulls down (-0.12 per point above 5)
  var base = 3 + (stats.spd - 5) * 0.15 - (stats.def - 5) * 0.12;
  // seed jitter: ±0.3
  var jitter = (rng() - 0.5) * 0.6;
  return Math.max(2, Math.min(4.5, base + jitter));
}

function renderCritter(seed, recipeKey, extraShapes, palKey, cohesionMode, poseKey, pulseDepth) {
  var rng = seededRng(seed);
  var recipe = RECIPES[recipeKey] || RECIPES.creature;
  var pal = PALETTES[palKey] || PALETTES.creature;

  // Pose resolution — defaults to idle/0 when omitted (zero transform)
  var pose = (poseKey && CRANK_POSES[poseKey]) ? CRANK_POSES[poseKey] : CRANK_POSES.idle;
  var depth = typeof pulseDepth === "number" ? pulseDepth : 0;

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

  var cx = GRID/2 + (rng()-0.5)*6 + pose.dx * depth;
  var cy = GRID/2 + (rng()-0.5)*6 + pose.dy * depth;

  // Cohesion parameters
  var mode = cohesionMode || "radial";
  var flowAngle = rng() * Math.PI * 2;

  // ── Tag bias: read entity/maze context into body-shaping hints ───────────────
  var tagBias = {
    sizeBoost: 0,        // added to base bodyRadius
    bodyPrefer: null,    // "angular"|"organic"|"spiky"|"irregular"|null
    featureDensity: 0,   // added to count
    faceHeavy: false,    // bias features toward upper face
    limbHeavy: false,    // bias features toward outside/limbs
    surfaceLight: false, // fewer features, mostly scatter
  };
  var ctxTags = [];
  if (S && S.crankContext) {
    if (S.crankContext.tags) ctxTags = ctxTags.concat(S.crankContext.tags);
    if (S.crankContext.dominantPinType) ctxTags.push(S.crankContext.dominantPinType);
    if (S.crankContext.kiwiDensity) ctxTags.push(S.crankContext.kiwiDensity);
  }
  ctxTags.forEach(function(tag) {
    switch(tag) {
      case "large": case "mighty":
        tagBias.sizeBoost += 3; tagBias.bodyPrefer = tagBias.bodyPrefer || "organic"; break;
      case "heavy":
        tagBias.sizeBoost += 2; tagBias.bodyPrefer = tagBias.bodyPrefer || "angular"; break;
      case "small": case "nimble": case "quick": case "swift":
        tagBias.sizeBoost -= 2; tagBias.limbHeavy = true; break;
      case "fierce": case "bold":
        tagBias.bodyPrefer = "spiky"; tagBias.limbHeavy = true; tagBias.featureDensity += 1; break;
      case "territorial":
        tagBias.bodyPrefer = "angular"; break;
      case "ancient": case "shifting": case "meandering":
        tagBias.bodyPrefer = "irregular"; break;
      case "subtle": case "quiet": case "patient":
        tagBias.surfaceLight = true; tagBias.featureDensity -= 1; break;
      case "curious": case "attentive": case "watching": case "seeking":
        tagBias.faceHeavy = true; tagBias.featureDensity += 1; break;
      case "poisonous": case "toxic":
        tagBias.bodyPrefer = tagBias.bodyPrefer || "organic"; tagBias.featureDensity += 1; break;
      case "circle": tagBias.bodyPrefer = tagBias.bodyPrefer || "organic"; break;
      case "square": tagBias.bodyPrefer = tagBias.bodyPrefer || "angular"; break;
      case "triangle": tagBias.bodyPrefer = tagBias.bodyPrefer || "spiky"; tagBias.limbHeavy = true; break;
      case "dense": tagBias.featureDensity += 2; break;
      case "sparse": tagBias.surfaceLight = true; tagBias.featureDensity -= 1; break;
    }
  });

  var count = recipe.countRange[0] + Math.floor(rng() * (recipe.countRange[1] - recipe.countRange[0] + 1));
  // Creatures get more features; tagBias can push further in either direction
  if (recipeKey === "creature") {
    count = Math.max(count, 4) + Math.floor(rng() * 3);
    count = Math.max(2, count + tagBias.featureDensity);
  }

  // ── Creature body pass ────────────────────────────────────────────────────────
  // extraShapes (player intent) override tagBias for body type.
  var bodyRadius = 0;
  if (recipeKey === "creature") {
    var baseRadius = 5 + Math.floor(rng() * 6);
    bodyRadius = Math.max(3, Math.min(13, baseRadius + tagBias.sizeBoost + Math.round(pose.sizeMod * depth)));

    var hasAngular = extraShapes.some(function(s) { return s === "rect" || s === "diamond" || s === "cross"; });
    var hasOrganic = extraShapes.some(function(s) { return s === "blob" || s === "circle"; });
    var hasSpiky   = extraShapes.some(function(s) { return s === "spike" || s === "scatter"; });

    // Player extraShapes override tag suggestions
    var bodyPrefer = tagBias.bodyPrefer;
    if (hasAngular) bodyPrefer = "angular";
    else if (hasSpiky) bodyPrefer = "spiky";
    else if (hasOrganic) bodyPrefer = "organic";

    var bodyChoice = rng();
    if (bodyPrefer === "angular") {
      var bw2 = bodyRadius + Math.floor(rng() * 4);
      var bh2 = bodyRadius + Math.floor(rng() * 3);
      fillRect(Math.round(cx - bw2/2), Math.round(cy - bh2/2), bw2, bh2, mainColor);
      fillCircle(cx, cy, Math.floor(bodyRadius * 0.6), mainColor);
    } else if (bodyPrefer === "spiky") {
      fillCircle(cx, cy, bodyRadius - 2, mainColor);
      drawBlob(cx, cy, bodyRadius, mainColor);
    } else if (bodyPrefer === "irregular") {
      fillCircle(cx, cy, bodyRadius - 3, mainColor);
      var bpts = 5 + Math.floor(rng() * 4);
      for (var bi = 0; bi < bpts; bi++) {
        var ba = (bi / bpts) * Math.PI * 2 + rng() * 0.6;
        var br = bodyRadius * (0.7 + rng() * 0.5);
        fillCircle(cx + Math.cos(ba) * br * 0.6, cy + Math.sin(ba) * br * 0.6, 2 + Math.floor(rng() * 3), mainColor);
      }
    } else if (bodyPrefer === "organic" || bodyChoice < 0.45) {
      drawBlob(cx, cy, bodyRadius, mainColor);
    } else if (bodyChoice < 0.75) {
      fillCircle(cx, cy, bodyRadius - 2, mainColor);
      drawBlob(cx, cy, bodyRadius, mainColor);
    } else {
      fillCircle(cx, cy, bodyRadius - 3, mainColor);
      var bpts2 = 5 + Math.floor(rng() * 4);
      for (var bi2 = 0; bi2 < bpts2; bi2++) {
        var ba2 = (bi2 / bpts2) * Math.PI * 2 + rng() * 0.6;
        var br2 = bodyRadius * (0.7 + rng() * 0.5);
        fillCircle(cx + Math.cos(ba2) * br2 * 0.6, cy + Math.sin(ba2) * br2 * 0.6, 2 + Math.floor(rng() * 3), mainColor);
      }
    }
    fillCircle(cx + 1, cy + Math.floor(bodyRadius * 0.4), Math.floor(bodyRadius * 0.4), midColor);
  }

  // ── drawFeature: places one shape, optionally mirrored across body center ─────
  function drawFeature(shapeType, ox, oy, sz, color, mirror) {
    function place(px, py) {
      switch(shapeType) {
        case "blob":   drawBlob(px, py, sz, color); break;
        case "circle": fillCircle(px, py, sz, color); break;
        case "ring":   strokeRing(Math.round(px), Math.round(py), sz, color); break;
        case "rect":
          var rw2 = 3 + Math.floor(rng() * sz * 1.2);
          var rh2 = 3 + Math.floor(rng() * sz * 1.2);
          fillRect(Math.round(px-rw2/2), Math.round(py-rh2/2), rw2, rh2, color);
          break;
        case "diamond": fillDiamond(px, py, sz, color); break;
        case "cross":
          fillRect(Math.round(px-sz), Math.round(py-1), sz*2, 3, color);
          fillRect(Math.round(px-1), Math.round(py-sz), 3, sz*2, color);
          break;
        case "scatter":
          var dotCount2 = 3 + Math.floor(rng() * 6);
          for (var di2 = 0; di2 < dotCount2; di2++) {
            setPixel(Math.round(px + (rng()-0.5)*sz*2), Math.round(py + (rng()-0.5)*sz*2), color);
          }
          break;
        case "line":
          var la2 = rng()*Math.PI*2;
          var ll2 = sz + Math.floor(rng()*8);
          drawLine(Math.round(px-Math.cos(la2)*ll2), Math.round(py-Math.sin(la2)*ll2),
                   Math.round(px+Math.cos(la2)*ll2), Math.round(py+Math.sin(la2)*ll2), color);
          break;
        case "irregular":
          var ipts2 = 4 + Math.floor(rng()*4);
          var ipx2 = Math.round(px), ipy2 = Math.round(py);
          for (var ip2 = 0; ip2 < ipts2; ip2++) {
            var inx2 = Math.round(px + (rng()-0.5)*sz*2.5);
            var iny2 = Math.round(py + (rng()-0.5)*sz*2.5);
            drawLine(ipx2, ipy2, inx2, iny2, color);
            ipx2 = inx2; ipy2 = iny2;
          }
          break;
      }
    }
    place(ox, oy);
    if (mirror) place(cx + (cx - ox), oy);
  }

  for (var si = 0; si < count; si++) {
    var shapeType = pick(pool, rng);
    var color = si === 0 ? mainColor : (rng() > 0.45 ? mainColor : (rng() > 0.5 ? accentColor : midColor));
    var sz = 3 + Math.floor(rng() * 9);

    var ox, oy;
    if (recipeKey === "creature" && bodyRadius > 0) {
      var featureAngle = rng() * Math.PI * 2 + pose.angleBias * depth * 0.3;
      var featureDist;
      if (shapeType === "eye") {
        var faceSpread = tagBias.faceHeavy ? 0.55 : 0.85;
        featureAngle = -Math.PI * 0.5 + (rng() - 0.5) * Math.PI * faceSpread + pose.angleBias * depth * 0.15;
        featureDist = bodyRadius * (0.45 + rng() * 0.4) * (1 + pose.spreadMod * depth);
        sz = Math.max(2, Math.min(sz, 4));
      } else if (shapeType === "spike" || shapeType === "line") {
        var limbPush = tagBias.limbHeavy ? 1.1 : 0.9;
        featureDist = bodyRadius * (limbPush + rng() * 0.45) * (1 + pose.spreadMod * depth);
        sz = 4 + Math.floor(rng() * 7);
      } else if (shapeType === "scatter") {
        featureDist = (tagBias.surfaceLight ? bodyRadius * rng() * 0.6 : bodyRadius * (rng() * 0.75)) * (1 + pose.spreadMod * depth);
      } else {
        if (tagBias.faceHeavy && rng() > 0.5) {
          featureAngle = -Math.PI * 0.5 + (rng() - 0.5) * Math.PI * 1.1 + pose.angleBias * depth * 0.15;
        }
        featureDist = bodyRadius * (0.55 + rng() * 0.55) * (1 + pose.spreadMod * depth);
        sz = Math.max(2, sz - 2);
      }
      ox = cx + Math.cos(featureAngle) * featureDist;
      oy = cy + Math.sin(featureAngle) * featureDist;

      // Mirror chance — bilateral symmetry reads as alive
      var doMirror = shapeType === "eye" ? rng() > 0.3
                   : (shapeType === "spike" || shapeType === "line") ? rng() > 0.45
                   : rng() > 0.72;

      if (shapeType === "eye") {
        fillCircle(ox, oy, Math.max(2, sz), lightColor);
        fillCircle(ox + Math.round((rng()-0.5)*2), oy + Math.round((rng()-0.5)*2), Math.max(1, Math.floor(sz*0.5)), darkColor);
        setPixel(Math.round(ox)-1, Math.round(oy)-1, lightColor);
        if (doMirror) {
          var mx2 = cx + (cx - ox);
          fillCircle(mx2, oy, Math.max(2, sz), lightColor);
          fillCircle(mx2 + Math.round((rng()-0.5)*2), oy + Math.round((rng()-0.5)*2), Math.max(1, Math.floor(sz*0.5)), darkColor);
          setPixel(Math.round(mx2)-1, Math.round(oy)-1, lightColor);
        }
        continue;
      }
      if (shapeType === "spike") {
        var limbAngle = Math.atan2(oy - cy, ox - cx);
        var sCount2 = 1 + Math.floor(rng() * 3);
        for (var spi2 = 0; spi2 < sCount2; spi2++) {
          drawSpike(Math.round(ox), Math.round(oy), limbAngle + (rng()-0.5)*0.7, sz + Math.floor(rng()*5), color);
        }
        if (doMirror) {
          var mox = cx + (cx - ox);
          var mAngle = Math.atan2(oy - cy, mox - cx);
          for (var spi3 = 0; spi3 < sCount2; spi3++) {
            drawSpike(Math.round(mox), Math.round(oy), mAngle + (rng()-0.5)*0.7, sz + Math.floor(rng()*5), color);
          }
        }
        continue;
      }

      drawFeature(shapeType, ox, oy, sz, color, doMirror);
      continue;
    } else {
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
          sz = Math.max(2, sz - 2);
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
        setPixel(Math.round(ox)-1, Math.round(oy)-1, lightColor);
        break;
      case "spike":
        var sCount = 3 + Math.floor(rng() * 5);
        var baseAngle;
        if (recipeKey === "creature" && bodyRadius > 0) {
          // Limb spike: point outward from body center, small fan
          baseAngle = Math.atan2(oy - cy, ox - cx);
          sCount = 1 + Math.floor(rng() * 3); // fewer spikes — more limb-like
          for (var spi = 0; spi < sCount; spi++) {
            var sAngle = baseAngle + (rng()-0.5) * 0.7;
            drawSpike(Math.round(ox), Math.round(oy), sAngle, sz + Math.floor(rng()*5), color);
          }
        } else {
          baseAngle = mode === "directional" ? flowAngle : rng() * Math.PI * 2;
          for (var spi = 0; spi < sCount; spi++) {
            var sAngle = baseAngle + (spi/sCount) * Math.PI * 2;
            drawSpike(Math.round(ox), Math.round(oy), sAngle, sz + Math.floor(rng()*5), color);
          }
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

  // ── Flora body pass ──────────────────────────────────────────────────────────
  // Flora has an orientation axis. Three archetypes: upright, spreading, hanging.
  // The shape loop is skipped for flora — the body pass draws the whole thing.
  if (recipeKey === "flora") {
    // Determine archetype from tagBias, extraShapes, or rng
    var floraArch;
    var hasTall  = extraShapes.some(function(s){ return s==="line"||s==="spike"; })
                || ctxTags.some(function(t){ return t==="tall"||t==="ancient"||t==="proud"; });
    var hasWide  = extraShapes.some(function(s){ return s==="scatter"||s==="blob"; })
                || ctxTags.some(function(t){ return t==="spreading"||t==="patient"||t==="meandering"; });
    var hasDrape = ctxTags.some(function(t){ return t==="hanging"||t==="draping"||t==="shifting"; });
    var isToxic  = ctxTags.some(function(t){ return t==="toxic"||t==="poisonous"; });

    if (S.floraArch) {
      floraArch = S.floraArch; // player selection always wins
    } else if (hasTall || isToxic) floraArch = "upright";
    else if (hasDrape) floraArch = "hanging";
    else if (hasWide) floraArch = "spreading";
    else {
      var archRoll = rng();
      floraArch = archRoll < 0.45 ? "upright" : archRoll < 0.75 ? "spreading" : "hanging";
    }

    var stemColor = mainColor;
    var capColor  = rng() > 0.4 ? accentColor : midColor;
    var detailColor = lightColor;

    if (floraArch === "upright") {
      // ── Upright: spine runs full height. Cap is busy. Below cap is almost nothing.
      var stemH    = 12 + Math.floor(rng() * 10);
      var capR     = 6 + Math.floor(rng() * 8);
      var stemTopX = Math.round(cx + (rng()-0.5) * 4);
      // Spine runs from near-top to near-bottom of canvas
      var spineTopY = Math.round(GRID * 0.12 + rng() * 6);
      var spineBotY = Math.round(GRID * 0.78 + rng() * 6);
      // Cap sits in the upper third
      var capY = spineTopY + Math.floor((spineBotY - spineTopY) * (0.15 + rng() * 0.15));

      // Spine — drawn first, everything else layers on top
      // Thin: 1px, slight wobble
      for (var sy = spineBotY; sy >= spineTopY; sy--) {
        var swobble = rng() > 0.85 ? (rng() > 0.5 ? 1 : -1) : 0;
        setPixel(stemTopX + swobble, sy, stemColor);
      }
      // Slight base thickening
      for (var sbt = 0; sbt < 3; sbt++) {
        setPixel(stemTopX - 1, spineBotY - sbt, stemColor);
        setPixel(stemTopX + 1, spineBotY - sbt, stemColor);
      }

      // Cap — flat ellipse, wide and shallow, sits on the spine
      var capX = stemTopX + Math.round((rng()-0.5) * 2);
      var capW = capR + 3 + Math.floor(rng() * 5);
      var capH = Math.max(3, Math.floor(capR * 0.48 + rng() * 2));
      for (var ey = -capH; ey <= capH; ey++) {
        var halfW = Math.round(capW * Math.sqrt(Math.max(0, 1 - (ey/capH)*(ey/capH))));
        for (var ex = -halfW; ex <= halfW; ex++) setPixel(capX + ex, capY + ey, capColor);
      }
      // Underside rim
      for (var ci2 = -capW; ci2 <= capW; ci2++) {
        var rimY = Math.round(capH * Math.sqrt(Math.max(0, 1 - (ci2/capW)*(ci2/capW))));
        setPixel(capX + ci2, capY + rimY, stemColor);
      }
      // Cap highlights — tiny, top surface only
      for (var chi = 0; chi < 2 + Math.floor(rng()*2); chi++) {
        setPixel(Math.round(capX + (rng()-0.5)*capW*0.5), capY - Math.floor(capH*0.35) + Math.round(rng()), lightColor);
      }

      // Fringe — underside of cap only, small dots
      if (rng() > 0.4) {
        var fringeCount = 3 + Math.floor(rng() * 5);
        for (var fi = 0; fi < fringeCount; fi++) {
          var fa = Math.PI * (fi / fringeCount);
          setPixel(Math.round(capX + Math.cos(fa) * capW * 0.7),
                   Math.round(capY + capH * 0.8 + Math.round(rng()*2)), detailColor);
        }
      }

      // Eye — on cap face, tiny (1px), rare unless toxic
      if (isToxic ? rng() > 0.25 : rng() > 0.7) {
        var eyeX = capX + Math.round((rng()-0.5) * capW * 0.45);
        var eyeY = capY + Math.round((rng()-0.5) * capH * 0.4);
        setPixel(eyeX, eyeY, darkColor);
        setPixel(eyeX, eyeY - 1, lightColor); // glint above
      }

      // Secondary cap — only in upper half of spine, small ellipse, ~35% chance
      if (rng() > 0.65) {
        var sc2W = Math.floor(capW * (0.25 + rng() * 0.28));
        var sc2H = Math.max(2, Math.floor(sc2W * 0.45));
        var sc2X = stemTopX + Math.round((rng()-0.5) * 5);
        // Constrained to between cap and midpoint of spine — upper half only
        var sc2Y = capY + Math.floor((spineBotY - capY) * (0.15 + rng() * 0.3));
        for (var se = -sc2H; se <= sc2H; se++) {
          var sc2hw = Math.round(sc2W * Math.sqrt(Math.max(0, 1-(se/sc2H)*(se/sc2H))));
          for (var sf = -sc2hw; sf <= sc2hw; sf++) setPixel(sc2X+sf, sc2Y+se, capColor);
        }
      }

      // Roots — ONLY at base, 2-3 tiny lines, nothing else below
      var rootCount = 2 + Math.floor(rng() * 2);
      for (var ri = 0; ri < rootCount; ri++) {
        var ra2 = Math.PI * 0.5 + (rng()-0.5) * Math.PI * 0.65;
        var rl  = 2 + Math.floor(rng() * 3);
        drawLine(stemTopX, spineBotY,
          Math.round(stemTopX + Math.cos(ra2)*rl),
          Math.round(spineBotY + Math.sin(ra2)*rl), stemColor);
      }

    } else if (floraArch === "spreading") {
      // ── Spreading: one dominant terminal, rest are smaller ───────────────────
      var anchorY = Math.round(cy + 5 + rng() * 5);
      var branchCount = 3 + Math.floor(rng() * 4);
      var spreadR = 9 + Math.floor(rng() * 9);

      // Pick which branch is dominant (largest terminal)
      var dominantBranch = Math.floor(rng() * branchCount);

      // Thin root anchor
      setPixel(cx, anchorY, stemColor);
      setPixel(cx, anchorY+1, stemColor);
      setPixel(cx-1, anchorY+1, stemColor);
      setPixel(cx+1, anchorY+1, stemColor);

      for (var bri = 0; bri < branchCount; bri++) {
        var bAngle = Math.PI + (bri / Math.max(1, branchCount-1)) * Math.PI;
        var bAngleJitter = bAngle + (rng()-0.5) * 0.7;
        var bLen = spreadR * (0.45 + rng() * 0.55);
        var bEndX = Math.round(cx + Math.cos(bAngleJitter) * bLen);
        var bEndY = Math.round(anchorY + Math.sin(bAngleJitter) * bLen);
        drawLine(cx, anchorY, bEndX, bEndY, stemColor);

        // Size hierarchy: dominant branch gets a large terminal, others get small
        var isDom = (bri === dominantBranch);
        var termR = isDom ? 4 + Math.floor(rng() * 5) : 1 + Math.floor(rng() * 3);
        var termShape = rng();
        if (termShape < 0.45) {
          fillCircle(bEndX, bEndY, termR, capColor);
          if (isDom && rng() > 0.5) {
            // Dominant gets a small accent dot
            setPixel(bEndX + Math.round((rng()-0.5)*termR), bEndY + Math.round((rng()-0.5)*termR), accentColor);
          }
        } else if (termShape < 0.75) {
          fillDiamond(bEndX, bEndY, termR, capColor);
        } else {
          // Tiny scatter for non-dominant
          var sc = isDom ? 3 : 1;
          for (var si2 = 0; si2 < sc; si2++) {
            setPixel(Math.round(bEndX+(rng()-0.5)*3), Math.round(bEndY+(rng()-0.5)*3), capColor);
          }
        }
      }

      // Berry scatter — tiny, accent color
      if (rng() > 0.5) {
        var berryCount = 4 + Math.floor(rng() * 6);
        for (var byi = 0; byi < berryCount; byi++) {
          var byA = rng() * Math.PI * 2;
          var byR = spreadR * (0.2 + rng() * 0.5);
          setPixel(Math.round(cx + Math.cos(byA) * byR),
                   Math.round(anchorY - Math.abs(Math.sin(byA)) * byR * 0.75), accentColor);
        }
      }

    } else {
      // ── Hanging: anchor at top, draping downward ──────────────────────────────
      var hangAnchorY = Math.round(cy - 8 - rng() * 6);
      var hangCount = 3 + Math.floor(rng() * 4);

      // Anchor mass
      fillCircle(cx, hangAnchorY, 2 + Math.floor(rng()*3), stemColor);

      for (var hi = 0; hi < hangCount; hi++) {
        var hAngle = (rng()-0.5) * Math.PI * 0.9; // mostly downward, slight spread
        var hLen = 8 + Math.floor(rng() * 12);
        var hEndX = Math.round(cx + Math.sin(hAngle) * hLen);
        var hEndY = Math.round(hangAnchorY + Math.cos(hAngle) * hLen);
        drawLine(cx, hangAnchorY, hEndX, hEndY, stemColor);

        // Terminal: spore, bulb, or scatter
        var hTerm = rng();
        var hR = 2 + Math.floor(rng() * 5);
        if (hTerm < 0.45) {
          drawBlob(hEndX, hEndY, hR, capColor);
        } else if (hTerm < 0.7) {
          fillCircle(hEndX, hEndY, hR, capColor);
          setPixel(hEndX, hEndY + hR + 1, accentColor); // drip
        } else {
          // Scatter spores at end
          for (var hsi = 0; hsi < 4; hsi++) {
            setPixel(Math.round(hEndX + (rng()-0.5)*4), Math.round(hEndY + rng()*3), capColor);
          }
        }
      }
    }

    // All flora get accent highlights
    var floraHLCount = 1 + Math.floor(rng() * 3);
    for (var fhl = 0; fhl < floraHLCount; fhl++) {
      setPixel(Math.round(cx + (rng()-0.5)*18), Math.round(cy + (rng()-0.5)*18), lightColor);
    }

    return grid; // Flora draws itself completely — skip the generic shape loop
  }

  // ── Spirit body pass ─────────────────────────────────────────────────────────
  // Spirit has no single body. It is several things in relationship.
  // The space between parts is as intentional as the parts themselves.
  if (recipeKey === "spirit") {

    // Archetype from state, tags, or rng
    var spiritArch = S.spiritArch || null;
    if (!spiritArch) {
      var hasOrbiting = ctxTags.some(function(t){ return t==="watching"||t==="attentive"||t==="territorial"; });
      var hasChaining = ctxTags.some(function(t){ return t==="seeking"||t==="curious"||t==="shifting"; });
      if (hasOrbiting) spiritArch = "orbit";
      else if (hasChaining) spiritArch = "chain";
      else {
        var sr = rng();
        spiritArch = sr < 0.4 ? "orbit" : sr < 0.72 ? "chain" : "constellation";
      }
    }

    // Helper: draw one spirit part — light, ephemeral, suggests presence rather than mass
    // Spirit parts default to rings, scatter, crosses, eyes — not filled bodies.
    // Filled shapes (blob, circle) only if player explicitly added them to pool.
    var spiritLightPool = ["ring","scatter","cross","eye","line","ring","scatter"]; // weighted toward rings/scatter
    // If player added heavy shapes, allow them — player intent overrides spirit nature
    var playerHeavy = extraShapes.filter(function(s){ return s==="blob"||s==="circle"||s==="diamond"; });
    var spiritPool = spiritLightPool.concat(playerHeavy);

    function drawSpiritPart(px, py, partColor) {
      var pType = pick(spiritPool, rng);
      var pSz = 1 + Math.floor(rng() * 4); // smaller — 1-4px, not creature-scale
      switch(pType) {
        case "ring":
          strokeRing(Math.round(px), Math.round(py), pSz + 1 + Math.floor(rng()*3), partColor);
          break;
        case "scatter":
          var sc = 3 + Math.floor(rng()*6);
          for (var si3=0; si3<sc; si3++) {
            if (rng() > 0.3) // sparse — not every dot placed
              setPixel(Math.round(px+(rng()-0.5)*pSz*3), Math.round(py+(rng()-0.5)*pSz*3), partColor);
          }
          break;
        case "cross":
          // Thin cross — 1px arms
          for (var cx2=-pSz; cx2<=pSz; cx2++) setPixel(Math.round(px+cx2), Math.round(py), partColor);
          for (var cy3=-pSz; cy3<=pSz; cy3++) setPixel(Math.round(px), Math.round(py+cy3), partColor);
          break;
        case "eye":
          // Small eye — light iris, dark pupil, single glint
          strokeRing(Math.round(px), Math.round(py), Math.max(2, pSz), partColor);
          setPixel(Math.round(px), Math.round(py), darkColor);
          setPixel(Math.round(px)-1, Math.round(py)-1, lightColor);
          break;
        case "line":
          var lAng = rng() * Math.PI * 2;
          var lLen = pSz + 2 + Math.floor(rng()*4);
          drawLine(Math.round(px-Math.cos(lAng)*lLen), Math.round(py-Math.sin(lAng)*lLen),
                   Math.round(px+Math.cos(lAng)*lLen), Math.round(py+Math.sin(lAng)*lLen), partColor);
          break;
        // Heavy shapes — only if player added them
        case "blob":   drawBlob(px, py, pSz, partColor); break;
        case "circle": fillCircle(px, py, pSz, partColor); break;
        case "diamond": fillDiamond(px, py, pSz, partColor); break;
        default:
          strokeRing(Math.round(px), Math.round(py), pSz + 1, partColor);
      }
    }

    // Helper: draw thin connective tissue between two points (sparse, optional)
    function drawTether(x1, y1, x2, y2, col) {
      var dx = x2-x1, dy = y2-y1;
      var steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)));
      for (var ti = 0; ti <= steps; ti++) {
        // Skip ~60% of pixels — makes it feel like mist, not wire
        if (rng() > 0.4) {
          var t = steps===0 ? 0 : ti/steps;
          setPixel(Math.round(x1+dx*t), Math.round(y1+dy*t), col);
        }
      }
    }

    var partCount = 2 + Math.floor(rng() * 3); // 2–4 parts — spirits are spare

    if (spiritArch === "orbit") {
      // Parts arranged around an absent center. Consistent radius, facing inward.
      var orbitR = 7 + Math.floor(rng() * 9);
      var orbitOffset = rng() * Math.PI * 2; // random starting angle
      // Slightly elliptical orbit
      var orbitRX = orbitR;
      var orbitRY = orbitR * (0.6 + rng() * 0.5);

      for (var oi = 0; oi < partCount; oi++) {
        var oAngle = orbitOffset + (oi / partCount) * Math.PI * 2;
        // Add slight irregularity — not perfectly even
        oAngle += (rng()-0.5) * (Math.PI / partCount) * 0.5;
        var opx = cx + Math.cos(oAngle) * orbitRX;
        var opy = cy + Math.sin(oAngle) * orbitRY;
        var oColor = oi === 0 ? mainColor : (rng() > 0.5 ? accentColor : midColor);
        drawSpiritPart(opx, opy, oColor);
      }

      // Tether: thin lines between adjacent parts, ~50% chance
      if (rng() > 0.5) {
        for (var oti = 0; oti < partCount; oti++) {
          var a1 = orbitOffset + (oti / partCount) * Math.PI * 2;
          var a2 = orbitOffset + ((oti+1) / partCount) * Math.PI * 2;
          drawTether(
            cx + Math.cos(a1)*orbitRX, cy + Math.sin(a1)*orbitRY,
            cx + Math.cos(a2)*orbitRX, cy + Math.sin(a2)*orbitRY,
            darkColor
          );
        }
      }

      // Optional: tiny mark at the absent center — suggests something was there
      if (rng() > 0.6) {
        setPixel(Math.round(cx), Math.round(cy), darkColor);
        if (rng() > 0.5) setPixel(Math.round(cx)+1, Math.round(cy), darkColor);
      }

    } else if (spiritArch === "chain") {
      // One part leads. Others trail behind with tethers.
      // Lead part is largest. Each subsequent part is smaller and offset.
      var chainDir = rng() * Math.PI * 2; // direction of travel
      var chainSpacing = 8 + Math.floor(rng() * 6);
      var chainDrift = (rng()-0.5) * 6; // perpendicular wobble per link

      for (var ci3 = 0; ci3 < partCount; ci3++) {
        // Each part falls behind along chainDir, with perpendicular drift
        var along = ci3 * chainSpacing;
        var perp = ci3 * chainDrift + (rng()-0.5)*3;
        var cpx = cx - Math.cos(chainDir)*along + Math.cos(chainDir+Math.PI/2)*perp;
        var cpy = cy - Math.sin(chainDir)*along + Math.sin(chainDir+Math.PI/2)*perp;
        var cColor = ci3 === 0 ? mainColor : (rng() > 0.4 ? midColor : accentColor);

        // Size decreases with distance — things trailing feel smaller
        var savedPool = pool;
        if (ci3 > 0) {
          // Trailing parts: smaller, simpler shapes
          pool = ["circle","scatter","ring"];
        }
        drawSpiritPart(cpx, cpy, cColor);
        pool = savedPool;

        // Tether to previous part
        if (ci3 > 0) {
          var prevAlong = (ci3-1) * chainSpacing;
          var prevPerp = (ci3-1) * chainDrift;
          var prevX = cx - Math.cos(chainDir)*prevAlong + Math.cos(chainDir+Math.PI/2)*prevPerp;
          var prevY = cy - Math.sin(chainDir)*prevAlong + Math.sin(chainDir+Math.PI/2)*prevPerp;
          drawTether(prevX, prevY, cpx, cpy, darkColor);
        }
      }

    } else {
      // ── Constellation: irregular positions, relationship via negative space ────
      // Parts are placed to form a readable shape — triangle, arc, asymmetric cluster.
      // No tethers. The gap between them IS the drawing.
      var constellationShapes = ["triangle", "arc", "asymmetric"];
      var cShape = constellationShapes[Math.floor(rng() * constellationShapes.length)];
      var conR = 8 + Math.floor(rng() * 10);

      var positions = [];
      if (cShape === "triangle") {
        // Three points forming a triangle, possibly obtuse
        var baseAngle = rng() * Math.PI * 2;
        positions.push([cx + Math.cos(baseAngle)*conR, cy + Math.sin(baseAngle)*conR]);
        positions.push([cx + Math.cos(baseAngle+2.3)*conR*(0.7+rng()*0.5), cy + Math.sin(baseAngle+2.3)*conR*(0.7+rng()*0.5)]);
        positions.push([cx + Math.cos(baseAngle+4.2)*conR*(0.6+rng()*0.6), cy + Math.sin(baseAngle+4.2)*conR*(0.6+rng()*0.6)]);
        if (partCount > 3) positions.push([cx + (rng()-0.5)*conR*0.4, cy + (rng()-0.5)*conR*0.4]);
      } else if (cShape === "arc") {
        // Parts along a curved arc, unevenly spaced
        var arcStart = rng() * Math.PI * 2;
        var arcSpan = Math.PI * (0.6 + rng() * 0.8);
        for (var ai = 0; ai < partCount; ai++) {
          var at = ai / Math.max(1, partCount-1);
          // Uneven spacing — not perfectly distributed
          at = at + (rng()-0.5)*0.2;
          var aAngle = arcStart + at * arcSpan;
          var aR = conR * (0.8 + rng() * 0.4);
          positions.push([cx + Math.cos(aAngle)*aR, cy + Math.sin(aAngle)*aR]);
        }
      } else {
        // Asymmetric — one part near center, others scattered but not random
        positions.push([cx + (rng()-0.5)*6, cy + (rng()-0.5)*6]);
        for (var asi = 1; asi < partCount; asi++) {
          var asAngle = rng() * Math.PI * 2;
          var asDist = conR * (0.5 + rng() * 0.7);
          positions.push([cx + Math.cos(asAngle)*asDist, cy + Math.sin(asAngle)*asDist]);
        }
      }

      for (var pi = 0; pi < positions.length; pi++) {
        var pColor = pi === 0 ? mainColor : (rng() > 0.45 ? accentColor : midColor);
        drawSpiritPart(positions[pi][0], positions[pi][1], pColor);
      }
      // No tethers — the negative space does the work
    }

    // All spirits get one or two accent highlights floating near parts
    for (var shi = 0; shi < 1 + Math.floor(rng()*2); shi++) {
      setPixel(Math.round(cx + (rng()-0.5)*20), Math.round(cy + (rng()-0.5)*20), lightColor);
    }

    return grid; // Spirit draws itself — skip generic shape loop
  }

  // ── Relic body pass ──────────────────────────────────────────────────────────
  // Sparse. Two things. One witnesses the other.
  // Primary: small, still, slightly off-center.
  // Secondary: one gesture toward it — not decoration, an event.
  if (recipeKey === "relic") {

    var relicArch = S.relicArch || null;
    if (!relicArch) {
      var rr = rng();
      relicArch = rr < 0.38 ? "enshrined" : rr < 0.7 ? "crowned" : "marked";
    }

    // Primary — the humble thing. Small. Slightly off-center.
    var primX = Math.round(cx + (rng()-0.5) * 10);
    var primY = Math.round(cy + (rng()-0.5) * 10);
    var primSz = 1 + Math.floor(rng() * 3); // very small

    var humblePool = ["rect","circle","diamond","cross","rect","circle","rect"];
    extraShapes.forEach(function(s){ humblePool.push(s); });
    var primType = pick(humblePool, rng);
    var primColor = mainColor;

    // Secondary color: reach toward contrast, not harmony
    // Use lightColor or darkColor depending on which is more different from mainColor
    var secColor = lightColor;

    switch(primType) {
      case "rect":
        fillRect(primX - primSz, primY - Math.floor(primSz*0.6),
                 primSz*2+1, Math.floor(primSz*1.3)+1, primColor);
        break;
      case "circle":
        fillCircle(primX, primY, primSz, primColor);
        break;
      case "diamond":
        fillDiamond(primX, primY, primSz, primColor);
        break;
      case "cross":
        for (var rcx=-primSz; rcx<=primSz; rcx++) setPixel(primX+rcx, primY, primColor);
        for (var rcy2=-primSz; rcy2<=primSz; rcy2++) setPixel(primX, primY+rcy2, primColor);
        break;
      default:
        fillCircle(primX, primY, primSz, primColor);
    }

    if (relicArch === "enshrined") {
      // Filled shape BEHIND the primary — secondary recedes, primary advances.
      // The secondary is ground. The primary sits on top of it.
      // Larger, dimmer, offset slightly so primary isn't perfectly centered on it.
      var backType = rng();
      var backR = primSz + 4 + Math.floor(rng() * 7);
      var backX = primX + Math.round((rng()-0.5) * 5);
      var backY = primY + Math.round((rng()-0.5) * 5);
      var backColor = darkColor; // recedes — dim, not competing

      if (backType < 0.4) {
        // Filled circle behind
        fillCircle(backX, backY, backR, backColor);
      } else if (backType < 0.72) {
        // Filled diamond behind
        fillDiamond(backX, backY, backR, backColor);
      } else {
        // Filled rect behind
        fillRect(backX - backR, backY - Math.floor(backR*0.7), backR*2+1, Math.floor(backR*1.4)+1, backColor);
      }

      // Redraw primary on top — it should now clearly sit on the background shape
      switch(primType) {
        case "rect":
          fillRect(primX-primSz, primY-Math.floor(primSz*0.6), primSz*2+1, Math.floor(primSz*1.3)+1, primColor);
          break;
        case "diamond": fillDiamond(primX, primY, primSz, primColor); break;
        case "cross":
          for (var rcx2=-primSz; rcx2<=primSz; rcx2++) setPixel(primX+rcx2, primY, primColor);
          for (var rcy3=-primSz; rcy3<=primSz; rcy3++) setPixel(primX, primY+rcy3, primColor);
          break;
        default: fillCircle(primX, primY, primSz, primColor);
      }

      // One small light mark — the moment of noticing
      if (rng() > 0.4) setPixel(primX + Math.round((rng()-0.5)*4), primY - backR - 1, secColor);

    } else if (relicArch === "crowned") {
      // One arc that lands on something. 2-3 sparks where it connects.
      var crownR = primSz + 6 + Math.floor(rng() * 6);
      var crownSpan = Math.PI * (0.4 + rng() * 0.5); // short arc
      var crownAng = rng() * Math.PI * 2; // where it arrives from
      var crownStart = crownAng - crownSpan * 0.5;

      // Draw the arc — single pixel, no fill
      var crownSteps = Math.ceil(crownR * crownSpan * 1.2);
      for (var cs = 0; cs <= crownSteps; cs++) {
        var cAng = crownStart + (cs/crownSteps)*crownSpan;
        setPixel(Math.round(primX + Math.cos(cAng)*crownR),
                 Math.round(primY + Math.sin(cAng)*crownR), secColor);
      }

      // Where the arc ends closest to primary — the contact point
      var contactAng = crownAng; // midpoint of arc faces primary
      var contactX = Math.round(primX + Math.cos(contactAng) * (crownR));
      var contactY = Math.round(primY + Math.sin(contactAng) * (crownR));

      // 2-3 sparks flaring from contact — short lines or single pixels
      var sparkCount = 2 + Math.floor(rng() * 2);
      for (var sp = 0; sp < sparkCount; sp++) {
        var spAng = contactAng + (rng()-0.5) * Math.PI * 0.6;
        var spLen = 2 + Math.floor(rng() * 4);
        drawLine(contactX, contactY,
          Math.round(contactX + Math.cos(spAng)*spLen),
          Math.round(contactY + Math.sin(spAng)*spLen), accentColor);
      }

    } else {
      // ── Marked: sparse sparkle field. Primary sits still inside it. ──────────
      // The dust the sun shows through. 5-8 single pixels, spread wide.
      var sparkleCount = 5 + Math.floor(rng() * 4);
      for (var ski = 0; ski < sparkleCount; ski++) {
        var skAng = rng() * Math.PI * 2;
        var skDist = 6 + rng() * 14; // spread wide, keep away from primary
        setPixel(Math.round(primX + Math.cos(skAng)*skDist),
                 Math.round(primY + Math.sin(skAng)*skDist), secColor);
        // ~40% chance of a second pixel adjacent — makes it feel like a sparkle not a dot
        if (rng() > 0.6) {
          setPixel(Math.round(primX + Math.cos(skAng)*skDist) + (rng()>0.5?1:-1),
                   Math.round(primY + Math.sin(skAng)*skDist), secColor);
        }
      }
      // One accent pixel very close to primary — the thing that noticed it first
      setPixel(primX + (rng()>0.5?1:-1)*( primSz+2), primY + Math.round((rng()-0.5)*2), accentColor);
    }

    return grid;
  }

  // ── Item body pass ───────────────────────────────────────────────────────────
  // Two shapes that each own a quadrant. They meet at a joint near center.
  // The joint is where the item is. Neither shape is decoration.
  if (recipeKey === "item") {

    // Joint — the meeting point, slightly off dead-center
    var jx = Math.round(cx + (rng()-0.5) * 8);
    var jy = Math.round(cy + (rng()-0.5) * 8);

    // Axis — orthogonal or diagonal, determines which quadrants each part owns
    var axisAngle = rng() > 0.5
      ? (rng() > 0.5 ? 0 : Math.PI*0.5)           // orthogonal: horizontal or vertical
      : (rng() > 0.5 ? Math.PI*0.25 : Math.PI*0.75); // diagonal
    axisAngle += (rng()-0.5) * 0.2; // slight wobble

    // Part A — extends from joint along axis in one direction
    var aLen = 5 + Math.floor(rng() * 9);
    var aAx = Math.round(jx + Math.cos(axisAngle) * aLen * 0.5);
    var aAy = Math.round(jy + Math.sin(axisAngle) * aLen * 0.5);

    // Part B — extends from joint in opposite direction, different character
    var bLen = 4 + Math.floor(rng() * 7);
    var bAx = Math.round(jx - Math.cos(axisAngle) * bLen * 0.5);
    var bAy = Math.round(jy - Math.sin(axisAngle) * bLen * 0.5);

    // Shape vocabulary for each part — pick from pool, bias toward geometric
    var itemPool = ["rect","diamond","circle","cross","rect","rect","diamond"];
    extraShapes.forEach(function(s){ itemPool.push(s); });

    var typeA = pick(itemPool, rng);
    var typeB = pick(itemPool, rng);

    // Helper: draw one item part extending from a center point along the axis
    function drawItemPart(px, py, pType, pLen, pColor, isAlongAxis) {
      var perpAng = axisAngle + Math.PI*0.5;
      switch(pType) {
        case "rect":
          // Rect owns its quadrant: long along axis, narrow across
          var rLong = Math.floor(pLen * 0.9);
          var rShort = 2 + Math.floor(rng() * 3);
          for (var rl = -rLong; rl <= rLong; rl++)
            for (var rs = -rShort; rs <= rShort; rs++)
              setPixel(Math.round(px + Math.cos(axisAngle)*rl + Math.cos(perpAng)*rs),
                       Math.round(py + Math.sin(axisAngle)*rl + Math.sin(perpAng)*rs), pColor);
          break;
        case "diamond":
          fillDiamond(px, py, Math.floor(pLen*0.55), pColor);
          break;
        case "circle":
          fillCircle(px, py, Math.floor(pLen*0.5), pColor);
          break;
        case "cross":
          var cArm = Math.floor(pLen*0.6);
          for (var ca=-cArm; ca<=cArm; ca++) {
            setPixel(Math.round(px+Math.cos(axisAngle)*ca), Math.round(py+Math.sin(axisAngle)*ca), pColor);
            setPixel(Math.round(px+Math.cos(perpAng)*ca), Math.round(py+Math.sin(perpAng)*ca), pColor);
          }
          break;
        case "line": case "spike":
          for (var lt=-pLen; lt<=pLen; lt++) {
            setPixel(Math.round(px+Math.cos(axisAngle)*lt), Math.round(py+Math.sin(axisAngle)*lt), pColor);
            if (rng()>0.5) setPixel(Math.round(px+Math.cos(axisAngle)*lt+Math.cos(perpAng)),
                                    Math.round(py+Math.sin(axisAngle)*lt+Math.sin(perpAng)), pColor);
          }
          break;
        default:
          fillCircle(px, py, Math.floor(pLen*0.45), pColor);
      }
    }

    // Draw part B first (handle/grip end — shadow side, same hue family), then A on top
    // Both parts are the same object — midColor reads as shadow, not contrast
    drawItemPart(bAx, bAy, typeB, bLen, midColor, false);

    // Part A duplication — ~45% chance, same shape copied with slight offset + rotation nudge
    // Not mirror symmetry: placed, not grown. Two of the same thing, nearly aligned.
    if (rng() > 0.55) {
      var dupOffset = 2 + Math.floor(rng() * 4);
      var perpAng2 = axisAngle + Math.PI * 0.5;
      var dupX = aAx + Math.round(Math.cos(perpAng2) * dupOffset);
      var dupY = aAy + Math.round(Math.sin(perpAng2) * dupOffset);
      // Nudge the axis slightly for the duplicate — slight rotation in place
      var savedAxis = axisAngle;
      axisAngle = axisAngle + (rng()-0.5) * 0.35;
      drawItemPart(dupX, dupY, typeA, Math.floor(aLen * (0.8 + rng()*0.25)), midColor, true);
      axisAngle = savedAxis;
    }

    drawItemPart(aAx, aAy, typeA, aLen, mainColor, true);

    // Joint mark — small accent at the meeting point, always present
    // This is the thing that holds the two parts together
    var jointType = rng();
    if (jointType < 0.4) {
      setPixel(jx, jy, lightColor);
      if (rng()>0.5) setPixel(jx+1, jy, lightColor);
    } else if (jointType < 0.7) {
      fillDiamond(jx, jy, 2, accentColor); // small gem or rivet
    } else {
      strokeRing(jx, jy, 2, accentColor); // loop or ring fitting
    }

    // Shine — one light pixel on part A (the business end catches light)
    setPixel(Math.round(aAx + Math.cos(axisAngle) * Math.floor(aLen*0.4)),
             Math.round(aAy + Math.sin(axisAngle) * Math.floor(aLen*0.4)), lightColor);

    return grid;
  }

  // ── Terrain body pass ────────────────────────────────────────────────────────
  // Terrain is a condition, not a thing. It always exits the frame.
  // Tile six of them and they read as one continuous surface.
  // Detail is incidental to the material, not the subject.
  if (recipeKey === "terrain") {

    var terrainArch = S.terrainArch || null;
    if (!terrainArch) {
      var tr = rng();
      terrainArch = tr < 0.38 ? "floor" : tr < 0.68 ? "wall" : "ceiling";
    }

    // Material texture — responsive to extraShapes, uses only mainColor/darkColor/midColor
    // Terrain does not compete. It guides attention elsewhere gracefully.
    // Colors stay close: variation between mainColor and darkColor only.
    var hasRect   = extraShapes.indexOf("rect")    >= 0;
    var hasCircle = extraShapes.indexOf("circle")  >= 0 || extraShapes.indexOf("blob") >= 0;
    var hasDiamond= extraShapes.indexOf("diamond") >= 0;
    var hasBanding= extraShapes.indexOf("cross")   >= 0 || extraShapes.indexOf("scatter") >= 0;

    // Determine material style from extraShapes, or default to earth
    var matStyle = hasDiamond  ? "faceted"
                 : hasRect     ? "grid"
                 : hasBanding  ? "banded"
                 : hasCircle   ? "earth"
                 : (rng() > 0.5 ? "earth" : "banded"); // default varies

    // Band period for banded/grid — fixed per critter so it looks consistent
    var bandPeriod = 3 + Math.floor(rng() * 4);

    function materialPixel(mx, my) {
      if (matStyle === "grid") {
        // Regular grid — near-solid with thin dark lines at intervals
        var onLineH = (my % bandPeriod === 0);
        var onLineV = (mx % bandPeriod === 0);
        if (onLineH || onLineV) return darkColor;
        if (rng() > 0.97) return midColor; // rare fleck
        return mainColor;
      } else if (matStyle === "faceted") {
        // Diagonal facets — diamond/checkerboard feel
        var diag = (mx + my) % (bandPeriod);
        if (diag === 0) return darkColor;
        if (diag === 1 && rng() > 0.6) return midColor;
        return mainColor;
      } else if (matStyle === "banded") {
        // Horizontal bands — the lovely banding, toned down
        var band = Math.floor(my / bandPeriod);
        if (band % 2 === 0) return mainColor;
        if (rng() > 0.85) return midColor;
        return darkColor;
      } else {
        // Earth — organic, close-valued flecking
        if (rng() > 0.91) return darkColor;
        if (rng() > 0.95) return midColor;
        return mainColor;
      }
    }

    // Edge profile helper — generates a per-column or per-row boundary with slight noise
    function makeEdgeProfile(length, basePos, noise) {
      var profile = [];
      var cur = basePos;
      for (var pi2 = 0; pi2 < length; pi2++) {
        cur += (rng()-0.5) * noise * 0.5;
        cur = Math.max(basePos - noise, Math.min(basePos + noise, cur));
        profile[pi2] = Math.round(cur);
      }
      return profile;
    }

    if (terrainArch === "tile") {
      // ── Tile: full canvas fill. No edge. Pure material. ──────────────────────
      // Tileable background. Six of these side by side read as one surface.
      for (var ty = 0; ty < GRID; ty++) {
        for (var tx = 0; tx < GRID; tx++) {
          setPixel(tx, ty, materialPixel(tx, ty));
        }
      }
      // No seam — terrain does not annotate itself

    } else if (terrainArch === "edge") {
      // ── Edge: floor/wall/ceiling — always exits 3 borders ────────────────────
      var edgeDir = Math.floor(rng() * 3); // 0=floor, 1=wall, 2=ceiling
      var edgeNoise = 2 + Math.floor(rng() * 5);

      if (edgeDir === 0) { // floor
        var baseY = Math.round(GRID * (0.38 + rng() * 0.28));
        var edgeProfile = makeEdgeProfile(GRID, baseY, edgeNoise);
        for (var fy2 = 0; fy2 < GRID; fy2++)
          for (var fx3 = 0; fx3 < GRID; fx3++)
            if (fy2 >= edgeProfile[fx3]) setPixel(fx3, fy2, materialPixel(fx3, fy2));
        for (var ex = 0; ex < GRID; ex++) {
          setPixel(ex, edgeProfile[ex], lightColor);
          if (rng() > 0.55) setPixel(ex, edgeProfile[ex]-1, lightColor);
        }
      } else if (edgeDir === 1) { // wall
        var wallFromLeft = rng() > 0.5;
        var wallBase = Math.round(GRID * (0.35 + rng() * 0.28));
        var wallProfile = makeEdgeProfile(GRID, wallBase, edgeNoise);
        for (var wy = 0; wy < GRID; wy++)
          for (var wx = 0; wx < GRID; wx++) {
            var inside = wallFromLeft ? (wx <= wallProfile[wy]) : (wx >= wallProfile[wy]);
            if (inside) setPixel(wx, wy, materialPixel(wx, wy));
          }
        for (var ey2 = 0; ey2 < GRID; ey2++) {
          setPixel(wallProfile[ey2], ey2, midColor);
          if (rng() > 0.6) setPixel(wallFromLeft ? wallProfile[ey2]-1 : wallProfile[ey2]+1, ey2, midColor);
        }
      } else { // ceiling
        var ceilBase = Math.round(GRID * (0.28 + rng() * 0.28));
        var ceilProfile = makeEdgeProfile(GRID, ceilBase, edgeNoise);
        for (var cy5 = 0; cy5 < GRID; cy5++)
          for (var cx4 = 0; cx4 < GRID; cx4++)
            if (cy5 <= ceilProfile[cx4]) setPixel(cx4, cy5, materialPixel(cx4, cy5));
        for (var cex = 0; cex < GRID; cex++) {
          setPixel(cex, ceilProfile[cex], lightColor);
          if (rng() > 0.55) setPixel(cex, ceilProfile[cex]+1, lightColor);
        }
        // No stalactites — terrain does not annotate itself
      }
      // No seam — terrain does not annotate itself

    } else {
      // ── Sparse: small repeated motifs scattered across open canvas ────────────
      // Grass tufts, pebbles, sand grains. Repetition is what makes it terrain.
      // A single tuft is flora. Eight tufts is ground cover.
      var motifType = Math.floor(rng() * 4); // 0=tuft, 1=pebble, 2=dot cluster, 3=scratch
      var motifCount = 7 + Math.floor(rng() * 9); // 7-15 stamps

      // Build a grid of candidate positions — loose grid prevents total randomness
      // Random origin offset prevents center bias
      var cols2 = Math.ceil(Math.sqrt(motifCount));
      var rows2 = Math.ceil(motifCount / cols2);
      var cellW = Math.floor(GRID / cols2);
      var cellH = Math.floor(GRID / rows2);
      var gridOffX = Math.round((rng()-0.5) * cellW * 0.5);
      var gridOffY = Math.round((rng()-0.5) * cellH * 0.5);
      var positions = [];
      for (var mi2 = 0; mi2 < motifCount; mi2++) {
        var col = mi2 % cols2;
        var row2 = Math.floor(mi2 / cols2);
        positions.push([
          Math.round(gridOffX + cellW * col + rng() * cellW * 0.75 + cellW * 0.12),
          Math.round(gridOffY + cellH * row2 + rng() * cellH * 0.75 + cellH * 0.12)
        ]);
      }

      // Shuffle positions slightly
      positions.sort(function() { return rng() - 0.5; });

      for (var pi3 = 0; pi3 < positions.length; pi3++) {
        var mx2 = positions[pi3][0], my2 = positions[pi3][1];
        if (mx2 < 0 || mx2 >= GRID || my2 < 0 || my2 >= GRID) continue;
        // Each stamp gets slight size variation and color variation
        var mSz = 1 + Math.floor(rng() * 3);
        var mColor = rng() > 0.7 ? accentColor : rng() > 0.5 ? midColor : mainColor;

        if (motifType === 0) {
          // Tuft — 2-4 short upward lines from base point
          var bladeCount = 2 + Math.floor(rng() * 3);
          for (var bi = 0; bi < bladeCount; bi++) {
            var bAng = -Math.PI*0.5 + (rng()-0.5) * Math.PI * 0.5;
            var bLen = mSz + Math.floor(rng() * 2);
            for (var bl = 0; bl < bLen; bl++)
              setPixel(Math.round(mx2 + Math.cos(bAng)*bl), Math.round(my2 + Math.sin(bAng)*bl), mColor);
          }
        } else if (motifType === 1) {
          // Pebble — small filled circle or diamond, 1-3px
          if (rng() > 0.5) fillCircle(mx2, my2, mSz, mColor);
          else fillDiamond(mx2, my2, mSz, mColor);
          if (rng() > 0.6) setPixel(mx2-1, my2-1, lightColor); // shine
        } else if (motifType === 2) {
          // Dot cluster — 3-6 pixels loosely grouped
          var dotCount = 3 + Math.floor(rng() * 4);
          for (var di6 = 0; di6 < dotCount; di6++)
            setPixel(Math.round(mx2 + (rng()-0.5)*mSz*2.5),
                     Math.round(my2 + (rng()-0.5)*mSz*2), mColor);
        } else {
          // Scratch — short angled line, like a mark in sand or a twig
          var sAng = rng() * Math.PI;
          var sLen = 2 + Math.floor(rng() * 4);
          drawLine(Math.round(mx2 - Math.cos(sAng)*sLen), Math.round(my2 - Math.sin(sAng)*sLen),
                   Math.round(mx2 + Math.cos(sAng)*sLen), Math.round(my2 + Math.sin(sAng)*sLen), mColor);
        }
      }
    }

    return grid; // Terrain draws itself — skip generic shape loop
  }

  // Accent highlights (remaining recipes)
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

