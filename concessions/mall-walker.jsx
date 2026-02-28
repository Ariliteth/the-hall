import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const CELL = 4, WALL_H = 3.2, PLAYER_H = 1.6;
const T = { EMPTY: 0, CORRIDOR: 1, STORE: 2 };

const STORE_PALETTES = [
  { floor:"#C8508C", wall:"#FF2D78", ceil:"#FFB3D9", name:"XCESS" },
  { floor:"#1A3A6B", wall:"#00CFFF", ceil:"#B3EEFF", name:"SPORT PLUS" },
  { floor:"#2B1A4F", wall:"#9B59B6", ceil:"#DDB3FF", name:"PHASE" },
  { floor:"#4A1A00", wall:"#FF6600", ceil:"#FFD9B3", name:"SUNCOAST" },
  { floor:"#004A1A", wall:"#27AE60", ceil:"#B3FFD1", name:"NATURE CO" },
  { floor:"#1A0000", wall:"#CC0000", ceil:"#FFB3B3", name:"BLAZE" },
  { floor:"#4A3A00", wall:"#FFD700", ceil:"#FFF5B3", name:"GOLDENROD" },
  { floor:"#003A4A", wall:"#008080", ceil:"#B3FFFF", name:"PACIFIC" },
];
const CORRIDOR_PALETTE = { floor:"#D4A76A", wall:"#F5ECD7", ceil:"#F0EDE0" };
const NEW_CORRIDOR_PALETTE = { floor:"#B8C4A0", wall:"#E8EDD8", ceil:"#F0EDE8" };

// ── RNG ───────────────────────────────────────────────────────────────────────
function rng(seed) {
  let s = (seed ^ 0xDEADBEEF) >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
}

// ── ITEMS ─────────────────────────────────────────────────────────────────────
const RARITY_COLORS = { common:"#AAAAAA", uncommon:"#44DD44", rare:"#4488FF", legendary:"#FF9900" };
const RARITY_ORDER = ["common","uncommon","rare","legendary"];
const PREFIXES = [
  {name:"Glittery",stat:"STYLE",val:2},{name:"Chunky",stat:"BULK",val:3},
  {name:"Blessed",stat:"LUCK",val:2},{name:"Hyped",stat:"CLOUT",val:2},
  {name:"Mellow",stat:"CHILL",val:3},{name:"Vintage",stat:"VIBES",val:4},
  {name:"Clearance",stat:"LUCK",val:-1},{name:"Limited",stat:"CLOUT",val:5},
  {name:"Frosted",stat:"STYLE",val:3},{name:"Worn",stat:"BULK",val:-1},
];
const SUFFIXES = [
  {name:"of the Mall",stat:"VIBES",val:2},{name:"of the Ancients",stat:"BULK",val:3},
  {name:"of Attitude",stat:"CLOUT",val:3},{name:"of Serenity",stat:"CHILL",val:2},
  {name:"of Fortune",stat:"LUCK",val:4},{name:"of the Season",stat:"STYLE",val:2},
  {name:"of Excess",stat:"VIBES",val:5},{name:"of Mystery",stat:"LUCK",val:3},
];
const ITEM_BASES = [
  {name:"Keychain",color:"#FFD700"},{name:"Cap",color:"#FF6699"},
  {name:"Tee",color:"#66CCFF"},{name:"Hoodie",color:"#9966FF"},
  {name:"Bracelet",color:"#FF9900"},{name:"Poster",color:"#FF3366"},
  {name:"Tape",color:"#44DDAA"},{name:"Pin",color:"#FFEE44"},
  {name:"Shades",color:"#33AAFF"},{name:"Wallet",color:"#CC4400"},
  {name:"Beanie",color:"#AA44FF"},{name:"Bag",color:"#FF6644"},
  {name:"Charm",color:"#FFAADD"},{name:"Plushie",color:"#88DDFF"},
  {name:"Sticker",color:"#AAFF44"},
];
const BASE_STATS = ["VIBES","BULK","STYLE","LUCK","CLOUT","CHILL"];
const DOLLAR_COLORS = ["#FF3366","#33AAFF","#FFEE00","#44DD88","#FF9900","#CC44FF"];

function generateItem(seed) {
  const r = rng(seed);
  const base = ITEM_BASES[Math.floor(r() * ITEM_BASES.length)];
  const roll = r();
  const rarity = roll < 0.55 ? "common" : roll < 0.82 ? "uncommon" : roll < 0.96 ? "rare" : "legendary";
  const affixCount = rarity === "common" ? 0 : rarity === "uncommon" ? 1 : 2;
  const prefix = affixCount > 0 ? PREFIXES[Math.floor(r() * PREFIXES.length)] : null;
  const suffix = affixCount > 1 ? SUFFIXES[Math.floor(r() * SUFFIXES.length)] : null;
  const stats = {};
  BASE_STATS.forEach(s => { if (r() < 0.5) stats[s] = 1 + Math.floor(r() * 4); });
  if (!Object.keys(stats).length) stats[BASE_STATS[Math.floor(r() * BASE_STATS.length)]] = 1;
  return { id: seed, name: base.name, color: base.color, rarity, prefix, suffix, stats, isDollar: false };
}

function generateDollar(seed) {
  const r = rng(seed);
  const color = DOLLAR_COLORS[Math.floor(r() * DOLLAR_COLORS.length)];
  const roll = r();
  const rarity = roll < 0.5 ? "common" : roll < 0.8 ? "uncommon" : roll < 0.95 ? "rare" : "legendary";
  const stats = {};
  BASE_STATS.forEach(s => { if (r() < 0.35) stats[s] = 1 + Math.floor(r() * 3); });
  return { id: `dollar_${seed}`, name: "Mall Dollar", color, rarity, prefix: null, suffix: null, stats, isDollar: true };
}

// Dollar crafting: blend dollar stats into item, possibly upgrade rarity
function craftItemWithDollar(item, dollar) {
  const newStats = { ...item.stats };
  Object.entries(dollar.stats || {}).forEach(([k, v]) => {
    newStats[k] = (newStats[k] || 0) + Math.ceil(v / 2);
  });
  let newRarity = item.rarity;
  const dollarRarityIdx = RARITY_ORDER.indexOf(dollar.rarity);
  const itemRarityIdx = RARITY_ORDER.indexOf(item.rarity);
  if (dollarRarityIdx > itemRarityIdx && Math.random() < 0.4) {
    newRarity = RARITY_ORDER[Math.min(3, itemRarityIdx + 1)];
  }
  // Maybe add a prefix from dollar color
  let newPrefix = item.prefix;
  if (!newPrefix && dollarRarityIdx >= 2) {
    newPrefix = PREFIXES[Math.floor(rng(dollar.id + 1)() * PREFIXES.length)];
  }
  return { ...item, stats: newStats, rarity: newRarity, prefix: newPrefix, crafted: true };
}

function itemDisplayName(item) {
  if (!item) return "";
  let n = item.name;
  if (item.prefix) n = item.prefix.name + " " + n;
  if (item.suffix) n = n + " " + item.suffix.name;
  return n;
}

