import { AppContext, useRouteState } from ".";

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const route = useRouteState();
  return (
    <AppContext.Provider value={{ route }}>{children}</AppContext.Provider>
  );
}
