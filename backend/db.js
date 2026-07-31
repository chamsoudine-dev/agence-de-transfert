const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "ricardo.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// --- Schéma de la base de données ---
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT '+227',
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  account_number TEXT NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'CFA',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_wallet_id INTEGER,
  receiver_wallet_id INTEGER,
  type TEXT NOT NULL CHECK (type IN ('send','account_transfer','self','received','deposit')),
  amount INTEGER NOT NULL,
  fee INTEGER NOT NULL DEFAULT 0,
  reason TEXT,
  receiver_phone TEXT,
  receiver_name TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (sender_wallet_id) REFERENCES wallets(id),
  FOREIGN KEY (receiver_wallet_id) REFERENCES wallets(id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_user_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  phone TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT '+227',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);
`);

module.exports = db;
