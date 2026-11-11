import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';

// The database is a single local file, created automatically on first run.
mkdirSync('server/data', { recursive: true });
const db = new Database('server/data/solves.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS solves (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    facelets   TEXT    NOT NULL,
    moves      TEXT    NOT NULL,
    move_count INTEGER NOT NULL,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;