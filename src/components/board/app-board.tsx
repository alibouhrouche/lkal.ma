"use client";

import AppEvents from "@/components/board/app-events";
import MainMenu from "@/components/board/main-menu";
import { useTheme } from "next-themes";
import { TLComponents, Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import useStoreHook from "./app-hook";
import NotFound from "./not-found";
import SharePanel from "./share-panel";
import AppThumbnail from "./app-thumbnail";
import { ShareDialog } from "./share-dialog";
import { useQueryState } from "nuqs";
import { ComponentTool, ComponentUtil } from "../tools";
import { customAssetUrls, toolsComponents, uiOverrides } from "../tools/ui-overrides";

const components: TLComponents = {
  // Define your components here
  MainMenu,
  SharePanel,
  ...toolsComponents,
};

const shapeUtils = [ComponentUtil];
const tools = [ComponentTool];

export default function AppBoard() {
  const { storeWithStatus, notFound } = useStoreHook([ComponentUtil]);
  const { theme, setTheme } = useTheme();
  const [, setDeeplink] = useQueryState("d");
  return (
    <Tldraw
      assetUrls={customAssetUrls}
      components={components}
      shapeUtils={shapeUtils}
      tools={tools}
      overrides={uiOverrides}
      store={storeWithStatus}
      onMount={(editor) => {
        editor.user.updateUserPreferences({
          colorScheme: theme as "dark" | "light" | "system",
        });
      }}
      onUiEvent={(name, data) => {
        if (name === "color-scheme" && data.source === "menu") {
          setTheme((data as { value: string }).value);
        }
      }}
      deepLinks={{
        onChange(url) {
          setDeeplink(url.searchParams.get("d"));
        },
      }}
    >
      {notFound && <NotFound />}
      <AppEvents />
      <AppThumbnail />
      <ShareDialog />
    </Tldraw>
  );
}
