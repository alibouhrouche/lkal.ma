import { preventDefault, stopEventPropagation, useEditor } from "tldraw";
import { ComponentShape } from ".";
import React, { useState } from "react";
import { Button } from "../ui/button";

export const defaultConfig = {
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

function ImageConfig({ shape }: { shape: ComponentShape }) {
  const editor = useEditor();
  const [data, setData] = useState(shape.props.config || defaultConfig);
  const lastImageSeed =
    shape.props.data.find((d) => d.type === "image")?.seed || 0;
  return (
    <div
      className="absolute inset-0 overflow-y-auto"
      style={{ pointerEvents: "all" }}
      onPointerDown={stopEventPropagation}
    >
      <div
        className="w-full h-full p-4 tl-text-wrapper"
        data-font={shape.props.font}
      >
        <div>
          <label htmlFor="model">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Model
            </span>

            <select
              value={data.model || "flux"}
              onChange={(e) => {
                setData((prev) => ({ ...prev, model: e.target.value }));
              }}
              name="model"
              id="model"
              className="mt-0.5 w-full tl-cursor-pointer rounded bg-(--bg) text-(--fg) border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 "
            >
              <option value="flux">Flux</option>
              <option value="flux-pro">Flux-pro</option>
              <option value="flux-realism">Flux-realism</option>
              <option value="flux-anime">Flux-anime</option>
              <option value="flux-3d">Flux-3d</option>
              <option value="flux-cablyai">Flux-cablyai</option>
              <option value="turbo">Turbo</option>
            </select>
          </label>
        </div>
        <div className="flex items-start gap-3 mt-2">
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              Height:
            </label>
            <input
              type="number"
              value={data.height}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  height: parseInt(e.target.value),
                }));
              }}
              className="h-10 w-24 rounded-sm border-gray-200 sm:text-sm dark:border-gray-700 bg-(--bg) text-(--fg)"
            />
          </div>
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              Width:
            </label>
            <input
              type="number"
              value={data.width}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  width: parseInt(e.target.value),
                }));
              }}
              className="h-10 w-24 rounded-sm border-gray-200 sm:text-sm dark:border-gray-700 bg-(--bg) text-(--fg)"
            />
          </div>
        </div>
        <div className="flex items-start gap-3 mt-2">
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              Seed:
            </label>
            <input
              type="number"
              value={data.seed || lastImageSeed}
              readOnly={data.seed === null}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  seed: parseInt(e.target.value),
                }));
              }}
              className="h-10 min-w-24 max-w-38 rounded-sm border-gray-200 sm:text-sm dark:border-gray-700 bg-(--bg) text-(--fg) read-only:text-gray-500 dark:read-only:text-gray-400"
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
                    seed: e.target.checked ? null : lastImageSeed,
                  }));
                }}
                className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-(--bg) dark:ring-offset-gray-900 dark:checked:bg-primary"
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
              checked={data.nologo}
              onChange={(e) => {
                setData((prev) => ({ ...prev, nologo: e.target.checked }));
              }}
              className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-(--bg) dark:ring-offset-gray-900 dark:checked:bg-primary"
            />

            <span className="tl-cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              No Logo
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

          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              checked={data.enhance}
              onChange={(e) => {
                setData((prev) => ({ ...prev, enhance: e.target.checked }));
              }}
              className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-(--bg) dark:ring-offset-gray-900 dark:checked:bg-primary"
            />

            <span className="tl-cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              Enhance
            </span>
          </label>

          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              checked={data.safe}
              onChange={(e) => {
                setData((prev) => ({ ...prev, safe: e.target.checked }));
              }}
              className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-(--bg) dark:ring-offset-gray-900 dark:checked:bg-primary"
            />

            <span className="tl-cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              Safe
            </span>
          </label>
        </div>
        <div className="w-full justify-end flex mt-2">
          <Button
            className="tl-cursor-pointer"
            onClick={() => {
              editor.updateShape({
                id: shape.id,
                type: shape.type,
                props: {
                  ...shape.props,
                  config: data,
                },
              });
              editor.setEditingShape(null);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(function ImageContent({
  shape,
  isEditing,
}: {
  shape: ComponentShape;
  isEditing?: boolean;
}) {
  const image = shape.props.data.find((d) => d.type === "image");
  const imageUrl = image?.src || "/placeholder.svg";
  return (
    <div
      className="relative w-full h-full"
      onContextMenu={stopEventPropagation}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover"
        onDragStart={preventDefault}
      />
      {isEditing && (
        <>
          <div className="absolute inset-0 bg-(--bg) opacity-75" />
          <ImageConfig shape={shape} />
        </>
      )}
    </div>
  );
});
