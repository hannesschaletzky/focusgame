import Start from "@/components/Start";
import Game from "@/components/Game";
import Score from "@/components/Score";

import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { Points, Seconds } from "@/styles/UI_Elements";
import { setID, setColor, setBoard } from "@/app/features/gameStateSlice";
import { InitData } from "@/pages/index";

import { useEffect } from "react";

const App: React.FC<InitData> = (props: InitData) => {
  //set inital store data
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setID(props.id));
    dispatch(setColor(props.color));
    dispatch(setBoard(props.board));
  });

  //read game data
  const index = useAppSelector((state) => state.page.index);
  const points = useAppSelector((state) => state.gameState.points);
  const seconds = useAppSelector((state) => state.gameState.seconds);

  //determine content based on state
  let content: JSX.Element = <div></div>;
  switch (index) {
    case 0:
      content = <Start />;
      break;
    case 1:
      content = (
        <>
          <Points>{points}</Points>
          <Game />
          <Seconds>{seconds}</Seconds>
        </>
      );
      break;
    case 2:
      content = <Score />;
      break;
  }

  return <>{content}</>;
};

export default App;
