import Head from "next/head";
// SSR
import { InferGetServerSidePropsType } from "next";
// redux
import { store } from "@/app/store";
import { Provider } from "react-redux";

import { LeaderboardPlayer } from "@/types/games";
import App from "@/components/App";

export interface InitData {
  id: number;
  color: string;
  board: string[];
}

export interface SSR_Data {
  init: InitData;
  leaderboard: LeaderboardPlayer[];
}

// SSR only working on pages, not on components
export const getServerSideProps = async () => {
  const res_init = await fetch(`${process.env.NEXT_PUBLIC_DBHOST}/init`);
  const data_init: InitData = await res_init.json();

  const res_leaderboard = await fetch(
    `${process.env.NEXT_PUBLIC_DBHOST}/leaderboard`
  );
  const data_leaderboard: LeaderboardPlayer[] = await res_leaderboard.json();

  const data: SSR_Data = {
    init: data_init,
    leaderboard: data_leaderboard,
  };

  return {
    props: {
      data,
    },
  };
};

const Home = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log("RENDER APP");
  //console.log(data);

  return (
    <>
      <Head>
        <title>Focus</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Provider store={store}>
        <App {...data} />
      </Provider>
    </>
  );
};

export default Home;