// ── QUEST SYSTEM ──────────────────────────────────────────────────────────────
const QUEST_GIVERS = [
  "Aunt Carol","Uncle Dave","Your Cousin Jess","Grandma Pat","Your Neighbor Tim",
  "Old Friend Mira","Your Roommate","Mom","Dad","Your Sister","Your Brother",
  "A Kid Named Rory","Someone Called Bex","Your Old Coach",
];
const QUEST_TEMPLATES = [
  g => ({ giver:g, stat:"VIBES",  min:2, msg:`${g} needs something with good VIBES. At least +2.` }),
  g => ({ giver:g, stat:"CHILL",  min:3, msg:`${g} is stressed. Find something CHILL, +3 or better.` }),
  g => ({ giver:g, stat:"STYLE",  min:2, msg:`${g} has a date. Needs STYLE. Anything +2 or more.` }),
  g => ({ giver:g, stat:"LUCK",   min:2, msg:`${g} says they need more LUCK. Even a little.` }),
  g => ({ giver:g, stat:"CLOUT",  min:2, msg:`${g} wants CLOUT. Send something impressive.` }),
  g => ({ giver:g, stat:"BULK",   min:3, msg:`${g} is moving. Needs something with BULK.` }),
  g => ({ giver:g, stat:"VIBES",  min:4, msg:`${g} said, and I quote: "max VIBES only."` }),
  g => ({ giver:g, stat:"STYLE",  min:4, msg:`${g} is going to a reunion. STYLE +4 minimum, no excuses.` }),
];

function generateQuest(seed) {
  const r = rng(seed);
  const giver = QUEST_GIVERS[Math.floor(r() * QUEST_GIVERS.length)];
  const template = QUEST_TEMPLATES[Math.floor(r() * QUEST_TEMPLATES.length)];
  return { ...template(giver), id: seed, complete: false };
}

function questMatchesItem(quest, item) {
  if (!quest || !item || item.isDollar) return false;
  const statVal = item.stats?.[quest.stat] || 0;
  // Also count prefix/suffix contributions
  const prefixVal = item.prefix?.stat === quest.stat ? (item.prefix.val || 0) : 0;
  const suffixVal = item.suffix?.stat === quest.stat ? (item.suffix.val || 0) : 0;
  return (statVal + prefixVal + suffixVal) >= quest.min;
}

// ── PAYPHONE BABBLE ───────────────────────────────────────────────────────────
const PAYPHONE_BABBLE = [
  "...anyway how are you doing, you sound tired—",
  "—I already TOLD you, the cat is FINE—",
  "—did you see what they're doing to the old Sears—",
  "—just pick up something nice, you know what I like—",
  "—hello? hello? can you hear me? HELLO—",
  "—the signal here is terrible, I'm at the mall—",
  "—your father says hi, I'm saying hi too—",
  "—honestly just get something, anything, just think of me—",
];

// ── MAP GENERATOR ─────────────────────────────────────────────────────────────
function generateFloor(seed) {
  const rand = rng(seed);
  const W = 12 + Math.floor(rand() * 9), H = 12 + Math.floor(rand() * 9);
  const grid = Array.from({ length: H }, () => new Array(W).fill(T.EMPTY));
  const storeMap = Array.from({ length: H }, () => new Array(W).fill(-1));
  const stores = [];
  const paletteOrder = [...STORE_PALETTES].sort(() => rand() - 0.5);
  const numStores = 3 + Math.floor(rand() * 5);

  for (let si = 0; si < numStores; si++) {
    const sw = 2 + Math.floor(rand() * 4), sh = 2 + Math.floor(rand() * 4);
    const sx = 1 + Math.floor(rand() * (W - sw - 2)), sy = 1 + Math.floor(rand() * (H - sh - 2));
    let ok = true;
    for (let y = sy-1; y <= sy+sh && ok; y++)
      for (let x = sx-1; x <= sx+sw && ok; x++)
        if (y >= 0 && y < H && x >= 0 && x < W && grid[y][x] !== T.EMPTY) ok = false;
    if (!ok) continue;
    const idx = stores.length;
    stores.push({ palette: paletteOrder[si % paletteOrder.length], x: sx, y: sy, w: sw, h: sh });
    for (let y = sy; y < sy + sh; y++)
      for (let x = sx; x < sx + sw; x++) { grid[y][x] = T.STORE; storeMap[y][x] = idx; }
  }

  const midY = Math.floor(H / 2);
  for (let x = 0; x < W; x++) if (grid[midY][x] === T.EMPTY) grid[midY][x] = T.CORRIDOR;
  stores.forEach(s => {
    const cx = s.x + Math.floor(s.w / 2), cy = s.y + Math.floor(s.h / 2);
    for (let y = Math.min(cy, midY); y <= Math.max(cy, midY); y++)
      if (grid[y][cx] === T.EMPTY) grid[y][cx] = T.CORRIDOR;
  });
  const rand2 = rng(seed + 1);
  for (let i = 0; i < W * 2; i++) {
    const x = 1 + Math.floor(rand2() * (W - 2)), y = 1 + Math.floor(rand2() * (H - 2));
    if (grid[y][x] === T.CORRIDOR) {
      const dx = Math.floor(rand2() * 3) - 1, dz = Math.floor(rand2() * 3) - 1;
      const nx = x + dx, ny = y + dz;
      if (nx > 0 && nx < W-1 && ny > 0 && ny < H-1 && grid[ny][nx] === T.EMPTY)
        grid[ny][nx] = T.CORRIDOR;
    }
  }

  const doors = new Set();
  stores.forEach(s => {
    let dc = 0;
    for (let y = s.y; y < s.y + s.h && dc < 2; y++)
      for (let x = s.x; x < s.x + s.w && dc < 2; x++)
        for (const [nx, ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]])
          if (ny >= 0 && ny < H && nx >= 0 && nx < W && grid[ny][nx] === T.CORRIDOR) {
            doors.add(`${x},${y}:${nx},${ny}`); doors.add(`${nx},${ny}:${x},${y}`); dc++; break;
          }
  });

  let startX = 0, startY = midY;
  for (let x = 0; x < W; x++) { if (grid[midY][x] === T.CORRIDOR) { startX = x; break; } }

  // Wall entities: ATMs + Payphones
  const wallEntities = [];
  const weRand = rng(seed + 99);
  let atmCount = 0, phoneCount = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (grid[y][x] !== T.CORRIDOR) continue;
      const roll = weRand();
      if (roll < 0.93) continue;
      const candidates = [];
      if (y === 0 || grid[y-1][x] === T.EMPTY) candidates.push('N');
      if (y === H-1 || grid[y+1][x] === T.EMPTY) candidates.push('S');
      if (x === W-1 || grid[y][x+1] === T.EMPTY) candidates.push('E');
      if (x === 0 || grid[y][x-1] === T.EMPTY) candidates.push('W');
      if (!candidates.length) continue;
      const face = candidates[Math.floor(weRand() * candidates.length)];
      // Alternate: first few ATMs, then payphones
      const type = atmCount < 2 ? 'atm' : phoneCount < 2 ? 'payphone' : null;
      if (!type) continue;
      wallEntities.push({ tileX: x, tileY: y, face, type, id: `${type}_${x}_${y}` });
      if (type === 'atm') atmCount++; else phoneCount++;
    }
  }

  // Loose items
  const looseItems = [];
  const itemRand = rng(seed + 333);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (grid[y][x] === T.EMPTY) continue;
      const chance = grid[y][x] === T.STORE ? 0.12 : 0.04;
      if (itemRand() < chance) {
        const itemSeed = seed * 1000 + y * 100 + x;
        const item = generateItem(itemSeed);
        const or = rng(itemSeed + 7);
        const ox = (or() - 0.5) * CELL * 0.55, oz = (or() - 0.5) * CELL * 0.55;
        const requiredFace = Math.abs(ox) > Math.abs(oz) ? (ox > 0 ? 'E' : 'W') : (oz > 0 ? 'S' : 'N');
        looseItems.push({ tileX: x, tileY: y, item, offsetX: ox, offsetZ: oz, requiredFace, id: `item_${x}_${y}` });
      }
    }
  }

  return { grid, storeMap, stores, doors, W, H, startX, startY, wallEntities, looseItems, seed };
}

