import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useEditor } from "tldraw";
import { db } from "@/db";
import { useParams } from "react-router";

export default function AppEvents() {
  const editor = useEditor();
  const { theme } = useTheme();
  const id = useParams().id!;
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
