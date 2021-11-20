import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { reduceSecond } from './gameStateSlice'
import { RootState } from '../store'

export const thunkTimer = (): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    // const asyncResp = await exampleAPI()
    // dispatch(reduceSecond())
    const ID = setInterval(() => {
      dispatch(reduceSecond())
    }, 1000)
    setTimeout(() => {
      clearInterval(ID)
    }, 5000)
  }

// function exampleAPI() {
//   return Promise.resolve('Async Chat Bot')
// }