// ── WORLD MUTATION ────────────────────────────────────────────────────────────
// Adds a new hallway + optional back room to the grid, returns new tile coords
function mutateWorld(fd, questSeed) {
  const { grid, storeMap, W, H, stores, doors, wallEntities, looseItems } = fd;
  const r = rng(questSeed + 4242);

  // Find corridor tiles on the edge of the explored area
  const edgeTiles = [];
  for (let y = 1; y < H-1; y++) {
    for (let x = 1; x < W-1; x++) {
      if (grid[y][x] !== T.CORRIDOR) continue;
      // Has at least one empty neighbor not on the outer border
      for (const [dx, dz] of [[0,-1],[0,1],[-1,0],[1,0]]) {
        const nx = x+dx, ny = y+dz;
        if (nx > 0 && nx < W-1 && ny > 0 && ny < H-1 && grid[ny][nx] === T.EMPTY) {
          edgeTiles.push({ x, y, nx, ny, dx, dz }); break;
        }
      }
    }
  }
  if (!edgeTiles.length) return null;

  const edge = edgeTiles[Math.floor(r() * edgeTiles.length)];
  const newTiles = [];

  // Carve 3-5 corridor tiles in the direction
  let cx = edge.nx, cy = edge.ny;
  const len = 3 + Math.floor(r() * 3);
  for (let i = 0; i < len; i++) {
    if (cx <= 0 || cx >= W-1 || cy <= 0 || cy >= H-1) break;
    if (grid[cy][cx] !== T.EMPTY) break;
    grid[cy][cx] = T.CORRIDOR;
    newTiles.push({ x: cx, y: cy });
    cx += edge.dx; cy += edge.dz;
  }
  if (!newTiles.length) return null;

  // Maybe add a small back room off one side of the new corridor
  const addRoom = r() < 0.65;
  if (addRoom) {
    const pick = newTiles[Math.floor(r() * newTiles.length)];
    // Pick a perpendicular direction
    const perp = edge.dx === 0 ? [1, 0] : [0, 1];
    const side = r() < 0.5 ? 1 : -1;
    const rw = 2 + Math.floor(r() * 2), rh = 2 + Math.floor(r() * 2);
    const rx = pick.x + perp[0] * side;
    const ry = pick.y + perp[1] * side;
    if (rx > 0 && rx+rw < W && ry > 0 && ry+rh < H) {
      let ok = true;
      for (let dy = -1; dy <= rh && ok; dy++)
        for (let dx2 = -1; dx2 <= rw && ok; dx2++)
          if (grid[ry+dy]?.[rx+dx2] !== T.EMPTY) ok = false;
      if (ok) {
        const palette = STORE_PALETTES[Math.floor(r() * STORE_PALETTES.length)];
        const idx = stores.length;
        stores.push({ palette, x: rx, y: ry, w: rw, h: rh, isBackRoom: true });
        for (let dy = 0; dy < rh; dy++)
          for (let dx2 = 0; dx2 < rw; dx2++) {
            grid[ry+dy][rx+dx2] = T.STORE;
            storeMap[ry+dy][rx+dx2] = idx;
            newTiles.push({ x: rx+dx2, y: ry+dy });
          }
        // Door between corridor and room
        doors.add(`${pick.x},${pick.y}:${rx},${ry}`);
        doors.add(`${rx},${ry}:${pick.x},${pick.y}`);
        // Add a loose item in the back room as reward
        const itemSeed = questSeed * 777 + rx * 13 + ry;
        const item = generateItem(itemSeed);
        const or = rng(itemSeed + 3);
        // Make it slightly better than normal
        item.rarity = item.rarity === "common" ? "uncommon" : item.rarity;
        const ox = (or() - 0.5) * CELL * 0.4, oz = (or() - 0.5) * CELL * 0.4;
        const requiredFace = Math.abs(ox) > Math.abs(oz) ? (ox > 0 ? 'E' : 'W') : (oz > 0 ? 'S' : 'N');
        looseItems.push({ tileX: rx, tileY: ry, item, offsetX: ox, offsetZ: oz, requiredFace, id: `reward_${rx}_${ry}` });
      }
    }
  }

  // Add a payphone at the end of the new hall
  const last = newTiles[newTiles.length - 1];
  const wallFaces = [];
  for (const [dx, dz, f] of [[0,-1,'N'],[0,1,'S'],[1,0,'E'],[-1,0,'W']]) {
    const nx = last.x+dx, ny = last.y+dz;
    if (ny < 0||ny>=H||nx<0||nx>=W||grid[ny][nx]===T.EMPTY) wallFaces.push(f);
  }
  if (wallFaces.length) {
    wallEntities.push({ tileX: last.x, tileY: last.y, face: wallFaces[0], type: 'payphone', id: `phone_reward_${last.x}_${last.y}` });
  }

  return newTiles;
}

