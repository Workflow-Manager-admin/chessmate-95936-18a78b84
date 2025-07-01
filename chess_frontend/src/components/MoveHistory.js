import React from "react";

// PUBLIC_INTERFACE
export default function MoveHistory({ moves }) {
  return (
    <div className="move-history-panel">
      <h3>Moves</h3>
      {moves.length === 0 && <div className="muted">No moves yet</div>}
      <ol>
        {moves.map((move, idx) => (
          <li key={idx}>
            <span>{move}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
