import AppGlobals from "./components/app-globals";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AppGlobals />
    </>
  );
}
