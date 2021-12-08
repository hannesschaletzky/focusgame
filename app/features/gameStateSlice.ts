import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LeaderboardPlayer } from '@/types/games';

interface GameState {
  id: number;
  name: string;
  points: number;
  board: string[];
  seconds: number;
  color: string;
  leaderboard: LeaderboardPlayer[];
}
const initialState: GameState = {
  id: 0,
  name: "",
  points: 0,
  board: [],
  seconds: 3,
  color: "", //set in SSR
  leaderboard: []
}

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    setID: (state, action: PayloadAction<number>) => {
      state.id = action.payload
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    },
    setSeconds: (state, action: PayloadAction<number>) => {
      state.seconds = action.payload
    },
    reduceSeconds: (state) => {
      state.seconds -= 1
    },
    addPoint: (state) => {
      state.points += 1
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload
    },
    setBoard: (state, action: PayloadAction<string[]>) => {
      state.board = action.payload
    },
    setLeaderboard: (state, action: PayloadAction<LeaderboardPlayer[]>) => {
      state.leaderboard = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setID, setName, addPoint, setBoard, reduceSeconds, setSeconds, setColor, setLeaderboard } = gameStateSlice.actions

export default gameStateSlice.reducer