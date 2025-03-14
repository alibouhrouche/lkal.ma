import { Box, Editor, TLFrameShape, TLShapeId, useEditor } from "tldraw";
import { useEffect } from "react";
import { useBoardId } from ".";
import { db } from "@/db";

function getCoverFrame(editor: Editor) {
  const shapeIds = editor.store.query.exec("shape", {
    type: { eq: "frame" },
  }) as TLFrameShape[];
  const coverFrame = shapeIds.find(
    (shape) => shape.props.name.toLowerCase() === "cover"
  );
  return coverFrame;
}

function getCoverShapes(editor: Editor, coverFrame?: TLFrameShape) {
  let shapes: Set<TLShapeId>;
  if (coverFrame) {
    const coverShapesIds = editor.getShapeAndDescendantIds([coverFrame.id]);
    coverShapesIds.delete(coverFrame.id);
    shapes = coverShapesIds;
  } else {
    shapes = editor.getPageShapeIds(editor.getPages()[0]);
  }
  return Array.from(shapes).map((id) => editor.getShape(id)!);
}

function getCoverBounds(coverFrame?: TLFrameShape) {
  if (!coverFrame) return;
  const {
    x,
    y,
    props: { w, h },
  } = coverFrame;
  return new Box(x, y, w, h);
}

export default function AppThumbnail() {
  const editor = useEditor();
  const id = useBoardId();

  useEffect(() => {
    let timeout: number;
    let cancelled = false;
    async function screenshot() {
      const coverFrame = getCoverFrame(editor);
      const shapes = getCoverShapes(editor, coverFrame);
      const bounds = getCoverBounds(coverFrame);
      const svg =
        shapes.length > 0
          ? await editor.getSvgString(shapes, {
              darkMode: false,
              bounds,
            })
          : {
              svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" fill="none"><path fill="#fff" d="M0 0h1920v1080H0z"/></svg>`,
            };
      const thumbnail = svg?.svg;
      if (cancelled || !thumbnail) return;
      db.boards.update(id, { thumbnail }).timeout(500);
    }
    const unlisten = editor.store.listen(
      () => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          screenshot();
        }, 500);
      },
      { scope: "document", source: "user" }
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      unlisten();
    };
  }, [editor, id]);

  return null;
}
