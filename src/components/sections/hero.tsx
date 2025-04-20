import HeroButtons from "./hero-buttons";
import Image from "next/image";
import heroImage from "@/assets/hero-image.jpg";

export default function Hero() {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden border-b border-accent">
      <div className="max-w-screen-xl w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
        <div className="max-w-xl">
          <h1 className="mt-6 max-w-[20ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
            Whiteboarding Without Limits
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg">
            A next-gen collaborative whiteboard built on tldraw with Dexie Cloud
            for seamless teamwork—online and offline.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <HeroButtons />
          </div>
        </div>
        <div className="relative lg:max-w-lg xl:max-w-xl w-full bg-accent rounded-xl aspect-square">
          <Image
            src={heroImage}
            placeholder="blur"
            alt={"Designer choosing color"}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
