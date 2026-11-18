import { useEffect, useEffectEvent, useRef, useState, type PointerEvent } from "react";
import { Cell, MissFlash, Points, Seconds } from "@/styles/UI_Elements";
import { GAME_SECONDS } from "@/utils/constants";

interface Props {
  boards: string[][];
  round: number;
  onBegin: () => void;
  onClick: (index: number, meta: ClickMeta) => boolean;
  onTimeUp: () => void;
}

// Für den unauffälligen Schummelschutz: wann (ms seit dem ersten Tipp), echt (isTrusted), im Feld
export type ClickMeta = [number, 0 | 1, 0 | 1];

// Dauer des roten Blitzes nach einem Fehlklick
const MISS_FLASH_MS = 300;

const Game = ({ boards, round, onBegin, onClick, onTimeUp }: Props) => {
  // Der Countdown startet erst mit dem ersten Tipp, vorher kann man sich das Feld ansehen
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(GAME_SECONDS);
  const [missCount, setMissCount] = useState(0);
  const timeUp = useEffectEvent(onTimeUp);
  const firstTapAt = useRef<number | null>(null);

  // Spielende: Restzeit aus der Uhr berechnen statt Intervalle zu zählen, damit nichts driftet.
  // setInterval läuft auch in einem Tab im Hintergrund weiter, requestAnimationFrame nicht.
  // Anzeige: pro Frame neu, damit die Hundertstel flüssig herunterlaufen.
  useEffect(() => {
    if (!started) return;
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
  }, [started]);

  const tap = (index: number, e: PointerEvent<HTMLDivElement>) => {
    if (!started) {
      setStarted(true);
      onBegin();
    }
    firstTapAt.current ??= e.timeStamp;
    const r = e.currentTarget.getBoundingClientRect();
    const inside =
      e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    const meta: ClickMeta = [
      Math.max(0, Math.round(e.timeStamp - firstTapAt.current)),
      e.isTrusted ? 1 : 0,
      inside ? 1 : 0,
    ];
    if (!onClick(index, meta)) setMissCount((n) => n + 1);
  };

  const board = boards[Math.min(round, boards.length - 1)];

  return (
    <div className="fixed inset-0 flex flex-wrap">
      <Points>{round}</Points>
      {/* key startet den roten Blitz bei jedem Fehlklick neu */}
      {missCount > 0 && <MissFlash key={missCount} $ms={MISS_FLASH_MS} />}
      {board.map((color, i) => (
        <Cell $color={color} key={i} onPointerDown={(e) => tap(i, e)} />
      ))}
      <Seconds className="tabular-nums">
        {secondsLeft.toFixed(2)}
        {!started && <span className="ml-2 text-base">starts on first tap</span>}
      </Seconds>
    </div>
  );
};

export default Game;
