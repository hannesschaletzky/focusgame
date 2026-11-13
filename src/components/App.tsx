import { useEffect, useRef, useState } from "react";
import Start from "@/components/Start";
import Game from "@/components/Game";
import Calculating from "@/components/Calculating";
import Score from "@/components/Score";
import * as api from "@/utils/api";
import { randomColor, type Color } from "@/utils/constants";
import type { Leaderboard, NewGame } from "@/utils/types";

type Phase = "start" | "game" | "calculating" | "score";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Homer soll immer mindestens so lange im Kreis laufen
const MIN_LOADING_AFTER_GAME_MS = 2000;
const MIN_LOADING_LEADERBOARD_MS = 1500;

const App = ({ initialColor }: { initialColor: Color }) => {
  const [phase, setPhase] = useState<Phase>("start");
  const [color, setColor] = useState<Color>(initialColor);
  const [name, setName] = useState("");
  const [game, setGame] = useState<NewGame | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [board, setBoard] = useState<Leaderboard>({ players: [], totalGames: 0 });
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState({ label: "", ms: MIN_LOADING_AFTER_GAME_MS });
  const clicks = useRef<number[]>([]);
  // Startmeldung an den Server; finish wartet darauf, damit die Reihenfolge stimmt
  const begun = useRef<Promise<unknown> | null>(null);

  // Die Seiten scrollen normal; jede neue Phase beginnt oben
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  const start = async () => {
    setError("");
    setStarting(true);
    try {
      const newGame = await api.createGame(color);
      clicks.current = [];
      begun.current = null;
      setRound(0);
      setGame(newGame);
      setPhase("game");
    } catch {
      setError("Server not reachable, please try again.");
    } finally {
      setStarting(false);
    }
  };

  // Gibt zurück, ob getroffen wurde; das Spielfeld zeigt danach Treffer oder Fehler an
  const click = (index: number) => {
    if (!game) return false;
    clicks.current.push(index);
    const board = game.boards[Math.min(round, game.boards.length - 1)];
    const hit = board[index] === color;
    if (hit) setRound((r) => r + 1);
    return hit;
  };

  // Ladeanimation mindestens kurz zeigen, dann Bestenliste
  const showLeaderboard = async (minDelay: Promise<unknown>) => {
    try {
      setBoard(await api.getLeaderboard());
    } catch {
      setBoard({ players: [], totalGames: 0 });
      setError("Leaderboard could not be loaded.");
    }
    await minDelay;
    setPhase("score");
  };

  // Erster Tipp: Countdown läuft, Server merkt sich den Start
  const begin = () => {
    if (!game || begun.current) return;
    begun.current = api.beginGame(game.id).catch(() => {});
  };

  const finish = async () => {
    if (!game) return;
    setLoading({ label: "Calculating your score", ms: MIN_LOADING_AFTER_GAME_MS });
    setPhase("calculating");
    const minDelay = wait(MIN_LOADING_AFTER_GAME_MS);
    try {
      await begun.current;
      const result = await api.finishGame(game.id, name, clicks.current);
      setScore(result.rounds);
    } catch (err) {
      setScore(round);
      setError(`Score not saved: ${(err as Error).message}`);
    }
    await showLeaderboard(minDelay);
  };

  const openLeaderboard = () => {
    setError("");
    setScore(null);
    setLoading({ label: "Loading leaderboard", ms: MIN_LOADING_LEADERBOARD_MS });
    setPhase("calculating");
    showLeaderboard(wait(MIN_LOADING_LEADERBOARD_MS));
  };

  const restart = () => {
    setError("");
    setScore(null);
    setGame(null);
    setColor(randomColor());
    setPhase("start");
  };

  switch (phase) {
    case "start":
      return (
        <Start
          color={color}
          name={name}
          onName={setName}
          onStart={start}
          onLeaderboard={openLeaderboard}
          starting={starting}
          error={error}
        />
      );
    case "game":
      return game && <Game
          boards={game.boards}
          round={round}
          onBegin={begin}
          onClick={click}
          onTimeUp={finish}
        />;
    case "calculating":
      return <Calculating label={loading.label} durationMs={loading.ms} />;
    case "score":
      return (
        <Score
          score={score}
          name={name}
          leaders={board.players}
          totalGames={board.totalGames}
          error={error}
          onRestart={restart}
        />
      );
  }
};

export default App;
