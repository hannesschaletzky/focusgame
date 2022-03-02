import Image from "next/image";

const Calculating = () => {
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 flex flex-col justify-center items-center flex-wrap">
      <div>Calculating results + leaderboard ...</div>
      <br />
      <Image src="/loading.gif" alt="Circles." width={500} height={500} />
    </div>
  );
};

export default Calculating;
