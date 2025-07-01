import React, { useState } from "react";
import "./App.css";
import "./custom.css";
import { ChessProvider, useChess } from "./ChessContext";
import { AuthProvider, useAuth } from "./AuthContext";
import AuthForm from "./components/AuthForm";
import ChessBoard from "./components/ChessBoard";
import MoveHistory from "./components/MoveHistory";
import GameHistory from "./components/GameHistory";
import ProfilePanel from "./components/ProfilePanel";
import { fetchAIMove, submitGameResult } from "./api";
import { Chess } from "chess.js";

// PUBLIC_INTERFACE
function ChessGameUI() {
  const { state, dispatch } = useChess();
  const { user } = useAuth();
  const [chess, setChess] = useState(() => new Chess());
  const [selected, setSelected] = useState(null);
  const [aiThinking, setAIThinking] = useState(false);

  // Start or reset game
  React.useEffect(() => {
    dispatch({ type: "RESET_GAME", fen: chess.fen() });
    setSelected(null);
  }, []);

  // When moves change, update board and check result
  React.useEffect(() => {
    setChess(new Chess(state.board || undefined));
    // Check for game end
    if (chess.isGameOver()) {
      let result = "draw";
      if (chess.isCheckmate()) result = chess.turn() === "w" ? "black" : "white";
      dispatch({ type: "SET_RESULT", result });
    }
    // eslint-disable-next-line
  }, [state.board]);

  // On player's move, send FEN to backend for AI reply
  const handleMove = async (from, to) => {
    if (aiThinking || state.result) return; // game ended or thinking
    const chessCopy = new Chess(state.board || undefined);
    const move = chessCopy.move({ from, to, promotion: "q" });
    if (!move) return;
    dispatch({ type: "ADD_MOVE", move: move.san, fen: chessCopy.fen() });

    // If not over, call backend for AI move
    if (!chessCopy.isGameOver()) {
      setAIThinking(true);
      dispatch({ type: "SET_LOADING", loading: true });
      try {
        const aiRes = await fetchAIMove(chessCopy.fen());
        if (aiRes.move) {
          chessCopy.move(aiRes.move);
          dispatch({ type: "ADD_MOVE", move: aiRes.move, fen: chessCopy.fen() });
          // Recheck if now ended
          if (chessCopy.isGameOver()) {
            let result = "draw";
            if (chessCopy.isCheckmate()) result = chessCopy.turn() === "w" ? "black" : "white";
            dispatch({ type: "SET_RESULT", result });
            // Save result
            if (user) {
              await submitGameResult({
                user_id: user.id,
                moves: state.moves.concat([aiRes.move]),
                winner: result
              });
            }
          }
        }
      } catch (e) {
        alert("AI server error.");
      }
      setAIThinking(false);
      dispatch({ type: "SET_LOADING", loading: false });
    } else {
      // Save result if needed
      let result = "draw";
      if (chessCopy.isCheckmate()) result = chessCopy.turn() === "w" ? "black" : "white";
      if (user) {
        await submitGameResult({
          user_id: user.id, moves: state.moves.concat([move.san]), winner: result
        });
      }
    }
  };

  const handleRestart = () => {
    dispatch({ type: "RESET_GAME", fen: undefined });
    setChess(new Chess());
    setSelected(null);
  };

  return (
    <div className="main-content-wrap">
      <div className="side-panel">
        <ProfilePanel />
        <GameHistory user={user} />
      </div>
      <div className="chessboard-container">
        <ChessBoard
          chess={chess}
          selected={selected}
          setSelected={setSelected}
          onMove={handleMove}
          isBoardFlipped={false}
        />
        <div>
          <button className="btn" onClick={handleRestart}>Restart Game</button>
          {aiThinking && <span className="muted" style={{marginLeft: 16}}>AI is thinking...</span>}
        </div>
        <div>
          {state.result && <p>
            <b>Game Result:</b> <span style={{color: "#52ad31"}}>{state.result === "draw" ? "Draw" : `Winner: ${state.result}`}</span>
          </p>}
        </div>
        <MoveHistory moves={state.moves} />
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ChessApp() {
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState("light");

  // Apply theme (not style-related, just demo per template)
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  if (loading) return <div className="App">Loading...</div>;
  return (
    <div className="App">
      <nav className="app-navbar">
        <div className="nav-left">
          <span className="brand">♟ ChessMate</span>
        </div>
        <div>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            style={{
              background: "var(--accent)",
              color: "#1a1a1a"
            }}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </nav>
      {user ? <ChessProvider><ChessGameUI /></ChessProvider> : <AuthForm />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ChessApp />
    </AuthProvider>
  );
}
