import Image from "next/image";

interface Props {
  label: string;
  durationMs: number;
}

const Calculating = ({ label, durationMs }: Props) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-4">
    <Image
      src="/loading.gif"
      alt="Homer running in circles"
      width={333}
      height={243}
      unoptimized
      priority
      className="h-auto w-[min(60vw,220px)]"
    />
    <div className="flex flex-col items-center gap-4">
      <div>
        {label}
        <span className="loading-dots" aria-hidden="true">
          ...
        </span>
      </div>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-black/10">
        <div
          className="loading-bar h-full rounded-full bg-orange-400"
          style={{ animationDuration: `${durationMs}ms` }}
        />
      </div>
    </div>
  </div>
);

export default Calculating;
