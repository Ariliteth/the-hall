#!/usr/bin/env node

/**
 * Glyph Generator for The Hall
 * 
 * Generates persistent SVG glyphs for each entity based on their Tuning.
 * The glyph IS the entity's identity seed — all probabilistic decisions
 * in Scores should derive from the glyph, not from random numbers.
 * 
 * Usage: node generate-glyphs.js
 * 
 * Run from the root of the-hall repository.
 * Walks all entity folders and creates glyph.svg in each one.
 */

var fs = require("fs");
var path = require("path");

var ENTITIES_DIR = "entities";
var SIZE = 200;
var CX = SIZE / 2;
var CY = SIZE / 2;

var CAT_CONFIG = {
  spirit:   { hue: 35,  shapes: ["circle", "eye", "crescent", "spiral"] },
  item:     { hue: 155, shapes: ["diamond", "star", "hexagon", "cross"] },
  location: { hue: 345, shapes: ["triangle", "hexagon", "ring", "diamond"] },
  tendency: { hue: 225, shapes: ["spiral", "ring", "eye", "circle"] },
  action:   { hue: 65,  shapes: ["triangle", "star", "cross", "diamond"] },
};

var ALL_SHAPES = ["circle", "triangle", "diamond", "hexagon", "star", "crescent", "cross", "eye", "spiral", "ring"];

