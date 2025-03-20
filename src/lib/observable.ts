import { useEffect } from "react";

type Observer<T> = (arg: T) => void;

export default class Observable<T> {
  private observers: Observer<T>[];

  constructor() {
    this.observers = [];
  }

  subscribe(func: Observer<T>) {
    this.observers.push(func);
    return () => {
      this.unsubscribe(func);
    }
  }

  unsubscribe(func: Observer<T>) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data: T) {
    this.observers.forEach((observer) => observer(data));
  }
}

export const useSubscribe = <T>(observable: Observable<T>, callback: Observer<T>) => {
  useEffect(() => observable.subscribe(callback), [observable, callback]);
}
