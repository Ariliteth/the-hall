// ── Canvas Drawing ───────────────────────────────────────────────────────────
function drawCritterToCanvas(canvas, grid, size) {
  var ctx = canvas.getContext("2d");
  var ps = size / GRID;
  canvas.width = size; canvas.height = size;
  ctx.clearRect(0, 0, size, size);
  for (var y = 0; y < GRID; y++)
    for (var x = 0; x < GRID; x++) {
      var color = grid[y * GRID + x];
      if (color) { ctx.fillStyle = color; ctx.fillRect(x * ps, y * ps, ps, ps); }
    }
}

// ── Diorama Rendering ────────────────────────────────────────────────────────

// Draw a 48×48 grid at an offset on an existing canvas context
function drawGridAt(ctx, grid, pixelSize, offsetX, offsetY) {
  var ps = pixelSize;
  for (var y = 0; y < GRID; y++)
    for (var x = 0; x < GRID; x++) {
      var c = grid[y * GRID + x];
      if (c) { ctx.fillStyle = c; ctx.fillRect(offsetX + x * ps, offsetY + y * ps, Math.ceil(ps), Math.ceil(ps)); }
    }
}

// Compute 5 companion positions around a 128×128 diorama canvas
function computeDioramaPositions(seed) {
  var rng = seededRng(seed + 55555);
  var positions = [];
  // Place companions roughly in a ring around center, avoiding the main creature zone
  var angles = [];
  var baseAngle = rng() * Math.PI * 2;
  for (var i = 0; i < 5; i++) {
    angles.push(baseAngle + (i / 5) * Math.PI * 2 + (rng() - 0.5) * 0.8);
  }
  for (var j = 0; j < 5; j++) {
    var r = 38 + rng() * 16; // radius from center: 38-54px
    var cx = 64 + Math.cos(angles[j]) * r - 12; // center at 64, offset by half companion size
    var cy = 64 + Math.sin(angles[j]) * r - 12;
    // Clamp to canvas bounds
    cx = Math.max(0, Math.min(104, cx));
    cy = Math.max(0, Math.min(104, cy));
    positions.push({ x: Math.round(cx), y: Math.round(cy) });
  }
  return positions;
}

// Draw a single diorama frame: bg + companions (static) + main creature (current frame)
function drawDioramaFrame(canvas, mainGrid, companionGrids, positions, bgColor) {
  var ctx = canvas.getContext("2d");
  canvas.width = 128; canvas.height = 128;
  // Background
  ctx.fillStyle = bgColor || '#080f00';
  ctx.fillRect(0, 0, 128, 128);
  // Subtle ground texture dots
  var groundRng = seededRng(mainGrid ? mainGrid.length : 42);
  ctx.fillStyle = 'rgba(155,188,15,0.04)';
  for (var d = 0; d < 20; d++) {
    ctx.fillRect(Math.floor(groundRng() * 126), Math.floor(groundRng() * 126), 2, 2);
  }
  // Draw companions (small: 0.5px per cell = 24px)
  for (var i = 0; i < companionGrids.length; i++) {
    if (companionGrids[i] && positions[i]) {
      drawGridAt(ctx, companionGrids[i], 0.5, positions[i].x, positions[i].y);
    }
  }
  // Draw main creature centered (larger: 1.3px per cell ≈ 62px, centered at 64,64)
  if (mainGrid) {
    drawGridAt(ctx, mainGrid, 1.3, 64 - 31, 64 - 31);
  }
}

// Animate a diorama: main creature breathes, companions static
function startDioramaAnimating(canvas, mainFrames, companionGrids, positions, bgColor, fps) {
  if (!mainFrames || mainFrames.length === 0) return;
  var frameIndex = 0;
  var direction = 1;
  var lastFrameTime = 0;
  var interval = 1000 / (fps || 3);

  drawDioramaFrame(canvas, mainFrames[0], companionGrids, positions, bgColor);

  if (mainFrames.length <= 1) return;

  function tick(now) {
    if (now - lastFrameTime >= interval) {
      lastFrameTime = now;
      drawDioramaFrame(canvas, mainFrames[frameIndex], companionGrids, positions, bgColor);
      frameIndex += direction;
      if (frameIndex >= mainFrames.length) { direction = -1; frameIndex = mainFrames.length - 2; }
      if (frameIndex < 0) { direction = 1; frameIndex = 1; }
    }
    var id = requestAnimationFrame(tick);
    activeAnimations.push(id);
  }
  var id = requestAnimationFrame(tick);
  activeAnimations.push(id);
}

// Full-screen diorama for packet detail (larger, companions animate too)
function computeFullDioramaPositions(seed) {
  var rng = seededRng(seed + 55555);
  var positions = [];
  var baseAngle = rng() * Math.PI * 2;
  for (var i = 0; i < 5; i++) {
    var angle = baseAngle + (i / 5) * Math.PI * 2 + (rng() - 0.5) * 0.7;
    var r = 72 + rng() * 24;
    var cx = 120 + Math.cos(angle) * r - 18;
    var cy = 110 + Math.sin(angle) * r - 18;
    cx = Math.max(0, Math.min(204, cx));
    cy = Math.max(0, Math.min(184, cy));
    positions.push({ x: Math.round(cx), y: Math.round(cy) });
  }
  return positions;
}

