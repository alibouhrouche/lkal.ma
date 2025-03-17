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

const WHITE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" fill="none"><path fill="#f9fafb" d="M0 0h1920v1080H0z"/></svg>`;
const BLACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" fill="none"><path fill="#101011" d="M0 0h1920v1080H0z"/></svg>`;

async function getThumbnailSvg(editor: Editor): Promise<[string, string] | undefined> {
  const coverFrame = getCoverFrame(editor);
  const shapes = getCoverShapes(editor, coverFrame);
  if (shapes.length === 0) return [WHITE_SVG, BLACK_SVG];
  const bounds = getCoverBounds(coverFrame);
  const lightModeSvg = await editor.getSvgString(shapes, {
    darkMode: false,
    bounds,
  });
  const darkModeSvg = await editor.getSvgString(shapes, {
    darkMode: true,
    bounds,
  });
  if (!lightModeSvg || !darkModeSvg) return;
  return [lightModeSvg.svg, darkModeSvg.svg];
}

export default function AppThumbnail() {
  const editor = useEditor();
  const id = useBoardId();

  useEffect(() => {
    let timeout: number;
    let cancelled = false;
    async function screenshot() {
      const thumbnail = await getThumbnailSvg(editor);
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
