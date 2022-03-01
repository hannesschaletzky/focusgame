import { Item } from "@/styles/UI_Elements";
import { useAppSelector, useAppDispatch } from "@/app/hooks";

import { Points, Seconds } from "@/styles/UI_Elements";

import { thunkCheckClick } from "@/app/features/gameStateThunks";

const Game: React.FC = () => {
  const dispatch = useAppDispatch();

  const round = useAppSelector((state) => state.gameState.round);
  const seconds = useAppSelector((state) => state.gameState.seconds);
  const board = useAppSelector((state) => state.gameState.boards[round]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-wrap">
      <Points>{round}</Points>
      {board.board.map((color, i) => (
        <Item
          color={color}
          height={"100% / 20"}
          onClick={() => dispatch(thunkCheckClick(i))}
          key={i}
        />
      ))}
      <Seconds>{seconds}</Seconds>
    </div>
  );
};

export default Game;
