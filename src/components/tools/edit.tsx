import { Editor } from "tldraw";
import { ComponentShape } from ".";
import { Settings2Icon } from "lucide-react";

export default function Edit({
  editor,
  shape,
  canEdit,
  loading,
}: {
  editor: Editor;
  shape: ComponentShape;
  canEdit: boolean;
  loading: number | false;
}) {
  if (!canEdit) return null;
  if (shape.props.component !== "image") return null;
  return (
    <button
      className="tl-cursor-pointer hover:opacity-75"
      disabled={loading !== false}
      onPointerDown={(e) => {
        e.stopPropagation();
        editor.setEditingShape(shape.id);
      }}
    >
      <Settings2Icon size={16} />
    </button>
  );
}
