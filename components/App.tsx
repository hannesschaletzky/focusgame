import { useRef, useState } from "react";
import Start from "@/components/Start";
import Game from "@/components/Game";
import Calculating from "@/components/Calculating";
import Score from "@/components/Score";
import * as api from "@/utils/api";
import { randomColor, type Color } from "@/utils/constants";
import type { LeaderboardEntry, NewGame } from "@/utils/types";

type Phase = "start" | "game" | "calculating" | "score";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const App = ({ initialColor }: { initialColor: Color }) => {
  const [phase, setPhase] = useState<Phase>("start");
  const [color, setColor] = useState<Color>(initialColor);
  const [name, setName] = useState("");
  const [game, setGame] = useState<NewGame | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const clicks = useRef<number[]>([]);

  const start = async () => {
    setError("");
    setStarting(true);
    try {
      const newGame = await api.createGame(color);
      clicks.current = [];
      setRound(0);
      setGame(newGame);
      setPhase("game");
    } catch {
      setError("Server not reachable, please try again.");
    } finally {
      setStarting(false);
    }
  };

  const click = (index: number) => {
    if (!game) return;
    clicks.current.push(index);
    const board = game.boards[Math.min(round, game.boards.length - 1)];
    if (board[index] === color) setRound((r) => r + 1);
  };

  // Ladeanimation mindestens kurz zeigen, dann Bestenliste
  const showLeaderboard = async (minDelay: Promise<unknown>) => {
    try {
      setLeaders(await api.getLeaderboard());
    } catch {
      setLeaders([]);
      setError("Leaderboard could not be loaded.");
    }
    await minDelay;
    setPhase("score");
  };

  const finish = async () => {
    if (!game) return;
    setPhase("calculating");
    const minDelay = wait(1000);
    try {
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
    setPhase("calculating");
    showLeaderboard(wait(500));
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
      return game && <Game boards={game.boards} round={round} onClick={click} onTimeUp={finish} />;
    case "calculating":
      return <Calculating />;
    case "score":
      return (
        <Score score={score} name={name} leaders={leaders} error={error} onRestart={restart} />
      );
  }
};

export default App;
