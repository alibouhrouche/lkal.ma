import { useRouter } from "next/router";
import { AppContext } from "@/components/board/context.ts";
import { Loading } from "@/components/loading.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/board/app-sidebar.tsx";
import React from "react";
import Head from "next/head";

function App({ children }: { children: React.ReactNode }) {
  const defaultOpen = localStorage.getItem("sidebar_state") === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  if (!id)
    return (
      <>
        <Head>
          <title key="title">Loading... - Lkal.ma</title>
        </Head>
        <Loading />
      </>
    );
  return (
    <AppContext.Provider value={{ id }}>
      <App>{children}</App>
    </AppContext.Provider>
  );
}
