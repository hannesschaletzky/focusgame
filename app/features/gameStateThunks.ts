import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { reduceSecond } from './gameStateSlice'
import { RootState } from '../store'

export const thunkTimer = (): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    const asyncResp = await exampleAPI()
    dispatch(reduceSecond())
  }

function exampleAPI() {
  return Promise.resolve('Async Chat Bot')
}