import {
  Editor,
  renderHtmlFromRichText,
  renderPlaintextFromRichText,
  renderRichTextFromHTML,
  TLArrowBinding,
  TLArrowShape,
  TLDefaultShape,
  TLShapeId,
} from "tldraw";
import { ComponentShape } from ".";
import { interpolate } from "@/components/tools/query.ts";
import { escapeHtml } from "@/components/tools/html.ts";
import {compressImage, loadImageBlob} from "@/components/tools/utils.ts";
import toMarkdown from "@/components/tools/markdown.ts";

function getInputsOutputPoints(
  editor: Editor,
  shape: ComponentShape,
  input: boolean,
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
      return editor
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
    }
  | {
      type: "json";
      data: any;
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

type DataTypes = "text/plain" | "text/html" | "image/*" | "application/json";

function resolveData(
  editor: Editor,
  shape: ComponentShape | TLDefaultShape,
  prefers: DataTypes,
  supports: DataTypes[],
): ShapeData[] {
  const support = supports.map((s) => {
    if (s.startsWith("application/")) {
      return s.split("/")[1];
    }
    return s.split("/")[0];
  });
  if (shape.type !== "component") {
    switch (shape.type) {
      case "text": {
        if (!support.includes("text")) return [];
        if (prefers === "text/plain" || !supports.includes("text/html")) {
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
      if (prefers === "text/plain" || !supports.includes("text/html")) {
        const text = renderPlaintextFromRichText(
          editor,
          renderRichTextFromHTML(editor, d.text),
        );
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
    } else if (d.type === "json") {
      out.push({
        type: "json",
        data: d.data,
      });
    }
  }
  return out;
}

export function getData(
  editor: Editor,
  shape: ComponentShape,
  prefers: DataTypes = "text/html",
  support: DataTypes[] = ["text/plain"],
) {
  const inputs = getInputs(editor, shape);
  const outputs = getOutputs(editor, shape);
  const namedInputs: Record<string, ShapeData[]> = {};
  const unnamedInputs: ShapeData[] = [];
  const namedOutputs: Record<string, string> = {};
  const unnamedOutputs: string[] = [];
  let value = shape.props.value;
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  // if (prefers === "text/plain" || !support.includes("text/html")) {
  //   const text = renderPlaintextFromRichText(
  //     editor,
  //     renderRichTextFromHTML(editor, value),
  //   );
  //
  //   value = text || "";
  // }
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

export async function shapeToImage(
  editor: Editor,
  data: Extract<ShapeData, { type: "frame" }>,
) {
  const set = editor.getShapeAndDescendantIds([data.id]);
  const shapes = Array.from(set);
  const image = await editor.toImage(shapes, {
    darkMode: false,
    format: "jpeg",
    quality: 0.7,
  });
  if (!image) {
    throw new Error("Failed to convert shape to image");
  }

  return await compressImage({
    img: await loadImageBlob(image.blob),
  })
}

export function hasImage({
  unnamedInputs,
  namedInputs,
}: {
  unnamedInputs: ShapeData[];
  namedInputs: NamedInputsData;
}) {
  const inputs = getInputData({ unnamedInputs, namedInputs });
  return inputs.find(
    (input) => input.type === "image" || input.type === "frame",
  );
}

export function dataToArray({
  unnamedInputs,
  namedInputs,
  unnamedOutputs,
  namedOutputs,
}: {
  unnamedInputs: ShapeData[];
  namedInputs: NamedInputsData;
  unnamedOutputs: string[];
  namedOutputs: NamedOutputsData;
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
  const outputs = [];
  for (const key in namedOutputs) {
    outputs.push({
      name: key,
      type: namedOutputs[key],
    });
  }
  for (const output of unnamedOutputs) {
    outputs.push({
      type: output,
    });
  }
  return {
    inputs,
    outputs,
  };
}

function getSingleValue(data: ShapeData) {
  switch (data.type) {
    case "text":
      return data.text;
    case "image":
      return data.src;
    case "html":
      return data.html;
    case "frame":
      return data.id;
    case "json":
      return data.data;
  }
}

export function getValue(data: ShapeData[]) {
  if (data.length === 0) return "";
  if (data.length === 1) {
    return getSingleValue(data[0]);
  }
  let json;
  let text = "";
  for (const d of data) {
    if (d.type === "json") {
      json = d.data;
    }
    if (d.type === "text") {
      text = d.text;
    }
  }
  if (json) {
    return json;
  }
  return text;
}

export function getText({
  editor,
  shape,
  prefers,
  support,
}: {
  editor: Editor;
  shape: ComponentShape;
  prefers?: DataTypes;
  support?: DataTypes[];
}) {
  const { unnamedInputs, namedInputs } = getData(
    editor,
    shape,
    prefers,
    support,
  );
  let currValue =
    typeof shape.props.value === "object"
      ? JSON.stringify(shape.props.value)
      : shape.props.value;
  let json: Record<string, any> = {};
  let object: Record<string, any> = {};
  let entries = Object.entries(namedInputs);
  for (const input of unnamedInputs) {
    if (prefers === "text/html" && input.type === "html") {
      currValue = input.html;
    } else if (prefers === "text/plain" && input.type === "text") {
      currValue = escapeHtml(input.text);
    } else if (input.type === "json") {
      json = input.data;
    }
  }
  for (const [name, value] of entries) {
    object[name] = getValue(value);
  }
  if (entries.length > 0) {
    if (typeof json !== "object" || Array.isArray(json)) {
      json = {
        ...object,
        _: json,
      };
    } else {
      json = {
        ...json,
        ...object,
      };
    }
  }
  return {
    value: currValue,
    data: [
      {
        type: "text" as const,
        text: interpolate(currValue, json),
      },
    ],
  };
}

export function getJSON({
  namedInputs,
  unnamedInputs = [],
  shape,
}: {
  namedInputs: Record<string, ShapeData[]>;
  unnamedInputs: ShapeData[];
  shape: ComponentShape;
}) {
  if (Object.keys(namedInputs).length > 0) {
    const data = Object.entries(namedInputs).reduce(
      (acc, [key, value]) => {
        const input =
          value.find((d) => d.type === "json")?.data ??
          value.find((d) => d.type === "text")?.text;
        if (input) {
          acc[key] = input;
        }
        return acc;
      },
      {} as Record<string, any>,
    );
    return {
      value: data,
      data: [
        {
          type: "json" as const,
          data,
        },
      ],
    };
  }
  if (unnamedInputs.length > 0) {
    const data =
      unnamedInputs.find((d) => d.type === "json")?.data ??
      unnamedInputs.find((d) => d.type === "text")?.text;
    if (data) {
      return {
        value: data,
        data: [
          {
            type: "json" as const,
            data: data,
          },
        ],
      };
    }
  }
  return {
    data: [
      {
        type: "json" as const,
        data: shape.props.value,
      },
    ],
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
  unnamedInputs: ShapeData[],
) {
  const namedEntries = Object.entries(namedInputs);
  if (namedEntries.length === 0 && unnamedInputs.length === 0) {
    return "";
  }
  let textContent = [];
  if (unnamedInputs.length > 0) {
    textContent.push(
      unnamedInputs
        .filter((input) => input.type === "html")
        .map((input) => toMarkdown(input.html))
        .join("\n---\n"),
    );
  }
  if (namedEntries.length > 0) {
    for (const [name, input] of namedEntries) {
      const text = input.find((data) => data.type === "html")?.html;
      if (text) {
        textContent.push(`<${name}>${toMarkdown(text)}</${name}>`);
      }
    }
  }
  return textContent.join("\n");
}
