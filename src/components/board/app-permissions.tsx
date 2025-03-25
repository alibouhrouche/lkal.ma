import { Board, db } from "@/db";
import { useObservable } from "dexie-react-hooks";
import { useEffect } from "react";
import { useEditor } from "tldraw";

export default function AppPermissions({ board }: { board: Board }) {
  const can = useObservable(
    () => db.cloud.permissions(board, "boards"),
    [board]
  );
  const editor = useEditor();
  const isReadonly = !can?.update("doc");
  useEffect(() => {
    editor.updateInstanceState({ isReadonly });
  }, [editor, isReadonly]);
  return null;
}
