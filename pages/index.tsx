import Head from "next/head";
// SSR
import { InferGetServerSidePropsType } from "next";
// redux
import { store } from "@/app/store";
import { Provider } from "react-redux";

import App from "@/components/App";
import { Board, InitialState } from "@/utils/types";
import { constructBoard, getRndNum } from "@/utils/board";
import { colors } from "@/utils/constants";

// SSR only working on pages, not on components
export const getServerSideProps = async () => {
  // randomize color
  let color = colors[getRndNum(colors.length - 1)];

  // construct board
  let boards: Board[] = [];
  while (boards.length < 100) {
    boards.push(constructBoard(color));
  }

  // init game on server
  const res = await fetch(`${process.env.NEXT_PUBLIC_DBHOST}/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `color=${color}`,
  });
  const json = await res.json();
  console.log(json);

  const data: InitialState = {
    id: json.id || null,
    color: color,
    boards: boards,
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
  return (
    <>
      <Head>
        <title>Focus Game</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="Focus Game 🔥"
          content="Practice your focus by clicking as fast and precise as you can."
        />
        <meta name="keywords" content="Game, Focus, Concentration" />
        <meta property="og:title" content="Focus Game 🔥" />
        <meta
          property="og:description"
          content="Practice your focus by clicking as fast and precise as you can."
        />
        <meta property="og:type" content="website" />
      </Head>
      <Provider store={store}>
        <App {...data} />
      </Provider>
    </>
  );
};

export default Home;
