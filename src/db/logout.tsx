import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { navigate } from "wouter/use-browser-location";
import { useCallback, useEffect, useState } from "react";
import Dexie from "dexie";
import { ask } from "@/components/prompts";

type Observer = (fromLogout?: boolean) => void;

class LogoutObservable {
  private observers: Observer[];

  constructor() {
    this.observers = [];
  }

  subscribe(func: Observer) {
    this.observers.push(func);
  }

  unsubscribe(func: Observer) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  logout(fromLogout?: boolean) {
    this.observers.forEach((observer) => observer(fromLogout));
  }
}

const logoutObservable = new LogoutObservable();

export function logout(fromLogout?: boolean) {
  ask({
    type: "confirm",
    title: "Logout",
    message: "Are you sure you want to logout?",
    destructive: true,
    ok: "Logout",
    callback: (confirmed) => {
      if (confirmed) {
        logoutObservable.logout(fromLogout);
      }
    },
  })
}

const dbLink =
    (import.meta.env.VITE_DEXIE_CLOUD_DB_URL! || '')
      .split('//')[1]
      ?.split('.')[0] || ''

const dbName = 'boards-' + dbLink

export default function Logout() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Logging out...");
  const callback = useCallback((fromLogout?: boolean) => {
    if (!fromLogout) navigate("/logout");
    setOpen(true);
    Dexie.exists(dbName)
      .then((dbExist) => {
        if (dbExist) {
          setMessage("Deleting database...");
          Dexie.delete(dbName)
            .then(() => {})
            .catch((error) => {
              setMessage(error);
              setTimeout(() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }, 3000);
            })
            .finally(() => {
              setMessage("Cleaning up..." as string);
              setTimeout(() => {
                setOpen(false);
              }, 3000);
            });
        } else {
          setMessage("Logging out..." as string);
          setTimeout(() => {
            setOpen(false);
          }, 3000);
        }
      })
      .catch((error) => {
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }, 3000);
        setMessage(error);
      });
  }, []);
  useEffect(() => {
    logoutObservable.subscribe(callback);
    return () => {
      logoutObservable.unsubscribe(callback);
    };
  }, [callback]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logging out...</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
