import AppGlobals from "./components/board/app-globals";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AppGlobals />
    </>
  );
}