function drawFullDioramaFrame(canvas, mainGrid, companionGrids, positions, bgColor) {
  var ctx = canvas.getContext("2d");
  canvas.width = 240; canvas.height = 220;
  ctx.fillStyle = bgColor || '#080f00';
  ctx.fillRect(0, 0, 240, 220);
  // Ground texture
  var groundRng = seededRng(mainGrid ? mainGrid.length : 42);
  ctx.fillStyle = 'rgba(155,188,15,0.04)';
  for (var d = 0; d < 40; d++) {
    ctx.fillRect(Math.floor(groundRng() * 238), Math.floor(groundRng() * 218), 2, 2);
  }
  // Companions (0.75px per cell = 36px each)
  for (var i = 0; i < companionGrids.length; i++) {
    if (companionGrids[i] && positions[i]) {
      drawGridAt(ctx, companionGrids[i], 0.75, positions[i].x, positions[i].y);
    }
  }
  // Main creature centered (2px per cell = 96px)
  if (mainGrid) {
    drawGridAt(ctx, mainGrid, 2, 120 - 48, 110 - 48);
  }
}

function startFullDioramaAnimating(canvas, mainFrames, companionFrameSets, positions, bgColor, fps) {
  if (!mainFrames || mainFrames.length === 0) return;
  var frameIndex = 0;
  var direction = 1;
  var lastFrameTime = 0;
  var interval = 1000 / (fps || 3);

  // Companions: use frame 0 for initial draw
  var compGrids = companionFrameSets.map(function(fs) { return fs ? fs[0] : null; });
  drawFullDioramaFrame(canvas, mainFrames[0], compGrids, positions, bgColor);

  if (mainFrames.length <= 1) return;

  function tick(now) {
    if (now - lastFrameTime >= interval) {
      lastFrameTime = now;
      // Companions also animate (use same frame index, clamped)
      var cGrids = companionFrameSets.map(function(fs) {
        if (!fs || fs.length <= 1) return fs ? fs[0] : null;
        var ci = Math.min(frameIndex, fs.length - 1);
        return fs[ci];
      });
      drawFullDioramaFrame(canvas, mainFrames[frameIndex], cGrids, positions, bgColor);
      frameIndex += direction;
      if (frameIndex >= mainFrames.length) { direction = -1; frameIndex = mainFrames.length - 2; }
      if (frameIndex < 0) { direction = 1; frameIndex = 1; }
    }
    var id = requestAnimationFrame(tick);
    activeAnimations.push(id);
  }
  var id = requestAnimationFrame(tick);
  activeAnimations.push(id);
}

// ── Animation Sequencer ──────────────────────────────────────────────────────
var activeAnimations = [];

function cancelAllAnimations() {
  for (var i = 0; i < activeAnimations.length; i++) {
    cancelAnimationFrame(activeAnimations[i]);
  }
  activeAnimations = [];
}

// Frame-based animation: cycles pre-rendered grids at target fps.
// mode: "pingpong" (idle), "once" (action burst), "loop" (continuous)
function startAnimating(canvas, frames, size, fps, mode) {
  if (!frames || frames.length === 0) return;
  var ctx = canvas.getContext("2d");
  var ps = size / GRID;
  canvas.width = size; canvas.height = size;

  var frameIndex = 0;
  var direction = 1;
  var interval = 1000 / fps;
  var lastFrameTime = 0;
  var stopped = false;

  function drawFrame(grid) {
    ctx.clearRect(0, 0, size, size);
    for (var y = 0; y < GRID; y++)
      for (var x = 0; x < GRID; x++) {
        var color = grid[y * GRID + x];
        if (color) { ctx.fillStyle = color; ctx.fillRect(x * ps, y * ps, ps, ps); }
      }
  }

  function tick(now) {
    if (stopped) return;
    if (now - lastFrameTime >= interval) {
      lastFrameTime = now;
      drawFrame(frames[frameIndex]);
      if (frames.length > 1) {
        if (mode === "pingpong") {
          frameIndex += direction;
          if (frameIndex >= frames.length - 1) direction = -1;
          if (frameIndex <= 0) direction = 1;
        } else if (mode === "loop") {
          frameIndex = (frameIndex + 1) % frames.length;
        } else if (mode === "once") {
          if (frameIndex < frames.length - 1) { frameIndex++; }
          else { stopped = true; return; }
        }
      }
    }
    var id = requestAnimationFrame(tick);
    activeAnimations.push(id);
  }

  drawFrame(frames[0]); // First frame synchronous — no blank flash
  if (frames.length > 1) {
    var id = requestAnimationFrame(tick);
    activeAnimations.push(id);
  }
}

// Backward compat — wraps single grid as 1-frame static draw
function startBreathing(canvas, grid, size) {
  startAnimating(canvas, [grid], size, 1, "loop");
}

