import { ThemeProvider } from "@/lib/next-themes";
import BoardsProvider from "./context/boards";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BoardsProvider>
        {children}
      </BoardsProvider>
    </ThemeProvider>
  );
}
