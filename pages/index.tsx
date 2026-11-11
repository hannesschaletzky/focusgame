import Head from "next/head";
import type { InferGetServerSidePropsType } from "next";
import App from "@/components/App";
import { randomColor } from "@/utils/constants";

// Farbe auf dem Server würfeln, damit Server- und Client-Render übereinstimmen
export const getServerSideProps = async () => ({
  props: { color: randomColor() },
});

const Home = ({ color }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <Head>
      <title>Focus Game</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta
        name="description"
        content="Practice your focus by clicking as fast and precise as you can."
      />
      <meta property="og:title" content="Focus Game 🔥" />
      <meta
        property="og:description"
        content="Practice your focus by clicking as fast and precise as you can."
      />
      <meta property="og:type" content="website" />
    </Head>
    <App initialColor={color} />
  </>
);

export default Home;
