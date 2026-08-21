import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Ensure DB directory exists
const dbDir = path.join(__dirname, 'db_data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'xfit.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Password security helpers
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Database Schema Initialization
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      salt TEXT NOT NULL,
      fullName TEXT NOT NULL,
      role TEXT NOT NULL,
      avatarUrl TEXT,
      phone TEXT,
      status TEXT DEFAULT 'active',
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      role TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workout_plans (
      id TEXT PRIMARY KEY,
      trainerId TEXT,
      customerId TEXT,
      customerName TEXT,
      title TEXT,
      description TEXT,
      frequency TEXT,
      difficulty TEXT,
      durationWeeks INTEGER,
      days TEXT,
      status TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS diet_plans (
      id TEXT PRIMARY KEY,
      trainerId TEXT,
      customerId TEXT,
      customerName TEXT,
      title TEXT,
      description TEXT,
      dailyCalorieTarget INTEGER,
      macros TEXT,
      meals TEXT,
      status TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      senderId TEXT,
      senderRole TEXT,
      receiverId TEXT,
      content TEXT,
      timestamp TEXT,
      isRead INTEGER DEFAULT 0,
      attachments TEXT
    );

    CREATE TABLE IF NOT EXISTS payment_transactions (
      id TEXT PRIMARY KEY,
      trainerId TEXT,
      customerId TEXT,
      customerName TEXT,
      customerAvatar TEXT,
      transactionId TEXT,
      amount REAL,
      currency TEXT,
      date TEXT,
      method TEXT,
      status TEXT,
      planName TEXT,
      invoiceNumber TEXT
    );

    CREATE TABLE IF NOT EXISTS system_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT,
      level TEXT,
      service TEXT,
      message TEXT,
      ip TEXT
    );

    CREATE TABLE IF NOT EXISTS store_data (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

initDatabase();

// Auth Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  const user = db.prepare('SELECT id, email, username, fullName, role, avatarUrl, phone, status FROM users WHERE id = ?').get(session.userId);
  if (!user || user.status !== 'active') {
    return res.status(403).json({ error: 'Account disabled or invalid.' });
  }

  req.user = user;
  req.session = session;
  next();
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'xfit Personal Fitness Platform',
    database: 'SQLite 3 (better-sqlite3)',
    dbPath,
    timestamp: new Date().toISOString(),
  });
});

// Auth Registration
app.post('/api/auth/register', (req, res) => {
  const { email, username, password, fullName, role, phone } = req.body;
  if (!email || !username || !password || !fullName) {
    return res.status(400).json({ error: 'Please provide email, username, password, and full name.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email.trim().toLowerCase(), username.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'User with this email or username already exists.' });
  }

  try {
    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const userRole = role === 'trainer' ? 'trainer' : 'customer';
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, username, passwordHash, salt, fullName, role, phone, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
    `).run(id, email.trim().toLowerCase(), username.trim().toLowerCase(), passwordHash, salt, fullName.trim(), userRole, phone || '', createdAt);

    const token = generateToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    db.prepare('INSERT INTO sessions (token, userId, role, expiresAt) VALUES (?, ?, ?, ?)').run(token, id, userRole, expiresAt);

    const userObj = { id, email: email.trim().toLowerCase(), username: username.trim().toLowerCase(), fullName: fullName.trim(), role: userRole, phone: phone || '', avatarUrl: '' };
    res.json({ success: true, token, user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Please enter your username/email and password.' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(identifier.trim().toLowerCase(), identifier.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. No user found.' });
    }

    const inputHash = hashPassword(password, user.salt);
    if (inputHash !== user.passwordHash) {
      return res.status(401).json({ error: 'Invalid password. Please try again.' });
    }

    const token = generateToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    db.prepare('DELETE FROM sessions WHERE userId = ?').run(user.id);
    db.prepare('INSERT INTO sessions (token, userId, role, expiresAt) VALUES (?, ?, ?, ?)').run(token, user.id, user.role, expiresAt);

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl || '',
      phone: user.phone || '',
      status: user.status,
    };

    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth Logout
app.post('/api/auth/logout', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(req.session.token);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth Current Session User
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Key-Value Persistent Store Endpoint
app.get('/api/store/:key', (req, res) => {
  const { key } = req.params;
  try {
    const row = db.prepare('SELECT value FROM store_data WHERE key = ?').get(key);
    if (row && row.value) {
      return res.json(JSON.parse(row.value));
    }
    return res.status(404).json({ error: 'Key not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/store/:key', (req, res) => {
  const { key } = req.params;
  try {
    const valueStr = JSON.stringify(req.body);
    const stmt = db.prepare(`
      INSERT INTO store_data (key, value, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(key, valueStr);
    return res.json({ success: true, key });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Serve Static Frontend
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[xfit Server] Production SQLite Engine running on http://0.0.0.0:${PORT}`);
});

function gracefulShutdown(signal) {
  console.log(`[xfit Server] Received ${signal}, closing SQLite connection...`);
  server.close(() => {
    try {
      db.close();
      console.log('[xfit Server] SQLite database closed safely.');
    } catch (err) {
      console.error('[xfit Server] Error closing SQLite database:', err);
    }
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
