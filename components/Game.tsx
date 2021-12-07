import { Item } from "@/styles/UI_Elements";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { addPoint, setBoard } from "@/app/features/gameStateSlice";

const Game = () => {
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.gameState.board);
  const id = useAppSelector((state) => state.gameState.id);

  //167.99.135.251

  const check = async (index: number) => {
    console.log(process.env);

    // see: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DBHOST}/focus/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${id}&index=${index}`,
      }
    );
    const data = await res.json();
    console.log(data);

    if (!data) {
      return;
    }

    dispatch(addPoint());
    dispatch(setBoard(data));
  };

  return (
    <div className="flex flex-row justify-center items-center flex-wrap w-screen h-screen">
      {board.map((color, i) => (
        <Item color={color} onClick={() => check(i)} key={i}></Item>
      ))}
    </div>
  );
};

export default Game;
