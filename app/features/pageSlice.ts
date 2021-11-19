import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// define type
interface PageState {
  index: number
}
// define inital
const initialState: PageState = {
  index: 0,
}

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    reset: (state) => {
      state.index = 1
    },
    next: (state) => {
      state.index += 1
    }
  },
})

// Action creators are generated for each case reducer function
export const { reset, next } = pageSlice.actions

export default pageSlice.reducer