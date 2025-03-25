import AppLogout from "@/db/logout";
import { AppLogin } from "./app-login";
import { Prompts } from "../prompts";
import AppInvites from "./app-invites";

export default function AppGlobals() {
  return (
    <>
      <AppLogin />
      <AppLogout />
      <AppInvites />
      <Prompts />
    </>
  );
}
