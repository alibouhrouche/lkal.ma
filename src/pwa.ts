import { toast } from "sonner";
import { useEffect, useRef } from "react";

export const usePWA = () => {
  const t = useRef<string | number | undefined>(undefined);
  useEffect(() => {
    const showSkipWaitingPrompt = () => {
      // Assuming the user accepted the update, set up a listener
      // that will reload the page as soon as the previously waiting
      // service worker has taken control.
      window.serwist.addEventListener("controlling", () => {
        // At this point, reloading will ensure that the current
        // tab is loaded under the control of the new service worker.
        // Depending on your web app, you may want to auto-save or
        // persist transient state before triggering the reload.
        window.location.reload();
      });

      t.current = toast("New version available. Refresh to update.", {
        duration: Infinity,
        action: {
          label: "Reload",
          onClick: () => {
            window.serwist.messageSkipWaiting();
          },
        },
        cancel: {
          label: "Dismiss",
          onClick: () => {
            toast.dismiss(t.current);
            t.current = undefined;
          },
        },
      });
    };

    // Add an event listener to detect when the registered
    // service worker has installed but is waiting to activate.
    window.serwist.addEventListener("waiting", showSkipWaitingPrompt);

    void window.serwist.register();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      void window.serwist.update();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void window.serwist.update();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  });
};
