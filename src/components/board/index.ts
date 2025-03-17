import { createContext, useContext } from "react";
import { useBrowserLocation } from "wouter/use-browser-location";

type RouteType =
  | {
      type: "board";
      id: string;
    }
  | {
      type: "home" | "logout" | "boards" | "new-board" | "not-found" ;
    };

type AppContextType = {
  route: RouteType;
};

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};

export const useAppRoute = () => {
  return useAppContext().route;
};

export const useBoardId = () => {
  const route = useAppRoute();
  if (route.type === "board") {
    return route.id;
  }
  throw new Error("useBoardId must be used within a board route");
};

export const useRouteState = (): RouteType => {
  const [location] = useBrowserLocation();

  let results;
  if (location === "/") {
    return { type: "home" };
  }
  if (location === "/logout") {
    return { type: "logout" };
  }
  if (location === "/boards") {
    return { type: "boards" };
  }
  if (location === "/b/new") {
    return { type: "new-board" };
  }
  if (((results = /^\/b\/([^/]+?)$/.exec(location)), results)) {
    return { type: "board", id: decodeURIComponent(results[1]) };
  }
  return { type: "not-found" };
};
