import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LeaderboardPlayer, Board } from "@/utils/types";

interface GameState {
  id: number;
  name: string;
  round: number;
  boards: Board[];
  seconds: number;
  color: string;
  leaderboard: LeaderboardPlayer[];
}
// color & board set in SSR
const initialState: GameState = {
  id: 0,
  name: "",
  round: 0,
  boards: [],
  seconds: 2,
  color: "",
  leaderboard: [],
};

export const gameStateSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    setID: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    reduceSeconds: (state) => {
      state.seconds -= 1;
    },
    setRound: (state, action: PayloadAction<number>) => {
      state.round = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    setLeaderboard: (state, action: PayloadAction<LeaderboardPlayer[]>) => {
      state.leaderboard = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setID,
  setName,
  setRound,
  setBoards,
  reduceSeconds,
  setColor,
  setLeaderboard,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
