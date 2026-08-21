import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure DB directory exists
const dbDir = path.join(__dirname, 'db_data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'xfit.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize SQLite Schema
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS store_data (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      subdomain TEXT,
      businessName TEXT,
      logo TEXT,
      primaryColor TEXT,
      secondaryColor TEXT,
      footerText TEXT,
      status TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      tenantId TEXT,
      email TEXT,
      fullName TEXT,
      role TEXT,
      avatar TEXT,
      phone TEXT,
      status TEXT,
      joinedDate TEXT
    );

    CREATE TABLE IF NOT EXISTS trainers (
      id TEXT PRIMARY KEY,
      tenantId TEXT,
      userId TEXT,
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
      userId TEXT,
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
      isRead INTEGER,
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

    CREATE TABLE IF NOT EXISTS platform_settings (
      id TEXT PRIMARY KEY,
      applicationName TEXT,
      baseUrl TEXT,
      platformCurrency TEXT,
      maintenanceMode INTEGER,
      allowNewRegistrations INTEGER,
      enforce2FA INTEGER,
      sessionTimeoutMinutes INTEGER,
      smtpHost TEXT,
      smtpPort INTEGER,
      smtpUser TEXT,
      smtpSecure INTEGER,
      dbStatus TEXT
    );
  `);
}

initDatabase();

// Generic Store API for seamless hydration & updates
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

// Dedicated Entity API Endpoints
app.get('/api/users', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM users').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, tenantId, email, fullName, role, avatar, phone, status, joinedDate)
      VALUES (@id, @tenantId, @email, @fullName, @role, @avatar, @phone, @status, @joinedDate)
      ON CONFLICT(id) DO UPDATE SET
        tenantId=excluded.tenantId, email=excluded.email, fullName=excluded.fullName,
        role=excluded.role, avatar=excluded.avatar, phone=excluded.phone, status=excluded.status
    `);
    stmt.run(user);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend files if production build exists
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
  console.log(`[xfit Server] SQLite Backend & App running on http://0.0.0.0:${PORT}`);
});
