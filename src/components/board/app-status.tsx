import { db } from "@/db";
import { useOnline } from "@/hooks/useOnline";
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
import {
  createContext,
  FC,
  PropsWithChildren,
  SVGProps,
  useContext,
} from "react";
import { SyncState } from "dexie-cloud-addon";

const Icons: Record<SyncStatePhase, FC<SVGProps<SVGSVGElement>>> = {
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

const AppStatusContext = createContext<{
  isOnline: boolean;
  sync?: SyncState;
}>({
  isOnline: navigator.onLine,
});

const useAppContext = (name: string) => {
  const context = useContext(AppStatusContext);
  if (!context) {
    throw new Error(`${name} must be used within a AppStatus`);
  }
  return context;
};

function AppStatus({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) {
  const isOnline = useOnline();
  const sync = useObservable(db.cloud.syncState);
  return (
    <AppStatusContext.Provider
      value={{
        isOnline,
        sync,
      }}
    >
      <div
        className={cn(
          "flex items-center justify-center space-x-2 p-2",
          colors[sync?.status as SyncStatus] ?? "text-muted-foreground",
          className,
        )}
      >
        {children}
      </div>
    </AppStatusContext.Provider>
  );
}

function AppStatusText({ className }: { className?: string }) {
  const { isOnline, sync } = useAppContext("AppStatusText");
  if (!isOnline) {
    return <span className={className}>Offline</span>;
  }
  if (sync?.progress) {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        <div className="w-16 h-1 bg-muted rounded-full">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${sync.progress}%` }}
          />
        </div>
      </div>
    );
  }
  return (
    <span className={cn("text-xs capitalize", className)}>
      {sync?.status.replace("-", " ") ?? "not started"}
    </span>
  );
}

function AppStatusIcon({
  children,
  className,
}: {
  className?: string;
  children?: (sync?: SyncState) => React.ReactNode;
}) {
  const { isOnline, sync } = useAppContext("AppStatusIcon");
  const Icon = isOnline
    ? Icons[sync?.phase as SyncStatePhase] || CloudIcon
    : CloudOffIcon;
  return <Icon className={cn("w-6 h-6", className)}>{children?.(sync)}</Icon>;
}

AppStatus.Icon = AppStatusIcon;
AppStatus.Text = AppStatusText;

export default AppStatus;
