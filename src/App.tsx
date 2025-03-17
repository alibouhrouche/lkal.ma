import AppBoard from "./components/board/app-board";
import AppLayout from "./components/board/app-layout";
import NewBoard from "./components/board/new-board";
import LogoutPage from "./components/logout-page";
import { useAppRoute } from "./components/board";
import Boards from "./components/boards";
import { AppTitle } from "./components/board/app-title";
import Home from "./components/home";
import NotFound from "./components/NotFound";

function App() {
  const route = useAppRoute();
  switch (route.type) {
    case "home":
      return <Home />;
    case "board":
      return (
        <AppLayout>
          <AppTitle />
          <AppBoard />
        </AppLayout>
      );
    case "logout":
      return <LogoutPage />;
    case "boards":
      return <Boards />;
    case "new-board":
      return <NewBoard />;
    default:
      return <NotFound />;
  }
}

export default App;
