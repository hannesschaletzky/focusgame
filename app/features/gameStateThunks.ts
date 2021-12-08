import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { reduceSeconds, setSeconds } from './gameStateSlice'
import { addPoint, setBoard } from "@/app/features/gameStateSlice";
import { next } from '@/app/features/pageSlice'
import { RootState } from '../store'

// finish game
const finishGame = async (gameID:number, name:string) => {
  const res = await fetch(
    `http://${process.env.NEXT_PUBLIC_DBHOST}/focus/finish`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${gameID}&name=${name}`,
    }
  );
  const data = await res.json();
  console.log(data);
}

export const thunkStartTimer = (): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {

    //read data from store
    const state = getState()
    const name = state.gameState.name
    const gameID = state.gameState.id
    const seconds = state.gameState.seconds

    const ID = setInterval(() => {
      dispatch(reduceSeconds())
    }, 1000)
    setTimeout(() => {
      clearInterval(ID)
      finishGame(gameID, name)
      //dispatch(setSeconds(0)) //hard-set to zero, bc. sometimes it stops at 1
      dispatch(next())
    }, seconds*1000)
  }

export const thunkCheckClick = (index:number): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    //read data from store
    const state = getState()
    const gameID = state.gameState.id

    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DBHOST}/focus/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${gameID}&index=${index}`,
      }
    );
    const data = await res.json();
    console.log(data);
    
    //stop when user retrieved false
    if (!data) return; 

    // tried making it a new one bc. comparing ref etc..
    const newArr:string[] = Array.from(data as string[])

    dispatch(addPoint());
    dispatch(setBoard(newArr));
  }