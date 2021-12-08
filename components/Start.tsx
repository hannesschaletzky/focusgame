import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { next } from "@/app/features/pageSlice";
import { useEffect } from "react";
import { thunkStartTimer } from "@/app/features/gameStateThunks";
import { Input, Item, StartButton } from "@/styles/UI_Elements";
import { setName } from "@/app/features/gameStateSlice";

function Start() {
  const dispatch = useAppDispatch();
  const color = useAppSelector((state) => state.gameState.color);
  const name = useAppSelector((state) => state.gameState.name);

  // check saved name from local storage
  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      dispatch(setName(name));
    }
  });

  const inputChanged = (name: string) => {
    localStorage.setItem("name", name);
    dispatch(setName(name));
  };

  const start = () => {
    dispatch(next());
    dispatch(thunkStartTimer());
  };

  return (
    <div className="flex flex-col justify-center items-center flex-wrap w-screen h-screen">
      <div>Click as many {color} squares as you can...</div>
      <div>They look like this:</div>
      <Item color={color} />
      <br />
      {name.length == 0 && <div>Enter a name to start</div>}
      <Input
        type="text"
        value={name}
        placeholder="..."
        onChange={(e) => inputChanged(e.target.value.trim())}
      />
      <br />
      {name.length > 0 && (
        <StartButton onClick={() => start()}>Start</StartButton>
      )}
    </div>
  );
}

export default Start;
