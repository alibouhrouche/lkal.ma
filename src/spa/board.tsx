import AppBoard from "@/components/board/app-board";
import { AppSidebar } from "@/components/board/app-sidebar";
import { AppTitle } from "@/components/board/app-title";
import { AppContext } from "@/components/board/context";
import { LoadingFallback } from "@/components/loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { useParams } from "wouter";

export default function Board() {
    const id = useParams<{ id: string }>().id;
    const defaultOpen = localStorage.getItem("sidebar_state") === "true";
    return (
        <AppContext.Provider value={{ id }}>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppTitle />
                <AppSidebar />
                <main className="w-full">
                    <Suspense fallback={<LoadingFallback />}>
                        <AppBoard />
                    </Suspense>
                </main>
            </SidebarProvider>
        </AppContext.Provider>
    );
}