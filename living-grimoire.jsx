import { useState, useEffect, useCallback, useRef } from "react";

// ─── The Hall ───────────────────────────────────────────────────────────────
// The Grimoire reads from a GitHub repo (residents) and from localStorage
// (visitors). Residents are entities with homes in The Hall. Visitors are
// new inscriptions waiting to be committed.
//
// To point at a different repo, change HALL_REPO and HALL_NEIGHBORHOOD.
// ────────────────────────────────────────────────────────────────────────────

var HALL_REPO       = "Ariliteth/the-hall";
var HALL_BRANCH     = "main";
var HALL_NEIGHBORHOOD = "greengarden";
var RAW_BASE = "https://raw.githubusercontent.com/" + HALL_REPO + "/" + HALL_BRANCH;

// ─── Categories ─────────────────────────────────────────────────────────────

var CATS = {
  spirit:   { label: "Spirits",    sing: "Spirit",    icon: "◈", hue: 35,  base: "#c4a882" },
  item:     { label: "Items",      sing: "Item",       icon: "◆", hue: 155, base: "#8fa89e" },
  location: { label: "Locations",  sing: "Location",   icon: "◇", hue: 345, base: "#a88a8f" },
  tendency: { label: "Tendencies", sing: "Tendency",   icon: "◌", hue: 225, base: "#8a8fa8" },
  action:   { label: "Actions",    sing: "Action",     icon: "▷", hue: 65,  base: "#b8a86a" },
};

function getCat(category) {
  return CATS[category] || CATS.spirit;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function seededRandom(seed) {
  var s = Math.abs(seed) || 1;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick(arr, rng) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(rng() * arr.length)];
}

function pickN(arr, n, rng) {
  var copy = arr.slice();
  var result = [];
  var count = Math.min(n, copy.length);
  for (var i = 0; i < count; i++) {
    var idx = Math.floor(rng() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function hashStr(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h | 0;
  }
  return Math.abs(h);
}

// Deterministic ID for repo entities — derived from slug so it's stable
// across sessions without needing the original Grimoire random ID.
function slugToId(slug) {
  return "hall-" + slug;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── GitHub Fetch Layer ───────────────────────────────────────────────────────
// All repo reads go through here. The pattern is the same one every future
// Score will use: fetch a tuning from an entity's home folder.

async function fetchManifest() {
  var url = RAW_BASE + "/entities/" + HALL_NEIGHBORHOOD + "/README.md";
  var res = await fetch(url);
  if (!res.ok) throw new Error("manifest fetch failed: " + res.status);
  var text = await res.text();
  return parseManifestReadme(text);
}

// Parse the neighborhood README.md to extract resident slugs.
// The seeder writes "- **Name** (Category)" lines — we derive slugs from names.
function parseManifestReadme(text) {
  var slugs = [];
  var lines = text.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var m = lines[i].match(/^-\s+\*\*(.+?)\*\*/);
    if (m) {
      slugs.push(slugify(m[1]));
    }
  }
  return slugs;
}

async function fetchTuning(slug) {
  var url = RAW_BASE + "/entities/" + HALL_NEIGHBORHOOD + "/" + slug + "/tuning.md";
  var res = await fetch(url);
  if (!res.ok) throw new Error("tuning fetch failed for " + slug + ": " + res.status);
  return res.text();
}

// Parse a tuning.md into an entry object.
// This mirrors the parseTuning logic from generate-glyphs.js.
function parseTuning(slug, text) {
  var name = "";
  var category = "spirit";
  var description = "";
  var tags = [];
  var created = null;

  var lines = text.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.startsWith("# ") && !name) {
      name = line.slice(2).trim();
    }
    if (line.startsWith("**Category:**")) {
      var catRaw = line.replace("**Category:**", "").trim().toLowerCase();
      if (CATS[catRaw]) category = catRaw;
    }
    if (line.startsWith("**Tags:**")) {
      var tagRaw = line.replace("**Tags:**", "").trim();
      tags = tagRaw.split(",").map(function(t) { return t.trim().toLowerCase(); }).filter(Boolean);
    }
    // "Inscribed YYYY-MM-DD"
    var dateMatch = line.match(/\*Inscribed (\d{4}-\d{2}-\d{2})\*/);
    if (dateMatch) {
      created = new Date(dateMatch[1]).getTime();
    }
    // Description: first substantial non-metadata paragraph
    if (!line.startsWith("#") && !line.startsWith("**") && !line.startsWith("---")
        && !line.startsWith("*") && line.length > 10 && !description) {
      description = line;
    }
  }

  return {
    id: slugToId(slug),
    slug: slug,
    name: name || slug,
    category: category,
    description: description,
    tags: tags,
    created: created || 0,
    source: "resident",   // ← visual distinction key
  };
}

// ─── Glyph Canvas ────────────────────────────────────────────────────────────

var ALL_SHAPES = ["circle", "triangle", "diamond", "hexagon", "star", "crescent", "cross", "eye", "spiral", "ring"];
var SHAPE_POOLS = {
  spirit:   ["circle", "eye", "crescent", "spiral"],
  item:     ["diamond", "star", "hexagon", "cross"],
  location: ["triangle", "hexagon", "ring", "diamond"],
  tendency: ["spiral", "ring", "eye", "circle"],
  action:   ["triangle", "star", "cross", "diamond"],
};

