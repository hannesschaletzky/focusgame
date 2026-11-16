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
        content="A 5-second focus game: find the one square in your color, tap it, next board. Play against your friends."
      />
      <meta property="og:title" content="Focus Game 🔥" />
      <meta
        property="og:description"
        content="A 5-second focus game: find the one square in your color, tap it, next board. Play against your friends."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://focus.hschaletzky.com" />
      {/* Vorschaubild für geteilte Links (public/og.png, 1200 × 630) */}
      <meta property="og:image" content="https://focus.hschaletzky.com/og.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Focus: find your color on a board of colored squares" />
      <meta name="twitter:card" content="summary_large_image" />
      {/* Homer soll sofort da sein, wenn das Spiel endet */}
      <link rel="preload" as="image" href="/loading.gif" />
    </Head>
    <App initialColor={color} />
  </>
);

export default Home;
