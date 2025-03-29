import { db } from "@/db";
import { useObservable } from "dexie-react-hooks";
import { Button } from "../ui/button";
import NavUser from "./nav-user";

export default function LoginButton({children}: {children?: React.ReactNode}) {
  const user = useObservable(db.cloud.currentUser);
  if (user?.isLoggedIn) {
    return (
      <>
        {children}
        <NavUser user={user} />
      </>
    );
  }
  return (
    <Button
      className="tl-cursor-pointer cursor-pointer"
      onClick={() => {
        db.cloud.login();
      }}
    >
      Login
    </Button>
  );
}
