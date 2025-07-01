import React, { createContext, useReducer, useContext } from "react";

const ChessContext = createContext();

const initialState = {
  board: null,           // FEN string
  moves: [],             // SAN/pgn moves
  result: null,          // 'white', 'black', 'draw' or null
  loading: false,        // Is AI thinking?
};

function reducer(state, action) {
  switch (action.type) {
    case "RESET_GAME":
      return { ...initialState, board: action.fen || null };
    case "SET_BOARD":
      return { ...state, board: action.fen };
    case "ADD_MOVE":
      return { ...state, moves: [...state.moves, action.move], board: action.fen };
    case "SET_RESULT":
      return { ...state, result: action.result };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function ChessProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ChessContext.Provider value={{ state, dispatch }}>
      {children}
    </ChessContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useChess() {
  return useContext(ChessContext);
}
