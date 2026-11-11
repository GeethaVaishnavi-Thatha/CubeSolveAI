
import { useEffect, useState } from 'react';
import { listSolves, deleteSolve } from '../lib/api.js';

export default function History() {
  const [solves, setSolves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadHistory() {
    try {
      setError('');
      const data = await listSolves();
      setSolves(data);
    } catch {
      setError('Unable to load history. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this solve?')) return;
    try {
      await deleteSolve(id);
      setSolves((old) => old.filter((solve) => solve.id !== id));
    } catch {
      setError('Unable to delete this solve.');
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return <p className="py-12 text-center">Loading history...</p>;
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Solve History</h1>
          <p className="mt-1 text-sm text-slate-600">
            Your recently solved cubes.
          </p>
        </div>
        <button
          onClick={loadHistory}
          className="rounded-lg border px-4 py-2 hover:bg-slate-100"
        >
          Refresh
        </button>
      </header>

      {error && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {solves.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <h2 className="text-lg font-semibold">No solve history yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Solve a Rubik's Cube to see your history here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {solves.map((solve) => (
            <div
              key={solve.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">
                  Solve #{solve.id}
                </h2>
                <p className="text-sm text-slate-600">
                  {solve.moveCount} moves
                </p>
                <p className="mt-1 break-all font-mono text-xs text-slate-400">
                  {solve.moves.join(' ')}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(
                    solve.createdAt.replace(' ', 'T') + 'Z'
                  ).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(solve.id)}
                className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
