import { useAppSelector } from "@/app/hooks";
import { StartButton, Item } from "@/styles/UI_Elements";

const Score = () => {
  const round = useAppSelector((state) => state.gameState.round);
  const leaderboard = useAppSelector((state) => state.gameState.leaderboard);

  const parseDate = (input: string) => {
    const date = new Date(input);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 flex flex-col justify-center items-center flex-wrap">
      <div>
        You scored: <strong>{round}</strong>
      </div>
      <br />
      {leaderboard.map((player, i) => (
        <div
          className="flex gap-3 w-80 items-center"
          key={i}
          title={player.created_at}
        >
          <div>{player.rounds}</div>
          <Item color={player.color} height={"100vh / 40"} />
          <div className="flex-1">{player.name}</div>
          <div>{parseDate(player.created_at)} </div>
        </div>
      ))}
      <br />
      <em>Can you beat the record of {leaderboard[0].name}?</em>
      <br />
      <StartButton onClick={() => window.location.reload()}>
        Let&apos;s go!
      </StartButton>
    </div>
  );
};

export default Score;
