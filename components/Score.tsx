import { StartButton, Swatch } from "@/styles/UI_Elements";
import type { LeaderboardEntry } from "@/utils/types";

interface Props {
  score: number | null;
  name: string;
  leaders: LeaderboardEntry[];
  error: string;
  onRestart: () => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const Score = ({ score, name, leaders, error, onRestart }: Props) => {
  const me = name.toLowerCase();
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center p-4 overflow-y-auto">
      {score !== null && (
        <div>
          You scored: <strong>{score}</strong>
        </div>
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <br />
      {leaders.map((player, i) => (
        <div
          className={`flex mt-1 gap-3 w-80 max-w-full items-center ${
            me && player.name.toLowerCase() === me ? "font-bold" : ""
          }`}
          key={player.name}
          title={player.date}
        >
          <div className="w-5 text-right">{i + 1}.</div>
          <div className="w-5 text-right">{player.rounds}</div>
          <Swatch $color={player.color} />
          <div className="flex-1 truncate">{player.name}</div>
          <div>{formatDate(player.date)}</div>
        </div>
      ))}
      {leaders.length > 0 && (
        <>
          <br />
          <em>Can you beat the record of {leaders[0].name}?</em>
        </>
      )}
      <br />
      <StartButton onClick={onRestart}>Let&apos;s go!</StartButton>
    </div>
  );
};

export default Score;
