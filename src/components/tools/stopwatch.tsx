import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function ShowTime({
  time,
  className,
}: {
  time: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "tl-text-wrapper absolute bottom-0 right-0 opacity-60",
        className
      )}
      data-font="draw"
    >
      {(time / 1000).toFixed(2)}s
    </div>
  );
}

export function Stopwatch({
  start: _start,
  className,
}: {
  start: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef(_start);
  useEffect(() => {
    let timeout = 0;
    requestAnimationFrame(function update() {
      if (!ref.current) return;
      ref.current.textContent =
        ((performance.now() - start.current) / 1000).toFixed(2) + "s";
      timeout = window.setTimeout(() => {
        requestAnimationFrame(update);
      }, 100);
    });
    return () => {
      window.clearTimeout(timeout);
    };
  }, []);
  return (
    <div
      ref={ref}
      className={cn(
        "tl-text-wrapper absolute bottom-0 right-0 opacity-60",
        className
      )}
      data-font="draw"
    >
      0.00s
    </div>
  );
}
