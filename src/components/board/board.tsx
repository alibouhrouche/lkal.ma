import MainMenu from "@/components/board/main-menu";
import SharePanel from "@/components/board/share-panel";
import { TLComponents, Tldraw } from "tldraw";
import { ComponentTool, ComponentUtil } from "../tools";
import {
  customAssetUrls,
  toolsComponents,
  uiOverrides,
} from "../tools/ui-overrides";
import * as Y from "yjs";
import { useYjsStore } from "@/hooks/useYjsStore";
import { useTheme } from "next-themes";
import { useQueryState } from "nuqs";
import AppEvents from "./app-events";
import AppThumbnail from "./app-thumbnail";
// import { ShareDialog } from "./share-dialog";

const components: TLComponents = {
  // Define your components here
  MainMenu,
  SharePanel,
  InFrontOfTheCanvas: () => <div id="portal" />,
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
        if (canEdit === false) {
          editor.updateInstanceState({ isReadonly: true });
        }
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
      <AppEvents />
      <AppThumbnail />
      {/* <ShareDialog /> */}
      {children}
    </Tldraw>
  );
}
