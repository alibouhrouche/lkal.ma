import { Editor, SvgExportContext } from "tldraw";
import { ComponentShape } from "@/components/tools";
import SVGContainer from "@/components/svg/container.tsx";

const websiteSVGHeaderPath =
  "M11.1 15.7q-.5 0-.9-.2t-.8-.8q-.4-.4-.6-1-.2-.6-.4-1.3-.2-.7-.4-1.3-.2-.6-.5-1.1-.7.8-1.3 2.1-.6 1.3-1 2.7-.3.9-1.2.9-.3 0-.7-.2-.3-.2-.6-1-.5-.9-.8-2.1l-.6-2.6q-.2-1.3-.2-2.4 0-.5.2-.8.2-.3.8-.3.7 0 1 .4.3.3.3.9l.2 2.2q.2 1.1.6 2.1.4-1.2.9-2.2.5-.9 1.1-1.5.4-.5.8-.7.4-.3.9-.3.6 0 1 .4.3.4.6 1.2.2.5.3 1.1l.4 1.4q.2.8.6 1.5.3-.7.5-1.5t.3-1.6q.2-.8.4-1.5t.4-1.1q.2-.5.5-.6.3-.2.7-.2.5 0 .7.3.3.3.3.7 0 .5-.2 1l-.5 1.5q-.2.8-.4 1.7l-.6 1.8q-.2.8-.6 1.5-.2.5-.5.7-.3.2-.7.2Zm8.7 1.3q-1.4 0-2.3-.5-.9-.5-1.3-1.5-.4-.9-.3-2.1 0-.9.4-1.9.4-.9 1-1.7.7-.8 1.6-1.3.9-.4 2-.4 1.4 0 2.2.7.9.8.8 2.2-.1 1-.7 1.7t-1.5 1q-1 .3-2.1.3-.6 0-1-.1t-.6-.3q-.1.9.3 1.4.4.6 1.4.6 1 0 1.6-.2.7-.2 1.1-.5.5-.3.8-.5.3-.2.6-.2.6 0 .6.8 0 .6-.6 1.2t-1.7.9q-1 .4-2.3.4Zm1-7.4q-.8 0-1.5.7-.7.6-1.1 1.6.2 0 .5.1h.7q1 0 1.7-.4t.7-1q.1-1-1-1Zm7.6 6.3q-.6 0-1.2-.2-.6-.1-1-.4-.4-.3-.3-.9 0-.3.2-.5t.5-.3l-.2-.4q0-.8-.1-1.6t-.1-1.5V8.9q.1-1 .2-1.7 0-.6.1-1.1.1-.5.1-1 0-.3.2-.6.1-.3.5-.3.6 0 1 .4.4.5.3 1.2 0 .7-.1 1.4-.2.8-.2 2-.1.5-.1 1.1.6-.8 1.4-1.3.8-.5 1.6-.5t1.4.4q.6.3.9 1 .4.7.3 1.7-.1 1.3-.8 2.3-.8 1-2 1.5t-2.6.5Zm-.2-2.2q-.1 0-.1.1h.3q.8 0 1.5-.2.8-.3 1.2-.8.5-.5.5-1.2.1-.4-.1-.7-.1-.3-.6-.3-.9 0-1.6.9-.7.8-1.1 2.2Zm9.2 3.3q-.9 0-1.5-.3-.6-.2-.8-.7-.3-.4-.3-.8 0-.3.2-.5t.5-.2q.3 0 .5.1l.6.2q.4.2.9.2 1 0 1.6-.3.6-.2 1-.8-.2-.3-.6-.5-.4-.2-1-.3-.5-.2-1.1-.4-.6-.2-1-.5-.5-.3-.8-.8-.3-.4-.2-1.1 0-.9.4-1.5t1.1-1q.7-.4 1.5-.6.8-.2 1.7-.1.7 0 1.2.4.4.5.3 1 0 .7-.7.7h-1q-.9 0-1.6.3-.7.2-1 .9.2.3.6.5.4.2.9.3l1.2.4q.6.2 1.1.4.5.3.8.8.2.4.2 1.1-.1 1.1-.7 1.7-.7.7-1.7 1.1-1.1.3-2.3.3Zm7.8-.5q-.6 0-.9-.5-.4-.4-.3-1v-1.6q.1-.6.1-1v-.9q0-.6.4-1 .4-.5 1-.5.5 0 .8.3.3.4.2 1v.8q-.1.6-.2 1.3 0 .7-.1 1.3 0 .5-.1.9 0 .4-.2.6-.2.3-.7.3Zm.4-9.2q-.8 0-1.1-.3-.4-.4-.4-1t.5-.9q.5-.4 1.1-.4.7 0 1.1.4.3.5.3.9 0 .5-.4.9t-1.1.4Zm6.6 9.2q-1.3 0-2.1-.5-.7-.6-1-1.6-.3-1.1-.3-2.4.1-1 .2-1.8.2-.7.3-1.4.2-.7.3-1.5V5.2q0-.4.2-.6.2-.2.7-.2.7 0 1 .7.4.6.2 2.1 0 .4-.1.7 0 .4-.1.7.6-.2 1.3-.2.7-.1 1.3-.1.7 0 1.1.3.5.4.4.9 0 .3-.1.4-.2.2-.5.2-.9.1-1.5.2-.7 0-1.3.2-.5.1-1.1.3-.1.3-.1.5 0 .3-.1.7 0 1.3.4 1.8.4.6 1.2.6.4 0 .6-.1.2-.1.4-.1.1-.1.3-.1.7 0 .7.8-.1.7-.6 1.2-.6.4-1.7.4Zm8.2.5q-1.4 0-2.3-.5-.9-.5-1.3-1.5-.4-.9-.3-2.1.1-.9.4-1.9.4-.9 1.1-1.7.6-.8 1.5-1.3.9-.4 2-.4 1.4 0 2.3.7.8.8.7 2.2 0 1-.6 1.7-.7.7-1.6 1-1 .3-2.1.3-.6 0-1-.1t-.6-.3q0 .9.3 1.4.4.6 1.4.6 1 0 1.7-.2.6-.2 1.1-.5.4-.3.7-.5.3-.2.6-.2.7 0 .6.8 0 .6-.6 1.2t-1.6.9q-1.1.4-2.4.4Zm1.1-7.4q-.9 0-1.6.7-.7.6-1.1 1.6.3 0 .5.1h.7q1.1 0 1.7-.4.7-.4.8-1 0-1-1-1Z";

export default async function websiteSVG({
  editor,
  shape,
  ctx,
}: {
  editor: Editor;
  shape: ComponentShape;
  ctx: SvgExportContext;
}) {
  const value = shape.props.value;
  return (
    <SVGContainer
      editor={editor}
      shape={shape}
      ctx={ctx}
      headerPath={websiteSVGHeaderPath}
    >
      <foreignObject
        x={8}
        y={36}
        width={shape.props.w - 16}
        height={shape.props.h - 44}
        className="tl-export-embed-styles tl-rich-text tl-rich-text-svg"
        clipPath="inset(0% round 10px)"
      >
        <iframe
          srcDoc={String(value)}
          className="w-full h-full border-none bg-white"
          sandbox=""
        />
      </foreignObject>
    </SVGContainer>
  );
}
