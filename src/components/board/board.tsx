import MainMenu from "@/components/board/main-menu";
import SharePanel from "@/components/board/share-panel";
import { TLAssetStore, TLComponents, Tldraw } from "tldraw";
import { ComponentTool, ComponentUtil } from "../tools";
import {
  customAssetUrls,
  toolsComponents,
  uiOverrides,
} from "../tools/ui-overrides";
import * as Y from "yjs";
import { useYjsStore } from "@/hooks/useYjsStore";
import { useTheme } from "next-themes";
import AppEvents from "./app-events";
import AppThumbnail from "./app-thumbnail";
import ContextMenu from "./context-menu";
import { cn } from "@/lib/utils";
import TopPanel from "./top-panel";

const components: TLComponents = {
  // Define your components here
  MainMenu,
  TopPanel,
  SharePanel,
  ContextMenu,
  ...toolsComponents,
};

const shapeUtils = [ComponentUtil];
const tools = [ComponentTool];

export default function TldrawBoard({
  doc,
  canEdit,
  children,
}: {
  doc: Y.Doc;
  canEdit?: boolean;
  children?: React.ReactNode;
}) {
  const storeWithStatus = useYjsStore({
    doc,
    shapeUtils,
  });
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <Tldraw
      assetUrls={customAssetUrls}
      components={components}
      shapeUtils={shapeUtils}
      tools={tools}
      overrides={uiOverrides}
      store={storeWithStatus}
      className={cn(
        "app",
        resolvedTheme === "dark"
          ? "tl-theme__dark"
          : resolvedTheme === "light"
          ? "tl-theme__light"
          : ""
      )}
      onMount={(editor) => {
        if (canEdit === false) {
          editor.updateInstanceState({ isReadonly: true });
        }
        editor.user.updateUserPreferences({
          colorScheme: theme as "dark" | "light" | "system",
          isDynamicSizeMode: true,
        });
      }}
      onUiEvent={(name, data) => {
        if (name === "color-scheme" && data.source === "menu") {
          setTheme((data as { value: string }).value);
        }
      }}
      deepLinks
    >
      <AppEvents />
      {children}
    </Tldraw>
  );
}
