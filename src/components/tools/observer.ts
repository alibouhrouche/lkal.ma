import { TLShapeId } from "tldraw";

type Observer<T> = (arg: T) => void;

type ObserverData = {
  id: TLShapeId;
  loading: number | false;
  abort?: AbortController;
};

class ComponentRunner {
  private observers: Map<TLShapeId, Set<Observer<ObserverData>>>;
  constructor() {
    this.observers = new Map();
  }

  subscribe(id: TLShapeId, func: Observer<ObserverData>) {
    if (!this.observers.has(id)) {
      this.observers.set(id, new Set());
    }
    this.observers.get(id)?.add(func);
    return () => {
      this.unSubscribe(id, func);
    };
  }

  unSubscribe(id: TLShapeId, func: Observer<ObserverData>) {
    this.observers.get(id)?.delete(func);
  }

  notify(data: ObserverData) {
    this.observers.get(data.id)?.forEach((func) => {
      func(data);
    });
  }
}

export const componentRunner = new ComponentRunner();
