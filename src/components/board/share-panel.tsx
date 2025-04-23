import { PeopleMenu } from "tldraw";
import LoginButton from "./login-button";
import ShareDialogTrigger from "./share-dialog";
import { NavigationSheet } from "../navbar/navigation-sheet";

export default function SharePanel() {
  return (
    <div
      className="flex items-center justify-end space-x-2 w-full p-2"
      style={{ pointerEvents: "all" }}
    >
      <PeopleMenu displayUserWhenAlone />
      <LoginButton loggedOut={<NavigationSheet />}>
        <ShareDialogTrigger />
      </LoginButton>
    </div>
  );
}
