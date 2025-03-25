import { ComponentShape } from ".";

export function preloadImage(url: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function inputsToMessages(
  value: string,
  inputs: { shape: ComponentShape; name?: string }[]
) {
  const textInputs = inputs.filter((input) =>
    input.shape.props.data.some((data) => data.type === "text")
  );
  if (textInputs.length === 0) {
    return [
      {
        role: "user",
        content: value,
      },
    ];
  }
  const unnamedInputs = textInputs
    .filter((input) => !input.name)
    .map((input) => {
      const text = input.shape.props.data.find(
        (data) => data.type === "text"
      )?.text;
      if (!text) {
        return "";
      }
      const dom = new DOMParser().parseFromString(text, "text/html");
      const value = dom.body.textContent || "";
      return value;
    })
    .join("\n---\n");
  const namedInputs = textInputs
    .filter((input) => input.name)
    .map((input) => {
      const text = input.shape.props.data.find(
        (data) => data.type === "text"
      )?.text;
      if (!text) {
        return "";
      }
      const dom = new DOMParser().parseFromString(text, "text/html");
      const value = dom.body.textContent || "";
      return `<${input.name}>${value}</${input.name}>`;
    })
    .join("\n");
  return [
    {
      role: "system",
      content: value,
    },
    {
      role: "user",
      content: `${unnamedInputs}\n${namedInputs}`,
    },
  ];
}

export async function textGeneration({
  value,
  inputs,
  seed,
  model,
}: {
  value: string;
  seed: number;
  model?: string;
  inputs: { shape: ComponentShape; name?: string }[];
}) {
  const messages = inputsToMessages(value, inputs);
  const response = await fetch("https://text.pollinations.ai/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      model,
      seed,
      private: true,
    }),
  });
  return await response.text();
}
