import { useState } from "react";
import { useObservable } from "dexie-react-hooks";
import { db } from "@/db";
import {
  resolveText,
  type DXCAlert,
  type DXCInputField,
  type DXCUserInteraction,
} from "dexie-cloud-addon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AppLogin() {
  const ui = useObservable(db.cloud.userInteraction);
  if (!ui) return null; // No user interaction is requested.
  return <MyLoginDialog ui={ui} />;
}

function CustomAlert({ alert }: { alert: DXCAlert }) {
  const typeToTitle =
    alert.type === "error"
      ? "Error"
      : alert.type === "warning"
      ? "Warning"
      : "Info";
  const className = `${
    alert.type === "error" ? "text-red-600 border-red-600" : ""
  }${alert.type === "warning" ? "text-yellow-600 border-yellow-600" : ""}`;
  return (
    <Alert className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{typeToTitle}</AlertTitle>
      <AlertDescription className="text-current">
        {resolveText(alert)}
      </AlertDescription>
    </Alert>
  );
}

function LoginDialogContent({ ui }: { ui: DXCUserInteraction }) {
  const [params, setParams] = useState<{ [param: string]: string }>({});
  return (
    <>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ui.onSubmit(params);
        }}
      >
        {(Object.entries(ui?.fields) as [string, DXCInputField][]).map(
          ([fieldName, { type, label, placeholder }], idx) => (
            <div
              key={idx}
              className="grid w-full max-w-sm items-center gap-1.5"
            >
              <Label htmlFor={fieldName}>{label ? `${label}: ` : ""}</Label>
              <Input
                id={fieldName}
                type={type}
                name={fieldName}
                autoFocus
                placeholder={placeholder}
                value={params[fieldName] || ""}
                onChange={(ev) => {
                  const value = ev.target.value;
                  const updatedParams = {
                    ...params,
                    [fieldName]: value,
                  };
                  setParams(updatedParams);
                }}
              />
            </div>
          )
        )}
      </form>
      <DialogFooter>
          <Button type="submit" onClick={() => ui.onSubmit(params)}>
            {ui.submitLabel}
          </Button>
          {ui.cancelLabel && (
            <Button variant="secondary" onClick={ui.onCancel}>{ui.cancelLabel}</Button>
          )}
      </DialogFooter>
    </>
  );
}

export function MyLoginDialog({ ui }: { ui?: DXCUserInteraction }) {
  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && ui?.onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>{ui?.title}</DialogDescription>
        </DialogHeader>
        {ui?.alerts?.map((alert, i) => (
          <CustomAlert key={i} alert={alert} />
        ))}
        {ui?.fields && <LoginDialogContent ui={ui} />}
      </DialogContent>
    </Dialog>
  );
}
