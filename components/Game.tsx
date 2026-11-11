import { useEffect, useEffectEvent, useState } from "react";
import { Cell, MissFlash, Points, Seconds } from "@/styles/UI_Elements";
import { GAME_SECONDS } from "@/utils/constants";

interface Props {
  boards: string[][];
  round: number;
  onClick: (index: number) => boolean;
  onTimeUp: () => void;
}

// Dauer des roten Blitzes nach einem Fehlklick
const MISS_FLASH_MS = 300;

const Game = ({ boards, round, onClick, onTimeUp }: Props) => {
  const [secondsLeft, setSecondsLeft] = useState(GAME_SECONDS);
  const [missCount, setMissCount] = useState(0);
  const timeUp = useEffectEvent(onTimeUp);

  // Spielende: Restzeit aus der Uhr berechnen statt Intervalle zu zählen, damit nichts driftet.
  // setInterval läuft auch in einem Tab im Hintergrund weiter, requestAnimationFrame nicht.
  // Anzeige: pro Frame neu, damit die Hundertstel flüssig herunterlaufen.
  useEffect(() => {
    const startedAt = performance.now();
    const leftAt = (now: number) => Math.max(0, GAME_SECONDS - (now - startedAt) / 1000);

    let frame = 0;
    const draw = (now: number) => {
      setSecondsLeft(leftAt(now));
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    const id = setInterval(() => {
      if (leftAt(performance.now()) <= 0) {
        clearInterval(id);
        cancelAnimationFrame(frame);
        setSecondsLeft(0);
        timeUp();
      }
    }, 50);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(frame);
    };
  }, []);

  const tap = (index: number) => {
    if (!onClick(index)) setMissCount((n) => n + 1);
  };

  const board = boards[Math.min(round, boards.length - 1)];

  return (
    <div className="fixed inset-0 flex flex-wrap">
      <Points>{round}</Points>
      {/* key startet den roten Blitz bei jedem Fehlklick neu */}
      {missCount > 0 && <MissFlash key={missCount} $ms={MISS_FLASH_MS} />}
      {board.map((color, i) => (
        <Cell $color={color} key={i} onPointerDown={() => tap(i)} />
      ))}
      <Seconds className="tabular-nums">{secondsLeft.toFixed(2)}</Seconds>
    </div>
  );
};

export default Game;
