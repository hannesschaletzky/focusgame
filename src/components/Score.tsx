import { useState } from "react";
import { StartButton } from "@/styles/UI_Elements";
import type { LeaderboardEntry } from "@/utils/types";

interface Props {
  score: number | null;
  name: string;
  leaders: LeaderboardEntry[];
  error: string;
  onRestart: () => void;
}

const PLACES = 10;

const pad = (n: number) => String(n).padStart(2, "0");
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};

const headline = (score: number, myRank: number, leaders: LeaderboardEntry[]) => {
  // myRank zeigt den Bestwert des Namens; nur erwähnen, wenn dieser Lauf ihn erreicht hat
  const hitBest = myRank >= 0 && leaders[myRank].rounds === score;
  if (hitBest && myRank === 0) return "That's the record.";
  if (hitBest) return `That's #${myRank + 1} of all time.`;
  if (score === 0) return "Zero. Happens to the best.";
  if (leaders.length > 0) return `${leaders[0].name} has ${leaders[0].rounds}. Again?`;
  return "";
};

const Score = ({ score, name, leaders, error, onRestart }: Props) => {
  const [copied, setCopied] = useState(false);
  const me = name.toLowerCase();

  // Am Handy das Teilen-Menü, sonst Text + Link in die Zwischenablage
  const share = async () => {
    const text = `I scored ${score} in Focus. Can you beat that?`;
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({ text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Teilen abgebrochen oder Zwischenablage nicht erlaubt
    }
  };
  const myRank = me ? leaders.findIndex((p) => p.name.toLowerCase() === me) : -1;

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col gap-6 px-4 py-8 md:justify-center">
      {score !== null && (
        <div className="text-center">
          <div className="text-6xl font-black leading-none tabular-nums">{score}</div>
          <div className="mt-2">{headline(score, myRank, leaders)}</div>
        </div>
      )}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Buttons über der Liste, damit man sie am Handy nicht suchen muss */}
      <div className="flex items-center justify-center gap-6">
        <StartButton onClick={onRestart}>{score !== null ? "Play again" : "Let's go!"}</StartButton>
        {score !== null && score > 0 && (
          <button className="underline underline-offset-4" onClick={share}>
            {copied ? "Copied!" : "Share"}
          </button>
        )}
      </div>

      <div>
        <div className="border-b-2 border-black pb-1 font-bold">Leaderboard</div>
        <ol>
          {Array.from({ length: PLACES }, (_, i) => {
            const player = leaders[i];
            const isMe = i === myRank;
            return (
              <li
                key={i}
                className={`flex h-9 items-center gap-3 border-b border-black/10 ${
                  isMe ? "font-bold" : ""
                }`}
              >
                <span className="w-7 tabular-nums">{i + 1}.</span>
                {player ? (
                  <>
                    {/* Ein Spielfeld in der Farbe, mit der gespielt wurde */}
                    <span
                      className="h-4 w-10 shrink-0 border border-black/20"
                      style={{ backgroundColor: player.color }}
                      title={player.color}
                    />
                    <span className="flex-1 truncate">
                      {player.name}
                      {isMe && " ←"}
                    </span>
                    <span className="text-sm tabular-nums opacity-50">
                      {formatDate(player.date)}
                    </span>
                    <span className="w-6 text-right font-bold tabular-nums">{player.rounds}</span>
                  </>
                ) : (
                  // Freier Platz
                  <>
                    <span className="h-4 w-10 shrink-0 border border-dashed border-black/30" />
                    <span className="flex-1 opacity-40">–</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
};

export default Score;
