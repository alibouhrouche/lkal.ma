"use client";

import AppEvents from "@/components/board/app-events";
import MainMenu from "@/components/board/main-menu";
import { useTheme } from "next-themes";
import { TLComponents, Tldraw, TLUiAssetUrls } from "tldraw";
import "tldraw/tldraw.css";
import useStoreHook from "./app-hook";
import NotFound from "./not-found";
import SharePanel from "./share-panel";
import AppThumbnail from "./app-thumbnail";
import { getAssetUrls } from "@tldraw/assets/selfHosted";
import { ShareDialog } from "./share-dialog";
import { useQueryState } from "nuqs";

const assetUrls = getAssetUrls() as unknown as TLUiAssetUrls;

const components: TLComponents = {
  // Define your components here
  MainMenu,
  SharePanel,
};

export default function AppBoard() {
  const { storeWithStatus, notFound } = useStoreHook();
  const { theme, setTheme } = useTheme();
  const [, setDeeplink] = useQueryState("d");
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
      deepLinks={{
        getUrl() {
          return new URL(window.location.href);
        },
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
