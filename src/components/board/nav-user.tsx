import { UserLogin } from "dexie-cloud-addon";
import { useMemo } from "react";
import { Md5 } from "ts-md5";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { logout } from "@/db/logout";
import { Link } from "react-router";

function License({ user }: { user: UserLogin }) {
  const { license } = user;
  if (!license) return null;
  // if (
  //   license.status === 'ok' &&
  //   license.validUntil === undefined &&
  //   license.evalDaysLeft === undefined
  // ) {
  //   return null
  // }
  if (license.type === "eval") {
    return `Evaluation License (${license.evalDaysLeft} days left)`;
  }
  if (license.type === "demo") {
    return "Demo User";
  }
  if (license.type === "prod") {
    return "Pro User";
  }
}

export default function NavUser({ user }: { user: UserLogin }) {
  const avatar = useMemo(() => {
    if (!user.email) return undefined;
    return `https://gravatar.com/avatar/${Md5.hashStr(
      user.email.trim().toLowerCase()
    )}?d=identicon`;
  }, [user]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar className="cursor-pointer">
            <AvatarImage src={avatar} alt={user.email} />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[500]" align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal">
          <License user={user} />
        </DropdownMenuLabel>
        <Link to="/boards">
          <DropdownMenuItem>Boards</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
