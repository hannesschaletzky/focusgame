import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SetBoardPayload {
  board: JSX.Element[];
  solution: number;
}
interface GameState {
  points: number;
  board: JSX.Element[];
  solution: number;
}
const initialState: GameState = {
  points: 0,
  board: [],
  solution: -1
}

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    addPoint: (state) => {
      state.points += 1
    },
    setBoard: (state, action: PayloadAction<SetBoardPayload>) => {
      state.board = action.payload.board
      state.solution = action.payload.solution
    },
    setSolution: (state, action: PayloadAction<number>) => {
      state.solution = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addPoint, setBoard, setSolution } = gameStateSlice.actions

export default gameStateSlice.reducer