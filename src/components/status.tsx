import { db } from "@/db";
import { cn } from "@/lib/utils";
import { useObservable } from "dexie-react-hooks";
import {
  CloudAlertIcon,
  CloudDownloadIcon,
  CloudIcon,
  CloudOffIcon,
  CloudUploadIcon,
} from "lucide-react";
import {
  SyncStatePhase,
  SyncStatus,
} from "node_modules/dexie-cloud-addon/dist/modern/types/SyncState";

const Icons: Record<SyncStatePhase, React.FC<React.SVGProps<SVGSVGElement>>> = {
  initial: CloudIcon,
  "not-in-sync": CloudAlertIcon,
  pushing: CloudUploadIcon,
  pulling: CloudDownloadIcon,
  "in-sync": CloudIcon,
  error: CloudAlertIcon,
  offline: CloudOffIcon,
};

const colors: Record<SyncStatus, string> = {
  connected: "text-green-500",
  disconnected: "text-red-500",
  connecting: "text-yellow-500",
  "not-started": "text-muted-foreground",
  error: "text-red-500",
  offline: "text-red-500",
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function StatusIcon() {
  const sync = useObservable(db.cloud.syncState);
  const Icon = Icons[sync?.phase as SyncStatePhase] || CloudIcon;
  return (
    <div
      className={cn(
        "flex items-center justify-center space-x-2 w-full p-2",
        colors[sync?.status as SyncStatus]
      )}
    >
      <Icon className="w-6 h-6">
        {sync && (
          <title>{`${capitalize(sync.phase)}: ${
            sync.progress
              ? `${sync.progress}%`
              : capitalize(sync.status.replace("-", " "))
          }`}</title>
        )}
      </Icon>
    </div>
  );
}
