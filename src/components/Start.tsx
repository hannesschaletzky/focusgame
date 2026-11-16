import Image from "next/image";
import { useEffect } from "react";
import { StartButton } from "@/styles/UI_Elements";
import HowToPlay from "@/components/HowToPlay";
import { NAME_MAX_LENGTH, colorLabel, textOn } from "@/utils/constants";

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

const Start = ({
  color,
  name,
  onName,
  onStart,
  onLeaderboard,
  starting,
  error,
}: Props) => {
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
    <>
      <a
        href="https://github.com/hannesschaletzky/focusgame"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-10 opacity-60 transition-opacity hover:opacity-100"
        aria-label="Source on GitHub"
      >
        <Image src="/github.png" alt="" width={28} height={28} />
      </a>

      {/* Handy: eine Spalte, oben ausgerichtet, damit bei offener Tastatur nichts springt.
          Ab md: links Farbe, Name und Start, rechts die Anleitung, beides mittig im Fenster. */}
      <main className="mx-auto grid min-h-dvh max-w-sm gap-8 px-4 pt-14 pb-10 md:max-w-3xl md:grid-cols-2 md:content-center md:items-start md:gap-12">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-5xl font-black leading-none md:text-6xl">
              Focus
            </h1>
            <p className="mt-3">
              A 5-second focus game to play against your friends.
            </p>
          </div>

          {/* Die Zielfarbe ist das Auffälligste auf der Seite */}
          <div
            className="flex h-14 items-center justify-between border-2 border-black px-4 text-lg"
            style={{ backgroundColor: color, color: textOn(color) }}
          >
            <span>Your color</span>
            <strong>{colorLabel(color)}</strong>
          </div>

          {/* Name und Start vor der Anleitung, damit beides über der Tastatur bleibt */}
          <form
            className="flex flex-col gap-2"
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
              enterKeyHint="go"
              maxLength={NAME_MAX_LENGTH}
              value={name}
              aria-label="Name"
              onChange={(e) => changeName(e.target.value)}
              className="h-12 border-2 border-black px-3 text-lg outline-none focus:border-orange-500"
            />
            <StartButton
              type="submit"
              disabled={!canStart}
              className="mt-2 w-full"
            >
              {starting ? "..." : "Start"}
            </StartButton>
            <button
              type="button"
              className="mt-1 self-center underline underline-offset-4"
              onClick={onLeaderboard}
            >
              See the leaderboard
            </button>
            {error && <div className="text-red-600">{error}</div>}
          </form>
        </div>

        <HowToPlay color={color} />
      </main>
    </>
  );
};

export default Start;
