import Image from "next/image";

const Calculating = () => {
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 flex flex-col justify-center items-center flex-wrap">
      Calculating results...
      <Image
        src="/loading.gif"
        alt="Picture of the author"
        width={500}
        height={500}
      />
    </div>
  );
};

export default Calculating;
