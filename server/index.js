import express from 'express';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '10kb' }));

const FACELETS = /^[URFDLB]{54}$/;
const MOVE = /^[URFDLB][2']?$/;

const toSolve = (row) => ({
  id: row.id,
  facelets: row.facelets,
  moves: JSON.parse(row.moves),
  moveCount: row.move_count,
  createdAt: row.created_at,
});

// Save a solve.
app.post('/api/solves', (req, res) => {
  const { facelets, moves } = req.body ?? {};
  const valid =
    typeof facelets === 'string' &&
    FACELETS.test(facelets) &&
    Array.isArray(moves) &&
    moves.length <= 100 &&
    moves.every((m) => typeof m === 'string' && MOVE.test(m));
  if (!valid) return res.status(400).json({ error: 'Invalid solve data.' });

  const info = db
    .prepare('INSERT INTO solves (facelets, moves, move_count) VALUES (?, ?, ?)')
    .run(facelets, JSON.stringify(moves), moves.length);
  const row = db.prepare('SELECT * FROM solves WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(toSolve(row));
});

// List the 50 most recent solves.
app.get('/api/solves', (_req, res) => {
  const rows = db.prepare('SELECT * FROM solves ORDER BY id DESC LIMIT 50').all();
  res.json(rows.map(toSolve));
});

// Delete one solve.
app.delete('/api/solves/:id', (req, res) => {
  const info = db.prepare('DELETE FROM solves WHERE id = ?').run(Number(req.params.id));
  if (info.changes === 0) return res.status(404).json({ error: 'Solve not found.' });
  res.status(204).end();
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`API running at http://127.0.0.1:${PORT}`);
});