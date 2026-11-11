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
  const [seconds, setSeconds] = useState(GAME_SECONDS);
  const [missCount, setMissCount] = useState(0);
  const timeUp = useEffectEvent(onTimeUp);

  // Restzeit aus der Uhr berechnen statt Intervalle zu zählen, damit nichts driftet
  useEffect(() => {
    const startedAt = Date.now();
    const id = setInterval(() => {
      const left = GAME_SECONDS - (Date.now() - startedAt) / 1000;
      if (left <= 0) {
        clearInterval(id);
        timeUp();
      } else {
        setSeconds(Math.ceil(left));
      }
    }, 100);
    return () => clearInterval(id);
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
      <Seconds>{seconds}</Seconds>
    </div>
  );
};

export default Game;