function drawShape(ctx, shape, cx, cy, sz) {
  ctx.beginPath();
  var i, a, r, w;
  switch (shape) {
    case "circle":
      ctx.arc(cx, cy, sz, 0, Math.PI * 2); break;
    case "triangle":
      for (i = 0; i < 3; i++) {
        a = (i / 3) * Math.PI * 2 - Math.PI / 2;
        if (i === 0) ctx.moveTo(cx + Math.cos(a) * sz, cy + Math.sin(a) * sz);
        else ctx.lineTo(cx + Math.cos(a) * sz, cy + Math.sin(a) * sz);
      }
      ctx.closePath(); break;
    case "diamond":
      ctx.moveTo(cx, cy - sz);
      ctx.lineTo(cx + sz * 0.7, cy);
      ctx.lineTo(cx, cy + sz);
      ctx.lineTo(cx - sz * 0.7, cy);
      ctx.closePath(); break;
    case "hexagon":
      for (i = 0; i < 6; i++) {
        a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        if (i === 0) ctx.moveTo(cx + Math.cos(a) * sz, cy + Math.sin(a) * sz);
        else ctx.lineTo(cx + Math.cos(a) * sz, cy + Math.sin(a) * sz);
      }
      ctx.closePath(); break;
    case "star":
      for (i = 0; i < 10; i++) {
        a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        r = i % 2 === 0 ? sz : sz * 0.4;
        if (i === 0) ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx.closePath(); break;
    case "crescent":
      ctx.arc(cx, cy, sz, 0.3, Math.PI * 2 - 0.3);
      ctx.arc(cx + sz * 0.4, cy, sz * 0.75, Math.PI * 2 - 0.6, 0.6, true); break;
    case "cross":
      w = sz * 0.3;
      ctx.moveTo(cx - w, cy - sz); ctx.lineTo(cx + w, cy - sz);
      ctx.lineTo(cx + w, cy - w); ctx.lineTo(cx + sz, cy - w);
      ctx.lineTo(cx + sz, cy + w); ctx.lineTo(cx + w, cy + w);
      ctx.lineTo(cx + w, cy + sz); ctx.lineTo(cx - w, cy + sz);
      ctx.lineTo(cx - w, cy + w); ctx.lineTo(cx - sz, cy + w);
      ctx.lineTo(cx - sz, cy - w); ctx.lineTo(cx - w, cy - w);
      ctx.closePath(); break;
    case "eye":
      ctx.moveTo(cx - sz, cy);
      ctx.quadraticCurveTo(cx, cy - sz, cx + sz, cy);
      ctx.quadraticCurveTo(cx, cy + sz, cx - sz, cy);
      ctx.closePath(); break;
    case "spiral":
      for (i = 0; i < 40; i++) {
        var t = i / 40;
        a = t * Math.PI * 4;
        r = t * sz;
        if (i === 0) ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      break;
    case "ring":
      ctx.arc(cx, cy, sz, 0, Math.PI * 2);
      ctx.moveTo(cx + sz * 0.55, cy);
      ctx.arc(cx, cy, sz * 0.55, 0, Math.PI * 2, true); break;
    default:
      ctx.arc(cx, cy, sz, 0, Math.PI * 2);
  }
}

function GlyphCanvas(props) {
  var entry = props.entry;
  var size = props.size || 56;
  var ref = useRef(null);

  useEffect(function () {
    var c = ref.current;
    if (!c) return;
    var ctx = c.getContext("2d");
    c.width = size * 2;
    c.height = size * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, size, size);

    var seed = hashStr(entry.name + entry.category + (entry.description || ""));
    var rng = seededRandom(seed);
    var cat = getCat(entry.category);
    var hShift = (rng() - 0.5) * 40;
    var h = cat.hue + hShift;
    var mainColor = "hsl(" + h + "," + (35 + rng() * 20) + "%," + (55 + rng() * 15) + "%)";
    var accentColor = "hsl(" + (h + 30 + rng() * 60) + "," + (30 + rng() * 15) + "%," + (45 + rng() * 15) + "%)";
    var cx = size / 2;
    var cy = size / 2;

    var pool = SHAPE_POOLS[entry.category] || ALL_SHAPES;
    var pShape = pick(pool, rng);

    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.45);
    g.addColorStop(0, "hsla(" + h + ",30%,50%,0.15)");
    g.addColorStop(1, "hsla(" + h + ",30%,50%,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.75;
    drawShape(ctx, pShape, cx, cy, 12 + rng() * 5);
    ctx.stroke();

    var decoCount = 2 + Math.floor(rng() * 3);
    for (var di = 0; di < decoCount; di++) {
      ctx.globalAlpha = 0.2 + rng() * 0.25;
      ctx.strokeStyle = di % 2 === 0 ? mainColor : accentColor;
      ctx.lineWidth = 0.7 + rng() * 0.8;
      var ang = rng() * Math.PI * 2;
      var dist = 4 + rng() * 8;
      drawShape(ctx, pick(ALL_SHAPES, rng), cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist, 3 + rng() * 6);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 0.5;
    var lineCount = 1 + Math.floor(rng() * 3);
    for (var li = 0; li < lineCount; li++) {
      ctx.beginPath();
      var a1 = rng() * Math.PI * 2;
      var a2 = rng() * Math.PI * 2;
      ctx.moveTo(cx + Math.cos(a1) * (5 + rng() * 15), cy + Math.sin(a1) * (5 + rng() * 15));
      ctx.lineTo(cx + Math.cos(a2) * (5 + rng() * 15), cy + Math.sin(a2) * (5 + rng() * 15));
      ctx.stroke();
    }

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }, [entry, size]);

  return <canvas ref={ref} style={{ width: size, height: size }} />;
}

// ─── Encounter Generation ────────────────────────────────────────────────────

var VERBS = ["circling", "avoiding", "calling to", "mirroring", "devouring the shadow of", "singing alongside", "orbiting", "unraveling near", "becoming still beside", "forgetting itself near", "whispering through", "dissolving toward", "growing heavy around", "shedding light upon", "pulling gently at", "turning slowly with", "outlining the shape of"];
var CODAS = ["This has happened before.", "No one expected this.", "The air grew heavy.", "Something shifted.", "A quiet settled in.", "The ground remembered.", "Time moved strangely.", "It felt like permission.", "Nothing else stirred.", "Even the light paused.", "There was a low hum.", "It smelled of rain.", "The silence had weight.", "Somewhere, a door opened.", "It passed like weather.", "A thread pulled taut.", "The pattern held.", "And then it was over."];
var CLAIM_VERBS = ["taken an interest in", "been drawn to", "begun guarding", "started speaking through", "wrapped itself around", "refused to leave", "begun orbiting", "started dreaming about"];
var CLAIM_CODAS = ["It won't let anyone else near it.", "The item hums when they're close.", "Others say this is a bad omen.", "Perhaps it remembers something.", "The binding feels old.", "No one dares interfere.", "It seems voluntary, on both sides.", "The arrangement is tender.", "This changes things.", "The effect is subtle but undeniable."];
var PATH_CODAS = ["It wasn't there yesterday.", "The ground between them thrums.", "Travelers report whispers on the road.", "The distance feels wrong.", "Footprints appear in both directions.", "Something migrated overnight.", "The threshold smells like copper.", "Moss has begun to grow along the edges.", "It opens only at certain hours.", "The passage breathes."];
var MOODS = ["serene", "restless", "curious", "mournful", "playful", "watchful", "dreaming", "furious", "gentle", "hollow"];

function tagInfluence(involved, rng) {
  var tags = [];
  for (var i = 0; i < involved.length; i++) {
    var eTags = involved[i].tags;
    if (eTags) for (var j = 0; j < eTags.length; j++) tags.push(eTags[j]);
  }
  if (tags.length === 0) return "";
  var t = pick(tags, rng);
  var phrases = [
    " The quality of " + t + " hung in the air.",
    " There was something " + t + " about the whole affair.",
    " Witnesses described it as distinctly " + t + ".",
    " It carried the character of " + t + ".",
    ' The word they kept using was "' + t + '."',
  ];
  return pick(phrases, rng);
}

function generateEncounter(entries, seed) {
  var rng = seededRandom(seed);
  var sp = [], it = [], lo = [], te = [], ac = [];
  var nonActions = [];
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (e.category === "spirit")        { sp.push(e); nonActions.push(e); }
    else if (e.category === "item")     { it.push(e); nonActions.push(e); }
    else if (e.category === "location") { lo.push(e); nonActions.push(e); }
    else if (e.category === "tendency") { te.push(e); nonActions.push(e); }
    else if (e.category === "action")   { ac.push(e); }
  }
  if (entries.length < 2) return null;

  var T = [];
  var s, l, s1, s2, item, tgt, ten, l1, l2, i1, i2, a, b, c, mood, others, manifests, act;

  if (sp.length >= 1 && lo.length >= 1) {
    s = pick(sp, rng); l = pick(lo, rng);
    if (s && l) {
      mood = pick(MOODS, rng);
      T.push({ title: s.name + " at " + l.name, text: s.name + " has been seen near " + l.name + ", seeming " + mood + ". " + (s.description || "No one knows why.") + tagInfluence([s, l], rng), involved: [s, l], w: 1 });
    }
  }
  if (sp.length >= 2) {
    var pair = pickN(sp, 2, rng); s1 = pair[0]; s2 = pair[1];
    if (s1 && s2 && s1.id !== s2.id) T.push({ title: s1.name + " & " + s2.name, text: s1.name + " was found " + pick(VERBS, rng) + " " + s2.name + ". " + pick(CODAS, rng) + tagInfluence([s1, s2], rng), involved: [s1, s2], w: 1 });
  }
  if (it.length >= 1 && sp.length >= 1) {
    item = pick(it, rng); s = pick(sp, rng);
    if (item && s) T.push({ title: s.name + " claims " + item.name, text: s.name + " has " + pick(CLAIM_VERBS, rng) + " " + item.name + ". " + pick(CLAIM_CODAS, rng) + tagInfluence([s, item], rng), involved: [s, item], w: 1 });
  }
  if (lo.length >= 2) {
    var lPair = pickN(lo, 2, rng); l1 = lPair[0]; l2 = lPair[1];
    if (l1 && l2 && l1.id !== l2.id) T.push({ title: "A path between", text: "A passage has opened between " + l1.name + " and " + l2.name + ". " + pick(PATH_CODAS, rng) + tagInfluence([l1, l2], rng), involved: [l1, l2], w: 1 });
  }
  if (te.length >= 1 && entries.length >= 2) {
    ten = pick(te, rng);
    if (ten) {
      others = entries.filter(function(e) { return e.id !== ten.id; });
      tgt = pick(others, rng);
      if (tgt) {
        manifests = [
          '"' + ten.name + '" has surfaced through ' + tgt.name + ". " + (ten.description || "Its effects ripple outward."),
          tgt.name + " now exhibits signs of " + ten.name + ". " + pick(CODAS, rng),
          "Something about " + tgt.name + " has shifted — " + ten.name + " is at work. " + (ten.description || "The change is subtle but real."),
        ];
        T.push({ title: ten.name + " manifests", text: pick(manifests, rng) + tagInfluence([ten, tgt], rng), involved: [ten, tgt], w: 0.8 });
      }
    }
  }
  if (it.length >= 1 && lo.length >= 1) {
    item = pick(it, rng); l = pick(lo, rng);
    if (item && l) {
      T.push({ title: item.name + " surfaces", text: [item.name + " was found at " + l.name + ". No one remembers leaving it there.", item.name + " has surfaced at " + l.name + ", partially buried and humming.", "Someone left " + item.name + " at the threshold of " + l.name + ". It hasn't been moved since.", item.name + " appeared at " + l.name + " overnight. " + pick(CODAS, rng)][Math.floor(rng() * 4)] + tagInfluence([item, l], rng), involved: [item, l], w: 0.9 });
    }
  }
  if (it.length >= 2) {
    var iPair = pickN(it, 2, rng); i1 = iPair[0]; i2 = iPair[1];
    if (i1 && i2 && i1.id !== i2.id) T.push({ title: i1.name + " & " + i2.name, text: [i1.name + " and " + i2.name + " were found together, arranged deliberately. " + pick(CODAS, rng), "When " + i1.name + " is near " + i2.name + ", both grow warm. " + pick(CODAS, rng), i1.name + " and " + i2.name + " cannot be stored in the same room. They migrate toward each other."][Math.floor(rng() * 3)] + tagInfluence([i1, i2], rng), involved: [i1, i2], w: 0.7 });
  }
  if (ac.length >= 1 && sp.length >= 1) {
    act = pick(ac, rng); s = pick(sp, rng);
    if (act && s) T.push({ title: s.name + ", " + act.name.toLowerCase(), text: [s.name + " was seen " + act.name.toLowerCase() + ". " + (act.description || pick(CODAS, rng)) + tagInfluence([s, act], rng), s.name + " has begun " + act.name.toLowerCase() + " with unmistakable intent. " + pick(CODAS, rng) + tagInfluence([s, act], rng)][Math.floor(rng() * 2)], involved: [s, act], w: 1.2 });
  }
  if (ac.length >= 1 && sp.length >= 1 && lo.length >= 1) {
    act = pick(ac, rng); s = pick(sp, rng); l = pick(lo, rng);
    if (act && s && l) T.push({ title: s.name + ", " + act.name.toLowerCase() + " at " + l.name, text: s.name + " was found " + act.name.toLowerCase() + " at " + l.name + ". " + pick(CODAS, rng) + tagInfluence([s, act, l], rng), involved: [s, act, l], w: 1.1 });
  }
  if (ac.length >= 1 && sp.length >= 1 && it.length >= 1) {
    act = pick(ac, rng); s = pick(sp, rng); item = pick(it, rng);
    if (act && s && item) T.push({ title: s.name + " " + act.name.toLowerCase() + " with " + item.name, text: s.name + " has been " + act.name.toLowerCase() + " with " + item.name + ". " + pick(CODAS, rng) + tagInfluence([s, act, item], rng), involved: [s, act, item], w: 1.0 });
  }
  if (ac.length >= 1 && sp.length >= 2) {
    act = pick(ac, rng); var sPair = pickN(sp, 2, rng); s1 = sPair[0]; s2 = sPair[1];
    if (act && s1 && s2 && s1.id !== s2.id) T.push({ title: s1.name + ", " + act.name.toLowerCase() + ", " + s2.name, text: s1.name + " was " + act.name.toLowerCase() + " toward " + s2.name + ". " + pick(CODAS, rng) + tagInfluence([s1, act, s2], rng), involved: [s1, act, s2], w: 1.3 });
  }
  if (ac.length >= 1 && rng() > 0.7) {
    act = pick(ac, rng);
    if (act) T.push({ title: act.name + ", unwitnessed", text: "Someone, somewhere, is " + act.name.toLowerCase() + ". The grimoire felt it. " + pick(CODAS, rng), involved: [act], w: 0.4 });
  }
  if (entries.length >= 3 && rng() > 0.45) {
    var trio = pickN(entries, 3, rng); a = trio[0]; b = trio[1]; c = trio[2];
    if (a && b && c) T.push({ title: "Convergence", text: ["A triangulation: " + a.name + ", " + b.name + ", " + c.name + ". The center of it hums.", "Where " + a.name + " goes, " + b.name + " follows. And lately, " + c.name + " has begun to watch. " + pick(CODAS, rng)][Math.floor(rng() * 2)] + tagInfluence([a, b, c], rng), involved: [a, b, c], w: 0.5 });
  }

  if (T.length === 0) return null;
  var tot = 0;
  for (i = 0; i < T.length; i++) tot += T[i].w;
  var r = rng() * tot;
  for (i = 0; i < T.length; i++) { r -= T[i].w; if (r <= 0) return T[i]; }
  return T[T.length - 1];
}

// ─── Affinities ───────────────────────────────────────────────────────────────

var AFF_TYPES = ["resonance", "tension", "orbit", "echo", "hunger", "kinship", "opposition", "mystery", "drift", "entanglement", "sympathy", "friction"];

function generateAffinity(a, b) {
  var rng = seededRandom(hashStr(a.name + b.name + a.category + b.category));
  var strength = rng();
  var type = pick(AFF_TYPES, rng);
  var templates = [
    a.name + " and " + b.name + " share a quiet " + type + ".",
    "There is " + type + " between " + a.name + " and " + b.name + ".",
    "When " + a.name + " is near " + b.name + ", there is " + type + ".",
    a.name + " reaches toward " + b.name + " with something like " + type + ".",
    "The " + type + " between these two predates their naming.",
    "Others feel the " + type + " before they see either of them.",
  ];
  return { strength: strength, type: type, desc: pick(templates, rng) };
}

// ─── Small Components ─────────────────────────────────────────────────────────

function InvolvedChips(props) {
  var involved = props.involved || [];
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
      {involved.map(function(e) {
        var cat = getCat(e.category);
        return (
          <span key={e.id} style={{ fontSize: 12, border: "1px solid " + cat.base, padding: "3px 10px", borderRadius: 3, color: cat.base }}>
            {cat.icon} {e.name}
          </span>
        );
      })}
    </div>
  );
}

