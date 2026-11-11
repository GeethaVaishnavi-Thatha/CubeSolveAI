// Small helpers for the backend API. In development Vite proxies /api to the server.

async function request(path, options) {
  const res = await fetch(path, options);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

export const saveSolve = (facelets, moves) =>
  request('/api/solves', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ facelets, moves }),
  });

export const listSolves = () => request('/api/solves');

export const deleteSolve = (id) => request(`/api/solves/${id}`, { method: 'DELETE' });