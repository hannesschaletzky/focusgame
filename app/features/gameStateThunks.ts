import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { reduceSeconds, setLeaderboard } from "./gameStateSlice";
import { setRound } from "@/app/features/gameStateSlice";
import { showLeaderboard } from "@/app/features/pageSlice";
import { RootState } from "../store";

import { LeaderboardPlayer } from "@/utils/types";

export const thunkStartTimer =
  (): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    //read data from store
    const state = getState();
    const seconds = state.gameState.seconds;

    const ID = setInterval(() => {
      dispatch(reduceSeconds());
    }, 1000);
    setTimeout(() => {
      clearInterval(ID);
      dispatch(finishGame());
    }, seconds * 1000);
  };

export const thunkCheckClick =
  (index: number): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    // read data from store
    const state = getState();
    const round = state.gameState.round;

    // check user selection
    if (state.gameState.boards[round].sol_index == index) {
      dispatch(setRound(round + 1));
    }
  };

export const finishGame =
  (): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    const state = getState();
    const name = state.gameState.name;
    const gameID = state.gameState.id;

    const res = await fetch(`${process.env.NEXT_PUBLIC_DBHOST}/finish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${gameID}&name=${name}`,
    });
    const data = await res.json();
    console.log(data);
    dispatch(getLeaderboard());
  };

export const getLeaderboard =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DBHOST}/leaderboard`, {
      method: "GET",
      //mode: 'no-cors', // no-cors, *cors, same-origin
    });
    const data: LeaderboardPlayer[] = await res.json();
    console.log("Leaderboard received");
    dispatch(setLeaderboard(data as LeaderboardPlayer[]));
    dispatch(showLeaderboard());
  };
