import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppContext } from "./context";
import { AppTitle } from "./app-title";
import { useRoute } from "wouter";
import {LoadingFallback, Spinner} from "../loading";
import AppStatus from "./app-status.tsx";
import {lazy, Suspense} from "react";
const AppBoard = lazy(() => import("./app-board"));

export default function App() {
  const defaultOpen = localStorage.getItem("sidebar_state") === "true";
  const [match, params] = useRoute("/b/:id");

  if (!match) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AppStatus>
          <AppStatus.Icon className="w-6 h-6" />
          <AppStatus.Text className="text-sm" />
        </AppStatus>
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
            <Suspense fallback={<LoadingFallback />}>
              <AppBoard />
            </Suspense>
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