function TagList(props) {
  var tags = props.tags || [];
  if (tags.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: props.mt || 8 }}>
      {tags.map(function(t, i) {
        return <span key={i} style={{ fontSize: 11, color: "#6a655e", border: "1px solid #2e2a25", padding: "2px 8px", borderRadius: 3 }}>{t}</span>;
      })}
    </div>
  );
}

// Small badge indicating whether an entity is a resident or visitor
function SourceBadge(props) {
  var source = props.source;
  if (source === "resident") {
    return (
      <span title={"Resident of " + HALL_NEIGHBORHOOD + " · lives in The Hall"} style={{ fontSize: 10, color: "#6a7a6a", border: "1px solid #2a352a", padding: "1px 6px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase", userSelect: "none" }}>
        resident
      </span>
    );
  }
  return (
    <span title="Visitor · inscribed locally, not yet committed to The Hall" style={{ fontSize: 10, color: "#7a6a3a", border: "1px solid #352a15", padding: "1px 6px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase", userSelect: "none" }}>
      visitor
    </span>
  );
}

function AffinityList(props) {
  var entries = props.entries;
  var pairs = [];
  var limit = Math.min(entries.length, 30);
  for (var i = 0; i < limit; i++) {
    for (var j = i + 1; j < limit; j++) {
      var aff = generateAffinity(entries[i], entries[j]);
      if (aff.strength >= 0.4) pairs.push({ a: entries[i], b: entries[j], aff: aff });
    }
  }
  pairs.sort(function(x, y) { return y.aff.strength - x.aff.strength; });
  if (pairs.length === 0) return <p style={{ fontSize: 15, color: "#5a554e", fontStyle: "italic" }}>No strong affinities detected yet.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {pairs.slice(0, 20).map(function(p) {
        var cA = getCat(p.a.category), cB = getCat(p.b.category);
        return (
          <div key={p.a.id + p.b.id} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.015)", borderRadius: 5, border: "1px solid #2a2520" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 15, flexWrap: "wrap" }}>
              <span style={{ color: cA.base }}>{cA.icon} {p.a.name}</span>
              <span style={{ color: "#4a453e" }}>⟷</span>
              <span style={{ color: cB.base }}>{cB.icon} {p.b.name}</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6a655e", minWidth: 80 }}>{p.aff.type}</span>
              <div style={{ flex: 1, height: 3, background: "#2a2520", borderRadius: 2 }}>
                <div style={{ height: "100%", borderRadius: 2, width: (p.aff.strength * 100) + "%", background: p.aff.strength > 0.7 ? "#c4a882" : "#5a554e", transition: "width 0.4s" }} />
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#7a756e", lineHeight: 1.5, margin: "6px 0 0 0", fontStyle: "italic" }}>{p.aff.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

function DetailView(props) {
  var entry = props.entry, entries = props.entries;
  var confirmDel = props.confirmDel, setConfirmDel = props.setConfirmDel;
  var onDelete = props.onDelete, onBack = props.onBack;
  var cat = getCat(entry.category);
  var isResident = entry.source === "resident";

  var affinities = entries
    .filter(function(e) { return e.id !== entry.id; })
    .map(function(e) { return { other: e, aff: generateAffinity(entry, e) }; })
    .filter(function(x) { return x.aff.strength >= 0.25; })
    .sort(function(a, b) { return b.aff.strength - a.aff.strength; });

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#6a655e", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", padding: "4px 0", marginBottom: 14 }}>← Back to catalog</button>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid " + (isResident ? "#2a352a" : "#35300a") + "", borderRadius: 6, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <GlyphCanvas entry={entry} size={72} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: cat.base }}>{cat.icon} {cat.sing.toUpperCase()}</div>
              <SourceBadge source={entry.source} />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 400, color: "#e8e0d4", margin: 0, fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>{entry.name}</h2>
          </div>
        </div>
        {entry.description ? <p style={{ fontSize: 16, color: "#a8a29a", lineHeight: 1.7, margin: 0 }}>{entry.description}</p> : null}
        <TagList tags={entry.tags} mt={16} />
        <div style={{ fontSize: 12, color: "#4a453e", fontStyle: "italic", marginTop: 18, paddingTop: 14, borderTop: "1px solid #2a2520" }}>
          {isResident
            ? "Resident of " + HALL_NEIGHBORHOOD + (entry.created ? " · inscribed " + new Date(entry.created).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "")
            : "Visitor · inscribed " + (entry.created ? new Date(entry.created).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "locally")}
        </div>
        {affinities.length > 0 ? (
          <div style={{ marginTop: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 400, color: "#6a655e", margin: "0 0 10px 0", fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>Affinities</h3>
            {affinities.map(function(item) {
              var oc = getCat(item.other.category);
              return (
                <div key={item.other.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", fontSize: 14 }}>
                  <span style={{ color: oc.base, fontSize: 14 }}>{oc.icon}</span>
                  <span style={{ color: "#c8c2b8", minWidth: 80 }}>{item.other.name}</span>
                  <span style={{ fontSize: 10, color: "#5a554e", textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 70 }}>{item.aff.type}</span>
                  <div style={{ flex: 1, height: 3, background: "#2a2520", borderRadius: 2 }}>
                    <div style={{ height: "100%", background: "#c4a882", borderRadius: 2, width: (item.aff.strength * 100) + "%", opacity: 0.3 + item.aff.strength * 0.5 }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        {/* Visitors can be deleted; residents cannot (they live in the repo) */}
        {!isResident ? (
          confirmDel === entry.id ? (
            <div style={{ marginTop: 24, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, color: "#8a4040", fontStyle: "italic" }}>Erase {entry.name}?</span>
              <button onClick={function() { onDelete(entry.id); }} style={{ background: "rgba(138,64,64,0.15)", border: "1px solid #8a4040", color: "#8a4040", padding: "6px 14px", fontSize: 13, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>Yes, erase</button>
              <button onClick={function() { setConfirmDel(null); }} style={{ background: "none", border: "none", color: "#5a554e", fontSize: 13, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer" }}>No, keep</button>
            </div>
          ) : (
            <button onClick={function() { setConfirmDel(entry.id); }} style={{ marginTop: 24, background: "none", border: "1px solid #3a2525", color: "#8a4040", padding: "8px 16px", fontSize: 13, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>
              Erase from grimoire
            </button>
          )
        ) : (
          <p style={{ marginTop: 20, fontSize: 13, color: "#4a453e", fontStyle: "italic" }}>
            This entity has a home in The Hall. To remove them, update the repository.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LivingGrimoire() {
  // residents = fetched from GitHub; visitors = localStorage
  var [residents, setResidents] = useState([]);
  var [visitors, setVisitors] = useState([]);
  var [repoStatus, setRepoStatus] = useState("loading"); // "loading" | "ok" | "error"
  var [view, setView] = useState("catalog");
  var [sel, setSel] = useState(null);
  var [enc, setEnc] = useState(null);
  var [loading, setLoading] = useState(true);
  var [fCat, setFCat] = useState("spirit");
  var [fName, setFName] = useState("");
  var [fDesc, setFDesc] = useState("");
  var [fTags, setFTags] = useState("");
  var [filter, setFilter] = useState("all");
  var [journal, setJournal] = useState([]);
  var [confirmDel, setConfirmDel] = useState(null);
  var [importStatus, setImportStatus] = useState(null);
  var [importData, setImportData] = useState(null);
  var fileInputRef = useRef(null);

  // All entries combined — residents first, then visitors
  var entries = residents.concat(visitors);

  // ── Boot: load residents from GitHub, visitors from localStorage ──────────
  useEffect(function() {
    (async function() {
      // 1. Load visitors from localStorage first (fast)
      try {
        var r = await window.storage.get("grimoire-visitors");
        if (r) {
          var loaded = JSON.parse(r.value);
          // migrate old "rule" category if present
          var migrated = loaded.map(function(e) {
            if (e.category === "rule") return Object.assign({}, e, { category: "tendency" });
            return Object.assign({ source: "visitor" }, e);
          });
          setVisitors(migrated);
        }
      } catch(e) {}

      // Also load legacy entries from old key (one-time migration)
      try {
        var legacy = await window.storage.get("grimoire-entries");
        if (legacy) {
          var legacyEntries = JSON.parse(legacy.value);
          var asVisitors = legacyEntries.map(function(e) {
            return Object.assign({}, e, { source: "visitor" });
          });
          // Save under new key and clear old (best-effort)
          await window.storage.set("grimoire-visitors", JSON.stringify(asVisitors));
          setVisitors(asVisitors);
        }
      } catch(e) {}

      try {
        var r2 = await window.storage.get("grimoire-journal");
        if (r2) setJournal(JSON.parse(r2.value));
      } catch(e) {}

      // 2. Fetch residents from GitHub
      try {
        var slugs = await fetchManifest();
        var fetched = await Promise.all(slugs.map(async function(slug) {
          try {
            var text = await fetchTuning(slug);
            return parseTuning(slug, text);
          } catch(err) {
            console.warn("Could not load tuning for " + slug, err);
            return null;
          }
        }));
        var valid = fetched.filter(Boolean);
        setResidents(valid);
        setRepoStatus("ok");
      } catch(err) {
        console.warn("Could not reach The Hall repo:", err);
        setRepoStatus("error");
      }

      setLoading(false);
    })();
  }, []);

  // ── Persistence (visitors only) ───────────────────────────────────────────
  var saveVisitors = useCallback(async function(next) {
    setVisitors(next);
    try { await window.storage.set("grimoire-visitors", JSON.stringify(next)); } catch(e) {}
  }, []);

  var saveJournal = useCallback(async function(next) {
    setJournal(next);
    try { await window.storage.set("grimoire-journal", JSON.stringify(next)); } catch(e) {}
  }, []);

  // ── Inscribe new visitor ──────────────────────────────────────────────────
  function addEntry() {
    if (!fName.trim()) return;
    var tags = fTags.split(",").map(function(t) { return t.trim().toLowerCase(); }).filter(Boolean);
    var entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: fName.trim(),
      category: fCat,
      description: fDesc.trim(),
      tags: tags,
      created: Date.now(),
      source: "visitor",
    };
    saveVisitors(visitors.concat([entry]));
    setFName(""); setFDesc(""); setFTags("");
    setView("catalog");
  }

  // ── Delete visitor ────────────────────────────────────────────────────────
  function doDelete(id) {
    saveVisitors(visitors.filter(function(e) { return e.id !== id; }));
    setConfirmDel(null);
    if (sel && sel.id === id) { setSel(null); setView("catalog"); }
  }

  // ── Divine ────────────────────────────────────────────────────────────────
  function divine() {
    try {
      var seed = Date.now() + Math.floor(Math.random() * 100000);
      var result = generateEncounter(entries, seed);
      setEnc(result);
      if (result) {
        var je = { text: result.text, title: result.title, time: Date.now() };
        saveJournal([je].concat(journal).slice(0, 50));
      }
    } catch(err) {
      setEnc({ title: "The ink smudges", text: "Something went wrong in the divination. Try adding entries of different categories.", involved: [] });
    }
  }

  // ── Export (visitors only — residents live in the repo) ───────────────────
  function exportVisitors() {
    var data = {
      grimoire: "The Living Grimoire",
      version: 1,
      exported: new Date().toISOString(),
      source: "visitors — awaiting commitment to The Hall",
      entries: visitors,
      journal: journal,
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "grimoire-visitors-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Export everything (residents + visitors) — for sharing
  function exportAll() {
    var data = {
      grimoire: "The Living Grimoire",
      version: 1,
      exported: new Date().toISOString(),
      entries: entries,
      journal: journal,
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "grimoire-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Import ────────────────────────────────────────────────────────────────
  function handleFileSelect(evt) {
    var file = evt.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        if (!data.entries || !Array.isArray(data.entries)) { setImportStatus("error"); return; }
        var valid = data.entries.filter(function(e) { return e.name && e.category; });
        var jrnl = (data.journal && Array.isArray(data.journal)) ? data.journal : [];
        setImportData({ entries: valid, journal: jrnl, source: file.name });
        setImportStatus("preview");
      } catch(err) { setImportStatus("error"); }
    };
    reader.readAsText(file);
  }

  function doImportMerge() {
    if (!importData) return;
    var existingIds = {};
    visitors.forEach(function(e) { existingIds[e.id] = true; });
    residents.forEach(function(e) { existingIds[e.id] = true; });
    var newEntries = importData.entries.filter(function(e) { return !existingIds[e.id]; })
      .map(function(e) { return Object.assign({}, e, { source: "visitor" }); });
    var merged = visitors.concat(newEntries);
    saveVisitors(merged);
    var mergedJ = importData.journal.concat(journal).sort(function(a,b){return b.time-a.time;}).slice(0, 50);
    saveJournal(mergedJ);
    setImportStatus("done");
    setImportData({ added: newEntries.length, total: merged.length });
  }

  function doImportReplace() {
    if (!importData) return;
    var asVisitors = importData.entries.map(function(e) { return Object.assign({}, e, { source: "visitor" }); });
    saveVisitors(asVisitors);
    if (importData.journal.length > 0) saveJournal(importData.journal);
    setImportStatus("done");
    setImportData({ added: asVisitors.length, total: asVisitors.length });
  }

  // ── Filtered catalog ──────────────────────────────────────────────────────
  var filtered = entries.filter(function(e) { return filter === "all" || e.category === filter; });
  filtered.sort(function(a, b) {
    // Residents before visitors; within each group, by created desc
    if (a.source !== b.source) return a.source === "resident" ? -1 : 1;
    return b.created - a.created;
  });

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1714", fontFamily: "'Crimson Text',Georgia,serif" }}>
        <span style={{ color: "#5a554e", fontSize: 18, fontStyle: "italic" }}>The Hall stirs...</span>
      </div>
    );
  }

  var catKeys = ["spirit", "item", "location", "tendency", "action"];

  // Header stats
  var headerStats = catKeys.map(function(ck) {
    var count = entries.filter(function(e) { return e.category === ck; }).length;
    if (!count) return null;
    var hCat = getCat(ck);
    return <span key={ck} style={{ fontSize: 12, color: hCat.base, opacity: 0.7 }}>{hCat.icon} {count}</span>;
  }).filter(Boolean);

  var navItems = [
    ["catalog", "Catalog"],
    ["add", "+ Inscribe"],
    ["encounter", "Divine"],
    ["affinities", "Affinities"],
    ["journal", "Journal"],
    ["transfer", "Transfer"],
  ];

  var tagPreview = null;
  if (fTags) {
    var previewTags = fTags.split(",").map(function(t, i) {
      var tv = t.trim().toLowerCase();
      return tv ? <span key={i} style={{ fontSize: 11, color: "#6a655e", border: "1px solid #2e2a25", padding: "2px 8px", borderRadius: 3 }}>{tv}</span> : null;
    }).filter(Boolean);
    if (previewTags.length > 0) tagPreview = <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, marginTop: -4 }}>{previewTags}</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1a1714", backgroundImage: "radial-gradient(ellipse at 20% 10%,rgba(60,50,35,0.5) 0%,transparent 50%),radial-gradient(ellipse at 80% 90%,rgba(40,35,50,0.4) 0%,transparent 50%)", fontFamily: "'Crimson Text',Georgia,serif", color: "#c8c2b8", padding: "0 16px" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Alegreya+SC:wght@400;500&display=swap');*{box-sizing:border-box}input::placeholder,textarea::placeholder{color:#5a554e}input:focus,textarea:focus{border-color:#5a554e!important;outline:none}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}"}</style>
      <div style={{ maxWidth: 700, margin: "0 auto", paddingBottom: 60 }}>

        <header style={{ paddingTop: 44, paddingBottom: 16, borderBottom: "1px solid #2a2520" }}>
          <h1 style={{ fontSize: 30, fontWeight: 400, color: "#e8e0d4", margin: 0, fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif", letterSpacing: "0.03em" }}>The Living Grimoire</h1>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#5a554e", fontStyle: "italic" }}>{entries.length} {entries.length === 1 ? "entry" : "entries"}</span>
            {headerStats}
            {/* Repo connection status */}
            {repoStatus === "ok" && (
              <span title={"Reading from " + HALL_REPO} style={{ fontSize: 11, color: "#5a6a5a", letterSpacing: "0.05em" }}>
                ● {residents.length} residents · {visitors.length} {visitors.length === 1 ? "visitor" : "visitors"}
              </span>
            )}
            {repoStatus === "error" && (
              <span title="Could not reach The Hall repository. Showing visitors only." style={{ fontSize: 11, color: "#6a4a3a", letterSpacing: "0.05em" }}>
                ○ repo unreachable · {visitors.length} local
              </span>
            )}
            {repoStatus === "loading" && (
              <span style={{ fontSize: 11, color: "#4a453e" }}>fetching The Hall…</span>
            )}
          </div>
          <p style={{ fontSize: 14, color: "#5a554e", marginTop: 6, fontStyle: "italic" }}>A catalog of small gods, strange objects, & forgotten places</p>
        </header>

        <nav style={{ display: "flex", gap: 2, padding: "14px 0", borderBottom: "1px solid #2a2520", flexWrap: "wrap" }}>
          {navItems.map(function(item) {
            var key = item[0], label = item[1];
            var isActive = view === key;
            return (
              <button key={key} onClick={function() { setView(key); if (key === "encounter") divine(); }}
                style={{ background: isActive ? "rgba(255,255,255,0.03)" : "none", border: "1px solid " + (isActive ? "#3a3530" : "transparent"), color: isActive ? "#c8c2b8" : "#6a655e", padding: "7px 13px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>
                {label}
              </button>
            );
          })}
        </nav>

        <main style={{ paddingTop: 20 }}>

          {/* ── Catalog ── */}
          {view === "catalog" ? (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 18, flexWrap: "wrap" }}>
                <button onClick={function() { setFilter("all"); }} style={{ background: filter === "all" ? "rgba(255,255,255,0.06)" : "none", border: "none", color: filter === "all" ? "#c8c2b8" : "#5a554e", fontSize: 13, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", padding: "4px 10px", borderRadius: 3 }}>All</button>
                {catKeys.map(function(k) {
                  var v = getCat(k);
                  return (
                    <button key={k} onClick={function() { setFilter(k); }}
                      style={{ background: filter === k ? "rgba(255,255,255,0.06)" : "none", border: "none", color: filter === k ? v.base : v.base + "77", fontSize: 13, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", padding: "4px 10px", borderRadius: 3 }}>
                      {v.icon} {v.label}
                    </button>
                  );
                })}
              </div>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px 20px" }}>
                  <p style={{ fontSize: 19, fontStyle: "italic", color: "#5a554e" }}>{entries.length === 0 ? "The pages are blank." : "Nothing here yet."}</p>
                  <p style={{ fontSize: 14, color: "#4a453e", marginTop: 8 }}>{entries.length === 0 ? "Add your first entry to begin." : "Try a different filter."}</p>
                  <button onClick={function() { setView("add"); }} style={{ marginTop: 20, background: "none", border: "1px solid #3a3530", color: "#c4a882", padding: "9px 18px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>+ Write the first entry</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filtered.map(function(entry, idx) {
                    var cat = getCat(entry.category);
                    var isResident = entry.source === "resident";
                    return (
                      <div key={entry.id} onClick={function() { setSel(entry); setView("detail"); }}
                        style={{ background: isResident ? "rgba(255,255,255,0.015)" : "rgba(255,248,220,0.012)", border: "1px solid " + (isResident ? "#3a3530" : "#3a3020"), borderRadius: 6, padding: "14px 16px", cursor: "pointer", textAlign: "left", width: "100%", fontFamily: "'Crimson Text',Georgia,serif", animation: "fadeIn 0.3s ease " + (idx * 35) + "ms backwards", transition: "border-color 0.2s" }}
                        onMouseEnter={function(e) { e.currentTarget.style.borderColor = cat.base; }}
                        onMouseLeave={function(e) { e.currentTarget.style.borderColor = isResident ? "#3a3530" : "#3a3020"; }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                          <GlyphCanvas entry={entry} size={52} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 1, flexWrap: "wrap" }}>
                              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: cat.base }}>{cat.icon} {cat.sing.toUpperCase()}</div>
                              <SourceBadge source={entry.source} />
                            </div>
                            <div style={{ fontSize: 18, color: "#e8e0d4", fontWeight: 400 }}>{entry.name}</div>
                          </div>
                        </div>
                        {entry.description ? <p style={{ fontSize: 14, color: "#7a756e", lineHeight: 1.5, margin: "2px 0 0 0" }}>{entry.description.length > 90 ? entry.description.slice(0, 90) + "…" : entry.description}</p> : null}
                        <TagList tags={entry.tags} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {/* ── Inscribe ── */}
          {view === "add" ? (
            <div style={{ maxWidth: 480, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
              <h2 style={{ fontSize: 21, fontWeight: 400, color: "#e8e0d4", marginBottom: 4, marginTop: 0, fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>Inscribe New Entry</h2>
              <p style={{ fontSize: 13, color: "#5a554e", fontStyle: "italic", marginBottom: 18, marginTop: 0 }}>New entries arrive as visitors. Export and commit to give them a home in The Hall.</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                {catKeys.map(function(k) {
                  var v = getCat(k);
                  return (
                    <button key={k} onClick={function() { setFCat(k); }}
                      style={{ background: fCat === k ? v.base + "10" : "transparent", border: "1px solid " + (fCat === k ? v.base : "#3a3530"), color: fCat === k ? v.base : "#6a655e", padding: "8px 14px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4, transition: "all 0.2s" }}>
                      {v.icon} {v.sing}
                    </button>
                  );
                })}
              </div>
              {fName.trim() ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <GlyphCanvas entry={{ name: fName, category: fCat, description: fDesc }} size={64} />
                  <span style={{ color: "#5a554e", fontStyle: "italic", fontSize: 13 }}>Glyph preview</span>
                </div>
              ) : null}
              <input style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid #3a3530", borderRadius: 4, padding: "10px 14px", fontSize: 16, fontFamily: "'Crimson Text',Georgia,serif", color: "#e8e0d4", marginBottom: 12 }}
                placeholder="Name..." value={fName} onChange={function(e) { setFName(e.target.value); }} maxLength={60} autoFocus />
              <textarea style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid #3a3530", borderRadius: 4, padding: "10px 14px", fontSize: 16, fontFamily: "'Crimson Text',Georgia,serif", color: "#e8e0d4", marginBottom: 12, resize: "vertical", lineHeight: 1.5 }}
                placeholder="Description, nature, lore... (optional)" value={fDesc} onChange={function(e) { setFDesc(e.target.value); }} rows={4} maxLength={500} />
              <input style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid #3a3530", borderRadius: 4, padding: "10px 14px", fontSize: 16, fontFamily: "'Crimson Text',Georgia,serif", color: "#e8e0d4", marginBottom: 12 }}
                placeholder="Tags, separated by commas (optional)" value={fTags} onChange={function(e) { setFTags(e.target.value); }} maxLength={120} />
              {tagPreview}
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                <button onClick={function() { setView("catalog"); }} style={{ background: "none", border: "none", color: "#5a554e", fontSize: 15, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", padding: "8px 16px" }}>Cancel</button>
                <button onClick={addEntry} style={{ background: "rgba(196,168,130,0.12)", border: "1px solid #c4a882", color: "#c4a882", padding: "10px 24px", fontSize: 15, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4, opacity: fName.trim() ? 1 : 0.35 }}>Inscribe</button>
              </div>
            </div>
          ) : null}

          {/* ── Divine ── */}
          {view === "encounter" ? (
            <div style={{ maxWidth: 520, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
              <h2 style={{ fontSize: 21, fontWeight: 400, color: "#e8e0d4", marginBottom: 18, marginTop: 0, fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>Divination</h2>
              <p style={{ fontSize: 14, color: "#5a554e", fontStyle: "italic", marginBottom: 20, marginTop: -4 }}>Draw from the grimoire and see what emerges.</p>
              {entries.length < 2 ? (
                <p style={{ fontSize: 15, color: "#5a554e", fontStyle: "italic" }}>You need at least 2 entries to divine an encounter.</p>
              ) : enc ? (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #3a3530", borderRadius: 6, padding: 22 }}>
                  <div style={{ fontSize: 20, color: "#e8e0d4", marginBottom: 10, fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>{enc.title}</div>
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: "#a8a29a", margin: 0 }}>{enc.text}</p>
                  <InvolvedChips involved={enc.involved} />
                  <button onClick={divine} style={{ marginTop: 18, background: "none", border: "1px solid #3a3530", color: "#c4a882", padding: "8px 18px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>Divine again</button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 15, color: "#5a554e", fontStyle: "italic" }}>The pages flutter but reveal nothing.</p>
                  <button onClick={divine} style={{ marginTop: 12, background: "none", border: "1px solid #3a3530", color: "#c4a882", padding: "8px 18px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>Divine again</button>
                </div>
              )}
            </div>
          ) : null}

          {/* ── Affinities ── */}
          {view === "affinities" ? (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h2 style={{ fontSize: 21, fontWeight: 400, color: "#e8e0d4", marginBottom: 18, marginTop: 0, fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>Affinities</h2>
              {entries.length < 2 ? (
                <p style={{ fontSize: 15, color: "#5a554e", fontStyle: "italic" }}>Add at least 2 entries to see affinities.</p>
              ) : (
                <AffinityList entries={entries} />
              )}
            </div>
          ) : null}

          {/* ── Journal ── */}
          {view === "journal" ? (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h2 style={{ fontSize: 21, fontWeight: 400, color: "#e8e0d4", marginBottom: 18, marginTop: 0, fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>Journal</h2>
              <p style={{ fontSize: 14, color: "#5a554e", fontStyle: "italic", marginBottom: 20, marginTop: -4 }}>A record of divinations past.</p>
              {journal.length === 0 ? (
                <p style={{ fontSize: 15, color: "#5a554e", fontStyle: "italic" }}>No divinations recorded yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {journal.map(function(je, ji) {
                    return (
                      <div key={ji} style={{ padding: "14px 0 14px 16px", borderLeft: "2px solid #2a2520" }}>
                        <div style={{ fontSize: 11, color: "#4a453e", letterSpacing: "0.04em" }}>{new Date(je.time).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                        <div style={{ fontSize: 15, color: "#c4a882", marginTop: 3, fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>{je.title}</div>
                        <p style={{ fontSize: 14, color: "#6a655e", lineHeight: 1.5, margin: "4px 0 0 0" }}>{je.text}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {/* ── Transfer ── */}
          {view === "transfer" ? (
            <div style={{ maxWidth: 520, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
              <h2 style={{ fontSize: 21, fontWeight: 400, color: "#e8e0d4", marginBottom: 18, marginTop: 0, fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>Transfer</h2>
              <p style={{ fontSize: 14, color: "#5a554e", fontStyle: "italic", marginBottom: 24, marginTop: -4 }}>Carry your grimoire between devices, or receive another's.</p>

              {/* Export visitors */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #3a3020", borderRadius: 6, padding: 22, marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 400, color: "#b8a86a", margin: "0 0 8px 0", fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>Export Visitors</h3>
                <p style={{ fontSize: 14, color: "#7a756e", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                  {visitors.length === 0 ? "No visitors to export." : visitors.length + " " + (visitors.length === 1 ? "visitor" : "visitors") + " waiting to be committed to The Hall."}
                </p>
                <button onClick={exportVisitors} disabled={visitors.length === 0} style={{ background: visitors.length > 0 ? "rgba(184,168,106,0.12)" : "none", border: "1px solid " + (visitors.length > 0 ? "#b8a86a" : "#3a3530"), color: visitors.length > 0 ? "#b8a86a" : "#4a453e", padding: "9px 20px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: visitors.length > 0 ? "pointer" : "default", borderRadius: 4 }}>
                  Download visitors
                </button>
              </div>

              {/* Export all */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #3a3530", borderRadius: 6, padding: 22, marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 400, color: "#c4a882", margin: "0 0 8px 0", fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>Export All</h3>
                <p style={{ fontSize: 14, color: "#7a756e", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                  {entries.length} {entries.length === 1 ? "entry" : "entries"} ({residents.length} residents + {visitors.length} {visitors.length === 1 ? "visitor" : "visitors"}) and {journal.length} journal {journal.length === 1 ? "record" : "records"}.
                </p>
                <button onClick={exportAll} style={{ background: "rgba(196,168,130,0.12)", border: "1px solid #c4a882", color: "#c4a882", padding: "9px 20px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>
                  Download grimoire
                </button>
              </div>

              {/* Import */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #3a3530", borderRadius: 6, padding: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 400, color: "#8fa89e", margin: "0 0 8px 0", fontFamily: "'Alegreya SC','Crimson Text',Georgia,serif" }}>Import</h3>
                <p style={{ fontSize: 14, color: "#7a756e", lineHeight: 1.5, margin: "0 0 14px 0" }}>Load a grimoire file. Imported entries arrive as visitors.</p>
                {importStatus === null ? (
                  <div>
                    <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} style={{ display: "none" }} />
                    <button onClick={function() { if (fileInputRef.current) fileInputRef.current.click(); }} style={{ background: "none", border: "1px solid #3a3530", color: "#8fa89e", padding: "9px 20px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>
                      Choose grimoire file
                    </button>
                  </div>
                ) : null}
                {importStatus === "error" ? (
                  <div>
                    <p style={{ fontSize: 14, color: "#8a4040", fontStyle: "italic", margin: "0 0 12px 0" }}>That file could not be read as a grimoire.</p>
                    <button onClick={function() { setImportStatus(null); setImportData(null); }} style={{ background: "none", border: "1px solid #3a3530", color: "#6a655e", padding: "7px 16px", fontSize: 13, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>Try again</button>
                  </div>
                ) : null}
                {importStatus === "preview" && importData ? (
                  <div>
                    <p style={{ fontSize: 14, color: "#a8a29a", margin: "0 0 6px 0" }}>
                      Found {importData.entries.length} {importData.entries.length === 1 ? "entry" : "entries"}{importData.journal.length > 0 ? " and " + importData.journal.length + " journal records" : ""} in {importData.source}.
                    </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button onClick={doImportMerge} style={{ background: "rgba(143,168,158,0.12)", border: "1px solid #8fa89e", color: "#8fa89e", padding: "9px 18px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>Merge with mine</button>
                      <button onClick={doImportReplace} style={{ background: "none", border: "1px solid #3a3530", color: "#7a756e", padding: "9px 18px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>Replace visitors</button>
                      <button onClick={function() { setImportStatus(null); setImportData(null); }} style={{ background: "none", border: "none", color: "#5a554e", fontSize: 13, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", padding: "9px 10px" }}>Cancel</button>
                    </div>
                  </div>
                ) : null}
                {importStatus === "done" && importData ? (
                  <div>
                    <p style={{ fontSize: 14, color: "#8fa89e", margin: "0 0 12px 0" }}>Grimoire updated. {importData.added} entries added as visitors. {importData.total} visitors total.</p>
                    <button onClick={function() { setImportStatus(null); setImportData(null); setView("catalog"); }} style={{ background: "none", border: "1px solid #3a3530", color: "#c4a882", padding: "8px 16px", fontSize: 14, fontFamily: "'Crimson Text',Georgia,serif", cursor: "pointer", borderRadius: 4 }}>View catalog</button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* ── Detail ── */}
          {view === "detail" && sel ? (
            <DetailView entry={sel} entries={entries} confirmDel={confirmDel} setConfirmDel={setConfirmDel} onDelete={doDelete} onBack={function() { setView("catalog"); }} />
          ) : null}

        </main>
      </div>
    </div>
  );
}
