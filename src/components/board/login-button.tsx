import { db } from "@/db";
import { useObservable } from "dexie-react-hooks";
import { Button } from "../ui/button";
import NavUser from "./nav-user";

export default function LoginButton() {
  const user = useObservable(db.cloud.currentUser);
  if (user?.isLoggedIn) {
    return <NavUser user={user} />;
  }
  return (
    <Button
      className="cursor-pointer"
      onClick={() => {
        db.cloud.login();
      }}
    >
      Login
    </Button>
  );
}
