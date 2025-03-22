import {
  Editor,
  TLArrowBinding,
  TLArrowShape,
  TLShapeId,
} from "tldraw";
import { ComponentShape } from ".";

type AdjacencyList = Map<TLShapeId, TLShapeId[]>;

export function toAdjacencyList(
  editor: Editor,
  shapeId: TLShapeId,
  namesMap: Map<TLShapeId, (string | undefined)[]>
) {
  const list = new Map<TLShapeId, TLShapeId[]>();
  const queue = [shapeId];
  const visited = new Set<TLShapeId>();
  while (queue.length) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    const names: (string | undefined)[] = [];
    const neighbors = editor
      .getBindingsToShape(current, "arrow")
      .filter(
        (binding) =>
          binding.type === "arrow" &&
          (binding as TLArrowBinding).props.terminal === "start"
      )
      .flatMap((binding) => {
        const arrow: TLArrowShape | undefined = editor.getShape(binding.fromId);
        names.push(arrow?.props.text);
        return editor
          .getBindingsFromShape(binding.fromId, "arrow")
          .filter((binding) => {
            return (
              binding.type === "arrow" &&
              (binding as TLArrowBinding).props.terminal === "end"
            );
          })
          .map((binding) => binding.toId);
      });
    namesMap.set(current, names);
    list.set(current, neighbors);
    queue.push(...neighbors);
  }
  return list;
}

export function topologicalSort(adj: AdjacencyList) {
  const visited = new Set<TLShapeId>();
  const stack: TLShapeId[] = [];
  const dfs = (node: TLShapeId) => {
    visited.add(node);
    adj.get(node)?.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    });
    stack.push(node);
  };
  adj.forEach((_, node) => {
    if (!visited.has(node)) {
      dfs(node);
    }
  });
  return stack.reverse();
}

export function getInputs(
  editor: Editor,
  shapeId: TLShapeId,
  adj: AdjacencyList,
  namesMap: Map<TLShapeId, (string | undefined)[]>
) {
  const inputs: [string, ComponentShape][] = [];
  adj.forEach((nodes, key) => {
    if (nodes.includes(shapeId)) {
      const idx = nodes.indexOf(shapeId);
      const name = namesMap.get(key)?.[idx];
      const shape = editor.getShape(key)! as ComponentShape;
      inputs.push([name ?? "", shape]);
    }
  });
  return inputs;
}

export function getOutputs(
  editor: Editor,
  shapeId: TLShapeId,
  adj: AdjacencyList,
  namesMap: Map<TLShapeId, (string | undefined)[]>
): [string, ComponentShape][] {
  return adj.get(shapeId)?.map((node) => {
    const idx = adj.get(node)?.indexOf(shapeId);
    const name = namesMap.get(node)?.[idx!];
    const shape = editor.getShape(node)! as ComponentShape;
    return [name ?? "", shape];
  }) ?? [];
}
