const API_BASE = process.env.REACT_APP_BACKEND_API || '/api'; // You may adjust as needed

// PUBLIC_INTERFACE
export async function fetchAIMove(fen, difficulty = 1) {
  /** Fetches AI move for a FEN board state from the backend */
  const res = await fetch(`${API_BASE}/ai/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fen, difficulty }),
  });
  if (!res.ok) throw new Error('Failed to get AI move');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function submitGameResult({ user_id, moves, winner }) {
  /** Submits the game result to backend for storing in history */
  const res = await fetch(`${API_BASE}/game/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, moves, winner }),
  });
  if (!res.ok) throw new Error('Failed to submit game result');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function fetchGameHistory(user_id) {
  /** Fetch past games for a user */
  const res = await fetch(`${API_BASE}/game/history?user_id=${encodeURIComponent(user_id)}`);
  if (!res.ok) throw new Error('Failed to fetch game history');
  return await res.json();
}
