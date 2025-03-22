import { Outlet } from "react-router";
import AppGlobals from "./components/board/app-globals";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

function App() {
  return (
    <NuqsAdapter>
      <Outlet />
      <AppGlobals />
    </NuqsAdapter>
  );
}

export default App;
