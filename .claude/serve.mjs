import http from 'http';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002;

const MIME = {
  html: 'text/html',
  js: 'application/javascript',
  css: 'text/css',
  json: 'application/json',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  woff2: 'font/woff2',
  md: 'text/plain',
};

http.createServer((req, res) => {
  let url = req.url.split('?')[0];

  // ── Café file listing ──
  if (url === '/api/cafe') {
    const cafeDir = path.join(ROOT, 'concessions', 'cafe');
    try {
      const files = fs.readdirSync(cafeDir)
        .filter(f => f.endsWith('.md') && f !== 'CAFE.md');
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
      res.end(JSON.stringify({ files }));
    } catch(e) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ files: [] }));
    }
    return;
  }

  if (url === '/') url = '/index.html';
  let fp = path.join(ROOT, url);
  if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) {
    fp = path.join(fp, 'index.html');
  }
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    res.writeHead(404); res.end('not found'); return;
  }
  const ext = path.extname(fp).slice(1);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain', 'Cache-Control': 'no-cache' });
  fs.createReadStream(fp).pipe(res);
}).listen(PORT, () => console.log(`serving on http://localhost:${PORT}`));
