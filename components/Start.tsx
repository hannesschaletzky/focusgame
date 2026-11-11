import Image from "next/image";
import { useEffect } from "react";
import { StartButton } from "@/styles/UI_Elements";
import { COLORS, GAME_SECONDS, NAME_MAX_LENGTH, TRANSPARENT } from "@/utils/constants";

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

// Kleines Beispielfeld (5 × 4) im Stil des Spiels: ein paar Köder, genau ein Feld in der Zielfarbe.
// Feste Positionen, damit Server- und Client-Render gleich sind.
const BAIT_CELLS = [1, 4, 7, 8, 13, 16, 18];
const TARGET_CELL = 11;
const previewCells = (color: string) => {
  const baits = COLORS.filter((c) => c !== color);
  return Array.from({ length: 20 }, (_, i) => {
    if (i === TARGET_CELL) return color;
    const b = BAIT_CELLS.indexOf(i);
    return b >= 0 ? baits[(b * 3) % baits.length] : TRANSPARENT;
  });
};

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

  const canStart = name.length > 0 && !starting;

  return (
    <div className="fixed inset-0 overflow-y-auto">
      <a
        href="https://github.com/hannesschaletzky/focusgame"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-10 opacity-60 transition-opacity hover:opacity-100"
        aria-label="Source on GitHub"
      >
        <Image src="/github.png" alt="" width={28} height={28} />
      </a>

      <div className="mx-auto flex min-h-full max-w-sm flex-col justify-center gap-8 px-4 py-16">
        <div>
          <h1 className="text-6xl font-black leading-none">Focus</h1>
          <p className="mt-4">
            Click as many <strong>{color}</strong> squares as you can in {GAME_SECONDS} seconds.
          </p>
        </div>

        {/* Beispielfeld */}
        <div className="grid grid-cols-5 border-2 border-black" aria-hidden="true">
          {previewCells(color).map((c, i) => (
            <div
              key={i}
              className="h-7"
              style={{
                backgroundColor: c,
                // Das gesuchte Feld markieren
                outline: i === TARGET_CELL ? "3px solid black" : undefined,
                outlineOffset: -3,
              }}
            />
          ))}
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (canStart) onStart();
          }}
        >
          <label htmlFor="name" className="font-bold">
            Your name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="nickname"
            maxLength={NAME_MAX_LENGTH}
            value={name}
            aria-label="Name"
            onChange={(e) => changeName(e.target.value)}
            className="h-12 border-2 border-black px-3 text-lg outline-none focus:border-orange-500"
          />
          <StartButton type="submit" disabled={!canStart} className="mt-2 w-full">
            {starting ? "..." : "Start"}
          </StartButton>
          {error && <div className="text-red-600">{error}</div>}
        </form>

        <button className="self-start underline underline-offset-4" onClick={onLeaderboard}>
          Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Start;
