import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings2Icon } from "lucide-react";
import { ComponentShape } from ".";
import { Editor, useDialogs } from "tldraw";
import { ImageConfig } from "./image";
import InstructionConfig from "./instructions";
import { useState } from "react";
import AppDialog from "../board/app-dialog";

function ConfigContent({
  editor,
  shape,
  loading,
  setOpen,
}: {
  editor: Editor;
  shape: ComponentShape;
  loading: number | false;
  setOpen: (open: boolean) => void;
}) {
  if (shape.props.component === "instruction") {
    return (
      <InstructionConfig editor={editor} shape={shape} loading={loading} />
    );
  }
  //   if (shape.props.component === "image") {
  //     return <ImageConfig editor={editor} shape={shape} setOpen={setOpen} />;
  //   }
  return null;
}

function ConfigPopover({
  editor,
  shape,
  loading,
}: {
  editor: Editor;
  shape: ComponentShape;
  loading: number | false;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          editor.setEditingShape(shape.id);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          className="tl-cursor-pointer hover:opacity-75"
          disabled={loading !== false}
        >
          <Settings2Icon size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="relative border-2 border-primary bg-(--bg) text-(--text)">
        <ConfigContent
          editor={editor}
          shape={shape}
          loading={loading}
          setOpen={setIsOpen}
        />
      </PopoverContent>
    </Popover>
  );
}

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
