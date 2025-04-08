import { Editor, stopEventPropagation } from "tldraw";
import { ComponentConfigText, ComponentShape } from ".";
import models from "./text-models.json";
import { useMemo } from "react";
import {
  BrainIcon,
  ComponentIcon,
  EyeIcon,
  FenceIcon,
  SpeechIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const defaultConfig = {
  type: "text",
  model: "",
  seed: null,
  json: false,
  private: true,
} as const;

export default function InstructionConfig({
  data,
  setData,
  shape,
}: {
  editor: Editor;
  data: ComponentConfigText;
  setData: React.Dispatch<React.SetStateAction<ComponentConfigText>>;
  shape: ComponentShape;
}) {
  const lastTextSeed =
    shape.props.data.find((d) => d.type === "text")?.seed || 0;
  const model = useMemo(
    () => models.find((m) => m.name === data.model),
    [data.model]
  );
  return (
    <div
      className="w-full h-full p-2 space-y-2"
      style={{
        pointerEvents: "all",
      }}
      onPointerDown={stopEventPropagation}
    >
      <div className="tl-text-wrapper" data-font={shape.props.font}>
        <div>
          <label htmlFor="model">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Model
            </span>
            <select
              value={data.model}
              onChange={(e) => {
                setData((prev) => ({ ...prev, model: e.target.value }));
              }}
              name="model"
              id="model"
              className="mt-0.5 w-full tl-cursor-pointer rounded bg-background text-foreground focus:ring-primary border-gray-300 shadow-sm sm:text-sm dark:border-gray-600"
            >
              <option value="">Default</option>
              {models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.description}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div
          className={cn(
            "flex items-start justify-around p-2 text-primary",
            !model && "hidden"
          )}
        >
          <BrainIcon
            className={model?.reasoning ? "opacity-100" : "opacity-50"}
          >
            <title>{`Reasoning: ${model?.reasoning ? "True" : "False"}`}</title>
          </BrainIcon>
          <EyeIcon className={model?.vision ? "opacity-100" : "opacity-50"}>
            <title>{`Vision: ${model?.vision ? "True" : "False"}`}</title>
          </EyeIcon>
          <SpeechIcon className={model?.audio ? "opacity-100" : "opacity-50"}>
            <title>{`Audio: ${model?.audio ? "True" : "False"}`}</title>
          </SpeechIcon>
          <ComponentIcon
            className={model?.baseModel ? "opacity-100" : "opacity-50"}
          >
            <title>{`Base Model: ${
              model?.baseModel ? "True" : "False"
            }`}</title>
          </ComponentIcon>
          <FenceIcon className={model?.censored ? "opacity-100" : "opacity-50"}>
            <title>{`Censored: ${model?.censored ? "True" : "False"}`}</title>
          </FenceIcon>
        </div>
        <div className="flex items-start gap-3 mt-2">
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              Seed:
            </label>
            <input
              type="number"
              value={data.seed || lastTextSeed}
              readOnly={data.seed === null}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  seed: parseInt(e.target.value),
                }));
              }}
              className="h-10 w-32 rounded-sm border-gray-200 sm:text-sm dark:border-gray-700 bg-background text-foreground read-only:text-gray-500 dark:read-only:text-gray-400"
            />
          </div>
          <div className="flex w-full h-10 max-w-sm items-center gap-1.5">
            <label className="inline-flex items-center justify-center gap-3">
              <input
                type="checkbox"
                checked={data.seed === null}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    seed: e.target.checked ? null : lastTextSeed,
                  }));
                }}
                className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-background dark:ring-offset-gray-900 dark:checked:bg-primary"
              />

              <span className="tl-cursor-pointer font-medium text-gray-700 dark:text-gray-200">
                Random
              </span>
            </label>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 mt-2">
          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              checked={data.json}
              onChange={(e) => {
                setData((prev) => ({ ...prev, json: e.target.checked }));
              }}
              className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-(--bg) dark:ring-offset-gray-900 dark:checked:bg-primary"
            />

            <span className="tl-cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              JSON Mode
            </span>
          </label>

          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              checked={data.private}
              onChange={(e) => {
                setData((prev) => ({ ...prev, private: e.target.checked }));
              }}
              className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-(--bg) dark:ring-offset-gray-900 dark:checked:bg-primary"
            />

            <span className="tl-cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              Private
            </span>
          </label>
        </div>
        <div className="w-full justify-between items-center flex mt-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            API Provided by{" "}
            <a
              href="https://pollinations.ai"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Pollinations.ai
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
