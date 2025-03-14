import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useBoardId } from ".";
import { Scroller } from "../ui/scroll-area";
import BoardCard from "./board-card";
import { ArrowLeftIcon } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { Link } from "wouter";

export function AppSidebar() {
  const id = useBoardId();
  const boards = useLiveQuery(() => db.boards.orderBy("order").reverse().toArray());
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/boards">
          <SidebarMenuButton className="cursor-pointer">
            <ArrowLeftIcon size={24} />
            <span>See all boards</span>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
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
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
