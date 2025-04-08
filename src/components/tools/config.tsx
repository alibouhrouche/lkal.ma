import { Settings2Icon } from "lucide-react";
import { ComponentShape } from ".";
import { Editor, useDialogs } from "tldraw";
import AppDialog from "../board/app-dialog";

const configurableComponents = ["instruction", "image"];

export default function Config({
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
  const { addDialog } = useDialogs();
  if (configurableComponents.includes(shape.props.component)) {
    return (
      <button
        className="tl-cursor-pointer hover:opacity-75"
        disabled={loading !== false}
        onPointerDown={() => {
          editor.setEditingShape(
            editor.getEditingShapeId() === null ? shape.id : null
          );
          addDialog({
            component: (props) => <AppDialog {...props} shape={shape} />,
            onClose() {
							editor.setEditingShape(null);
						},
          })
        }}
      >
        <Settings2Icon size={16} />
      </button>
    );
  }
  return null;
}
