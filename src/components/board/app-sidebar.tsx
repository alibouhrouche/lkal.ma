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

function BoardsList() {
  const id = useApp().id!;
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
      <SidebarHeader>
        <a href="/boards">
          <SidebarMenuButton className="cursor-pointer">
            <ArrowLeftIcon size={24} />
            <span>See all boards</span>
          </SidebarMenuButton>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <BoardsList />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
