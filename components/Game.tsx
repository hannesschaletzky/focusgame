import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Cell, MissFlash, Points, Seconds } from "@/styles/UI_Elements";
import { GAME_SECONDS } from "@/utils/constants";

interface Props {
  boards: string[][];
  round: number;
  onClick: (index: number) => boolean;
  onTimeUp: () => void;
}

// So lange ist das Feld nach einem Fehlklick gesperrt: Raten kostet Zeit
const MISS_LOCK_MS = 300;

const Game = ({ boards, round, onClick, onTimeUp }: Props) => {
  const [seconds, setSeconds] = useState(GAME_SECONDS);
  const [missCount, setMissCount] = useState(0);
  const lockedUntil = useRef(0);
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

  // at = Zeitstempel des Pointer-Events; Ref statt State, damit auch sehr schnelle Klicks gesperrt sind
  const tap = (index: number, at: number) => {
    if (at < lockedUntil.current) return;
    if (!onClick(index)) {
      lockedUntil.current = at + MISS_LOCK_MS;
      setMissCount((n) => n + 1);
    }
  };

  const board = boards[Math.min(round, boards.length - 1)];

  return (
    <div className="fixed inset-0 flex flex-wrap">
      {/* key startet die Animationen bei jedem Treffer bzw. Fehler neu */}
      <Points key={`p${round}`}>{round}</Points>
      {missCount > 0 && <MissFlash key={`m${missCount}`} $ms={MISS_LOCK_MS} />}
      {board.map((color, i) => (
        <Cell $color={color} key={i} onPointerDown={(e) => tap(i, e.timeStamp)} />
      ))}
      <Seconds>{seconds}</Seconds>
    </div>
  );
};

export default Game;
