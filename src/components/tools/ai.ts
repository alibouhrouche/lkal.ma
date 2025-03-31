import { Editor } from "tldraw";
import { getInputText, NamedInputsData, ShapeData } from "./shapes";
import models from "./text-models.json";
import { blobToBase64 } from "./utils";

export async function getImageData(
  editor: Editor,
  namedInputs: NamedInputsData,
  unnamedInputs: ShapeData[],
) {
  for (const input of unnamedInputs) {
    if (input.type === "image") {
      return input.src;
    }
    if (input.type === "frame") {
      const shapes = Array.from(editor.getShapeAndDescendantIds([input.id]));
      const image = await editor.toImage(shapes, {
        darkMode: false,
        format: "jpeg",
        quality: 0.7,
      });
      if (!image) {
        return;
      }
      return await blobToBase64(image.blob);
    }
  }
  const namedEntries = Object.entries(namedInputs);
  for (const [, input] of namedEntries) {
    const image = input.find((data) => data.type === "image");
    const frame = input.find((data) => data.type === "frame");
    if (image) {
      return image.src;
    }
    if (frame) {
      const shapes = Array.from(editor.getShapeAndDescendantIds([frame.id]));
      const image = await editor.toImage(shapes, {
        darkMode: false,
        format: "jpeg",
        quality: 0.7,
      });
      if (!image) {
        return;
      }
      return await blobToBase64(image.blob);
    }
  }
}

async function inputsToMessages(
  editor: Editor,
  value: string,
  namedInputs: NamedInputsData,
  unamedInputs: ShapeData[],
  vision: boolean = false,
) {
  const joinedText = getInputText(namedInputs, unamedInputs);
  if (!joinedText) {
    return [
      {
        role: "user",
        content: value,
      },
    ];
  }
  const messages = [];
  const image = vision
    ? await getImageData(editor, namedInputs, unamedInputs)
    : null;
  if (joinedText) {
    if (value) {
      messages.push({
        role: "system",
        content: value,
      });
    }
    if (image) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: joinedText },
          {
            type: "image_url",
            image_url: {
              url: image,
            },
          },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: joinedText,
      });
    }
  } else {
    if (value) {
      if (image) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: value },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        });
      } else {
        messages.push({
          role: "user",
          content: value,
        });
      }
    }
  }
  return messages;
}

export async function textGeneration({
  editor,
  value,
  namedInputs,
  unnamedInputs,
  seed,
  model,
  jsonMode = false,
  privateMode = true,
  signal,
}: {
  editor: Editor;
  value: string;
  seed: number;
  model?: string;
  jsonMode?: boolean;
  namedInputs: NamedInputsData;
  unnamedInputs: ShapeData[];
  privateMode?: boolean;
  signal?: AbortSignal;
}) {
  const vision = models.find((m) => m.name === model)?.vision || false;
  let modelProps: {
    model?: string;
    reasoning?: string;
  } = {
    model,
  };
  if (model?.includes(":")) {
    const [name, reasoning] = model.split(":");
    modelProps = {
      model: name,
      reasoning: reasoning,
    };
  }
  const messages = await inputsToMessages(
    editor,
    value,
    namedInputs,
    unnamedInputs,
    vision,
  );
  const response = await fetch("https://text.pollinations.ai/", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      ...modelProps,
      jsonMode,
      seed,
      private: privateMode,
    }),
  });
  return await response.text();
}
