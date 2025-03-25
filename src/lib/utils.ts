import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<F extends (arg: any) => any>(fn: F, delay: number) {
  let lastTime = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any,...args: Parameters<F>) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
