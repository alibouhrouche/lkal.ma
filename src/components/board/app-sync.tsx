import { useObservable } from "dexie-react-hooks";
import { db } from "@/db";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function SyncOverlay() {
  const sync = useObservable(db.cloud.syncState);
  const ref = useRef<string | number | undefined>(undefined);
  const failed = useRef<boolean>(false);
  useEffect(() => {
    console.log(sync);
    if (sync?.status === "error") {
      failed.current = true;
      toast.error("An error occurred while syncing", {
        description: "Please try again later",
        duration: Infinity,
        dismissible: false,
        id: ref.current,
      });
      return;
    }
    if (failed.current) return;
    if (sync?.phase === "initial" && sync.status === "connecting") {
      ref.current = toast.loading("Connecting to server...", {
        duration: Infinity,
      });
    } else if (sync?.phase === "pushing") {
      toast("Pushing data...", {
        id: ref.current,
      });
    } else if (sync?.phase === "pulling") {
      toast("Pulling data...", {
        id: ref.current,
      });
    } else if (sync?.phase === "in-sync" && sync.status === "connected") {
      toast.success("Sync complete", {
        id: ref.current,
        duration: 1000,
      });
    }
  }, [sync]);
  return null;
}
