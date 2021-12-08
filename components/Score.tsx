import { useAppDispatch, useAppSelector } from "@/app/hooks";

const Score = () => {
  const dispatch = useAppDispatch();
  const points = useAppSelector((state) => state.gameState.points);
  const leaderboard = useAppSelector((state) => state.gameState.leaderboard);

  return (
    <div className="flex flex-col justify-center items-center flex-wrap w-screen h-screen">
      <div>You scored: {points}</div>
      <br />
      <div>Leaderboard:</div>
      <br />
      {leaderboard.map((player, i) => (
        <div className="flex gap-5 w-80" key={i} title={player.created_at}>
          <div>{player.points}</div>
          <div className="flex-1">{player.name}</div>
          <div>{new Date(player.created_at).toDateString()} </div>
        </div>
      ))}
    </div>
  );
};

export default Score;
