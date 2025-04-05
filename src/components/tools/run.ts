import { Editor } from "tldraw";
import type {
  ComponentShape,
  ComponentTypeStyle,
  ComponentShapeProps,
} from ".";
import { textGeneration } from "./ai";
import {compressImage, loadImage} from "./utils";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { defaultConfig } from "./image";
import {getData, getInputText, getJSON, getText, hasImage, shapeToImage} from "./shapes";
import { mistql } from "@/components/tools/query";
import {getHtmlBlock} from "@/components/tools/html";

type MaybePromise<T> = T | Promise<T>;

export const runners: Record<
  ComponentTypeStyle,
  (props: {
    editor: Editor;
    shape: ComponentShape;
    signal?: AbortSignal;
  }) => MaybePromise<Partial<ComponentShapeProps>>
> = {
  text({ shape, editor }) {
    const { value, ...props} = getText({
      editor,
      shape,
      prefers: "text/html",
      support: ["text/html"],
    });
    return {
      value: value.startsWith('<p') ? value : `<p>${value}</p>`,
      ...props
    }
  },
  website({ shape, editor }) {
    const { value, ...props } = getText({
        editor,
        shape,
        prefers: "text/html",
        support: ["text/html"],
    });
    return {
      value: getHtmlBlock(value),
      ...props
    }
  },
  async image({ shape, editor, signal }) {
    const { namedInputs, unnamedInputs } = getData(
      editor,
      shape,
      "text/plain",
      ["text/plain", "image/*"],
    );
    const img = hasImage({unnamedInputs, namedInputs});
    if (img) {
      switch (img.type) {
        case "image":
          const image = await loadImage(img.src, signal);
          return {
            value: "",
            data: [
              {
                type: "image" as const,
                ...await compressImage({img: image}),
              },
            ],
          };
        case "frame":
          return {
            data: [
              {
                type: "image" as const,
                ...await shapeToImage(editor, img),
              },
            ],
          }
      }
    }
    const prompt = getInputText(namedInputs, unnamedInputs);
    if (!prompt) return {};
    const conf = shape.props.config || defaultConfig;
    if (conf.type !== "image") return {};
    const seed = conf.seed ?? Math.floor(Math.random() * 1000000000);
    const url = new URL(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,
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
      await loadImage(url.toString(), signal);
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
      "text/html",
      ["text/html", "text/plain", "image/*"],
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
  data({ shape, editor }) {
    const { namedInputs, unnamedInputs } = getData(
      editor,
      shape,
      "application/json",
      ["text/plain", "application/json"],
    );
    return getJSON({ namedInputs, unnamedInputs, shape });
  },
  query({ shape, editor }) {
    const { value, namedInputs, unnamedInputs } = getData(
      editor,
      shape,
      "application/json",
      ["text/plain", "text/html", "application/json"],
    );
    const { data } = getJSON({ namedInputs, unnamedInputs, shape });
    const ret = mistql.query(value, data[0].data);
    const out: ComponentShapeProps["data"] = [
      {
        type: "json",
        data: ret,
      },
    ];
    if ([
        "string",
        "number",
        "boolean",
        "bigint",
    ].includes(typeof ret)) {
      out.push({
        type: "text",
        text: String(ret),
      });
    }
    return {
      value: value,
      data: out,
    };
  },
  button() {
    return {
      value: "",
      data: [],
    };
  },
};
