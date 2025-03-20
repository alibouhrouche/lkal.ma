import { db } from "@/db";
import { useObservable } from "dexie-react-hooks";
import { Link, useNavigate } from "react-router";
import { Button, buttonVariants } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { logout } from "@/db/logout";

export default function LogoutPage() {
  const user = useObservable(db.cloud.currentUser);
  const navigate = useNavigate();
  if (user?.isLoggedIn) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <h1 className="text-xl">
            Are you sure you want to log out?
        </h1>
        <div className="flex gap-4">
          <Link
            className={buttonVariants({
              variant: "link",
            })}
            to="/"
            replace
          >
            <ArrowLeft className="size-6" />
            Go back
          </Link>
          <Button variant="destructive" className="cursor-pointer" onClick={() => {
            logout(true);
          }}>
            Log out
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <h1 className="text-xl">You have been logged out.</h1>
      <div className="flex gap-4">
        <Link
          className={buttonVariants({
            variant: "link",
          })}
          to="/"
          replace
        >
          <ArrowLeft className="size-6" />
          Go back
        </Link>
        <Button
          className="cursor-pointer"
          onClick={() => {
            db.cloud.login().then(() => {
              navigate("/", { replace: true });
            });
          }}
        >
          Log in again
        </Button>
      </div>
    </div>
  );
}
