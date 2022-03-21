import Start from "@/components/Start";
import Game from "@/components/Game";
import Score from "@/components/Score";
import Calculating from "@/components/Calculating";
import Script from "next/script";

import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { setID, setColor, setBoards } from "@/app/features/gameStateSlice";
import { Board, InitialState } from "@/utils/types";

import { useEffect } from "react";
import { constructBoard } from "@/utils/board";

const App: React.FC<InitialState> = (props: InitialState) => {
  const dispatch = useAppDispatch();
  //read game data from store
  const index = useAppSelector((state) => state.page.index);

  // set inital store data
  useEffect(() => {
    dispatch(setID(props.id));
    dispatch(setColor(props.color));
    // construct board
    let boards: Board[] = [];
    while (boards.length < 100) {
      boards.push(constructBoard(props.color));
    }
    dispatch(setBoards(boards));
  }, [dispatch, props.color, props.id]);

  // refresh page until server is booted
  if (props.booting) {
    return (
      <div>
        Server is booting, site reloads automatically! Grab yourself a 🍺, it
        will take less than 10 seconds.
        <Script src="reload.js" />
      </div>
    );
  }

  //determine content based on state
  let content: JSX.Element = <div></div>;

  switch (index) {
    case 0:
      content = <Start />;
      break;
    case 1:
      content = <Game />;
      break;
    case 2:
      content = <Calculating />;
      break;
    case 3:
      content = <Score />;
      break;
  }

  return <>{content}</>;
};

export default App;
