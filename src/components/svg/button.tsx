import { Editor, getDefaultColorTheme, SvgExportContext } from "tldraw";
import { ComponentShape } from "@/components/tools";

const ICON_SIZES = {
  s: 16,
  m: 24,
  l: 32,
  xl: 48,
};

export default function buttonSVG({
  editor,
  shape,
  ctx,
}: {
  editor: Editor;
  shape: ComponentShape;
  ctx: SvgExportContext;
}) {
  const bounds = editor.getShapeGeometry(shape).bounds;
  const width = bounds.width / (shape.props.scale ?? 1);
  const height = bounds.height / (shape.props.scale ?? 1);

  const size = ICON_SIZES[shape.props.size];
  const scaleX = 24 / size;
  const scaleY = 24 / size;

  const theme = getDefaultColorTheme(ctx);

  const min = Math.min(width, height);

  return (
    <g>
      <g height={height} width={width}>
        <circle
          cx={width / 2}
          cy={height / 2}
          r={min / 2}
          fill={theme[shape.props.color].semi}
        />
        <g
          transform={`translate(${(width - 24) / 2}, ${
            (height - 24) / 2
          }) scale(${scaleX}, ${scaleY})`}
          fill="none"
          stroke={theme[shape.props.color].solid}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <path d="m6 3 14 9-14 9V3z" />
        </g>
      </g>
    </g>
  );
}
