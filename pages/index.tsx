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

  function timeout(ms = 5000, promise: Promise<Response>): Promise<Response> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Server down"));
      }, ms);

      promise
        .then((value) => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch((reason) => {
          clearTimeout(timer);
          reject(reason);
        });
    });
  }

  let data: InitialState = {
    booting: true,
    id: -1,
    color: color,
    boards: boards,
  };

  // server is up when no timeout error was thrown
  try {
    await timeout(2000, fetch(`${process.env.NEXT_PUBLIC_DBHOST}`));
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

    data.booting = false;
    data.id = json.id;
  } catch (err) {
    // server down/booting
    console.log(err);
  }

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
