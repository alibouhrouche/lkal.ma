import { db } from "@/db";
import {
  DefaultContextMenu,
  DefaultContextMenuContent,
  Editor,
  TldrawUiMenuGroup,
  TldrawUiMenuItem,
  TLUiContextMenuProps,
  useEditor,
} from "tldraw";
import { useApp } from "./context";
import { toast } from "sonner";
import { resizeBlob } from "./resizeBlob";

const WHITE_PNG = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+ev3fwAJ0QPvglTrogAAAABJRU5ErkJggg==`;
const BLACK_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUEBD8DwABmwEy6T0sogAAAABJRU5ErkJggg==";

async function getThumbnail(
  editor: Editor,
): Promise<[string, string] | undefined> {
  const coverFrame = editor.getSelectedShapeIds();
  if (!coverFrame) return;
  const shapes = Array.from(editor.getShapeAndDescendantIds(coverFrame)).map(
    (id) => editor.getShape(id)!,
  );
  if (shapes.length === 0) return [WHITE_PNG, BLACK_PNG];
  const lightModeJPG = await editor.toImage(shapes, {
    darkMode: false,
    format: "jpeg",
    quality: 0.7,
  });
  const darkModeJPG = await editor.toImage(shapes, {
    darkMode: true,
    format: "jpeg",
    quality: 0.7,
  });
  if (!lightModeJPG || !darkModeJPG) return;
  const resizedLightMode = resizeBlob(lightModeJPG.blob, 320, 180, false);
  const resizedDarkMode = resizeBlob(darkModeJPG.blob, 320, 180, true);
  return await Promise.all([resizedLightMode, resizedDarkMode]);
}

let isGenerating = false;

function SetAsThumbnail() {
  const editor = useEditor();
  const id = useApp().id;
  if (editor.getSelectedShapeIds().length === 0) return null;
  return (
    <TldrawUiMenuItem
      id="thumbnail"
      label="Set as thumbnail"
      onSelect={async () => {
        if (isGenerating) {
          toast.error("Thumbnail generation in progress");
          return;
        }
        isGenerating = true;
        const toastId = toast.loading("Generating thumbnail...");
        const thumbnail = await getThumbnail(editor);
        if (!thumbnail) {
          toast.error("Failed to generate thumbnail", {
            id: toastId,
          });
          isGenerating = false;
          return;
        }
        await db.boards.update(id, { thumbnail });
        toast.success("Thumbnail set", { id: toastId });
        isGenerating = false;
      }}
    />
  );
}

export default function ContextMenu(props: TLUiContextMenuProps) {
  return (
    <DefaultContextMenu {...props}>
      <DefaultContextMenuContent />
      <TldrawUiMenuGroup id="extra">
        <SetAsThumbnail />
      </TldrawUiMenuGroup>
    </DefaultContextMenu>
  );
}
