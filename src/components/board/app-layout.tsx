import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { LoaderFunctionArgs, Outlet } from "react-router";
import { AppTitle } from "./app-title";
import { db } from "@/db";

export async function clientLoader({ params }: LoaderFunctionArgs) {
    const title = await db.boards.get(params.id!, b => b?.name);
    return { title };
}

export default function AppLayout() {
  const defaultOpen = localStorage.getItem("sidebar_state") === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full">
        <AppTitle />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
