import { useTheme } from "@/lib/next-themes";
import { useEffect } from "react";
import { useEditor } from "tldraw";
import { useBoardId } from ".";
import { db } from "@/db";

export default function AppEvents() {
  const editor = useEditor();
  const { theme } = useTheme();
  const id = useBoardId();
  useEffect(() => {
    editor.user.updateUserPreferences({
      colorScheme: theme as "dark" | "light" | "system",
    });
  }, [editor, theme]);
  useEffect(() => {
    let timeout: number;
    const unlisten = editor.store.listen(
      () => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          db.boards.update(id, {
            updated_at: new Date(),
          }).timeout(1000);
        }, 1000);
      },
      { scope: "document", source: "user" }
    );
    return () => {
      unlisten();
    };
  }, [editor, id]);
  return null;
}
