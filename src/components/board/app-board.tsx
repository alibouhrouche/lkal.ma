"use client";
import { Board, db } from "@/db";
import { useLiveQuery, useObservable } from "dexie-react-hooks";
import "tldraw/tldraw.css";
import TldrawBoard from "./board";
import NotFound from "../NotFound";
import { useApp } from "./context";
import { Loading } from "../loading";

function BoardWrapper({ board }: { board: Board }) {
  const can = useObservable(
    () => db.cloud.permissions(board, "boards"),
    [board]
  );
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

  return <BoardWrapper board={board} />;
}
