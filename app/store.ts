import { configureStore } from '@reduxjs/toolkit'
//import counterSlice from './features/counterSlice'
import pageSlice from './features/pageSlice'
import gameStateSlice from './features/gameStateSlice'

export const store = configureStore({
  reducer: {
    //counter: counterSlice,
    page: pageSlice,
    gameState: gameStateSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch