import AppLogout from "@/db/logout";
import { AppLogin } from "./board/app-login";
import { Prompts } from "./prompts";
import AppInvites from "./board/app-invites";
import { Toaster } from "./ui/sonner";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";
import { useEffect } from "react";
import { registerPWA } from "@/pwa";

export default function AppGlobals() {
  useEffect(() => {
    registerPWA();
  }, []);
  // const { updateServiceWorker } = useRegisterSW({
  //   immediate: true,
  //   onNeedRefresh() {
  //     const id = toast("New version available. Refresh to update.", {
  //       duration: Infinity,
  //       action: {
  //         label: "Reload",
  //         onClick: () => {
  //           updateServiceWorker(true);
  //         },
  //       },
  //       cancel: {
  //         label: "Dismiss",
  //         onClick: () => {
  //           toast.dismiss(id);
  //         },
  //       },
  //     });
  //   },
  //   onOfflineReady() {
  //     toast.success("The app is ready to work offline");
  //   },
  // });
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
