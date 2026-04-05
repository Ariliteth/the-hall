// ============================================================
// THE LEDGER — Write Endpoint
// ============================================================
//
// Neutral storage for player accumulation. Holds passports,
// milestones, and scraggles data without interpretation.
//
// Three entry shapes:
//   Ledger.passport({ hue, issuer, text?, traits?, portrait? })
//   Ledger.milestone({ score, key, label? })
//   Ledger.scraggle({ emoji, color?, weight?, origin? })
//
// All writes append to localStorage 'baseline-session/ledger'.
// Each entry receives a timestamp and a unique id at write time.
// The Ledger never mutates existing entries.
//
// Usage from the Hub:
//   <script src="ledger.js"></script>
//   Ledger.passport({ hue: [140,170,60], issuer: 'taste' });
//
// Usage from Scores (via postMessage to hub):
//   window.parent.postMessage({
//     type: 'hub:ledger',
//     action: 'passport',   // or 'milestone' or 'scraggle'
//     hue: [140,170,60],
//     issuer: 'taste'
//   }, '*');
//

const Ledger = (() => {
  const STORAGE_KEY = 'baseline-session/ledger';

  // --- helpers ---

  function uid() {
    // 12-char hex, enough to avoid collisions in a single-player localStorage world
    const a = new Uint8Array(6);
    crypto.getRandomValues(a);
    return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
  }

  function now() { return Date.now(); }

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }

  function append(entry) {
    const entries = read();
    entries.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return entry;
  }

  // --- validators ---

  function validHue(h) {
    return Array.isArray(h) && h.length === 3
      && h.every(v => typeof v === 'number' && v >= 0 && v <= 255);
  }

  function validString(s) {
    return typeof s === 'string' && s.length > 0;
  }

  // --- write methods ---

  /**
   * Record a passport.
   * Required: hue (RGB array), issuer (string — score slug, entity name, or 'hall')
   * Optional: text, traits (array of strings), portrait (string)
   */
  function passport(data) {
    if (!data || !validHue(data.hue) || !validString(data.issuer)) {
      console.warn('[Ledger] passport: requires { hue: [r,g,b], issuer: string }');
      return null;
    }
    const entry = {
      id: uid(),
      kind: 'passport',
      hue: data.hue,
      issuer: data.issuer,
      ts: now()
    };
    if (validString(data.text))     entry.text = data.text;
    if (Array.isArray(data.traits)) entry.traits = data.traits.filter(validString);
    if (validString(data.portrait)) entry.portrait = data.portrait;
    return append(entry);
  }

  /**
   * Record a milestone.
   * Required: score (string — score slug), key (string — machine-readable event)
   * Optional: label (human-readable description)
   */
  function milestone(data) {
    if (!data || !validString(data.score) || !validString(data.key)) {
      console.warn('[Ledger] milestone: requires { score: string, key: string }');
      return null;
    }
    const entry = {
      id: uid(),
      kind: 'milestone',
      score: data.score,
      key: data.key,
      ts: now()
    };
    if (validString(data.label)) entry.label = data.label;
    return append(entry);
  }

  /**
   * Record scraggles data.
   * Required: emoji (string)
   * Optional: color (RGB array), weight (0-1), origin (score slug)
   */
  function scraggle(data) {
    if (!data || !validString(data.emoji)) {
      console.warn('[Ledger] scraggle: requires { emoji: string }');
      return null;
    }
    const entry = {
      id: uid(),
      kind: 'scraggle',
      emoji: data.emoji,
      ts: now()
    };
    if (validHue(data.color))     entry.color = data.color;
    if (typeof data.weight === 'number' && data.weight >= 0 && data.weight <= 1) {
      entry.weight = data.weight;
    }
    if (validString(data.origin)) entry.origin = data.origin;
    return append(entry);
  }

  /**
   * Handle a hub:ledger postMessage from a score.
   * Dispatches to the correct write method based on msg.action.
   */
  function handleMessage(msg) {
    if (!msg || !msg.action) return null;
    switch (msg.action) {
      case 'passport':  return passport(msg);
      case 'milestone': return milestone(msg);
      case 'scraggle':  return scraggle(msg);
      default:
        console.warn('[Ledger] unknown action:', msg.action);
        return null;
    }
  }

  /**
   * Read all entries. Minimal read — for verification only.
   * Optional filter: { kind: 'passport'|'milestone'|'scraggle' }
   */
  function entries(filter) {
    const all = read();
    if (!filter) return all;
    if (filter.kind) return all.filter(e => e.kind === filter.kind);
    return all;
  }

  /**
   * Count entries by kind.
   */
  function counts() {
    const all = read();
    const c = { passport: 0, milestone: 0, scraggle: 0, total: all.length };
    for (const e of all) {
      if (c[e.kind] != null) c[e.kind]++;
    }
    return c;
  }

  /**
   * Compute the Scraggles portrait — derived color distribution.
   * Fresh each call, never cached.
   * Returns { blend: [r,g,b], byOrigin: { [slug]: { color: [r,g,b], count } }, total } or null.
   */
  function portrait() {
    const scraggles = read().filter(e => e.kind === 'scraggle' && validHue(e.color));
    if (scraggles.length === 0) return null;

    let rSum = 0, gSum = 0, bSum = 0, wSum = 0;
    const origins = {};

    for (const s of scraggles) {
      const w = (typeof s.weight === 'number' && s.weight >= 0 && s.weight <= 1) ? s.weight : 1;
      rSum += s.color[0] * w;
      gSum += s.color[1] * w;
      bSum += s.color[2] * w;
      wSum += w;

      const key = s.origin || '_unknown';
      if (!origins[key]) origins[key] = { rSum: 0, gSum: 0, bSum: 0, wSum: 0, count: 0 };
      origins[key].rSum += s.color[0] * w;
      origins[key].gSum += s.color[1] * w;
      origins[key].bSum += s.color[2] * w;
      origins[key].wSum += w;
      origins[key].count++;
    }

    const blend = [
      Math.round(rSum / wSum),
      Math.round(gSum / wSum),
      Math.round(bSum / wSum)
    ];

    const byOrigin = {};
    for (const [key, o] of Object.entries(origins)) {
      byOrigin[key] = {
        color: [
          Math.round(o.rSum / o.wSum),
          Math.round(o.gSum / o.wSum),
          Math.round(o.bSum / o.wSum)
        ],
        count: o.count
      };
    }

    return { blend, byOrigin, total: scraggles.length };
  }

  // ============================================================
  // VISITOR CONSTELLATION
  // ============================================================
  //
  // Separate from the main ledger. An emoji die that grows with
  // visitor presence: anchor + faces, tier derived from count.
  //
  // Storage: localStorage 'baseline-session/visitor-constellation'
  // Shape:  { anchor: emoji, faces: [{emoji, placedBy, ts}], tier }
  //   tier is always recomputed at read time — stored for convenience
  //
  // Die form:
  //   0 faces → d4, 1–3 → d6, 4–7 → d8, 8–11 → d10,
  //   12–15 → d12, 16–19 → d20, 20–49 → d50, 50+ → d100

  const CONSTELLATION_KEY = 'baseline-session/visitor-constellation';

  const DIE_TIERS = [
    { max: 0,  name: 'd4'   },
    { max: 3,  name: 'd6'   },
    { max: 7,  name: 'd8'   },
    { max: 11, name: 'd10'  },
    { max: 15, name: 'd12'  },
    { max: 19, name: 'd20'  },
    { max: 49, name: 'd50'  },
    { max: Infinity, name: 'd100' },
  ];

  function constellationTier(faceCount) {
    for (const t of DIE_TIERS) {
      if (faceCount <= t.max) return t.name;
    }
    return 'd100';
  }

  function readConstellation() {
    try {
      const raw = localStorage.getItem(CONSTELLATION_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      // recompute tier
      data.tier = constellationTier(data.faces ? data.faces.length : 0);
      return data;
    } catch(e) { return null; }
  }

  function writeConstellation(data) {
    data.tier = constellationTier(data.faces ? data.faces.length : 0);
    localStorage.setItem(CONSTELLATION_KEY, JSON.stringify(data));
    return data;
  }

  /**
   * Set or replace the anchor emoji. Creates the constellation if absent.
   */
  function constellationAnchor(emoji) {
    if (!validString(emoji)) return null;
    let c = readConstellation();
    if (!c) c = { anchor: emoji, faces: [] };
    else c.anchor = emoji;
    return writeConstellation(c);
  }

  /**
   * Add a face to the constellation.
   * placedBy: 'visitor' | 'larr'
   */
  function constellationAdd(emoji, placedBy) {
    if (!validString(emoji)) return null;
    placedBy = placedBy === 'larr' ? 'larr' : 'visitor';
    let c = readConstellation();
    if (!c) c = { anchor: emoji, faces: [] };
    c.faces.push({ emoji, placedBy, ts: now() });
    return writeConstellation(c);
  }

  /**
   * Remove a face by index.
   */
  function constellationRemove(index) {
    const c = readConstellation();
    if (!c || index < 0 || index >= c.faces.length) return null;
    c.faces.splice(index, 1);
    return writeConstellation(c);
  }

  /**
   * Replace a face at index with a new emoji.
   */
  function constellationReplace(index, emoji) {
    const c = readConstellation();
    if (!c || index < 0 || index >= c.faces.length || !validString(emoji)) return null;
    c.faces[index].emoji = emoji;
    c.faces[index].ts = now();
    return writeConstellation(c);
  }

  /**
   * Clear the entire constellation.
   */
  function constellationClear() {
    localStorage.removeItem(CONSTELLATION_KEY);
  }

  /**
   * Pip 4 — constellation sample for score consumption.
   * Returns 1–3 emoji weighted toward anchor and inner ring.
   * Returns [] if no constellation exists.
   */
  function constellationSample() {
    const c = readConstellation();
    if (!c) return [];
    const result = [c.anchor];
    if (c.faces.length > 0) {
      // inner ring = first half of faces (closest to anchor)
      const inner = c.faces.slice(0, Math.ceil(c.faces.length / 2));
      const outer = c.faces.slice(Math.ceil(c.faces.length / 2));
      // pick from inner with 70% weight, outer 30%
      const pool = Math.random() < 0.7 ? inner : (outer.length > 0 ? outer : inner);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) result.push(pick.emoji);
      // third emoji from any ring, if large enough
      if (c.faces.length >= 4) {
        const all = c.faces.filter(f => f.emoji !== pick?.emoji);
        if (all.length > 0) {
          result.push(all[Math.floor(Math.random() * all.length)].emoji);
        }
      }
    }
    return result;
  }

  return {
    passport,
    milestone,
    scraggle,
    handleMessage,
    entries,
    counts,
    portrait,
    STORAGE_KEY,
    // Constellation
    CONSTELLATION_KEY,
    constellationTier,
    readConstellation,
    constellationAnchor,
    constellationAdd,
    constellationRemove,
    constellationReplace,
    constellationClear,
    constellationSample,
  };
})();
