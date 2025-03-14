import {
  DefaultMainMenu,
  DefaultMainMenuContent,
  TldrawUiMenuItem,
} from "tldraw";
import { useSidebar } from "../ui/sidebar";
import { PanelLeftIcon } from "lucide-react";
import { db } from "@/db";
import { useLocation } from "wouter";

function SidebarTrigger() {
    const { toggleSidebar } = useSidebar()
  
    return (
      <button
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        className="h-7 w-7 size-9 hover:bg-secondary/10 m-1 rounded-md inline-flex items-center justify-center gap-2 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 pointer-events-all cursor-pointer"
        onClick={toggleSidebar}
      >
        <PanelLeftIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
    )
  }

export default function MainMenu() {
  const [,navigate] = useLocation()
  return (
    <div className="flex items-center justify-between w-full">
      <SidebarTrigger />
      <DefaultMainMenu>
        <TldrawUiMenuItem
          id="new"
          label="New"
          icon="plus"
          onSelect={() => {
            db.newBoard().then(id => {
              navigate(`/b/${id}`)
            })
          }}
        />
        <DefaultMainMenuContent />
      </DefaultMainMenu>
    </div>
  );
}
