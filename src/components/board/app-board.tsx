"use client";

import AppEvents from "@/components/board/app-events";
import MainMenu from "@/components/board/main-menu";
import { useTheme } from "@/lib/next-themes";
import { TLComponents, Tldraw, TLUiAssetUrls } from "tldraw";
import "tldraw/tldraw.css";
import useStoreHook from "./app-hook";
import NotFound from "./not-found";
import SharePanel from "./share-panel";
import AppThumbnail from "./app-thumbnail";
import { getAssetUrls } from '@tldraw/assets/selfHosted'

const assetUrls = getAssetUrls() as unknown as TLUiAssetUrls

const components: TLComponents = {
  // Define your components here
  MainMenu,
  SharePanel,
};

export default function AppBoard() {
  const { storeWithStatus, notFound } = useStoreHook();
  const { theme, setTheme } = useTheme();
  return (
    <Tldraw
      assetUrls={assetUrls}
      components={components}
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
      deepLinks
    >
      {notFound && <NotFound />}
      <AppEvents />
      <AppThumbnail />
    </Tldraw>
  );
}