// ── TEXTURES ──────────────────────────────────────────────────────────────────
const texCache = {};
function makeTex(key, draw, w = 256, h = 256) {
  if (texCache[key]) return texCache[key];
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); texCache[key] = t; return t;
}
function floorTex(color) {
  return makeTex(`f${color}`, (ctx, w, h) => {
    ctx.fillStyle = color; ctx.fillRect(0, 0, w, h);
    const t = 64;
    for (let y = 0; y < h; y += t) for (let x = 0; x < w; x += t) {
      if (((x/t)+(y/t)) % 2 === 0) { ctx.fillStyle="rgba(0,0,0,0.1)"; ctx.save(); ctx.translate(x+t/2,y+t/2); ctx.rotate(Math.PI/4); ctx.fillRect(-t*.38,-t*.38,t*.76,t*.76); ctx.restore(); }
      ctx.strokeStyle="rgba(0,0,0,0.18)"; ctx.lineWidth=1; ctx.save(); ctx.translate(x+t/2,y+t/2); ctx.rotate(Math.PI/4); ctx.strokeRect(-t*.38,-t*.38,t*.76,t*.76); ctx.restore();
    }
  });
}
function wallTex(color) {
  return makeTex(`w${color}`, (ctx, w, h) => {
    ctx.fillStyle=color; ctx.fillRect(0,0,w,h);
    ctx.fillStyle="rgba(255,255,255,0.07)"; for(let x=0;x<w;x+=28)ctx.fillRect(x,0,14,h);
    ctx.strokeStyle="rgba(0,0,0,0.12)"; ctx.lineWidth=1; for(let y=0;y<h;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  });
}
function ceilTex(color) {
  return makeTex(`c${color}`, (ctx, w, h) => {
    ctx.fillStyle=color; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle="rgba(0,0,0,0.1)"; ctx.lineWidth=1.5;
    for(let x=0;x<=w;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<=h;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.fillStyle="rgba(255,255,255,0.14)"; for(let x=0;x<w;x+=48)for(let y=0;y<h;y+=48)ctx.fillRect(x+4,y+4,40,40);
  });
}
function doorTex() {
  return makeTex("door", (ctx, w, h) => {
    ctx.fillStyle="#C8A060"; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle="#8B6030"; ctx.lineWidth=4; ctx.strokeRect(6,6,w-12,h-12); ctx.strokeRect(w*.2,h*.05,w*.6,h*.9);
    ctx.fillStyle="#FFD700"; ctx.beginPath(); ctx.arc(w*.72,h*.52,6,0,Math.PI*2); ctx.fill();
  });
}
function atmTex() {
  return makeTex("atm", (ctx, w, h) => {
    ctx.fillStyle="#223344"; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle="#00FFCC"; ctx.lineWidth=3; ctx.strokeRect(4,4,w-8,h-8);
    ctx.fillStyle="#001122"; ctx.fillRect(w*.1,h*.08,w*.8,h*.35);
    ctx.fillStyle="#00FF88"; ctx.font=`bold ${w*.12}px monospace`; ctx.textAlign="center"; ctx.fillText("ATM",w/2,h*.28);
    ctx.font=`${w*.07}px monospace`; ctx.fillStyle="#00CCAA"; ctx.fillText("$MALL CASH$",w/2,h*.38);
    ctx.fillStyle="#334455"; ctx.fillRect(w*.15,h*.5,w*.7,h*.38);
    for(let ky=0;ky<3;ky++)for(let kx=0;kx<3;kx++){ctx.fillStyle="#445566"; ctx.fillRect(w*.18+kx*w*.22,h*.53+ky*h*.11,w*.18,h*.09);}
    ctx.fillStyle="#00FFCC"; ctx.fillRect(w*.2,h*.9,w*.6,h*.04);
  });
}
function phoneTex() {
  return makeTex("phone", (ctx, w, h) => {
    // Body
    ctx.fillStyle="#3355AA"; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle="#AACCFF"; ctx.lineWidth=3; ctx.strokeRect(4,4,w-8,h-8);
    // Coin slot area
    ctx.fillStyle="#223377"; ctx.fillRect(w*.1,h*.05,w*.8,h*.3);
    ctx.fillStyle="#FFDD44"; ctx.font=`bold ${w*.09}px monospace`; ctx.textAlign="center";
    ctx.fillText("PAYPHONE",w/2,h*.17);
    ctx.fillStyle="#AACCFF"; ctx.font=`${w*.07}px monospace`; ctx.fillText("25¢",w/2,h*.28);
    // Handset outline
    ctx.strokeStyle="#AACCFF"; ctx.lineWidth=4;
    ctx.beginPath(); ctx.roundRect(w*.2,h*.38,w*.6,h*.22,8); ctx.stroke();
    // Cord
    ctx.strokeStyle="#334488"; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(w*.35,h*.6); ctx.bezierCurveTo(w*.2,h*.75,w*.8,h*.7,w*.65,h*.85); ctx.stroke();
    // Keypad
    ctx.fillStyle="#1A2855"; ctx.fillRect(w*.15,h*.62,w*.7,h*.3);
    for(let ky=0;ky<3;ky++)for(let kx=0;kx<3;kx++){ctx.fillStyle="#2A3A66"; ctx.fillRect(w*.18+kx*w*.21,h*.65+ky*h*.08,w*.17,h*.06);}
  });
}

// ── SCENE BUILDER ─────────────────────────────────────────────────────────────
function buildScene(scene, fd, onlyTiles = null) {
  // If onlyTiles provided, only add geometry for those tiles (incremental build)
  if (!onlyTiles) {
    scene.children.filter(c => !c.isAmbientLight).forEach(c => scene.remove(c));
  }

  const { grid, storeMap, stores, doors, W, H, wallEntities, looseItems } = fd;
  function mat(color, map) { return new THREE.MeshLambertMaterial({ color: color||0xffffff, ...(map?{map}:{}) }); }
  function addBox(sx, sy, sz, px, py, pz, m) { const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),m); mesh.position.set(px,py,pz); scene.add(mesh); return mesh; }
  function getPal(x, y) {
    if (grid[y][x] === T.CORRIDOR) return CORRIDOR_PALETTE;
    const si = storeMap[y][x]; return si >= 0 ? stores[si].palette : CORRIDOR_PALETTE;
  }
  const wx = gx => gx*CELL+CELL/2, wz = gy => gy*CELL+CELL/2;
  const passable = (x,y) => y>=0&&y<H&&x>=0&&x<W&&grid[y][x]!==T.EMPTY;

  const tilesToBuild = onlyTiles
    ? new Set(onlyTiles.map(t => `${t.x},${t.y}`))
    : null;
  const shouldBuild = (x, y) => !tilesToBuild || tilesToBuild.has(`${x},${y}`);

  // For incremental: also rebuild walls of neighbors
  const extendedTiles = tilesToBuild ? new Set(tilesToBuild) : null;
  if (onlyTiles && extendedTiles) {
    onlyTiles.forEach(t => {
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dz]) => extendedTiles.add(`${t.x+dx},${t.y+dz}`));
    });
  }
  const shouldBuildWall = (x, y) => !extendedTiles || extendedTiles.has(`${x},${y}`);

  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!passable(x,y)) continue;
    if (!shouldBuild(x,y)) continue;
    const p = getPal(x,y);
    const ft = floorTex(p.floor); ft.wrapS=ft.wrapT=THREE.RepeatWrapping; ft.repeat.set(1,1);
    const ct = ceilTex(p.ceil); ct.wrapS=ct.wrapT=THREE.RepeatWrapping; ct.repeat.set(1,1);
    addBox(CELL,.08,CELL,wx(x),0,wz(y),mat(0xffffff,ft));
    addBox(CELL,.08,CELL,wx(x),WALL_H,wz(y),mat(0xffffff,ct));
  }

  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!passable(x,y)) continue;
    if (!shouldBuildWall(x,y)) continue;
    const p = getPal(x,y);
    const wt = wallTex(p.wall); wt.wrapS=wt.wrapT=THREE.RepeatWrapping; wt.repeat.set(1,.8);
    [[0,-1,"x"],[0,1,"x"],[-1,0,"z"],[1,0,"z"]].forEach(([dx,dz,axis]) => {
      const nx=x+dx, ny=y+dz;
      const ewx=wx(x)+dx*CELL/2, ewz=wz(y)+dz*CELL/2;
      if (!passable(nx,ny)) {
        addBox(axis==="x"?CELL:.15,WALL_H,axis==="x"?.15:CELL,ewx,WALL_H/2,ewz,mat(0xffffff,wt));
      } else if (grid[ny][nx]!==grid[y][x]&&!doors.has(`${x},${y}:${nx},${ny}`)&&(x<nx||y<ny)) {
        const p2=getPal(nx,ny); const wt2=wallTex(p2.wall); wt2.wrapS=wt2.wrapT=THREE.RepeatWrapping; wt2.repeat.set(1,.8);
        addBox(axis==="x"?CELL:.18,WALL_H,axis==="x"?.18:CELL,ewx,WALL_H/2,ewz,mat(0xffffff,wt2));
      } else if (grid[ny][nx]!==grid[y][x]&&doors.has(`${x},${y}:${nx},${ny}`)) {
        const dm=mat(0xC8A060,doorTex());
        const dw=new THREE.Mesh(new THREE.BoxGeometry(axis==="x"?CELL*.55:.14,WALL_H*.85,axis==="x"?.14:CELL*.55),dm);
        dw.position.set(ewx,WALL_H/2,ewz); scene.add(dw);
      }
    });
  }

  const CORRIDOR_PROPS=["bench","plant","trashcan","kiosk","fountain"];
  const STORE_PROPS=["shelf","rack","display","counter","mannequin"];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (grid[y][x]===T.EMPTY) continue;
    if (!shouldBuild(x,y)) continue;
    const pr = rng(fd.seed*137+y*31+x);
    const chance = grid[y][x]===T.CORRIDOR?0.06:0.10;
    if (pr()<chance) {
      const p=getPal(x,y); const ac=parseInt((p.wall||"#888888").replace("#",""),16);
      const props=grid[y][x]===T.CORRIDOR?CORRIDOR_PROPS:STORE_PROPS;
      const type=props[Math.floor(pr()*props.length)];
      const ox=(pr()-0.5)*CELL*0.4, oz=(pr()-0.5)*CELL*0.4;
      spawnProp(type,wx(x)+ox,wz(y)+oz,ac,scene,addBox,mat);
    }
  }

  // Wall entities
  wallEntities.forEach(we => {
    if (onlyTiles && !tilesToBuild.has(`${we.tileX},${we.tileY}`)) return;
    const { tileX, tileY, face, type } = we;
    const cx = wx(tileX), cz = wz(tileY);
    const offset = CELL/2-0.12;
    const positions = {
      N:{px:cx,pz:cz-offset,ry:0}, S:{px:cx,pz:cz+offset,ry:Math.PI},
      E:{px:cx+offset,pz:cz,ry:-Math.PI/2}, W:{px:cx-offset,pz:cz,ry:Math.PI/2},
    };
    const fo = positions[face];
    if (type === 'atm') {
      const at=atmTex();
      const atm=new THREE.Mesh(new THREE.BoxGeometry(0.9,2.1,0.22),mat(0x223344,at));
      atm.position.set(fo.px,1.05,fo.pz); atm.rotation.y=fo.ry; scene.add(atm);
      const gl=new THREE.PointLight(0x00FFCC,0.8,4); gl.position.set(fo.px,2.5,fo.pz); scene.add(gl);
    } else if (type === 'payphone') {
      const pt=phoneTex();
      const phone=new THREE.Mesh(new THREE.BoxGeometry(0.75,1.8,0.18),mat(0x3355AA,pt));
      phone.position.set(fo.px,0.9,fo.pz); phone.rotation.y=fo.ry; scene.add(phone);
      // Receiver hanging on side
      const recv=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.45,0.12),mat(0x1A2244));
      recv.position.set(fo.px+(face==='N'||face==='S'?0.45:0),0.75,fo.pz+(face==='E'||face==='W'?0.3:0));
      scene.add(recv);
      const pl=new THREE.PointLight(0x4466FF,0.6,3); pl.position.set(fo.px,2.0,fo.pz); scene.add(pl);
    }
  });

  // Loose items
  looseItems.forEach(li => {
    if (onlyTiles && !tilesToBuild.has(`${li.tileX},${li.tileY}`)) return;
    const { tileX, tileY, item, offsetX, offsetZ } = li;
    const ix=wx(tileX)+offsetX, iz=wz(tileY)+offsetZ;
    const icolor=parseInt(item.color.replace("#",""),16);
    addBox(0.35,0.06,0.35,ix,0.52,iz,mat(0x999999));
    const im=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.24,0.24),mat(icolor));
    im.position.set(ix,0.69,iz); scene.add(im);
    const rc=parseInt(RARITY_COLORS[item.rarity].replace("#",""),16);
    const rl=new THREE.PointLight(rc,0.5,2.2); rl.position.set(ix,1.1,iz); scene.add(rl);
  });

  // Lights
  for (let y = 0; y < H; y+=2) for (let x = 0; x < W; x+=2) {
    if (!passable(x,y)) continue;
    if (!shouldBuild(x,y)) continue;
    const p=getPal(x,y);
    const col=p===CORRIDOR_PALETTE?0xFFFDE0:new THREE.Color(p.ceil).getHex();
    const light=new THREE.PointLight(col,0.75,CELL*3.5);
    light.position.set(wx(x),WALL_H-.2,wz(y)); scene.add(light);
  }
}