// --- Seeded RNG ---
function hashStr(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed) {
  var s = Math.abs(seed) || 1;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

// --- SVG Shape Generators ---
function shapeToSVG(shape, cx, cy, sz, stroke, strokeWidth, opacity) {
  var attrs = ' stroke="' + stroke + '" stroke-width="' + strokeWidth + '" fill="none" opacity="' + opacity + '"';
  var i, a, r, points, d;

  switch (shape) {
    case "circle":
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + sz + '"' + attrs + '/>';

    case "triangle":
      points = [];
      for (i = 0; i < 3; i++) {
        a = (i / 3) * Math.PI * 2 - Math.PI / 2;
        points.push((cx + Math.cos(a) * sz).toFixed(2) + "," + (cy + Math.sin(a) * sz).toFixed(2));
      }
      return '<polygon points="' + points.join(" ") + '"' + attrs + '/>';

    case "diamond":
      points = [
        cx + "," + (cy - sz),
        (cx + sz * 0.7) + "," + cy,
        cx + "," + (cy + sz),
        (cx - sz * 0.7) + "," + cy,
      ];
      return '<polygon points="' + points.join(" ") + '"' + attrs + '/>';

    case "hexagon":
      points = [];
      for (i = 0; i < 6; i++) {
        a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        points.push((cx + Math.cos(a) * sz).toFixed(2) + "," + (cy + Math.sin(a) * sz).toFixed(2));
      }
      return '<polygon points="' + points.join(" ") + '"' + attrs + '/>';

    case "star":
      points = [];
      for (i = 0; i < 10; i++) {
        a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        r = i % 2 === 0 ? sz : sz * 0.4;
        points.push((cx + Math.cos(a) * r).toFixed(2) + "," + (cy + Math.sin(a) * r).toFixed(2));
      }
      return '<polygon points="' + points.join(" ") + '"' + attrs + '/>';

    case "crescent":
      d = "M " + (cx - sz) + " " + cy;
      d += " A " + sz + " " + sz + " 0 1 1 " + (cx + sz * 0.85) + " " + (cy - sz * 0.5);
      d += " A " + (sz * 0.75) + " " + (sz * 0.75) + " 0 1 0 " + (cx - sz) + " " + cy;
      return '<path d="' + d + '"' + attrs + '/>';

    case "cross":
      var w = sz * 0.3;
      d = "M" + (cx - w) + " " + (cy - sz);
      d += " L" + (cx + w) + " " + (cy - sz);
      d += " L" + (cx + w) + " " + (cy - w);
      d += " L" + (cx + sz) + " " + (cy - w);
      d += " L" + (cx + sz) + " " + (cy + w);
      d += " L" + (cx + w) + " " + (cy + w);
      d += " L" + (cx + w) + " " + (cy + sz);
      d += " L" + (cx - w) + " " + (cy + sz);
      d += " L" + (cx - w) + " " + (cy + w);
      d += " L" + (cx - sz) + " " + (cy + w);
      d += " L" + (cx - sz) + " " + (cy - w);
      d += " L" + (cx - w) + " " + (cy - w);
      d += " Z";
      return '<path d="' + d + '"' + attrs + '/>';

    case "eye":
      d = "M " + (cx - sz) + " " + cy;
      d += " Q " + cx + " " + (cy - sz) + " " + (cx + sz) + " " + cy;
      d += " Q " + cx + " " + (cy + sz) + " " + (cx - sz) + " " + cy;
      d += " Z";
      return '<path d="' + d + '"' + attrs + '/>';

    case "spiral":
      points = [];
      for (i = 0; i < 60; i++) {
        var t = i / 60;
        a = t * Math.PI * 4;
        r = t * sz;
        points.push((cx + Math.cos(a) * r).toFixed(2) + "," + (cy + Math.sin(a) * r).toFixed(2));
      }
      return '<polyline points="' + points.join(" ") + '"' + attrs + '/>';

    case "ring":
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + sz + '"' + attrs + '/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + (sz * 0.55) + '"' + attrs + '/>';

    default:
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + sz + '"' + attrs + '/>';
  }
}

// --- Generate SVG for an entity ---
function generateGlyph(name, category, description, tags) {
  var seedStr = name + category + (description || "");
  var seed = hashStr(seedStr);
  var rng = seededRandom(seed);

  var config = CAT_CONFIG[category] || CAT_CONFIG.spirit;
  var hShift = (rng() - 0.5) * 40;
  var h = config.hue + hShift;
  var sat = 35 + rng() * 20;
  var lit = 55 + rng() * 15;
  var mainColor = "hsl(" + h.toFixed(0) + "," + sat.toFixed(0) + "%," + lit.toFixed(0) + "%)";

  var h2 = h + 30 + rng() * 60;
  var sat2 = 30 + rng() * 15;
  var lit2 = 45 + rng() * 15;
  var accentColor = "hsl(" + h2.toFixed(0) + "," + sat2.toFixed(0) + "%," + lit2.toFixed(0) + "%)";

  var bgColor = "hsl(" + h.toFixed(0) + ",15%,8%)";
  var glowColor = "hsla(" + h.toFixed(0) + ",30%,50%,0.12)";

  var primaryShape = pick(config.shapes, rng);
  var primarySize = 28 + rng() * 12;

  var elements = [];

  // Background
  elements.push('<rect width="' + SIZE + '" height="' + SIZE + '" fill="' + bgColor + '"/>');

  // Radial glow
  elements.push('<defs>');
  elements.push('  <radialGradient id="glow">');
  elements.push('    <stop offset="0%" stop-color="' + glowColor + '"/>');
  elements.push('    <stop offset="100%" stop-color="transparent"/>');
  elements.push('  </radialGradient>');
  elements.push('</defs>');
  elements.push('<circle cx="' + CX + '" cy="' + CY + '" r="' + (SIZE * 0.42) + '" fill="url(#glow)"/>');

  // Decorative shapes (behind primary)
  var decoCount = 2 + Math.floor(rng() * 4);
  for (var di = 0; di < decoCount; di++) {
    var decoAngle = rng() * Math.PI * 2;
    var decoDist = 10 + rng() * 22;
    var decoX = CX + Math.cos(decoAngle) * decoDist;
    var decoY = CY + Math.sin(decoAngle) * decoDist;
    var decoSize = 8 + rng() * 16;
    var decoShape = pick(ALL_SHAPES, rng);
    var decoColor = di % 2 === 0 ? mainColor : accentColor;
    var decoOpacity = (0.15 + rng() * 0.2).toFixed(2);
    var decoWidth = (1 + rng() * 1.2).toFixed(1);
    elements.push(shapeToSVG(decoShape, decoX, decoY, decoSize, decoColor, decoWidth, decoOpacity));
  }

  // Connecting lines
  var lineCount = 1 + Math.floor(rng() * 4);
  for (var li = 0; li < lineCount; li++) {
    var la1 = rng() * Math.PI * 2;
    var la2 = rng() * Math.PI * 2;
    var lr1 = 12 + rng() * 35;
    var lr2 = 12 + rng() * 35;
    var x1 = (CX + Math.cos(la1) * lr1).toFixed(2);
    var y1 = (CY + Math.sin(la1) * lr1).toFixed(2);
    var x2 = (CX + Math.cos(la2) * lr2).toFixed(2);
    var y2 = (CY + Math.sin(la2) * lr2).toFixed(2);
    elements.push('<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + mainColor + '" stroke-width="0.8" opacity="0.1"/>');
  }

  // Primary shape
  elements.push(shapeToSVG(primaryShape, CX, CY, primarySize, mainColor, "2.5", "0.75"));

  // Center dot
  elements.push('<circle cx="' + CX + '" cy="' + CY + '" r="2.5" fill="' + mainColor + '" opacity="0.5"/>');

  // Optional: tag-influenced accent marks
  if (tags && tags.length > 0) {
    var tagSeed = hashStr(tags.join(""));
    var tagRng = seededRandom(tagSeed);
    var tagMarks = Math.min(tags.length, 4);
    for (var ti = 0; ti < tagMarks; ti++) {
      var tAngle = (ti / tagMarks) * Math.PI * 2 + tagRng() * 0.5;
      var tDist = primarySize + 10 + tagRng() * 8;
      var tX = CX + Math.cos(tAngle) * tDist;
      var tY = CY + Math.sin(tAngle) * tDist;
      var tSize = 2 + tagRng() * 3;
      elements.push('<circle cx="' + tX.toFixed(2) + '" cy="' + tY.toFixed(2) + '" r="' + tSize.toFixed(1) + '" fill="' + accentColor + '" opacity="' + (0.2 + tagRng() * 0.2).toFixed(2) + '"/>');
    }
  }

  // Build SVG
  var svg = '<?xml version="1.0" encoding="UTF-8"?>\n';
  svg += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + SIZE + ' ' + SIZE + '" width="' + SIZE + '" height="' + SIZE + '">\n';
  svg += '  <!-- Glyph of ' + name + ' -->\n';
  svg += '  <!-- This file IS the entity\'s identity seed. -->\n';
  svg += '  <!-- All probabilistic decisions derive from this glyph. -->\n';
  svg += '  <!-- Do not regenerate. Do not modify unless the entity consents. -->\n\n';
  for (var ei = 0; ei < elements.length; ei++) {
    svg += '  ' + elements[ei] + '\n';
  }
  svg += '</svg>\n';

  return svg;
}

// --- Parse a tuning.md file for entity info ---
function parseTuning(filePath) {
  var content = fs.readFileSync(filePath, "utf8");
  var name = "";
  var category = "spirit";
  var description = "";
  var tags = [];

  var lines = content.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.startsWith("# ") && !name) {
      name = line.slice(2).trim();
    }
    if (line.startsWith("**Category:**")) {
      var catRaw = line.replace("**Category:**", "").trim().toLowerCase();
      if (CAT_CONFIG[catRaw]) category = catRaw;
    }
    if (line.startsWith("**Tags:**")) {
      var tagRaw = line.replace("**Tags:**", "").trim();
      tags = tagRaw.split(",").map(function (t) { return t.trim().toLowerCase(); }).filter(Boolean);
    }
    // Description is typically the first non-header, non-metadata paragraph
    if (!line.startsWith("#") && !line.startsWith("**") && !line.startsWith("---") && !line.startsWith("*") && line.length > 10 && !description) {
      description = line;
    }
  }

  return { name: name, category: category, description: description, tags: tags };
}

