import { Button } from "@/components/ui/button";
import { PeopleMenu } from "tldraw";
import { Share2Icon } from "lucide-react";
import LoginButton from "./login-button";
import { db } from "@/db";
import ShareDialog from "./share-dialog";

export default function SharePanel() {
  return (
    <div
      className="flex items-center justify-end space-x-2 w-full p-2"
      style={{ pointerEvents: "all" }}
    >
      <PeopleMenu displayUserWhenAlone />
      <ShareDialog />
      {/* <Button size="icon" onClick={() => db.realms.toArray().then(res => console.log(res))}>
        <Share2Icon />
      </Button> */}
      <LoginButton />
    </div>
  );
}
