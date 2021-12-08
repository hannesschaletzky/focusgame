import { Item } from "@/styles/UI_Elements";
import { useAppSelector, useAppDispatch } from "@/app/hooks";

import { Points, Seconds } from "@/styles/UI_Elements";

import { thunkCheckClick } from "@/app/features/gameStateThunks";

interface GameProps {
  board: string[];
}

const Game: React.FC = () => {
  const dispatch = useAppDispatch();

  const points = useAppSelector((state) => state.gameState.points);
  const seconds = useAppSelector((state) => state.gameState.seconds);
  const board = useAppSelector((state) => state.gameState.board);

  return (
    <div className="flex flex-row justify-center items-center flex-wrap w-screen h-screen">
      <Points>{points}</Points>
      {board.map((color, i) => (
        <Item
          color={color}
          onClick={() => dispatch(thunkCheckClick(i))}
          key={i}
        />
      ))}
      <Seconds>{seconds}</Seconds>
    </div>
  );
};

export default Game;
