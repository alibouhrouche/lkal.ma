import mistql from "mistql";
import { Editor, TLArrowBinding, TLArrowShape } from "tldraw";
import type {
  ComponentShape,
  ComponentTypeStyle,
  ComponentShapeProps,
} from ".";

type MaybePromise<T> = T | Promise<T>;

function interpolate(str: string, data: Record<string, string>) {
  return str.replace(/{{([^}]+)}}/g, (_, query: string) => {
    const res = mistql.query(query, data);
    if (typeof res === "string") return res;
    return JSON.stringify(res, null, 2);
  });
}

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
          shape: editor.getShape(binding.toId) as ComponentShape,
        }));
      return shapes;
    })
    .flat();
}

function getInputs(editor: Editor, shape: ComponentShape) {
  return getInputsOutputPoints(editor, shape, true);
}
function getOutputs(editor: Editor, shape: ComponentShape) {
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
    const inputs = getInputs(editor, shape);
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
    let ins: Record<string, string> = {};
    inputs.forEach((input) => {
      const dom = new DOMParser().parseFromString(
        input.shape.props.value,
        "text/html"
      );
      const value = dom.body.textContent || "";
      if (input.name) ins[input.name] = value;
      else if (value.startsWith("{")) {
        let data = {};
        try {
          console.log(value);
          data = JSON.parse(value);
        } catch (e) {
          console.error(e);
        }
        ins = { ...ins, ...data };
      }
    });
    return {
      data: [
        {
          type: "text",
          text: interpolate(shape.props.value, ins),
        },
      ],
    };
  },
  button() {
    return {
      value: "",
      data: [],
    };
  },
};
