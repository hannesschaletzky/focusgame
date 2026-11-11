import Image from "next/image";
import { useEffect } from "react";
import { Cell, Input, StartButton } from "@/styles/UI_Elements";
import { NAME_MAX_LENGTH } from "@/utils/constants";

interface Props {
  color: string;
  name: string;
  onName: (name: string) => void;
  onStart: () => void;
  onLeaderboard: () => void;
  starting: boolean;
  error: string;
}

const STORAGE_KEY = "name";

const Start = ({ color, name, onName, onStart, onLeaderboard, starting, error }: Props) => {
  // Gespeicherten Namen einmalig übernehmen
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) onName(saved);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeName = (value: string) => {
    const trimmed = value.trim();
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {}
    onName(trimmed);
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center gap-2 p-4 text-center">
      <a
        href="https://github.com/hannesschaletzky/focusgame"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-5 right-5"
      >
        <Image src="/github.png" alt="GitHub" width={40} height={40} />
      </a>

      <div>Click as many {color} squares as you can...</div>
      <div>They look like this:</div>
      {/* So groß wie ein Feld im Spiel */}
      <Cell $color={color} style={{ width: "20vw", height: "5vh" }} />
      <br />
      {name.length === 0 && <div>Enter a name to start</div>}
      <Input
        type="text"
        maxLength={NAME_MAX_LENGTH}
        value={name}
        aria-label="Name"
        onChange={(e) => changeName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && name && !starting && onStart()}
      />
      <br />
      {name.length > 0 && (
        <StartButton onClick={onStart} disabled={starting}>
          {starting ? "..." : "Start"}
        </StartButton>
      )}
      {error && <div className="text-red-600">{error}</div>}

      <button className="fixed bottom-4 italic cursor-pointer" onClick={onLeaderboard}>
        Leaderboard
      </button>
    </div>
  );
};

export default Start;
