import { RouteObject } from "react-router";
import App from "./App";
import Home, { clientLoader as homeClientLoader } from "./components/home";
import Boards from "./components/boards";
import AppLayout, { clientLoader as boardClientLoader } from "./components/board/app-layout";
import AppBoard from "./components/board/app-board";
import NewBoard from "./components/board/new-board";
import LogoutPage from "./components/logout-page";

export const routes: RouteObject[] = [
    { Component: App, children: [
        { index: true, loader: homeClientLoader, Component: Home },
        { path: "boards", Component: Boards },
        { path: "b/new", Component: NewBoard },
        { Component: AppLayout, loader: boardClientLoader, children: [
            { path: "b/:id", Component: AppBoard },
        ]},
        { path: "logout", Component: LogoutPage },
    ]},
]
