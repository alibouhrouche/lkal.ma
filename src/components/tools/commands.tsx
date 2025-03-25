import { preventDefault, stopEventPropagation } from "tldraw";
import { ComponentShape } from ".";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CommandContent({
  shape,
  canEdit,
}: {
  shape: ComponentShape;
  canEdit?: boolean;
}) {
  // const fontSize = FONT_SIZES[shape.props.size];
  // const lineHeight = TEXT_PROPS.lineHeight;
  return (
    <div
      className="w-full h-full p-2 tl-text-wrapper"
      data-font={shape.props.font}
      onContextMenu={stopEventPropagation}
      onPointerDownCapture={stopEventPropagation}
      onTouchEnd={stopEventPropagation}
      onDragStart={preventDefault}
    >
      <Select>
        <SelectTrigger
          className="w-full"
          style={{
            cursor: "var(--tl-cursor-pointer)",
          }}
        >
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ai-text">Text Completion</SelectItem>
          <SelectItem value="ai-image">Image Generation</SelectItem>
          <SelectItem value="ai-voice">Voice Generation</SelectItem>
        </SelectContent>
      </Select>
      {/* <textarea
          style={{
            fontSize,
            lineHeight: Math.floor(fontSize * lineHeight) + "px",
            minHeight: Math.floor(fontSize * lineHeight) + "px",
            cursor: "var(--tl-cursor-text)",
          }}
          readOnly={!canEdit}
          className="h-full w-full resize-none"
        /> */}
    </div>
  );
}
