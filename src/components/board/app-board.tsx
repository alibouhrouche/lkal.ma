"use client";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import "tldraw/tldraw.css";
import NotFound from "../NotFound";
import { useApp } from "./context";
import { BoardContext, useBoard } from "@/components/board/board-context.ts";
import { useBoardPermissions } from "@/hooks/usePermissions.ts";
import Head from "next/head";
import { AppTitle } from "@/components/board/app-title.tsx";
import dynamic from "next/dynamic";

const TldrawBoard = dynamic(() => import("@/components/board/board.tsx"), {
  ssr: false,
});

function BoardWrapper() {
  const board = useBoard().board;
  const can = useBoardPermissions(board);
  const canEdit = can?.update("doc");
  return <TldrawBoard canEdit={canEdit} />;
}

export default function AppBoard() {
  const id = useApp().id;
  const board = useLiveQuery(() => db.boards.get(id, (b) => b ?? false), [id]);

  if (!id || board === false) {
    return <NotFound />;
  }

  if (!board) {
    return (
      <Head>
        <title key="title">Loading... - Lkal.ma</title>
      </Head>
    );
  }

  return (
    <BoardContext value={{ board }}>
      <AppTitle />
      <BoardWrapper />
      <iframe id="print" className="fixed bottom-0 right-0 h-1 w-1 opacity-0" />
    </BoardContext>
  );
}
