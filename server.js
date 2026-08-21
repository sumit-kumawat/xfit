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

// Helper password hashing
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Database Schema Initialization
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      subdomain TEXT UNIQUE,
      businessName TEXT,
      logo TEXT,
      primaryColor TEXT,
      secondaryColor TEXT,
      footerText TEXT,
      status TEXT DEFAULT 'active',
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      tenantId TEXT,
      email TEXT UNIQUE,
      username TEXT UNIQUE,
      passwordHash TEXT,
      salt TEXT,
      fullName TEXT,
      role TEXT,
      avatarUrl TEXT,
      phone TEXT,
      status TEXT DEFAULT 'active',
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      role TEXT NOT NULL,
      tenantId TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS trainers (
      id TEXT PRIMARY KEY,
      tenantId TEXT,
      userId TEXT UNIQUE,
      specialties TEXT,
      bio TEXT,
      experienceYears INTEGER,
      rating REAL,
      clientCount INTEGER,
      monthlyRate INTEGER,
      socialLinks TEXT,
      isCertified INTEGER
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      tenantId TEXT,
      userId TEXT UNIQUE,
      assignedTrainerId TEXT,
      assignedTrainerName TEXT,
      membershipTier TEXT,
      membershipStatus TEXT,
      goals TEXT,
      metrics TEXT
    );

    CREATE TABLE IF NOT EXISTS workout_plans (
      id TEXT PRIMARY KEY,
      tenantId TEXT,
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
      tenantId TEXT,
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
      tenantId TEXT,
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
      tenantId TEXT,
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
      actorRole TEXT,
      actorEmail TEXT,
      action TEXT,
      tenantId TEXT,
      ipAddress TEXT,
      details TEXT
    );

    CREATE TABLE IF NOT EXISTS store_data (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default superadmin if no users exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const adminId = 'user-superadmin';
    const tenantId = 'tenant-enterprise';
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword('SuperAdmin2026!', salt);
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO tenants (id, subdomain, businessName, logo, primaryColor, secondaryColor, footerText, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(tenantId, 'enterprise', 'xfit Enterprise Global', '', '#0071e3', '#86868b', 'Powered by xfit Enterprise Platform', 'active', createdAt);

    db.prepare(`
      INSERT INTO users (id, tenantId, email, username, passwordHash, salt, fullName, role, avatarUrl, phone, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(adminId, tenantId, 'admin@xfit.com', 'superadmin', passwordHash, salt, 'Alexander Vance', 'super_admin', '', '+1 (555) 019-2831', 'active', createdAt);
  }
}

initDatabase();

// Authentication Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access. No session token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) {
      db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    }
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  const user = db.prepare('SELECT id, tenantId, email, username, fullName, role, avatarUrl, phone, status FROM users WHERE id = ?').get(session.userId);
  if (!user || user.status !== 'active') {
    return res.status(403).json({ error: 'Account suspended or invalid.' });
  }

  req.user = user;
  req.session = session;
  next();
}

// AUTH API ENDPOINTS
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Please enter username/email and password.' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(identifier.trim(), identifier.trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const inputHash = hashPassword(password, user.salt);
    if (inputHash !== user.passwordHash) {
      return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
    }

    // Create session token
    const token = generateToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Clean old sessions for user
    db.prepare('DELETE FROM sessions WHERE userId = ?').run(user.id);

    db.prepare(`
      INSERT INTO sessions (token, userId, role, tenantId, expiresAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(token, user.id, user.role, user.tenantId, expiresAt);

    const safeUser = {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      status: user.status,
    };

    res.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(req.session.token);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// DATA PERSISTENCE API (Store & Key-Value)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: 'SQLite 3 (better-sqlite3)',
    dbPath,
    timestamp: new Date().toISOString(),
  });
});

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

// Static Production Files
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[xfit Server] Production SQLite Engine running on http://0.0.0.0:${PORT}`);
});
