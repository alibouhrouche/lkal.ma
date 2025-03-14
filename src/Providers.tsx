import AppContextProvider from "./components/board/app-context";
import AppGlobals from "./components/board/app-globals";
import { ThemeProvider } from "./lib/next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppContextProvider>
          {children}
          <AppGlobals />
        </AppContextProvider>
      </ThemeProvider>
    </>
  );
}
