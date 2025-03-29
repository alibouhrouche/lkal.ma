import AppLogout from "@/db/logout";
import { AppLogin } from "./board/app-login";
import { Prompts } from "./prompts";
import AppInvites from "./board/app-invites";
import { Toaster } from "./ui/sonner";


export default function AppGlobals() {
  return (
    <>
      <AppLogin />
      <AppLogout />
      <AppInvites />
      <Prompts />
      <Toaster richColors />
    </>
  );
}
