import { toast } from "sonner";
import { registerSW } from "virtual:pwa-register";

let called = false;

export const registerPWA = () => {
  if (called) return;
  called = true;
  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      const id = toast("New version available. Refresh to update.", {
        duration: Infinity,
        action: {
          label: "Reload",
          onClick: () => {
            updateServiceWorker(true);
          },
        },
        cancel: {
          label: "Dismiss",
          onClick: () => {
            toast.dismiss(id);
          },
        },
      });
    },
    onOfflineReady() {
      requestAnimationFrame(() => {
        toast.success("The app is ready to work offline");
      });
    },
  });
};
