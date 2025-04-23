import AppLogout from "@/db/logout";
import { AppLogin } from "./board/app-login";
import { Prompts } from "./prompts";
import AppInvites from "./board/app-invites";
import { Toaster } from "./ui/sonner";
import { usePWA } from "@/pwa";

export default function AppGlobals() {
  usePWA();
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
