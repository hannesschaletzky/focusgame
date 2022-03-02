import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// define type
interface PageState {
  index: number;
}
// define inital
const initialState: PageState = {
  index: 0,
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    next: (state) => {
      state.index += 1;
    },
    showLeaderboard: (state) => {
      state.index = 3;
    },
  },
});

// Action creators are generated for each case reducer function
export const { next, showLeaderboard } = pageSlice.actions;

export default pageSlice.reducer;
