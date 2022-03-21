import Start from "@/components/Start";
import Game from "@/components/Game";
import Score from "@/components/Score";
import Calculating from "@/components/Calculating";

import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { setID, setColor, setBoards } from "@/app/features/gameStateSlice";
import { InitialState } from "@/utils/types";

import { useEffect } from "react";

const App: React.FC<InitialState> = (props: InitialState) => {
  //set inital store data
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setID(props.id));
    dispatch(setColor(props.color));
    dispatch(setBoards(props.boards));
  });

  //read game data from store
  const index = useAppSelector((state) => state.page.index);

  //determine content based on state
  let content: JSX.Element = <div></div>;

  // refresh page until server is booted
  if (props.booting) {
    setTimeout(() => location.reload(), 2000);
    return (
      <div>
        Server is booting, site reloads automatically until server is up!
      </div>
    );
  }

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
