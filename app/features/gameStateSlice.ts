import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getRandomColor } from "@/app/colors"

interface GameState {
  points: number;
  board: JSX.Element[];
  seconds: number;
  color: string;
}
const initialState: GameState = {
  points: 0,
  board: [],
  seconds: 5,
  color: "" //set by client
}

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
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
    setBoard: (state, action: PayloadAction<JSX.Element[]>) => {
      state.board = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { addPoint, setBoard, reduceSeconds, setSeconds, setColor } = gameStateSlice.actions

export default gameStateSlice.reducer