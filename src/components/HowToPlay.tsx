import { useEffect, useState } from "react";
import { COLORS, GAME_SECONDS, TRANSPARENT } from "@/utils/constants";

// Animiertes Beispiel: ein kleines Board (5 × 4), ein Tipp landet auf dem Feld in der Zielfarbe,
// dann kommt das nächste Board und der Punktestand steigt. Feste Layouts, damit Server- und
// Client-Render gleich sind.
const LAYOUTS = [
  { target: 11, baits: [1, 4, 7, 8, 13, 16, 18] },
  { target: 3, baits: [0, 6, 9, 12, 15, 17] },
  { target: 17, baits: [2, 5, 8, 10, 14, 19] },
];
const STEP_MS = 1600;

const boardCells = (color: string, step: number) => {
  const { target, baits } = LAYOUTS[step % LAYOUTS.length];
  const others = COLORS.filter((c) => c !== color);
  return Array.from({ length: 20 }, (_, i) => {
    if (i === target) return color;
    const b = baits.indexOf(i);
    return b >= 0 ? others[(b * 3 + step) % others.length] : TRANSPARENT;
  });
};

const HowToPlay = ({ color }: { color: string }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Wer Bewegung reduziert haben möchte, sieht nur das erste Board
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setStep((s) => s + 1), STEP_MS);
    return () => clearInterval(id);
  }, []);

  const layout = LAYOUTS[step % LAYOUTS.length];
  const points = step % LAYOUTS.length;

  return (
    <section>
      <h2 className="border-b-2 border-black pb-1 font-bold">How to play</h2>

      <div className="mt-3 flex items-baseline justify-between text-sm">
        <span>Example</span>
        <span className="tabular-nums">
          {points} {points === 1 ? "point" : "points"}
        </span>
      </div>
      <div className="mt-1 grid grid-cols-5 border-2 border-black" aria-hidden="true">
        {boardCells(color, step).map((c, i) => (
          <div key={i} className="relative h-7" style={{ backgroundColor: c }}>
            {i === layout.target && (
              // Der Tipp: key=step startet die Animation bei jedem neuen Board neu
              <span
                key={step}
                className="tap-dot absolute inset-0 m-auto h-4 w-4 rounded-full border-2 border-black bg-white/60"
                style={{ animationDuration: `${STEP_MS}ms` }}
              />
            )}
          </div>
        ))}
      </div>

      <ol className="mt-4 flex flex-col gap-2">
        <li className="flex gap-3">
          <span className="w-5 shrink-0 font-bold tabular-nums">1.</span>
          <span>Every board hides exactly one square in your color. Find it.</span>
        </li>
        <li className="flex gap-3">
          <span className="w-5 shrink-0 font-bold tabular-nums">2.</span>
          <span>Tap it and the next board appears. Every hit is one point.</span>
        </li>
        <li className="flex gap-3">
          <span className="w-5 shrink-0 font-bold tabular-nums">3.</span>
          <span>
            You have {GAME_SECONDS}&nbsp;seconds. The clock starts with your first tap, so take a
            look first.
          </span>
        </li>
      </ol>
    </section>
  );
};

export default HowToPlay;
