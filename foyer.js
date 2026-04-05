// ============================================================
// THE FOYER — Pre-Hub Landing Zone
// ============================================================
//
// The Foyer is FPL's threshold before the threshold. It appears
// on fresh boot (new session), hosts Larr.AI as greeter, and
// holds neighborhood/theme/roster selection so the Hub doesn't
// have to. The anteroom remains downstream, unchanged.
//
// Fresh boot detection: sessionStorage flag 'fpl-session-started'.
// Larr.AI greeting: authored string pool keyed to Ledger state.
// No external API calls. Fully local and contained.
//

const Foyer = (() => {

  // ── Larr.AI String Pool ──
  // Two registers minimum: new player (empty Ledger) and returning player.
  // Keyed to Ledger state — passports present, score visits, milestones.

  const LARR_GREETINGS = {
    // New player — empty Ledger. Curious, not welcoming.
    new: [
      "Oh. Someone's here. I didn't hear the door.",
      "Hello? Yes? The Hall is... well, it's open. That's the main thing.",
      "New smell. Good smell. Come in, come in.",
      "I don't know you yet. That's the best part.",
      "First time? I can tell. You're looking at everything.",
      "You found it. Most people don't find it.",
      "The door was already open. I want you to know that.",
      "Ah! A person. I was just — never mind what I was doing.",
    ],
    // Returning player — passports present. Recognition.
    returning: [
      "You're back. The Hall noticed before I did.",
      "I know that walk. You've been here before.",
      "Oh, it's you. Good. Some of these Scores have been asking about you.",
      "The Ledger's heavier since last time. What have you been doing?",
      "Welcome back. The temperature shifted when you walked in.",
      "You again. I mean that warmly.",
      "Something's different about you. Same about the Hall, actually.",
      "The door remembered you. I just confirmed.",
    ],
    // Returning player — many passports (5+). Familiarity.
    veteran: [
      "You practically live here now. I respect that.",
      "I stopped counting your passports. It felt rude.",
      "The Hall hums differently when you're around. I've been tracking it.",
      "You know where everything is. I'm just here for the carpet.",
      "At this point I think *you* should be greeting *me*.",
      "Every Score has your fingerprints on it. Metaphorically. Mostly.",
      "The Ledger's getting thick. You should be proud of that.",
      "Ah, the regular. The usual? ...We don't have a usual. But we could.",
    ],
    // Returning player — specific score visits detected
    // Returning-with-memory — imported save file, fresh session but Ledger has history.
    // The player carried something here. That's different.
    returningWithMemory: [
      "You brought your whole history. Good. I was wondering where you went.",
      "Still the same person. I can tell by the Ledger.",
      "Picked up right where you left off. I respect that.",
      "That's a heavy file you walked in with. I mean that as a compliment.",
      "Different browser, same fingerprints. The Hall doesn't forget — but you already knew that.",
      "You packed everything. Most people don't pack everything.",
      "The Ledger caught up before I did. It's like you never left.",
      "Ah. You brought receipts. The neighborhood remembers.",
    ],
    // Returning player — specific score visits detected
    scoreSpecific: {
      'taste': [
        "Still shopping? The produce doesn't judge. Well, the ghost might.",
        "Maria's or Terroir's today? The stores can tell, you know.",
      ],
      'hunter-encounter': [
        "The field crew was asking about you. Something about a last encounter.",
        "Back from the hunt? Or heading out again?",
      ],
      'grimoire': [
        "Been reading the catalog? The entries rearrange when you're not looking.",
        "The Grimoire remembers what you browsed. It's like that.",
      ],
      'critter-crank': [
        "The Crank's been turning on its own. Might be your fault.",
        "Something came out of the Crank last time. Did you keep it?",
      ],
      'sunset-ridge-mall': [
        "The Mall's lights are on. They're always on. That's... fine.",
        "Still got Mall Dollars in your pocket? The payphones are ringing.",
      ],
      'tending-field': [
        "Your seeds are still growing. Time moves differently in the Field.",
        "The caravan passed through while you were gone. Left something.",
      ],
      'silmor-spells': [
        "Fumbled anything good lately? The dice remember.",
        "Two sprites, three roles. The bridge holds. Barely.",
      ],
      'lode': [
        "The fleet's been waiting. They don't know how to wait politely.",
        "Die's still ascending. You should check on that.",
      ],
    },
  };

  // ── Capability Probes ──
  // Three silent binary questions, run during Foyer load.
  // Results stored for downstream use (score filtering, layout adaptation).

  function runCapabilityProbes() {
    const probes = {
      viewport: {
        w: window.innerWidth,
        h: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
      },
      memory: navigator.deviceMemory || null,
      perf: null, // filled async
    };

    // rAF performance test — count frames over 500ms
    let frameCount = 0;
    const perfStart = performance.now();
    function countFrame() {
      frameCount++;
      if (performance.now() - perfStart < 500) {
        requestAnimationFrame(countFrame);
      } else {
        // 30fps = 15 frames in 500ms. 60fps = 30 frames.
        probes.perf = frameCount >= 25 ? 'high' : (frameCount >= 12 ? 'mid' : 'low');
        // Derive tier
        const tier = deriveTier(probes);
        try {
          sessionStorage.setItem('fpl-capability', JSON.stringify({
            tier,
            viewport: probes.viewport,
            perf: probes.perf,
            memory: probes.memory,
          }));
        } catch(e) {}
      }
    }
    requestAnimationFrame(countFrame);

    return probes;
  }

  function deriveTier(probes) {
    const { viewport, perf, memory } = probes;
    const smallScreen = viewport.w < 480 || viewport.h < 480;
    const lowPerf = perf === 'low';
    const lowMem = memory != null && memory <= 2;

    if (smallScreen && lowPerf) return 'light';
    if (lowPerf || lowMem) return 'capable';
    return 'full';
  }

  // ── Returning-with-Memory Detection ──
  // Fresh session flag absent but Ledger entries exist = imported history.
  // Must be called before sessionStorage session flag is written.

  let _importedHistory = false;

  function hasImportedHistory() {
    const sessionStarted = sessionStorage.getItem('fpl-session-started');
    const entries = typeof Ledger !== 'undefined' ? Ledger.entries() : [];
    return !sessionStarted && entries.length > 0;
  }

  // ── Save State Export / Import ──

  function exportSave() {
    const save = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('baseline-session/')) {
        save[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const d = new Date();
    const stamp = d.getFullYear()
      + String(d.getMonth() + 1).padStart(2, '0')
      + String(d.getDate()).padStart(2, '0');
    a.download = `fpl-save-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importSave(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const save = JSON.parse(e.target.result);
        const keys = Object.keys(save).filter(k => k.startsWith('baseline-session/'));
        if (keys.length === 0) return; // not a valid FPL save
        keys.forEach(key => localStorage.setItem(key, save[key]));
        // re-init Foyer with imported Ledger state
        if (_registry && _entities.length > 0) {
          const el = document.getElementById('foyer');
          if (el) {
            _importedHistory = true;
            render(el, _registry, _entities);
          }
        }
      } catch(err) {
        // silent fail — invalid file, nothing changes
      }
    };
    reader.readAsText(file);
  }

  // ── Greeting Selection ──
  // Pick a greeting based on Ledger state.

  function pickGreeting() {
    // Returning-with-memory takes priority — player imported a save file
    if (_importedHistory) {
      return pick(LARR_GREETINGS.returningWithMemory);
    }

    const entries = typeof Ledger !== 'undefined' ? Ledger.entries() : [];
    const passports = entries.filter(e => e.kind === 'passport');

    // New player — no passports at all
    if (passports.length === 0) {
      return pick(LARR_GREETINGS.new);
    }

    // Check for score-specific greetings (most recent passport's score)
    const scoreVisits = passports.filter(p => p.text).map(p => p.text);
    const recentScore = scoreVisits[scoreVisits.length - 1];

    // 40% chance of score-specific greeting if available
    if (recentScore && LARR_GREETINGS.scoreSpecific[recentScore] && Math.random() < 0.4) {
      return pick(LARR_GREETINGS.scoreSpecific[recentScore]);
    }

    // Veteran — 5+ passports
    if (passports.length >= 5) {
      return pick(LARR_GREETINGS.veteran);
    }

    // Returning player
    return pick(LARR_GREETINGS.returning);
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ── Entity Milling ──
  // Draw entities milling in the center of the Foyer.
  // Reuses the entity pool format from anteroom.

  const millingState = {
    walkers: [],
    pool: [],
    poolIdx: 0,
    animId: null,
    lastFrame: null,
  };

  function startMilling(canvas, entities) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = canvas.parentElement.clientWidth * dpr;
      canvas.height = canvas.parentElement.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    millingState.pool = entities.slice().sort(() => Math.random() - 0.5);
    millingState.poolIdx = 0;
    millingState.walkers = [];

    // Preload images
    for (const entity of entities) {
      if (entity.glyphUrl) {
        const img = new Image();
        img.onload = () => { entity.glyphImg = img; entity.presence = 'glyph'; };
        img.src = entity.glyphUrl;
      }
      if (entity.portrait) {
        const img = new Image();
        img.onload = () => { entity.portraitImg = img; if (entity.presence !== 'glyph') entity.presence = 'portrait'; };
        img.src = entity.portrait;
      }
    }

    // Spawn initial walkers
    for (let i = 0; i < 4; i++) {
      setTimeout(() => spawnMillingWalker(canvas), i * 1800);
    }

    function frame(now) {
      const dt = Math.min((now - (millingState.lastFrame || now)) / 1000, 0.1);
      millingState.lastFrame = now;
      drawMilling(ctx, canvas.width / dpr, canvas.height / dpr, dt);
      millingState.animId = requestAnimationFrame(frame);
    }
    millingState.animId = requestAnimationFrame(frame);
  }

  function spawnMillingWalker(canvas) {
    const pool = millingState.pool;
    if (pool.length === 0) return;
    if (millingState.walkers.length >= 8) {
      setTimeout(() => spawnMillingWalker(canvas), 3000);
      return;
    }

    const entity = pool[millingState.poolIdx % pool.length];
    millingState.poolIdx++;

    const W = canvas.width / (window.devicePixelRatio || 1);
    const H = canvas.height / (window.devicePixelRatio || 1);

    // Entities mill within the center area
    const margin = 30;
    const sx = margin + Math.random() * (W - margin * 2);
    const sy = margin + Math.random() * (H - margin * 2);
    const ex = margin + Math.random() * (W - margin * 2);
    const ey = margin + Math.random() * (H - margin * 2);
    const mx = (sx + ex) / 2 + (Math.random() - 0.5) * 80;
    const my = (sy + ey) / 2 + (Math.random() - 0.5) * 60;

    const duration = 12 + Math.random() * 10;
    const type = entity.presence || 'color';
    let size;
    switch (type) {
      case 'glyph':    size = 24 + Math.random() * 10; break;
      case 'portrait': size = 20 + Math.random() * 8;  break;
      case 'color':    size = 3 + Math.random() * 3;   break;
      default:         size = 8;
    }

    millingState.walkers.push({
      entity, type, size,
      rotation: (Math.random() - 0.5) * 0.3,
      t: 0, duration,
      sx, sy, mx, my, ex, ey,
    });

    const nextDelay = 3000 + Math.random() * 5000;
    setTimeout(() => spawnMillingWalker(canvas), nextDelay);
  }

  function drawMilling(ctx, W, H, dt) {
    ctx.clearRect(0, 0, W, H);
    ctx.font = '8px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';

    for (let i = millingState.walkers.length - 1; i >= 0; i--) {
      const w = millingState.walkers[i];
      w.t += dt / w.duration;
      if (w.t >= 1) { millingState.walkers.splice(i, 1); continue; }

      const t = w.t;
      const it = 1 - t;
      const x = it * it * w.sx + 2 * it * t * w.mx + t * t * w.ex;
      const y = it * it * w.sy + 2 * it * t * w.my + t * t * w.ey;
      const edgeFade = Math.min(1, t * 4, (1 - t) * 4);
      const alpha = edgeFade * 0.25;
      const { r, g, b } = w.entity.color;

      switch (w.type) {
        case 'glyph':
          if (w.entity.glyphImg) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(w.rotation);
            ctx.globalAlpha = alpha * 0.7;
            ctx.drawImage(w.entity.glyphImg, -w.size / 2, -w.size / 2, w.size, w.size);
            ctx.globalAlpha = 1;
            ctx.restore();
          }
          break;
        case 'portrait':
          if (w.entity.portraitImg) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(w.rotation);
            ctx.globalAlpha = alpha * 0.6;
            ctx.drawImage(w.entity.portraitImg, -w.size / 2, -w.size / 2, w.size, w.size);
            ctx.globalAlpha = 1;
            ctx.restore();
          }
          break;
        case 'color': {
          const grad = ctx.createRadialGradient(x, y, 0, x, y, w.size * 2.5);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(x - w.size * 2.5, y - w.size * 2.5, w.size * 5, w.size * 5);
          break;
        }
        default: {
          const nr = Math.round(212 * 0.7 + r * 0.3);
          const ng = Math.round(200 * 0.7 + g * 0.3);
          const nb = Math.round(168 * 0.7 + b * 0.3);
          ctx.fillStyle = `rgba(${nr}, ${ng}, ${nb}, ${alpha})`;
          ctx.fillText(w.entity.name, x, y);
          break;
        }
      }
    }
  }

  function stopMilling() {
    if (millingState.animId) {
      cancelAnimationFrame(millingState.animId);
      millingState.animId = null;
    }
    millingState.walkers = [];
  }

  // ── State ──
  let _entities = [];
  let _registry = null;

  // ── Foyer Rendering ──

  function render(container, registry, entities) {
    _entities = entities;
    _registry = registry;
    container.innerHTML = '';

    // Version selector (top, quiet)
    const versionBar = document.createElement('div');
    versionBar.id = 'foyer-version';
    versionBar.innerHTML = `<span class="foyer-version-label">v1.0</span>`;
    container.appendChild(versionBar);

    // Main layout: edges (neighborhoods/themes) + center (entities + Larr)
    const layout = document.createElement('div');
    layout.id = 'foyer-layout';

    // Left edge — neighborhoods
    const leftEdge = document.createElement('div');
    leftEdge.className = 'foyer-edge foyer-edge-left';
    leftEdge.innerHTML = '<h3>Neighborhoods</h3>';
    const hoodList = document.createElement('div');
    hoodList.id = 'foyer-neighborhoods';

    if (registry) {
      const neighborhoods = Object.entries(registry.neighborhoods);
      neighborhoods.forEach(([slug]) => activeNeighborhoods.add(slug));

      neighborhoods.forEach(([slug, entry]) => {
        const ents = Array.isArray(entry) ? entry : (entry.entities || []);
        const item = document.createElement('div');
        item.className = 'foyer-hood-item';
        item.innerHTML = `
          <input type="checkbox" id="foyer-hood-${slug}" checked
                 onchange="Foyer.toggleNeighborhood('${slug}', this.checked)">
          <label for="foyer-hood-${slug}">${formatNeighborhoodName(slug)}</label>
          <span class="foyer-hood-count">${ents.length}</span>
        `;
        hoodList.appendChild(item);
      });
    }
    leftEdge.appendChild(hoodList);

    // Right edge — themes + roster
    const rightEdge = document.createElement('div');
    rightEdge.className = 'foyer-edge foyer-edge-right';

    // Themes
    const themeBlock = document.createElement('div');
    themeBlock.className = 'foyer-block';
    themeBlock.innerHTML = '<h3>Themes</h3>';
    const themeList = document.createElement('div');
    themeList.id = 'foyer-themes';

    const themes = [];
    if (registry) {
      for (const [slug, entry] of Object.entries(registry.neighborhoods)) {
        if (!Array.isArray(entry) && entry.theme) {
          themes.push({ slug: entry.theme, name: formatNeighborhoodName(slug) });
        }
      }
    }
    if (typeof KNOWN_THEMES !== 'undefined') {
      KNOWN_THEMES.forEach(t => { if (!themes.find(x => x.slug === t.slug)) themes.push(t); });
    }

    if (themes.length === 0) {
      themeList.innerHTML = '<div class="foyer-empty">No themes yet.</div>';
    } else {
      themes.forEach(theme => {
        const unlocked = localStorage.getItem(`baseline-session/${theme.slug}-theme`);
        if (unlocked) activeThemes.add(theme.slug);
        const item = document.createElement('div');
        item.className = 'foyer-theme-item';
        item.innerHTML = `
          <input type="checkbox" id="foyer-theme-${theme.slug}" ${unlocked ? 'checked' : ''}
                 onchange="Foyer.toggleTheme('${theme.slug}', this.checked)">
          <label for="foyer-theme-${theme.slug}">${theme.name}</label>
        `;
        themeList.appendChild(item);
      });
    }
    themeBlock.appendChild(themeList);
    rightEdge.appendChild(themeBlock);

    // Roster preview
    const rosterBlock = document.createElement('div');
    rosterBlock.className = 'foyer-block';
    rosterBlock.innerHTML = '<h3>On The Roster</h3>';
    const rosterList = document.createElement('div');
    rosterList.id = 'foyer-roster';
    renderFoyerRoster(rosterList, registry);
    rosterBlock.appendChild(rosterList);
    rightEdge.appendChild(rosterBlock);

    // Center — entity milling canvas + Larr.AI
    const center = document.createElement('div');
    center.id = 'foyer-center';

    const millingCanvas = document.createElement('canvas');
    millingCanvas.id = 'foyer-milling-canvas';
    center.appendChild(millingCanvas);

    // Larr.AI greeting
    const larrBox = document.createElement('div');
    larrBox.id = 'foyer-larr';
    const greeting = pickGreeting();
    const constellation = typeof Ledger !== 'undefined' ? Ledger.readConstellation() : null;
    const constellationPrompt = pickConstellationPrompt(constellation);

    larrBox.innerHTML = `
      <div id="foyer-larr-name">LARR.AI</div>
      <div id="foyer-larr-greeting">${greeting}</div>
      ${constellationPrompt ? `<div id="foyer-constellation-prompt">
        <div class="constellation-question">${constellationPrompt}</div>
        <div class="constellation-input-row">
          <input type="text" id="constellation-emoji-input" maxlength="8"
                 placeholder="one emoji" autocomplete="off">
          <button id="constellation-submit" onclick="Foyer.submitConstellation()">hold</button>
        </div>
        ${constellation ? `<div class="constellation-current">carrying: ${constellation.anchor}${constellation.faces.map(f => f.emoji).join('')}</div>` : ''}
      </div>` : ''}
    `;
    center.appendChild(larrBox);

    // Enter button
    const enterBtn = document.createElement('button');
    enterBtn.id = 'foyer-enter';
    enterBtn.textContent = 'ENTER THE HALL';
    enterBtn.onclick = () => enter();
    center.appendChild(enterBtn);

    // Save portability controls — quiet, below enter button
    const saveControls = document.createElement('div');
    saveControls.id = 'foyer-save-controls';

    const exportLink = document.createElement('button');
    exportLink.className = 'foyer-save-link';
    exportLink.textContent = '\u2193 save your place';
    exportLink.onclick = () => exportSave();

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.id = 'foyer-import-input';
    importInput.onchange = (e) => {
      if (e.target.files[0]) importSave(e.target.files[0]);
      e.target.value = '';
    };

    const importLink = document.createElement('button');
    importLink.className = 'foyer-save-link';
    importLink.textContent = '\u2191 return to a place you saved';
    importLink.onclick = () => importInput.click();

    saveControls.appendChild(exportLink);
    saveControls.appendChild(importInput);
    saveControls.appendChild(importLink);
    center.appendChild(saveControls);

    layout.appendChild(leftEdge);
    layout.appendChild(center);
    layout.appendChild(rightEdge);
    container.appendChild(layout);

    // Start entity milling after layout is in DOM
    requestAnimationFrame(() => {
      if (entities.length > 0) {
        startMilling(millingCanvas, entities);
      }
    });

    // Run capability probes
    runCapabilityProbes();

    // Fade in
    requestAnimationFrame(() => container.classList.add('visible'));
  }

  function renderFoyerRoster(container, reg) {
    container.innerHTML = '';
    if (!reg) return;

    const getEntities = (entry) => Array.isArray(entry) ? entry : (entry.entities || []);
    let any = false;

    for (const [hood, entry] of Object.entries(reg.neighborhoods)) {
      if (!activeNeighborhoods.has(hood)) continue;
      getEntities(entry).forEach(slug => {
        any = true;
        const el = document.createElement('div');
        el.className = 'foyer-roster-entry';
        el.innerHTML = `<span>${formatSlug(slug)}</span><span class="foyer-roster-hood">${formatNeighborhoodName(hood)}</span>`;
        container.appendChild(el);
      });
    }

    if (!any) {
      container.innerHTML = '<div class="foyer-empty">No neighborhoods selected.</div>';
    }
  }

  // ── Transitions ──

  function enter() {
    const el = document.getElementById('foyer');
    el.classList.add('exiting');

    // Mark session as started — Foyer won't appear again this session
    sessionStorage.setItem('fpl-session-started', '1');

    setTimeout(() => {
      el.style.display = 'none';  // hide foyer
      stopMilling();
      // Proceed to anteroom — first visit, so use anteroomInit (not anteroomShow)
      if (typeof anteroomInit === 'function') {
        const anteroomEl = document.getElementById('anteroom');
        anteroomEl.style.display = '';
        anteroomInit(_entities);
      } else {
        // Fallback: just show selection panel
        document.getElementById('selection-panel').classList.remove('collapsed');
      }
    }, 600);
  }

  function show(reg, entities) {
    // Detect imported history before session flag exists
    _importedHistory = hasImportedHistory();

    const el = document.getElementById('foyer');
    el.style.display = 'block';
    el.classList.remove('exiting');
    el.classList.remove('visible');
    render(el, reg, entities);
  }

  // ── Public API for Hub sidebar delegation ──

  function toggleNeighborhood(slug, checked) {
    if (checked) activeNeighborhoods.add(slug);
    else activeNeighborhoods.delete(slug);
    // Update foyer roster if it exists
    const rosterEl = document.getElementById('foyer-roster');
    if (rosterEl) renderFoyerRoster(rosterEl, registry);
  }

  function toggleTheme(slug, checked) {
    if (checked) activeThemes.add(slug);
    else activeThemes.delete(slug);
  }

  // ── Visitor Constellation ──

  const CONSTELLATION_PROMPTS_NEW = [
    "What did you bring in with you today? One emoji.",
    "If you had to carry one thing in here, what would it be? Emoji.",
    "One emoji. Whatever comes to mind.",
    "Before you go in — what are you carrying? One emoji.",
  ];

  const CONSTELLATION_PROMPTS_RETURNING = [
    "Anything new today? One emoji, if you have one.",
    "You're different since last time. Show me — one emoji.",
    "The constellation's listening. Got anything to add?",
  ];

  const CONSTELLATION_PROMPTS_NOTICE = [
    "I'm going to hold %s for you, if that's alright.",
  ];

  function pickConstellationPrompt(constellation) {
    // 60% chance to ask — not every visit
    if (Math.random() > 0.6) return null;
    if (!constellation) {
      return pick(CONSTELLATION_PROMPTS_NEW);
    }
    return pick(CONSTELLATION_PROMPTS_RETURNING);
  }

  function submitConstellation() {
    const input = document.getElementById('constellation-emoji-input');
    if (!input) return;
    const emoji = input.value.trim();
    if (!emoji) return;

    if (typeof Ledger === 'undefined') return;

    const c = Ledger.readConstellation();
    if (!c) {
      // First emoji becomes the anchor
      Ledger.constellationAnchor(emoji);
    } else {
      Ledger.constellationAdd(emoji, 'visitor');
    }

    // Visual feedback — Larr.AI reflects it back
    const promptEl = document.getElementById('foyer-constellation-prompt');
    if (promptEl) {
      promptEl.innerHTML = `<div class="constellation-question">${emoji} — held.</div>`;
    }
  }

  /**
   * Larr.AI places an emoji on behalf of the visitor.
   * Called programmatically, not from UI — for future use by richer Larr.AI conversations.
   */
  function larrHoldEmoji(emoji) {
    if (typeof Ledger === 'undefined') return;
    const c = Ledger.readConstellation();
    if (!c) {
      Ledger.constellationAnchor(emoji);
    } else {
      Ledger.constellationAdd(emoji, 'larr');
    }
  }

  // ── Fresh Boot Check ──

  function isFreshBoot() {
    return !sessionStorage.getItem('fpl-session-started');
  }

  return {
    isFreshBoot,
    show,
    enter,
    render,
    pickGreeting,
    toggleNeighborhood,
    toggleTheme,
    exportSave,
    importSave,
    submitConstellation,
    larrHoldEmoji,
  };
})();
