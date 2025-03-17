import { useCallback, useEffect, useId, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Data =
  | {
      type: "alert";
      title: string;
      message: string;
      ok?: string;
      callback: (data: boolean | null) => void;
    }
  | {
      type: "confirm";
      title: string;
      message: string;
      destructive?: boolean;
      ok?: string;
      cancel?: string;
      callback: (data: boolean | null) => void;
    }
  | {
      type: "prompt";
      title: string;
      message: string;
      label: string;
      placeholder: string;
      default?: string;
      isPassword?: boolean;
      ok?: string;
      cancel?: string;
      callback: (data: string | null) => void;
    };

type Observer = (data: Data) => void;

class Observable {
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

  notify(data: Data) {
    this.observers.forEach((observer) => observer(data));
  }
}

const observable = new Observable();

export const ask = (data: Data) => observable.notify(data);

export function Prompts() {
  const [data, setData] = useState<Data[]>([]);
  const lastData = data[data.length - 1];
  const [value, setValue] = useState("");
  const callback = useCallback((data: Data) => {
    setData((prev) => [...prev, data]);
    if (data.type === "prompt") {
      setValue(data.default ?? "");
    }
  }, []);
  const id = useId();
  useEffect(() => {
    observable.subscribe(callback);
    return () => {
      observable.unsubscribe(callback);
    };
  }, [callback]);
  const close = useCallback(() => {
    const prev = [...data];
    prev.pop();
    setValue("");
    setData(prev);
  }, [data]);
  return (
    <AlertDialog open={data.length > 0}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{lastData?.title}</AlertDialogTitle>
          <AlertDialogDescription>{lastData?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        {lastData?.type === "prompt" ? (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                lastData.callback(value);
                close();
              }}
              className="grid w-full items-center gap-1.5"
            >
              <Label htmlFor={id}>{lastData?.label}</Label>
              <Input
                type={lastData?.isPassword ? "password" : "text"}
                id={id}
                placeholder={lastData?.placeholder}
                autoFocus={true}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </form>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  lastData.callback(null);
                  close();
                }}
              >
                {lastData.cancel ? lastData.cancel : "Cancel"}
              </Button>
              <Button
                onClick={() => {
                  lastData.callback(value);
                  close();
                }}
              >
                {lastData.ok ? lastData.ok : "OK"}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <AlertDialogFooter>
            {lastData?.type === "alert" && (
              <>
                <Button
                  onClick={() => {
                    lastData.callback(true);
                    close();
                  }}
                >
                  {lastData.ok ? lastData.ok : "OK"}
                </Button>
              </>
            )}
            {lastData?.type === "confirm" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    lastData.callback(false);
                    close();
                  }}
                >
                  {lastData.cancel ? lastData.cancel : "Cancel"}
                </Button>
                <Button
                  onClick={() => {
                    lastData.callback(true);
                    close();
                  }}
                  variant={lastData.destructive ? "destructive" : "default"}
                >
                  {lastData.ok ? lastData.ok : (lastData.destructive ? "Delete" : "OK")}
                </Button>
              </>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
