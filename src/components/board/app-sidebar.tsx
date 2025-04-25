import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Scroller } from "../ui/scroll-area";
import BoardCard from "./board-card";
import { ArrowLeftIcon } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { NewBoardLink } from "./app-new";
import { useBoards } from "@/context/boards";
import { Link, useParams } from "wouter";

function BoardsList() {
  const id = useParams<{ id: string }>()?.id;
  const boards = useBoards();
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
