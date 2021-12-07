import { Item } from "@/styles/UI_Elements";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { addPoint, setBoard } from "@/app/features/gameStateSlice";

import { thunkCheckClick } from "@/app/features/gameStateThunks";

interface GameProps {
  board: string[];
}

const Game: React.FC<GameProps> = (props: GameProps) => {
  const dispatch = useAppDispatch();
  //const board = useAppSelector((state) => state.gameState.board);
  const id = useAppSelector((state) => state.gameState.id);

  // const check = async (index: number) => {
  //   // see: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  //   const res = await fetch(
  //     `http://${process.env.NEXT_PUBLIC_DBHOST}/focus/check`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: `id=${id}&index=${index}`,
  //     }
  //   );
  //   const data = await res.json();
  //   console.log(data);

  //   if (!data) {
  //     return;
  //   }

  //   dispatch(addPoint());
  //   dispatch(setBoard(data));
  // };

  return (
    <div className="flex flex-row justify-center items-center flex-wrap w-screen h-screen">
      {props.board.map((color, i) => (
        <Item
          color={color}
          onClick={() => dispatch(thunkCheckClick(id, i))}
          key={i}
        />
      ))}
    </div>
  );
};

export default Game;
