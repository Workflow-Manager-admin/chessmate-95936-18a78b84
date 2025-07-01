import React, { useState, useEffect } from "react";
import { fetchGameHistory } from "../api";

// PUBLIC_INTERFACE
export default function GameHistory({ user }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchGameHistory(user.id)
      .then(data => setGames(data.games ?? []))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="game-history-panel">
      <h3>Game History</h3>
      {loading ? <div className="muted">Loading...</div>
      : games.length === 0 ? <div className="muted">No games played yet</div>
      : (
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Result</th><th>Moves</th>
            </tr>
          </thead>
          <tbody>
            {games.map(g => (
              <tr key={g.id}>
                <td>{(new Date(g.created_at)).toLocaleDateString()}</td>
                <td>{g.winner ? `${g.winner.charAt(0).toUpperCase() + g.winner.slice(1)}` : '-'}</td>
                <td>{Array.isArray(g.moves) ? g.moves.length : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