function spawnProp(type, wx, wz, ac, scene, addBox, mat) {
  switch(type) {
    case"bench": addBox(1.8,.12,.5,wx,.45,wz,mat(0x8B6B3D)); addBox(.1,.4,.5,wx-.8,.2,wz,mat(0x6B4B2D)); addBox(.1,.4,.5,wx+.8,.2,wz,mat(0x6B4B2D)); break;
    case"plant": { addBox(.4,.4,.4,wx,.2,wz,mat(0xC8A060)); addBox(.1,.8,.1,wx,.85,wz,mat(0x5C3D1E)); const g=new THREE.SphereGeometry(.4,7,7); const m=new THREE.Mesh(g,mat(0x2D7B2D)); m.position.set(wx,1.5,wz); scene.add(m); break; }
    case"trashcan": addBox(.35,.7,.35,wx,.35,wz,mat(0x444444)); break;
    case"kiosk": addBox(1.2,.9,.7,wx,.45,wz,mat(ac)); addBox(1.0,.05,.5,wx,.93,wz,mat(0xCCCCCC)); break;
    case"fountain": { const bm=new THREE.Mesh(new THREE.CylinderGeometry(.9,1,.4,12),mat(0xC8B89A)); bm.position.set(wx,.2,wz); scene.add(bm); const wm=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,.06,12),mat(0x5BA8C4)); wm.position.set(wx,.45,wz); scene.add(wm); break; }
    case"shelf": addBox(1.4,1.5,.35,wx,.75,wz,mat(ac)); [.5,1.0,1.45].forEach(h=>addBox(1.2,.06,.3,wx,h,wz,mat(0xEEEEEE))); break;
    case"rack": addBox(.06,1.3,.06,wx-.6,.65,wz,mat(0x999999)); addBox(.06,1.3,.06,wx+.6,.65,wz,mat(0x999999)); addBox(1.2,.06,.06,wx,1.25,wz,mat(0xCCCCCC)); for(let i=-.45;i<=.45;i+=.3){const hm=new THREE.Mesh(new THREE.BoxGeometry(.2,.5,.06),mat(ac)); hm.position.set(wx+i,1,wz); scene.add(hm);} break;
    case"display": addBox(.9,.06,.9,wx,.7,wz,mat(0xDDDDDD)); addBox(.06,.65,.06,wx,.37,wz,mat(0xAAAAAA)); addBox(.7,.06,.7,wx,.06,wz,mat(0xCCCCCC)); break;
    case"counter": addBox(1.6,.9,.5,wx,.45,wz,mat(ac)); addBox(1.7,.06,.6,wx,.93,wz,mat(0xEEEEEE)); break;
    case"mannequin": addBox(.35,.55,.25,wx,1.15,wz,mat(ac)); addBox(.18,.3,.18,wx,1.7,wz,mat(0xF5DEB3)); addBox(.08,.3,.08,wx+.22,1,wz,mat(0xF5DEB3)); addBox(.08,.3,.08,wx-.22,1,wz,mat(0xF5DEB3)); addBox(.08,.6,.08,wx+.12,.4,wz,mat(0xF5DEB3)); addBox(.08,.6,.08,wx-.12,.4,wz,mat(0xF5DEB3)); addBox(.3,.06,.3,wx,.03,wz,mat(0x555555)); break;
  }
}

