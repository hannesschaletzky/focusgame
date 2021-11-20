import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GameState {
  points: number;
  board: JSX.Element[];
  seconds: number;
}
const initialState: GameState = {
  points: 0,
  board: [],
  seconds: 5
}

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    reduceSecond: (state) => {
      console.log("REDUCED")
      state.seconds -= 1
    },
    addPoint: (state) => {
      state.points += 1
    },
    setBoard: (state, action: PayloadAction<JSX.Element[]>) => {
      state.board = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { addPoint, setBoard, reduceSecond } = gameStateSlice.actions

export default gameStateSlice.reducer