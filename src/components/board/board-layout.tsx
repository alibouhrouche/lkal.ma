import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "../ui/sidebar";
import AppBoard from "./app-board";
import { AppSidebar } from "./app-sidebar";
import { AppContext } from "./context";
import { AppTitle } from "./app-title";
import { useRoute } from "wouter";
import { Spinner } from "../loading";
import TopPanel from "./top-panel";

export default function BoardLayout() {
  const defaultOpen = localStorage.getItem("sidebar_state") === "true";
  const [match, params] = useRoute("/b/:id");

  if (!match) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <TopPanel />
        <Spinner />
        <div className="text-sm p-4 text-gray-500 dark:text-gray-400">
          Invalid board URL, go back to{" "}
          <a href="/" className="text-blue-500 hover:underline">
            home
          </a>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ id: params.id }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppTitle />
          <AppSidebar />
          <main className="w-full">
            <AppBoard />
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
