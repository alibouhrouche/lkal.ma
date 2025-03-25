"use client";
import { Board, db } from "@/db";
import { useLiveQuery, useObservable } from "dexie-react-hooks";
import { useParams } from "react-router";
import "tldraw/tldraw.css";
import TldrawBoard from "./board";
import NotFound from "../NotFound";
import { Loader2 } from "lucide-react";

const Loading = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <Loader2 className="w-10 h-10 animate-spin" />
  </div>
);

function BoardWrapper({ board }: { board: Board }) {
  const can = useObservable(
    () => db.cloud.permissions(board, "boards"),
    [board]
  );
  const canEdit = can?.update("doc");
  return <TldrawBoard doc={board.doc} canEdit={canEdit} />;
}

export default function AppBoard() {
  const id = useParams().id!;
  const board = useLiveQuery(() => db.boards.get(id, (b) => b ?? false), [id]);

  if (board === false) {
    return <NotFound />;
  }

  if (!board) {
    return <Loading />;
  }

  return <BoardWrapper board={board} />;
}
