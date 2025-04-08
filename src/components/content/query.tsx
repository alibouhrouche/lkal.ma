import { ComponentShape } from "@/components/tools";
import React, { KeyboardEventHandler, useCallback, useRef } from "react";
import {
  preventDefault,
  stopEventPropagation,
  TEXT_PROPS,
  useEditor,
} from "tldraw";
import {
  FONT_SIZES,
  stopEventPropagationNoZoom,
} from "@/components/content/shared.ts";

export default function QueryContent({
  shape,
  editable,
  style,
  onRun,
}: {
  shape: ComponentShape;
  editable?: boolean;
  style?: React.CSSProperties;
  onRun?: () => void;
}) {
  const fontSize = FONT_SIZES[shape.props.size];
  const lineHeight = TEXT_PROPS.lineHeight;
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const editor = useEditor();
  const onKeyDown = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>(
    (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const textArea = event.target as HTMLTextAreaElement;
        const start = textArea?.selectionStart;
        const end = textArea?.selectionEnd;
        textArea.value = `${textArea.value.substring(0, start)}\t${textArea.value.substring(end)}`;
        textArea.selectionStart = textArea.selectionEnd = start + 1;
      } else if (event.key === "Enter" && event.ctrlKey) {
        event.preventDefault();
        onRun?.();
        setTimeout(() => {});
      }
    },
    [editor, onRun],
  );
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!editable) {
        return;
      }
      editor.updateShape({
        id: shape.id,
        type: "component",
        props: {
          value: e.target.value,
        },
      });
    },
    [shape, editor, editable],
  );
  return (
    <div
      className="w-full h-full overflow-hidden tl-text-wrapper"
      data-font={shape.props.font}
      style={{
        fontSize,
        lineHeight: Math.floor(fontSize * lineHeight) + "px",
        minHeight: Math.floor(fontSize * lineHeight) + "px",
        ...style,
      }}
      onContextMenu={stopEventPropagation}
      onPointerDownCapture={stopEventPropagation}
      onTouchEnd={stopEventPropagation}
      onWheelCapture={stopEventPropagationNoZoom}
      onDragStart={preventDefault}
    >
      <textarea
        ref={textAreaRef}
        className="w-full h-full bg-(--bg) text-(--fg) overflow-y-scroll tl-rich-text focus:ring-0 border-none rounded-md resize-none"
        style={{
          cursor: "var(--tl-cursor-text)",
        }}
        value={String(shape.props.value)}
        onKeyDown={onKeyDown}
        onChange={onChange}
        readOnly={!editable}
      />
    </div>
  );
}