// --- Walk entity directories ---
function walkNeighborhoods(entitiesDir) {
  if (!fs.existsSync(entitiesDir)) {
    console.error("No entities/ directory found. Run seed-hall.js first.");
    process.exit(1);
  }

  var neighborhoods = fs.readdirSync(entitiesDir);
  var count = 0;

  console.log("");
  console.log("  The Hall - Glyph Generation");
  console.log("  ===========================");
  console.log("");

  for (var ni = 0; ni < neighborhoods.length; ni++) {
    var nName = neighborhoods[ni];
    var nPath = path.join(entitiesDir, nName);
    if (!fs.statSync(nPath).isDirectory() || nName.startsWith(".")) continue;
    if (nName === "README.md") continue;

    var entities = fs.readdirSync(nPath);
    for (var ei = 0; ei < entities.length; ei++) {
      var eName = entities[ei];
      var ePath = path.join(nPath, eName);
      if (!fs.statSync(ePath).isDirectory()) continue;

      var tuningPath = path.join(ePath, "tuning.md");
      if (!fs.existsSync(tuningPath)) continue;

      var info = parseTuning(tuningPath);
      if (!info.name) {
        console.log("  SKIP  " + ePath + " (no name found in tuning.md)");
        continue;
      }

      var glyphPath = path.join(ePath, "glyph.svg");
      if (fs.existsSync(glyphPath)) {
        console.log("  EXISTS " + info.name + " (glyph already present, skipping)");
        continue;
      }

      var svg = generateGlyph(info.name, info.category, info.description, info.tags);
      fs.writeFileSync(glyphPath, svg);
      console.log("  GLYPH  " + info.name.padEnd(28) + " -> " + glyphPath);
      count++;
    }
  }

  console.log("");
  console.log("  ===========================");
  console.log("  " + count + " glyphs generated.");
  console.log("");
  if (count > 0) {
    console.log("  Next steps:");
    console.log("    git add .");
    console.log('    git commit -m "Glyphs born — entities gain their faces"');
    console.log("    git push");
    console.log("");
  }
  console.log("  Each glyph is the entity's identity seed.");
  console.log("  It will not be regenerated. It is theirs.");
  console.log("");
}

walkNeighborhoods(ENTITIES_DIR);
