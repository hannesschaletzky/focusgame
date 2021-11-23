import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { reduceSeconds, setSeconds } from './gameStateSlice'
import { next } from '@/app/features/pageSlice'
import { RootState } from '../store'

export const thunkStartTimer = (seconds:number): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    // const asyncResp = await exampleAPI()
    // dispatch(reduceSecond())
    const ID = setInterval(() => {
      dispatch(reduceSeconds())
    }, 1000)
    setTimeout(() => {
      clearInterval(ID)
      //dispatch(setSeconds(0)) //hard-set to zero, bc. sometimes it stops at 1
      dispatch(next())
    }, seconds*1000)
  }

// function exampleAPI() {
//   return Promise.resolve('Async Chat Bot')
// }