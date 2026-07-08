// Distraction Removal — backend
// Zero external dependencies. Run with: node server.js
// Stores user profiles (streak, sessions, last study date) in a local JSON file.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5050;
const DB_FILE = path.join(__dirname, 'data.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) return { users: {} };
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return { users: {} };
  }
}
function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function newProfile(username) {
  return { username, streak: 0, sessionsTotal: 0, lastStudyDate: '', todayCount: 0 };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') return sendJSON(res, 204, {});

  // ---- serve the frontend (same server, no separate hosting needed) ----
  if (req.method === 'GET' && !url.pathname.startsWith('/api')) {
    const filePath = url.pathname === '/'
      ? path.join(__dirname, 'public', 'index.html')
      : path.join(__dirname, 'public', url.pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const type = ext === '.html' ? 'text/html' : ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      return fs.createReadStream(filePath).pipe(res);
    }
    if (url.pathname === '/') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('put index.html inside a "public" folder next to server.js');
    }
  }

  // GET /api/profile?username=foo
  if (req.method === 'GET' && url.pathname === '/api/profile') {
    const username = (url.searchParams.get('username') || '').trim();
    if (!username) return sendJSON(res, 400, { error: 'username required' });
    const db = readDB();
    const key = username.toLowerCase();
    let profile = db.users[key] || newProfile(username);
    if (profile.lastStudyDate !== todayStr()) profile.todayCount = 0;
    return sendJSON(res, 200, profile);
  }

  // POST /api/login { username }
  if (req.method === 'POST' && url.pathname === '/api/login') {
    const body = await readBody(req).catch(() => ({}));
    const username = (body.username || '').trim();
    if (!username) return sendJSON(res, 400, { error: 'username required' });
    const db = readDB();
    const key = username.toLowerCase();
    if (!db.users[key]) db.users[key] = newProfile(username);
    if (db.users[key].lastStudyDate !== todayStr()) db.users[key].todayCount = 0;
    writeDB(db);
    return sendJSON(res, 200, db.users[key]);
  }

  // POST /api/session/complete { username }
  if (req.method === 'POST' && url.pathname === '/api/session/complete') {
    const body = await readBody(req).catch(() => ({}));
    const username = (body.username || '').trim();
    if (!username) return sendJSON(res, 400, { error: 'username required' });
    const db = readDB();
    const key = username.toLowerCase();
    let profile = db.users[key] || newProfile(username);

    const today = todayStr();
    if (profile.lastStudyDate === today) {
      // already logged today, just increment counts below
    } else if (profile.lastStudyDate === yesterdayStr()) {
      profile.streak += 1;
    } else {
      profile.streak = 1;
    }
    if (profile.lastStudyDate !== today) profile.todayCount = 0;
    profile.lastStudyDate = today;
    profile.sessionsTotal += 1;
    profile.todayCount += 1;

    db.users[key] = profile;
    writeDB(db);
    return sendJSON(res, 200, profile);
  }

  sendJSON(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log(`Distraction Removal backend running at http://localhost:${PORT}`);
});
