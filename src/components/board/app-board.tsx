"use client";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import "tldraw/tldraw.css";
import TldrawBoard from "./board";
import NotFound from "../NotFound";
import { useApp } from "./context";
import { Loading } from "../loading";
import { BoardContext, useBoard } from "@/components/board/board-context.ts";
import { useBoardPermissions } from "@/hooks/usePermissions.ts";

function BoardWrapper() {
  const board = useBoard().board;
  const can = useBoardPermissions(board);
  const canEdit = can?.update("doc");
  return <TldrawBoard doc={board.doc} canEdit={canEdit} />;
}

export default function AppBoard() {
  const id = useApp().id;
  const board = useLiveQuery(() => db.boards.get(id, (b) => b ?? false), [id]);

  if (!id || board === false) {
    return <NotFound />;
  }

  if (!board) {
    return <Loading />;
  }

  return (
    <BoardContext value={{ board }}>
      <BoardWrapper />
    </BoardContext>
  );
}
