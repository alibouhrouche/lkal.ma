/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import DemoUsers from "../demo-users";
import { db } from "@/db";

const Hero = () => {
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
            <Button
              size="lg"
              className="rounded-full text-base"
              onClick={() => {
                db.cloud.login();
              }}
            >
              Get Started <ArrowUpRight className="!h-5 !w-5" />
            </Button>
            <DemoUsers />
          </div>
        </div>
        <div className="relative lg:max-w-lg xl:max-w-xl w-full bg-accent rounded-xl aspect-square">
          <img
            src="/hero-image.jpg"
            alt="Hero Image"
            className="object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
