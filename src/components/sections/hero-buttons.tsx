import { Button } from "@/components/ui/button";
import { ArrowUpRight, FilePlus2Icon } from "lucide-react";
import DemoUsers from "../demo-users";
import { db } from "@/db";
import { useObservable } from "dexie-react-hooks";
import Link from "next/link";
import useNewBoard from "@/hooks/useNewBoard.ts";

const HeroButtons = () => {
  const newBoard = useNewBoard();
  const user = useObservable(() => db.cloud.currentUser, []);
  if (user?.isLoggedIn) {
    return (
      <>
        <Button
          size="lg"
          className="cursor-pointer rounded-full text-base"
          asChild
        >
          <Link href="/boards">
            Get Started <ArrowUpRight className="!h-5 !w-5" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="cursor-pointer rounded-full text-base"
          onClick={newBoard}
        >
          <FilePlus2Icon className="!h-5 !w-5" />
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
