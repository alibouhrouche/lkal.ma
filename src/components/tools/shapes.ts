import {
  Editor,
  renderHtmlFromRichText,
  renderPlaintextFromRichText,
  TLArrowBinding,
  TLArrowShape,
  TLDefaultShape,
  TLShapeId,
} from "tldraw";
import { ComponentShape } from ".";

function getInputsOutputPoints(
  editor: Editor,
  shape: ComponentShape,
  input: boolean
) {
  return editor
    .getBindingsToShape(shape, "arrow")
    .filter((binding) => {
      return (
        binding.type === "arrow" &&
        (binding as TLArrowBinding).props.terminal === (input ? "end" : "start")
      );
    })
    .map((binding) => {
      const arrow: TLArrowShape | undefined = editor.getShape(binding.fromId);
      const arrowText = arrow?.props.text;
      const shapes = editor
        .getBindingsFromShape(binding.fromId, "arrow")
        .filter((binding) => {
          return (
            binding.type === "arrow" &&
            (binding as TLArrowBinding).props.terminal ===
              (input ? "start" : "end")
          );
        })
        .map((binding) => ({
          name: arrowText,
          shape: editor.getShape(binding.toId) as
            | ComponentShape
            | TLDefaultShape,
        }));
      return shapes;
    })
    .flat();
}

export function getInputs(editor: Editor, shape: ComponentShape) {
  return getInputsOutputPoints(editor, shape, true);
}
export function getOutputs(editor: Editor, shape: ComponentShape) {
  return getInputsOutputPoints(editor, shape, false);
}

export type ShapeData =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image";
      src: string;
    }
  | {
      type: "html";
      html: string;
    }
  | {
      type: "frame";
      id: TLShapeId;
    };

export type ShapeDataWithName = {
  name?: string;
} & ShapeData;

export type NamedInputsData = {
  [key: string]: ShapeData[];
};

export type NamedOutputsData = {
  [key: string]: string;
};

type DataTypes = "text/plain" | "text/html" | "image/*";

function resolveData(
  editor: Editor,
  shape: ComponentShape | TLDefaultShape,
  prefers: DataTypes,
  supports: DataTypes[]
): ShapeData[] {
  const support = supports.map((s) => s.split("/")[0]);
  if (shape.type !== "component") {
    switch (shape.type) {
      case "text": {
        if (!support.includes("text")) return [];
        if (prefers === "text/plain") {
          return [
            {
              type: "text",
              text: renderPlaintextFromRichText(editor, shape.props.richText),
            },
          ];
        } else {
          return [
            {
              type: "html",
              html: renderHtmlFromRichText(editor, shape.props.richText),
            },
          ];
        }
      }
      case "image": {
        if (!support.includes("image")) return [];
        if (shape.props.assetId) {
          const asset = editor.getAsset(shape.props.assetId);
          if (!asset) return [];
          return [
            {
              type: "image",
              src: asset?.props.src ?? shape.props.url,
            },
          ];
        }
        if (!shape.props.url) return [];
        return [
          {
            type: "image",
            src: shape.props.url,
          },
        ];
      }
      case "frame": {
        if (!support.includes("image")) return [];
        return [
          {
            type: "frame",
            id: shape.id,
          },
        ];
      }
    }
    return [];
  }
  const data = shape.props.data;
  const out: ShapeData[] = [];
  for (const d of data) {
    if (!support.includes(d.type)) {
      continue;
    }
    if (d.type === "text") {
      if (prefers === "text/plain") {
        const text = new DOMParser().parseFromString(d.text, "text/html").body
          .textContent;
        out.push({
          type: "text",
          text: text || "",
        });
      } else {
        out.push({
          type: "html",
          html: d.text,
        });
      }
    } else if (d.type === "image") {
      out.push({
        type: "image",
        src: d.src,
      });
    }
  }
  return out;
}

export function getData(
  editor: Editor,
  shape: ComponentShape,
  prefers: DataTypes = "text/html",
  support: DataTypes[] = ["text/plain"]
) {
  const inputs = getInputs(editor, shape);
  const outputs = getOutputs(editor, shape);
  const namedInputs: Record<string, ShapeData[]> = {};
  const unnamedInputs: ShapeData[] = [];
  const namedOutputs: Record<string, string> = {};
  const unnamedOutputs: string[] = [];
  let value = shape.props.value;
  if (prefers === "text/plain") {
    const text = new DOMParser().parseFromString(value, "text/html").body
      .textContent;
    value = text || "";
  }
  for (const input of inputs) {
    const data = resolveData(editor, input.shape, prefers, support);
    if (input.name) {
      namedInputs[input.name] = data;
    } else {
      unnamedInputs.push(...data);
    }
  }
  for (const output of outputs) {
    const shape = output.shape;
    const type =
      shape.type === "component" ? shape.props.component : shape.type;
    if (output.name) {
      namedOutputs[output.name] = type;
    } else {
      unnamedOutputs.push(type);
    }
  }
  return {
    unnamedInputs,
    namedInputs,
    unnamedOutputs,
    namedOutputs,
    value,
    config: shape.props.config,
    type: shape.props.component,
    id: shape.id,
  };
}

export function getInputData({
  namedInputs,
  unnamedInputs = [],
}: {
  namedInputs?: Record<string, ShapeData[]>;
  unnamedInputs?: ShapeData[];
}) {
  const inputs: ShapeDataWithName[] = [];
  for (const key in namedInputs) {
    inputs.push({
      name: key,
      ...namedInputs[key][0],
    });
  }
  for (const input of unnamedInputs) {
    inputs.push({
      ...input,
    });
  }
  return inputs;
}

export function getInputText(
  namedInputs: NamedInputsData,
  unamedInputs: ShapeData[]
) {
  const namedEntries = Object.entries(namedInputs);
  if (namedEntries.length === 0 && unamedInputs.length === 0) {
    return "";
  }
  let textContent = [];
  if (unamedInputs.length > 0) {
    textContent.push(
      unamedInputs
        .filter((input) => input.type === "text")
        .map((input) => input.text)
        .join("\n---\n")
    );
  }
  if (namedEntries.length > 0) {
    for (const [name, input] of namedEntries) {
      const text = input.find((data) => data.type === "text")?.text;
      if (text) {
        textContent.push(`<${name}>${text}</${name}>`);
      }
    }
  }
  return textContent.join("\n");
}
