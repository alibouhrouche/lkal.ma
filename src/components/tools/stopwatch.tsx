import { useEffect, useRef } from "react";

export function ShowTime({ time }: { time: number }) {
  return (
    <div
      className="tl-text-wrapper absolute bottom-0 right-4 opacity-60"
      data-font="draw"
    >
      {(time / 1000).toFixed(2)}s
    </div>
  );
}

export function Stopwatch({ start: _start }: { start: number }) {
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
      className="tl-text-wrapper absolute bottom-0 right-4 opacity-60"
      data-font="draw"
    >
      0.00s
    </div>
  );
}
