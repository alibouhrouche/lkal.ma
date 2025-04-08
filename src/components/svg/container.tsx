import { PropsWithChildren } from "react";
import { Editor, getDefaultColorTheme, SvgExportContext } from "tldraw";
import { ComponentShape } from "@/components/tools";

export default function SVGContainer({
  editor,
  shape,
  ctx,
  children,
  headerPath,
}: PropsWithChildren<{
  editor: Editor;
  shape: ComponentShape;
  ctx: SvgExportContext;
  headerPath?: string;
}>) {
  const bounds = editor.getShapeGeometry(shape).bounds;
  const width = bounds.width / (shape.props.scale ?? 1);
  const height = bounds.height / (shape.props.scale ?? 1);

  const scaleX = width / shape.props.w;
  const scaleY = height / shape.props.h;

  const theme = getDefaultColorTheme(ctx);

  return (
    <g>
      <g
        transform={`scale(${scaleX}, ${scaleY})`}
        clipPath="inset(0% round 10px)"
      >
        <rect
          x="0"
          y="0"
          width={shape.props.w}
          height={shape.props.h}
          fill={theme[shape.props.color].semi}
          stroke={ctx?.isDarkMode ? "#6D28D9" : "#7C3AED"}
          rx="10px"
          ry="10px"
          strokeLinecap="round"
          strokeWidth={2}
        ></rect>
        <g fill={theme[shape.props.color].solid} transform="translate(4, 4)">
          <circle cx="9" cy="12" r="2"></circle>
          <circle cx="9" cy="5" r="2"></circle>
          <circle cx="9" cy="19" r="2"></circle>
          <circle cx="15" cy="12" r="2"></circle>
          <circle cx="15" cy="5" r="2"></circle>
          <circle cx="15" cy="19" r="2"></circle>
        </g>
        <path
          fill={theme[shape.props.color].solid}
          d={headerPath}
          transform="translate(30 5)"
        ></path>
        {children}
      </g>
    </g>
  );
}
