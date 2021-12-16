import Start from "@/components/Start";
import Game from "@/components/Game";
import Score from "@/components/Score";

import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  setID,
  setColor,
  setBoard,
  setLeaderboard,
} from "@/app/features/gameStateSlice";
import { SSR_Data } from "@/pages/index";

import { useEffect } from "react";

const App: React.FC<SSR_Data> = (props: SSR_Data) => {
  //set inital store data
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setID(props.init.id));
    dispatch(setColor(props.init.color));
    dispatch(setBoard(props.init.board));
    dispatch(setLeaderboard(props.leaderboard));
  });

  //read game data from store
  const index = useAppSelector((state) => state.page.index);

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
      content = <Score />;
      break;
  }

  return <>{content}</>;
};

export default App;