// ── DIRECTIONS ────────────────────────────────────────────────────────────────
const DIRS = [{dx:0,dz:-1,f:'N'},{dx:1,dz:0,f:'E'},{dx:0,dz:1,f:'S'},{dx:-1,dz:0,f:'W'}];
const DIR_ANGLE = [0, Math.PI/2, Math.PI, -Math.PI/2];
const DIR_LABELS = ["N","E","S","W"];
const FACE_ARROW = {N:"↑",S:"↓",E:"→",W:"←"};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function MallWalker() {
  const mountRef = useRef(null);
  const sr = useRef({ px:0, py:0, dir:0, floor:1, fd:null, moving:false, bumpMode:null });
  const tr = useRef({});
  const [hud, setHud] = useState({ floor:1, dir:"N", storeName:"" });
  const [border, setBorder] = useState(null);
  const [bumpPrompt, setBumpPrompt] = useState(null);
  const [hands, setHands] = useState([null, null]);
  const [playerStats, setPlayerStats] = useState({});
  const [acquired, setAcquired] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);
  const [questLog, setQuestLog] = useState([]);
  const [phoneMsg, setPhoneMsg] = useState(null);
  const [worldEvent, setWorldEvent] = useState(null);
  const borderTO = useRef(null);
  const acquiredTO = useRef(null);

  function flashBorder(color, ms = 300) {
    if (borderTO.current) clearTimeout(borderTO.current);
    setBorder(color);
    if (ms > 0) borderTO.current = setTimeout(() => setBorder(null), ms);
  }

  function learnAndPickup(item, prevHands) {
    setPlayerStats(prev => {
      const next = { ...prev };
      Object.keys(item.stats||{}).forEach(k => { if (!(k in next)) next[k] = 0; });
      return next;
    });
    const next = [...prevHands];
    if (!next[0]) { next[0] = item; } else if (!next[1]) { next[1] = item; }
    return next;
  }

  function showAcquired(msg, color, ms = 2500) {
    if (acquiredTO.current) clearTimeout(acquiredTO.current);
    setAcquired({ msg, color });
    acquiredTO.current = setTimeout(() => setAcquired(null), ms);
  }

  useEffect(() => {
    const container = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#C8B89A");
    scene.fog = new THREE.Fog("#C8B89A", CELL*4, CELL*11);
    scene.add(new THREE.AmbientLight(0xFFF8E7, 0.55));
    const camera = new THREE.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.05, 200);
    camera.position.y = PLAYER_H;
    tr.current = { renderer, scene, camera };
    const fd = generateFloor(Date.now());
    sr.current.fd = fd; sr.current.px = fd.startX; sr.current.py = fd.startY;
    buildScene(scene, fd);
    snapCamera();
    let animId;
    const loop = () => { animId = requestAnimationFrame(loop); renderer.render(scene, camera); };
    loop();
    const onResize = () => { renderer.setSize(container.clientWidth,container.clientHeight); camera.aspect=container.clientWidth/container.clientHeight; camera.updateProjectionMatrix(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize",onResize); renderer.dispose(); if(container.contains(renderer.domElement))container.removeChild(renderer.domElement); };
  }, []);

  function snapCamera() {
    const s=sr.current; const {camera}=tr.current;
    if(!camera||!s.fd)return;
    camera.position.set(s.px*CELL+CELL/2,PLAYER_H,s.py*CELL+CELL/2);
    camera.rotation.set(0,-DIR_ANGLE[s.dir],0);
    refreshHud();
  }
  function refreshHud() {
    const s=sr.current,fd=s.fd;
    let storeName="";
    if(fd&&fd.grid[s.py]&&fd.grid[s.py][s.px]===T.STORE){const si=fd.storeMap[s.py][s.px];if(si>=0)storeName=fd.stores[si].palette.name+(fd.stores[si].isBackRoom?" (back room)":"");}
    setHud({floor:s.floor,dir:DIR_LABELS[s.dir],storeName});
  }

  function getATMInFront(s) {
    return s.fd?.wallEntities.find(e=>e.type==='atm'&&e.tileX===s.px&&e.tileY===s.py&&e.face===DIRS[s.dir].f)||null;
  }
  function getPhoneInFront(s) {
    return s.fd?.wallEntities.find(e=>e.type==='payphone'&&e.tileX===s.px&&e.tileY===s.py&&e.face===DIRS[s.dir].f)||null;
  }
  function getItemsOnTile(s) {
    return s.fd?.looseItems.filter(li=>li.tileX===s.px&&li.tileY===s.py)||[];
  }

  const handlePhoneBump = useCallback((phone, currentHands, currentQuest) => {
    // If holding a quest item, deliver it
    const matchingHandIdx = currentHands.findIndex(h => h && questMatchesItem(currentQuest, h));
    if (currentQuest && matchingHandIdx >= 0) {
      // Deliver!
      const delivered = currentHands[matchingHandIdx];
      setHands(prev => { const n=[...prev]; n[matchingHandIdx]=null; return n; });
      const replyMsgs = [
        `${currentQuest.giver}: Oh this is PERFECT, thank you so much!!`,
        `${currentQuest.giver}: ...wow. This is exactly what I needed.`,
        `${currentQuest.giver}: I can't believe you found this. You're the best.`,
        `${currentQuest.giver}: *long pause* ...yeah okay this works. Thanks.`,
      ];
      const reply = replyMsgs[Math.floor(rng(Date.now())() * replyMsgs.length)];
      setPhoneMsg({ text: reply, isDelivery: true });
      setActiveQuest(null);
      setQuestLog(prev => [...prev, { ...currentQuest, complete: true, delivered: itemDisplayName(delivered) }]);

      // Mutate the world!
      const newTiles = mutateWorld(sr.current.fd, Date.now());
      if (newTiles && newTiles.length) {
        buildScene(tr.current.scene, sr.current.fd, newTiles);
        setTimeout(() => {
          setWorldEvent("🗺 A new area has opened up somewhere...");
          setTimeout(() => setWorldEvent(null), 4000);
        }, 1000);
      }
      setTimeout(() => setPhoneMsg(null), 4000);
      return;
    }

    // Otherwise: new quest or babble
    if (!currentQuest) {
      const quest = generateQuest(Date.now());
      setActiveQuest(quest);
      setPhoneMsg({ text: quest.msg, isQuest: true });
      setTimeout(() => setPhoneMsg(null), 5000);
    } else {
      // Babble if quest active but wrong item
      const babble = PAYPHONE_BABBLE[Math.floor(rng(Date.now())() * PAYPHONE_BABBLE.length)];
      const who = currentQuest.giver.split(" ")[0];
      setPhoneMsg({ text: `${who}: "${babble}"` });
      setTimeout(() => setPhoneMsg(null), 3500);
    }
  }, []);

  const doConfirmBump = useCallback((currentHands, currentQuest) => {
    const s = sr.current; const fd = s.fd;
    if (!s.bumpMode) return;
    const { target } = s.bumpMode;
    s.bumpMode = null; setBumpPrompt(null); setBorder(null);

    if (target.kind === 'atm') {
      const dollar = generateDollar(Date.now());
      setHands(prev => learnAndPickup(dollar, prev));
      showAcquired(`💳 ${dollar.rarity.toUpperCase()} Mall Dollar dispensed!`, "#00FFCC");
      flashBorder('green', 500); return;
    }

    if (target.kind === 'phone') {
      handlePhoneBump(target.entity, currentHands, currentQuest); return;
    }

    if (target.kind === 'item') {
      setHands(prev => {
        const dollarIdx = prev.findIndex(h => h && h.isDollar);
        if (dollarIdx < 0) {
          flashBorder('red', 600);
          setBumpPrompt({ type:'error', msg:'Need a Mall Dollar first!' });
          setTimeout(() => setBumpPrompt(null), 1800);
          return prev;
        }
        const dollar = prev[dollarIdx];
        const next = [...prev]; next[dollarIdx] = null;
        // Craft item with dollar
        const craftedItem = craftItemWithDollar(target.entity.item, dollar);
        const withItem = learnAndPickup(craftedItem, next);
        const idx = fd.looseItems.indexOf(target.entity);
        if (idx >= 0) fd.looseItems.splice(idx, 1);
        buildScene(tr.current.scene, fd);
        const wasUpgraded = craftedItem.rarity !== target.entity.item.rarity;
        flashBorder('green', 500);
        showAcquired(
          wasUpgraded
            ? `✨ ${itemDisplayName(craftedItem)} — UPGRADED to ${craftedItem.rarity.toUpperCase()}!`
            : `Got: ${itemDisplayName(craftedItem)}`,
          RARITY_COLORS[craftedItem.rarity]
        );
        return withItem;
      });
    }
  }, [handlePhoneBump]);

  const tryMove = useCallback((fwd) => {
    const s = sr.current; const fd = s.fd;
    if (!fd || s.moving) return;

    if (s.bumpMode) {
      if (fwd) doConfirmBump(hands, activeQuest);
      else { s.bumpMode=null; setBumpPrompt(null); setBorder(null); }
      return;
    }

    const d = DIRS[s.dir];
    const dx = fwd?d.dx:-d.dx, dz = fwd?d.dz:-d.dz;
    const nx = s.px+dx, ny = s.py+dz;
    const outOfBounds = ny<0||ny>=fd.H||nx<0||nx>=fd.W||fd.grid[ny][nx]===T.EMPTY;
    const wallBlocked = !outOfBounds&&fd.grid[ny][nx]!==fd.grid[s.py][s.px]&&!fd.doors.has(`${s.px},${s.py}:${nx},${ny}`);

    if (fwd && (outOfBounds || wallBlocked)) {
      const atm = getATMInFront(s);
      if (atm) { s.bumpMode={target:{kind:'atm',entity:atm}}; flashBorder('green',-1); setBumpPrompt({type:'atm'}); return; }
      const phone = getPhoneInFront(s);
      if (phone) { s.bumpMode={target:{kind:'phone',entity:phone}}; flashBorder('green',-1); setBumpPrompt({type:'phone',hasQuest:!!activeQuest,quest:activeQuest,hands}); return; }
      flashBorder('red'); return;
    }
    if (!fwd && (outOfBounds||wallBlocked)) { flashBorder('red'); return; }

    s.px=nx; s.py=ny;
    const {camera}=tr.current;
    const tx=nx*CELL+CELL/2, tz=ny*CELL+CELL/2;
    const sx2=camera.position.x, sz2=camera.position.z;
    s.moving=true;
    const t0=performance.now();
    const tick = (now) => {
      const t=Math.min(1,(now-t0)/180), e=t<.5?2*t*t:-1+(4-2*t)*t;
      camera.position.x=sx2+(tx-sx2)*e; camera.position.z=sz2+(tz-sz2)*e;
      if(t<1){requestAnimationFrame(tick);}
      else{
        s.moving=false; refreshHud();
        const items=getItemsOnTile(s);
        if(items.length){
          const match=items.find(li=>li.requiredFace===DIRS[s.dir].f)||items[0];
          s.bumpMode={target:{kind:'item',entity:match}};
          flashBorder('green',-1);
          setBumpPrompt({type:'item',entity:match,quest:activeQuest});
        }
      }
    };
    requestAnimationFrame(tick);
  }, [hands, activeQuest, doConfirmBump]);

  const tryTurn = useCallback((right) => {
    const s = sr.current; if (s.moving) return;
    const newDir = (s.dir+(right?1:3))%4;
    if (s.bumpMode?.target.kind==='item') {
      const items=getItemsOnTile(s);
      const match=items.find(li=>li.requiredFace===DIRS[newDir].f);
      if(match){ s.bumpMode={target:{kind:'item',entity:match}}; setBumpPrompt({type:'item',entity:match,quest:activeQuest}); }
      else{ s.bumpMode=null; setBumpPrompt(null); setBorder(null); }
    } else if(s.bumpMode){ s.bumpMode=null; setBumpPrompt(null); setBorder(null); }
    s.dir=newDir;
    const {camera}=tr.current;
    const target=-DIR_ANGLE[s.dir]; let start=camera.rotation.y;
    let diff=target-start;
    while(diff>Math.PI)diff-=Math.PI*2; while(diff<-Math.PI)diff+=Math.PI*2;
    s.moving=true; const t0=performance.now();
    const tick = (now) => {const t=Math.min(1,(now-t0)/140),e=t<.5?2*t*t:-1+(4-2*t)*t; camera.rotation.y=start+diff*e; if(t<1)requestAnimationFrame(tick); else{camera.rotation.y=target;s.moving=false;refreshHud();}};
    requestAnimationFrame(tick);
  }, [activeQuest]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.type!=="keydown") return;
      if(e.code==="ArrowUp"||e.code==="KeyW"||e.code==="KeyE") tryMove(true);
      if(e.code==="ArrowDown"||e.code==="KeyS") tryMove(false);
      if(e.code==="ArrowLeft"||e.code==="KeyA") tryTurn(false);
      if(e.code==="ArrowRight"||e.code==="KeyD") tryTurn(true);
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[tryMove,tryTurn]);

  // ── UI ────────────────────────────────────────────────────────────────────
  const btnStyle={width:52,height:52,background:"rgba(255,230,100,0.13)",border:"2px solid rgba(255,220,80,0.6)",borderRadius:10,color:"#FFE640",fontFamily:"'Arial Black',sans-serif",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",userSelect:"none",WebkitUserSelect:"none",touchAction:"manipulation"};
  function Btn({label,onPress}){return <div style={btnStyle} onPointerDown={e=>{e.preventDefault();onPress();}}>{label}</div>;}

  function ItemCard({item,label}){
    if(!item)return(<div style={{minWidth:100,padding:"8px 10px",background:"rgba(0,0,0,0.45)",border:"2px dashed rgba(255,220,80,0.25)",borderRadius:8,color:"rgba(255,220,80,0.3)",fontSize:10,fontFamily:"monospace",textAlign:"center",letterSpacing:1}}>{label}<br/><span style={{fontSize:14}}>——</span></div>);
    const rc=RARITY_COLORS[item.rarity];
    return(<div style={{minWidth:100,padding:"8px 10px",background:"rgba(0,0,0,0.8)",border:`2px solid ${rc}`,borderRadius:8,boxShadow:`0 0 10px ${rc}55`}}>
      <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:1,marginBottom:3}}>{label}{item.crafted?" ✨":""}</div>
      <div style={{width:28,height:28,background:item.color,borderRadius:4,marginBottom:4,boxShadow:`0 0 8px ${item.color}88`}}/>
      {item.prefix&&<div style={{fontSize:9,color:"#AAFFAA",fontFamily:"monospace"}}>{item.prefix.name}</div>}
      <div style={{fontSize:11,color:"#FFFFFF",fontFamily:"monospace",fontWeight:"bold",lineHeight:1.3}}>{item.name}</div>
      {item.suffix&&<div style={{fontSize:9,color:"#AAAAFF",fontFamily:"monospace"}}>{item.suffix.name}</div>}
      <div style={{marginTop:3,fontSize:9,color:rc,fontFamily:"monospace",letterSpacing:1}}>{item.rarity.toUpperCase()}</div>
      {Object.entries(item.stats||{}).map(([k,v])=><div key={k} style={{fontSize:9,color:"#CCCCCC",fontFamily:"monospace"}}>{k} +{v}</div>)}
    </div>);
  }

  const borderStyle=border==='red'?"5px solid rgba(255,60,60,0.75)":border==='green'?"5px solid rgba(0,255,150,0.75)":undefined;
  const activeItem=bumpPrompt?.type==='item'?bumpPrompt.entity:null;
  const facingCorrectly=activeItem?DIRS[hud.dir==="N"?0:hud.dir==="E"?1:hud.dir==="S"?2:3].f===activeItem.requiredFace:false;
  const questMatch=activeItem&&activeQuest?questMatchesItem(activeQuest,activeItem.item):false;

  return(
    <div style={{width:"100vw",height:"100vh",background:"#111",position:"relative",overflow:"hidden",fontFamily:"'Arial Black',sans-serif"}}>
      <div ref={mountRef} style={{width:"100%",height:"100%"}}/>
      {border&&<div style={{position:"absolute",inset:0,border:borderStyle,pointerEvents:"none",boxSizing:"border-box"}}/>}

      {/* Top HUD */}
      <div style={{position:"absolute",top:0,left:0,right:0,display:"flex",justifyContent:"space-between",padding:"10px 14px",pointerEvents:"none"}}>
        <div style={{background:"rgba(0,0,0,0.65)",color:"#FF9EC8",padding:"6px 12px",border:"2px solid #FF9EC8",fontSize:14,letterSpacing:2,textShadow:"0 0 8px #FF9EC8"}}>🛍 SUNSET RIDGE MALL</div>
        <div style={{background:"rgba(0,0,0,0.65)",color:"#FFE640",padding:"6px 12px",border:"1px solid #FFE640",fontSize:12,letterSpacing:2,textAlign:"right"}}>
          <div>FLOOR {hud.floor} · {hud.dir}</div>
          {hud.storeName&&<div style={{color:"#FF9EC8",marginTop:2}}>{hud.storeName}</div>}
        </div>
      </div>

      {/* Active quest note */}
      {activeQuest&&(
        <div style={{position:"absolute",top:56,left:"50%",transform:"translateX(-50%)",background:"rgba(20,15,5,0.9)",border:"2px solid #FFDD88",color:"#FFDD88",padding:"6px 14px",borderRadius:6,fontFamily:"monospace",fontSize:11,letterSpacing:1,textAlign:"center",pointerEvents:"none",maxWidth:260,boxShadow:"0 0 12px #FFDD8844"}}>
          📝 {activeQuest.msg}
        </div>
      )}

      {/* Phone message */}
      {phoneMsg&&(
        <div style={{position:"absolute",top:"38%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(0,10,30,0.95)",border:`2px solid ${phoneMsg.isDelivery?"#44FF88":phoneMsg.isQuest?"#FFDD44":"#4466FF"}`,color:"white",padding:"16px 22px",borderRadius:10,fontFamily:"monospace",fontSize:12,textAlign:"center",pointerEvents:"none",maxWidth:280,boxShadow:`0 0 20px ${phoneMsg.isDelivery?"#44FF8844":"#4466FF44"}`}}>
          <div style={{fontSize:10,color:"#4466FF",marginBottom:6}}>📞 PAYPHONE</div>
          <div style={{lineHeight:1.6,color:phoneMsg.isDelivery?"#44FF88":phoneMsg.isQuest?"#FFDD44":"#AACCFF"}}>{phoneMsg.text}</div>
        </div>
      )}

      {/* World event */}
      {worldEvent&&(
        <div style={{position:"absolute",bottom:200,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.9)",border:"2px solid #FFAA44",color:"#FFAA44",padding:"10px 18px",borderRadius:8,fontFamily:"monospace",fontSize:12,letterSpacing:1,pointerEvents:"none",whiteSpace:"nowrap"}}>
          {worldEvent}
        </div>
      )}

      {/* Compass */}
      <div style={{position:"absolute",top:"50%",right:14,transform:"translateY(-50%)",pointerEvents:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
        {["N","E","S","W"].map(d=><div key={d} style={{color:hud.dir===d?"#FFE640":"rgba(255,230,100,0.3)",fontSize:hud.dir===d?18:12,textAlign:"center",textShadow:hud.dir===d?"0 0 8px #FFE640":"none",transition:"all .15s"}}>{d}</div>)}
      </div>

      {/* Bump prompts */}
      {bumpPrompt?.type==='atm'&&(
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(0,0,0,0.88)",border:"2px solid #00FFCC",color:"#00FFCC",padding:"14px 22px",borderRadius:10,textAlign:"center",fontFamily:"monospace",fontSize:12,pointerEvents:"none"}}>
          <div style={{fontSize:16,marginBottom:4}}>💳 ATM</div>
          <div style={{fontSize:11,color:"#AAFFCC"}}>Move forward to withdraw</div>
        </div>
      )}
      {bumpPrompt?.type==='phone'&&(
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(0,5,20,0.92)",border:"2px solid #4466FF",color:"white",padding:"14px 22px",borderRadius:10,textAlign:"center",fontFamily:"monospace",fontSize:12,pointerEvents:"none",maxWidth:240}}>
          <div style={{fontSize:16,marginBottom:6}}>📞 PAYPHONE</div>
          {bumpPrompt.hasQuest
            ? <><div style={{color:"#FFDD44",fontSize:11,marginBottom:4}}>Active quest: {bumpPrompt.quest?.giver}</div>
                <div style={{fontSize:10,color:hands.some(h=>questMatchesItem(bumpPrompt.quest,h))?"#44FF88":"#AAAAAA"}}>
                  {hands.some(h=>questMatchesItem(bumpPrompt.quest,h))?"✓ You have what they need! Forward to deliver.":"You don't have the right item yet."}
                </div></>
            : <div style={{fontSize:11,color:"#AACCFF"}}>Forward to call — someone might need something.</div>
          }
        </div>
      )}
      {bumpPrompt?.type==='item'&&activeItem&&(
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(0,0,0,0.88)",border:`2px solid ${questMatch?"#44FF88":RARITY_COLORS[activeItem.item.rarity]}`,color:"white",padding:"14px 22px",borderRadius:10,textAlign:"center",fontFamily:"monospace",fontSize:12,pointerEvents:"none",minWidth:180}}>
          {questMatch&&<div style={{color:"#44FF88",fontSize:10,marginBottom:4}}>📝 QUEST MATCH</div>}
          <div style={{color:RARITY_COLORS[activeItem.item.rarity],fontWeight:"bold",fontSize:14,marginBottom:4}}>{itemDisplayName(activeItem.item)}</div>
          <div style={{fontSize:10,color:"#AAAAAA",marginBottom:6}}>{activeItem.item.rarity.toUpperCase()}</div>
          {facingCorrectly
            ? <div style={{color:"#00FF99",fontSize:11}}>Forward to buy · costs 1 💳</div>
            : <div style={{color:"#FFCC44",fontSize:11}}>Face {FACE_ARROW[activeItem.requiredFace]} to buy</div>}
        </div>
      )}
      {bumpPrompt?.type==='error'&&(<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(0,0,0,0.88)",border:"2px solid #FF4444",color:"#FF4444",padding:"12px 20px",borderRadius:10,fontFamily:"monospace",fontSize:13,pointerEvents:"none"}}>⚠ {bumpPrompt.msg}</div>)}

      {/* Acquired flash */}
      {acquired&&(<div style={{position:"absolute",top:64,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.92)",border:`2px solid ${acquired.color||"#00FF99"}`,color:"white",padding:"10px 20px",borderRadius:8,fontFamily:"monospace",fontSize:12,textAlign:"center",pointerEvents:"none",whiteSpace:"nowrap",maxWidth:"80vw"}}>{acquired.msg}</div>)}

      {/* Hands */}
      <div style={{position:"absolute",bottom:140,left:10}}><ItemCard item={hands[0]} label="L HAND"/></div>
      <div style={{position:"absolute",bottom:140,right:10}}><ItemCard item={hands[1]} label="R HAND"/></div>

      {/* Stats */}
      {Object.keys(playerStats).length>0&&(
        <div style={{position:"absolute",top:60,left:14,background:"rgba(0,0,0,0.6)",border:"1px solid rgba(255,220,80,0.35)",padding:"6px 10px",borderRadius:6,pointerEvents:"none"}}>
          <div style={{fontSize:9,color:"rgba(255,220,80,0.5)",letterSpacing:2,marginBottom:3}}>STATS</div>
          {Object.keys(playerStats).map(k=>{const total=(hands[0]?.stats?.[k]||0)+(hands[1]?.stats?.[k]||0);return<div key={k} style={{fontSize:10,color:"#FFE640",fontFamily:"monospace",letterSpacing:1}}>{k} {total>0?`+${total}`:0}</div>;})}
        </div>
      )}

      {/* Controls */}
      <div style={{position:"absolute",bottom:20,left:0,right:0,display:"flex",justifyContent:"center",gap:8,alignItems:"flex-end"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <Btn label="▲" onPress={()=>tryMove(true)}/>
          <div style={{display:"flex",gap:6}}>
            <Btn label="◄" onPress={()=>tryTurn(false)}/>
            <Btn label="▼" onPress={()=>tryMove(false)}/>
            <Btn label="►" onPress={()=>tryTurn(true)}/>
          </div>
        </div>
      </div>
      <div style={{position:"absolute",bottom:118,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.45)",color:"rgba(255,230,100,0.5)",fontSize:10,letterSpacing:2,padding:"3px 10px",pointerEvents:"none",whiteSpace:"nowrap"}}>
        WASD / ARROWS · FACE + FORWARD TO INTERACT
      </div>
    </div>
  );
}
