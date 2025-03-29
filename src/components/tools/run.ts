import mistql from "mistql";
import { Editor, TLArrowBinding, TLArrowShape, TLDefaultShape } from "tldraw";
import type {
  ComponentShape,
  ComponentTypeStyle,
  ComponentShapeProps,
} from ".";
import { preloadImage, textGeneration } from "./ai";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { defaultConfig } from "./image";
import { getData, getInputData, getInputText } from "./shapes";

type MaybePromise<T> = T | Promise<T>;

function interpolate(str: string, data: Record<string, string>) {
  return str.replace(/{{([^}]+)}}/g, (_, query: string) => {
    const res = mistql.query(query, data);
    if (typeof res === "string") return res;
    return JSON.stringify(res, null, 2);
  });
}

// function getData(shapes: (ComponentShape | TLDefaultShape)[]) {
//   return shapes.map((shape) => {
//     switch
//   });
// }

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

export const runners: Record<
  ComponentTypeStyle,
  (props: {
    editor: Editor;
    shape: ComponentShape;
    signal?: AbortSignal;
  }) => MaybePromise<Partial<ComponentShapeProps>>
> = {
  text({ shape, editor }) {
    const inputs = getInputs(editor, shape) as {
      name?: string;
      shape: ComponentShape;
    }[];
    const outputs = getOutputs(editor, shape);
    if (outputs.length === 0 && inputs.length === 1 && !inputs[0].name) {
      const input = inputs
        .map((input) => input.shape.props.data.find((d) => d.type === "text"))
        .filter(Boolean)
        .map((d) => d?.text)
        .join("\n");
      if (input) {
        return {
          value: input,
          data: [
            {
              type: "text",
              text: input,
            },
          ],
        };
      }
    }
    if (inputs.length === 0)
      return {
        data: [{ type: "text", text: shape.props.value }],
      };
    const ins: Record<string, string> = {};
    const unamed = inputs.filter(
      (input) =>
        !input.name && input.shape.props.data.some((d) => d.type === "text")
    );
    const named = inputs.filter(
      (input) =>
        input.name && input.shape.props.data.some((d) => d.type === "text")
    );
    let value = shape.props.value;
    if (unamed.length === 1) {
      value = unamed
        .map((input) => input.shape.props.data.find((d) => d.type === "text"))
        .filter(Boolean)
        .map((d) => d?.text)
        .join("\n");
    }
    named.forEach((input) => {
      const data = input.shape.props.data.find((d) => d.type === "text");
      const dom = new DOMParser().parseFromString(
        data?.text || "",
        "text/html"
      );
      const value = dom.body.textContent || "";
      ins[input.name!] = value;
    });
    return {
      value,
      data: [
        {
          type: "text",
          text: interpolate(value, ins),
        },
      ],
    };
  },
  async image({ shape, editor, signal }) {
    const { namedInputs, unnamedInputs } = getData(
      editor,
      shape,
      "text/plain",
      ["text/plain"]
    );
    const prompt = getInputText(namedInputs, unnamedInputs);
    if (!prompt) return {};
    const conf = shape.props.config || defaultConfig;
    if (conf.type !== "image") return {};
    const seed = conf.seed ?? Math.floor(Math.random() * 1000000000);
    const url = new URL(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
    );
    url.searchParams.set("width", `${conf.width}`);
    url.searchParams.set("height", `${conf.height}`);
    url.searchParams.set("seed", `${seed}`);
    url.searchParams.set("model", conf.model);
    url.searchParams.set("nologo", conf.nologo ? "true" : "false");
    url.searchParams.set("enhance", conf.enhance ? "true" : "false");
    url.searchParams.set("safe", conf.safe ? "true" : "false");
    url.searchParams.set("private", conf.private ? "true" : "false");

    // Optimistically update the shape with the new image
    editor.updateShape({
      id: shape.id,
      type: "component",
      props: {
        ...shape.props,
        value: "",
        data: [
          {
            type: "image",
            src: url.toString(),
            seed,
            width: conf.width,
            height: conf.height,
            model: conf.model,
            description: prompt,
          },
        ],
      },
    });

    try {
      await preloadImage(url.toString(), signal);
    } catch (e) {
      console.error(e);
    }

    return {
      value: "",
      data: [
        {
          type: "image",
          src: url.toString(),
          seed,
          width: 1024,
          height: 1024,
          model: "flux",
          description: prompt,
        },
      ],
    };
  },
  async instruction({ shape, editor, signal }) {
    const { value, config, namedInputs, unnamedInputs } = getData(
      editor,
      shape,
      "text/plain",
      ["text/html", "text/plain", "image/*"]
    );
    const conf = config?.type === "text" ? config : null;
    if (!value)
      return {
        data: [],
      };
    const seed = Math.floor(Math.random() * 1000000);
    const markdown = await textGeneration({
      editor,
      value,
      model: conf?.model,
      jsonMode: conf?.json,
      privateMode: conf?.private,
      namedInputs,
      unnamedInputs,
      seed,
      signal,
    });
    const html = await marked.parse(markdown);
    const text = DOMPurify.sanitize(html);
    return {
      data: [
        {
          type: "text",
          text,
          seed,
        },
      ],
    };
  },
  debug({ shape, editor }) {
    const {
      namedInputs,
      unnamedInputs,
    } = getData(
      editor,
      shape,
      "text/plain",
      ["text/html", "text/plain", "image/*"]
    );
    const inputs = getInputData({
      namedInputs,
      unnamedInputs,
    })
    console.log("inputs", inputs);
    return {
      value: "",
      data: []
    }
  },
  button() {
    return {
      value: "",
      data: [],
    };
  },
};
