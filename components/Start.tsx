import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { next, showLeaderboard } from "@/app/features/pageSlice";
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
    <div className="fixed top-0 left-0 bottom-0 right-0 flex flex-col justify-center items-center flex-wrap">
      {/* GitHub Icon */}
      <a
        href="https://github.com/hannesschaletzky/focusgame"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="fixed top-5 right-5">
          <Image src="/github.png" alt="GitHub" width={40} height={40} />
        </div>
      </a>

      {/* Content */}
      <div>Click as many {color} squares as you can...</div>
      <div>They look like this:</div>
      <Item color={color} height={"100% / 20"} />
      <br />
      {name.length == 0 && <div>Enter a name to start</div>}
      <Input
        type="text"
        maxLength={12}
        value={name}
        onChange={(e) => inputChanged(e.target.value.trim())}
      />
      <br />
      {name.length > 0 && (
        <StartButton onClick={() => start()}>Start</StartButton>
      )}
      <br />

      {/* Footer */}
      <em
        className="fixed bottom-4"
        onClick={() => dispatch(showLeaderboard())}
      >
        Leaderboard
      </em>
    </div>
  );
}

export default Start;
