import { useEditor } from "tldraw";
import { useEffect } from "react";
import { useBoardId } from ".";
import { db } from "@/db";

export default function AppThumbnail() {
  const editor = useEditor();
  const id = useBoardId();

  useEffect(() => {
    let timeout: number;
    let cancelled = false;
    async function screenshot() {
      const shapes = editor.getCurrentPageShapes();
      const svg =
        shapes.length > 0
          ? await editor.getSvgString(shapes, {
              darkMode: false,
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
