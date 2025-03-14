import AppBoard from "./components/board/app-board";
import AppLayout from "./components/board/app-layout";
import NewBoard from "./components/board/new-board";
import LogoutPage from "./components/logout-page";
import { useAppRoute } from "./components/board";
import Boards from "./components/boards";
import Home from "./components/home";

function App() {
  const route = useAppRoute();
  switch (route.type) {
    case "home":
      return <Home />;
    case "board":
      return (
        <AppLayout>
          <AppBoard />
        </AppLayout>
      );
    case "logout":
      return <LogoutPage />;
    case "boards":
      return <Boards />;
    case "new-board":
      return <NewBoard />;
  }
}

export default App;
