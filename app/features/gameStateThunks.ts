import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { reduceSeconds, setLeaderboard } from "./gameStateSlice";
import { setRound } from "@/app/features/gameStateSlice";
import { showLeaderboard, next } from "@/app/features/pageSlice";
import { RootState } from "../store";
import CryptoJS from "crypto-js";

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
      dispatch(next());
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
    const rounds = state.gameState.round;

    // encrypt rounds
    const passphrase = process.env.NEXT_PUBLIC_PASSPHRASE!;
    let cipherRounds = "";
    try {
      cipherRounds = CryptoJS.AES.encrypt(
        rounds.toString(),
        passphrase
      ).toString();
    } catch (err) {
      console.log("could not encrpt: " + err);
      throw err;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_DBHOST}/finish`, {
      method: "POST",
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${gameID}&name=${name}&rounds=${encodeURIComponent(
        cipherRounds
      )}`,
    });
    const data = await res.json();
    console.log(data);
    dispatch(getLeaderboard());
  };

export const getLeaderboard =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DBHOST}/leaderboard`, {
      method: "GET",
    });
    const data: LeaderboardPlayer[] = await res.json();
    console.log("Leaderboard received");
    dispatch(setLeaderboard(data as LeaderboardPlayer[]));
    // show loading gif for a bit :)
    setTimeout(() => dispatch(showLeaderboard()), 1000);
    //dispatch(showLeaderboard());
  };
