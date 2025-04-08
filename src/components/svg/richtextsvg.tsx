import {DefaultFontFamilies, RichTextSVGProps, TEXT_PROPS} from "tldraw";
import { rehightlight } from "../tools/html";

export default function RichTextSVG({
  bounds,
  html,
  fontSize,
  font,
  align,
  verticalAlign,
  wrap,
  labelColor,
  padding,
}: Omit<RichTextSVGProps, "richText"> & {
  html: string;
}) {
  const textAlign =
    align === "middle"
      ? ("center" as const)
      : align === "start"
        ? ("start" as const)
        : ("end" as const);
  const justifyContent =
    align === "middle"
      ? ("center" as const)
      : align === "start"
        ? ("flex-start" as const)
        : ("flex-end" as const);
  const alignItems =
    verticalAlign === "middle"
      ? "center"
      : verticalAlign === "start"
        ? "flex-start"
        : "flex-end";
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
    wrap: wrap ? "wrap" : "nowrap",
    color: labelColor,
    lineHeight: TEXT_PROPS.lineHeight,
    textAlign,
    width: "100%",
    wordWrap: "break-word" as const,
    overflowWrap: "break-word" as const,
    whiteSpace: "pre-wrap",
  };

  return (
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
            __html: rehightlight(html),
          }}
          style={style}
        />
      </div>
    </foreignObject>
  );
}
