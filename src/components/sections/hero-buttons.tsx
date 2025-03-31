/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { ArrowUpRight, FilePlus2Icon } from "lucide-react";
import DemoUsers from "../demo-users";
import { db } from "@/db";
import { useObservable } from "dexie-react-hooks";
import { newBoard } from "../board/app-new";

const HeroButtons = () => {
  const user = useObservable(() => db.cloud.currentUser, []);
  if (user?.isLoggedIn) {
    return (
      <>
        <Button
          size="lg"
          className="cursor-pointer rounded-full text-base"
          asChild
        >
          <a href="/boards">
            Get Started <ArrowUpRight className="!h-5 !w-5" />
          </a>
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="cursor-pointer rounded-full text-base"
          onClick={newBoard}
        >
          <FilePlus2Icon
            className="!h-5 !w-5"
          />
          New Board
        </Button>
      </>
    );
  }
  return (
    <>
      <Button
        size="lg"
        className="cursor-pointer rounded-full text-base"
        onClick={() => {
          db.cloud.login();
        }}
      >
        Get Started <ArrowUpRight className="!h-5 !w-5" />
      </Button>
      <DemoUsers />
    </>
  );
};

export default HeroButtons;
