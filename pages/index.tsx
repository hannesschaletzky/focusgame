import Head from "next/head";
// SSR
import { InferGetServerSidePropsType } from "next";
// redux
import { store } from "@/app/store";
import { Provider } from "react-redux";

import App from "@/components/App";
import { Board, InitialState } from "@/utils/types";
import { constructBoard } from "@/utils/board";

// SSR only working on pages, not on components
export const getServerSideProps = async () => {
  // const res_init = await fetch(`${process.env.NEXT_PUBLIC_DBHOST}/init`);
  // const data_init: InitData = await res_init.json();

  let color = "black";
  let boards: Board[] = [];

  while (boards.length < 10) {
    boards.push(constructBoard(color));
  }

  const data: InitialState = {
    id: 1,
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
  console.log(data);

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
