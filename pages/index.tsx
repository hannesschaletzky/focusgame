import Head from "next/head";
// SSR
import { InferGetServerSidePropsType } from "next";
// redux
import { store } from "@/app/store";
import { Provider } from "react-redux";

import App from "@/components/App";

export interface InitData {
  id: number;
  color: string;
  board: string[];
}

//167.99.135.251

// SSR only working on pages, not on components
export const getServerSideProps = async () => {
  const res = await fetch(
    `http://${process.env.NEXT_PUBLIC_HOSTNAME}:${process.env.NEXT_PUBLIC_PORT}/focus/init`
  );
  const data: InitData = await res.json();
  console.log(`Game with id ${data.id} was created. Color: ${data.color}`);
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
