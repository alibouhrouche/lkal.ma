import { PeopleMenu } from "tldraw";
import LoginButton from "./login-button";
// import ShareDialog from "./share-dialog";

export default function SharePanel() {
  return (
    <div
      className="flex items-center justify-end space-x-2 w-full p-2"
      style={{ pointerEvents: "all" }}
    >
      <PeopleMenu displayUserWhenAlone />
      {/* <ShareDialog /> */}
      <LoginButton />
    </div>
  );
}
