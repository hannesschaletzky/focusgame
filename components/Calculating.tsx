import Image from "next/image";

const Calculating = () => (
  <div className="fixed inset-0 flex flex-col justify-center items-center p-4">
    <div>Calculating results + leaderboard ...</div>
    <br />
    <Image src="/loading.gif" alt="Loading" width={300} height={300} unoptimized priority />
  </div>
);

export default Calculating;
