import React, { useMemo } from "react";
import { useChess } from "../ChessContext";
import { Chess } from "chess.js";

const pieceUnicode = {
  k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F",
  K: "\u2654", Q: "\u2655", R: "\u2656", B: "\u2657", N: "\u2658", P: "\u2659"
};

// Get a 2D array of pieces from FEN string.
function parseBoard(fen) {
  const rows = fen.split(" ")[0].split("/");
  return rows.map(row =>
    Array.from(row).reduce((out, s) => {
      if (!isNaN(parseInt(s))) return out.concat(Array(Number(s)).fill(null));
      return out.concat([s]);
    }, [])
  );
}

// PUBLIC_INTERFACE
export default function ChessBoard({ chess, selected, setSelected, onMove, isBoardFlipped }) {
  // chess: Chess instance
  // selected: {from: square} | null

  const fen = chess.fen();
  const boardArray = useMemo(() => parseBoard(fen), [fen]);
  const legalMoves = useMemo(() => {
    if (!selected) return [];
    return chess.moves({ square: selected, verbose: true });
  }, [chess, selected]);
  
  function handleSquareClick(row, col) {
    const square = String.fromCharCode(97 + col) + (8 - row);
    if (selected) {
      // Is this a legal target?
      const moves = chess.moves({ square: selected, verbose: true });
      const move = moves.find(m => m.to === square);
      if (move) {
        onMove(selected, square);
        setSelected(null);
        return;
      }
    }
    // Select piece if it's current player's and not empty
    if (boardArray[row][col] && (
      (chess.turn() === "w" && /[KQRNBP]/.test(boardArray[row][col])) ||
      (chess.turn() === "b" && /[kqrbnp]/.test(boardArray[row][col]))
    )) {
      setSelected(square);
    } else {
      setSelected(null);
    }
  }

  return (
    <div className="chessboard">
      {(isBoardFlipped ? [...Array(8).keys()] : [...Array(8).keys()].reverse()).map(r =>
        <div key={r} className="chessboard-row">
          {(isBoardFlipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()]).map(c => {
            const square = String.fromCharCode(97 + c) + (8 - r);
            const isSelected = selected === square;
            const isLegal = legalMoves.some(m => m.to === square);
            const piece = boardArray[r][c];
            return (
              <div
                key={`${r}-${c}`}
                className={
                  "chessboard-cell" +
                  (isSelected ? " cell-selected" : "") +
                  (isLegal ? " cell-legal" : "") +
                  (((r + c) % 2 === 0) ? " cell-light" : " cell-dark")
                }
                onClick={() => handleSquareClick(r, c)}
              >
                {piece ? <span className="chess-piece">{pieceUnicode[piece]}</span> : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
