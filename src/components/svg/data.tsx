import {
  Box,
  DefaultFontFamilies,
  Editor,
  getDefaultColorTheme,
  SvgExportContext,
  TEXT_PROPS,
} from "tldraw";
import { ComponentShape } from "@/components/tools";
import { highlightJson } from "@/components/tools/html.ts";
import { FONT_SIZES } from "@/components/content/shared.ts";
import SVGContainer from "@/components/svg/container.tsx";

const dataSVGHeaderPath =
  "M3.5 15.9q-.6 0-1.1-.4-.5-.4-.7-1-.3-.6-.2-1.3 0-1.4.2-2.5.1-1.2.3-2.3-.6-.1-.9-.4-.4-.3-.4-.8.1-.4.5-.7.2-.1.8-.3.5-.2 1.2-.3l1.4-.2q.8-.1 1.4-.1 1.4 0 2.3.5.9.5 1.4 1.4.4.9.4 2.1-.1 1.3-.7 2.5t-1.6 2q-1 .9-2.1 1.3-1.1.5-2.2.5Zm.1-3.1q0 .5.1 1.1 1.2-.3 2.1-.9.9-.7 1.5-1.5.6-.9.6-1.9.1-.9-.4-1.4-.4-.4-1.6-.4h-1l-.8.2v.1q0 .9-.2 2t-.3 2.7Zm10.2 3.1q-1.2 0-1.9-.7t-.6-1.7q0-.9.5-1.8.4-.8 1.1-1.6.7-.7 1.6-1.1.9-.4 1.8-.4 1 0 1.1.7h.3q.5 0 .9.3t.5.8q.2.9.3 1.7.2.7.5 1.4t.9 1.4q.2.3.2.8-.1.4-.4.8-.3.3-.8.3-.3 0-.4-.1-.2-.1-.3-.3-.5-.7-.9-1.4t-.6-1.8q-.5 1-1.1 1.6-.7.6-1.4.8-.7.3-1.3.3Zm-.5-2.2v.1h.6q.8 0 1.6-.8.7-.9 1.1-2.6-.9.2-1.7.7-.7.5-1.1 1.2-.4.7-.5 1.4Zm12.5 2.8q-1.4 0-2.1-.5-.8-.6-1.1-1.6-.3-1.1-.2-2.4 0-1 .2-1.8.1-.7.3-1.4.1-.7.2-1.5.1-.7.1-1.2-.1-.5 0-.9 0-.4.2-.6.2-.2.6-.2.8 0 1.1.7.3.6.2 2.1-.1.4-.1.7-.1.4-.2.7.7-.2 1.4-.2.7-.1 1.2-.1.8 0 1.2.3.4.4.4.9 0 .3-.2.4-.2.2-.5.2-.8.1-1.5.2-.6 0-1.2.2-.6.1-1.2.3v.5q-.1.3-.1.7-.1 1.3.3 1.8.4.6 1.3.6.3 0 .5-.1t.4-.1.4-.1q.7 0 .6.8 0 .7-.6 1.2-.6.4-1.6.4Zm6.6-.6q-1.2 0-1.8-.7-.7-.7-.7-1.7.1-.9.5-1.8.5-.8 1.2-1.6.7-.7 1.6-1.1.8-.4 1.8-.4.9 0 1.1.7h.2q.6 0 1 .3.3.3.4.8.2.9.4 1.7.2.7.5 1.4t.9 1.4q.2.3.1.8 0 .4-.3.8-.3.3-.8.3-.3 0-.5-.1l-.3-.3q-.5-.7-.8-1.4-.4-.7-.6-1.8-.5 1-1.1 1.6-.7.6-1.4.8-.7.3-1.4.3Zm-.4-2.2v.1h.6q.8 0 1.6-.8.7-.9 1.1-2.6-1 .2-1.7.7-.7.5-1.1 1.2-.5.7-.5 1.4Z";

export default async function data({
  editor,
  shape,
  ctx,
}: {
  editor: Editor;
  shape: ComponentShape;
  ctx: SvgExportContext;
}) {
  const theme = getDefaultColorTheme(ctx);
  const exportBounds = new Box(8, 36, shape.props.w - 16, shape.props.h - 44);
  const html = highlightJson(shape.props.value);
  const fontSize = FONT_SIZES[shape.props.size];
  const font = shape.props.font;
  const labelColor = theme[shape.props.color].solid;
  const bounds = exportBounds;
  const padding = 10;
  const textAlign = "start" as const;
  const justifyContent = "flex-start" as const;
  const alignItems = "flex-start" as const;
  const wrapperStyle = {
    display: "flex",
    height: `100%`,
    justifyContent,
    alignItems,
    padding: `${padding}px`,
  };
  const style = {
    fontSize: `${fontSize}px`,
    fontFamily: DefaultFontFamilies[font],
    wrap: "wrap",
    color: labelColor,
    lineHeight: TEXT_PROPS.lineHeight,
    textAlign,
    width: "100%",
    wordWrap: "break-word" as const,
    overflowWrap: "break-word" as const,
    whiteSpace: "pre-wrap",
  };
  return (
    <SVGContainer
      editor={editor}
      shape={shape}
      ctx={ctx}
      headerPath={dataSVGHeaderPath}
    >
      <foreignObject
        x={bounds.minX}
        y={bounds.minY}
        width={bounds.w}
        height={bounds.h}
        className="tl-export-embed-styles tl-rich-text tl-rich-text-svg"
      >
        <div style={wrapperStyle}>
          <div
            dangerouslySetInnerHTML={{
              __html: html,
            }}
            style={style}
          />
        </div>
      </foreignObject>
    </SVGContainer>
  );
}
