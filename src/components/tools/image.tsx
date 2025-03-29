import {
  Box,
  Editor,
  FileHelpers,
  getDefaultColorTheme,
  preventDefault,
  stopEventPropagation,
  SvgExportContext,
  useEditor,
} from "tldraw";
import { ComponentConfigImage, ComponentShape, ComponentShapeProps } from ".";
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

export function ImageConfig({
  shape,
  data,
  setData,
}: {
  data: ComponentConfigImage;
  setData: React.Dispatch<
    React.SetStateAction<ComponentConfigImage>
  >;
  shape: ComponentShape;
}) {
  const lastImageSeed =
    shape.props.data.find((d) => d.type === "image")?.seed || 0;
  return (
    <div
      className="w-full h-full overflow-auto space-y-2"
    >
      <div
        className="w-full h-full p-2 tl-text-wrapper"
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
              className="w-full tl-cursor-pointer rounded bg-background text-foreground focus:ring-primary border-gray-300 shadow-sm sm:text-sm dark:border-gray-600"
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
              className="h-10 w-20 rounded-sm border-gray-200 sm:text-sm dark:border-gray-700 bg-background text-foreground focus:ring-primary"
            />
          </div>
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
              className="h-10 w-20 rounded-sm border-gray-200 sm:text-sm dark:border-gray-700 bg-background text-foreground focus:ring-primary"
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
                    seed: e.target.checked ? null : lastImageSeed,
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
              checked={data.nologo}
              onChange={(e) => {
                setData((prev) => ({ ...prev, nologo: e.target.checked }));
              }}
              className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-background dark:ring-offset-gray-900 dark:checked:bg-primary"
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
              className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-background dark:ring-offset-gray-900 dark:checked:bg-primary"
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
              className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-background dark:ring-offset-gray-900 dark:checked:bg-primary"
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
              className="tl-cursor-pointer size-5 rounded border-gray-300 shadow-sm dark:border-gray-600 bg-background dark:ring-offset-gray-900 dark:checked:bg-primary"
            />

            <span className="tl-cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              Safe
            </span>
          </label>
        </div>
        <div className="w-full justify-between items-center flex mt-2">
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
    <div className="relative w-full h-full">
      <img
        src={imageUrl}
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover"
        onDragStart={preventDefault}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={48}
        height={48}
        fill="none"
        className="absolute bottom-2 right-2 tl-cursor-pointer mix-blend-difference"
      >
        <path
          fill="#fff"
          fillRule="evenodd"
          d="m22.818 24.758-12.813 7.556c-1.988 1.173-1.96 4.057.05 5.19l12.801 7.222c.74.417 1.635.519 2.404.159 8.348-3.908 8.349-16.238.047-20.297-.794-.388-1.728-.279-2.489.17Zm1.61 1.627c-.08-.039-.297-.08-.594.096l-12.813 7.556a.996.996 0 0 0 .016 1.726l12.802 7.22c.288.163.496.126.573.09 6.787-3.177 6.848-13.348.016-16.688ZM38.086 10.982 25.275 3.426c-.76-.448-1.694-.557-2.488-.17-8.314 4.06-8.346 16.402-.009 20.3.769.358 1.662.256 2.401-.16a7776.32 7776.32 0 0 1 8.671-4.876l4.183-2.35c2.012-1.131 2.041-4.016.053-5.189ZM24.259 5.149l12.811 7.555a.994.994 0 0 1-.017 1.723l-4.18 2.349c-2.895 1.626-5.79 3.252-8.676 4.878-.288.162-.496.125-.572.09-6.76-3.16-6.818-13.343.04-16.69.08-.04.298-.08.594.095Z"
          clipRule="evenodd"
        />
      </svg>
      <div
        className="absolute bottom-0 right-0 w-5/12 h-5/12"
        style={{
          background: "linear-gradient(-45deg, black, transparent 50%)",
        }}
      ></div>
      {/* {isEditing && (
        <>
          <div className="absolute inset-0 bg-(--bg) opacity-75" />
          <ImageConfig shape={shape} />
        </>
      )} */}
    </div>
  );
});
