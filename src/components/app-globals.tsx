import AppLogout from "@/db/logout";
import { AppLogin } from "./board/app-login";
import { Prompts } from "./prompts";
import AppInvites from "./board/app-invites";
import { Toaster } from "./ui/sonner";
import { useEffect } from "react";
import { registerPWA } from "@/pwa";

export default function AppGlobals() {
  useEffect(() => {
    registerPWA();
  }, []);
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
