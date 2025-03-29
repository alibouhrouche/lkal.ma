export const defaultImageConfig = {
  type: "image",
  model: "flux",
  seed: null,
  height: 1024,
  width: 1024,
  nologo: true,
  private: false,
  enhance: true,
  safe: false,
} as const;

export const defaultInstructionConfig = {
  type: "text",
  model: "",
  seed: null,
  json: false,
  private: true,
} as const;