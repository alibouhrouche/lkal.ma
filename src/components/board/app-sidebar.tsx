import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Scroller } from "../ui/scroll-area";
import BoardCard from "./board-card";
import { ArrowLeftIcon } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { useApp } from "./context";
import { NewBoardLink } from "./app-new";
import Link from "next/link";

function BoardsList() {
  const id = useApp().id;
  const boards = useLiveQuery(() =>
    db.boards.orderBy("created_at").reverse().toArray()
  );
  return (
    <Virtuoso
      className="h-screen"
      data={boards}
      components={{
        Scroller,
      }}
      totalCount={boards?.length}
      itemContent={(_, board) => (
        <div className="mx-3 my-1">
          <BoardCard key={board.id} board={board} currentBoardId={id} />
        </div>
      )}
    />
  );
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between">
        <Link href="/boards" className="w-full">
          <SidebarMenuButton className="cursor-pointer">
            <ArrowLeftIcon size={24} />
            <span>See all</span>
          </SidebarMenuButton>
        </Link>
        <NewBoardLink />
      </SidebarHeader>
      <SidebarContent>
        <BoardsList />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
