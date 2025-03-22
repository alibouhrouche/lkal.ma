import { getAssetUrls } from "@tldraw/assets/selfHosted";
import {
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  DefaultStylePanel,
  DefaultStylePanelContent,
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TLUiAssetUrlOverrides,
  TLUiOverrides,
  TldrawUiMenuItem,
  useEditor,
  useIsToolSelected,
  useRelevantStyles,
  useTools,
} from "tldraw";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { componentTypeStyle } from ".";

export const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    tools.component = {
      id: "component",
      icon: "sparkles",
      label: "Component",
      kbd: "i",
      onSelect: () => {
        editor.setCurrentTool("component");
      },
    };
    return tools;
  },
};

export const customAssetUrls: TLUiAssetUrlOverrides = {
  embedIcons: {
    ...getAssetUrls().embedIcons,
  },
  icons: {
    ...getAssetUrls().icons,
    sparkles: "/icons/icon/sparkles.svg",
  },
  fonts: {
    draw: getAssetUrls().fonts.tldraw_draw,
    monospace: getAssetUrls().fonts.tldraw_mono,
    sansSerif: getAssetUrls().fonts.tldraw_sans,
    serif: getAssetUrls().fonts.tldraw_serif,
  },
  translations: {
    ...getAssetUrls().translations,
  },
};

export const toolsComponents: TLComponents = {
  Toolbar: (props) => {
    const tools = useTools();
    const isComponentSelected = useIsToolSelected(tools["component"]);
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem
          {...tools["component"]}
          isSelected={isComponentSelected}
        />
        <DefaultToolbarContent />
      </DefaultToolbar>
    );
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools();
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <TldrawUiMenuItem {...tools["component"]} />
        <DefaultKeyboardShortcutsDialogContent />
      </DefaultKeyboardShortcutsDialog>
    );
  },
  StylePanel: () => {
    const editor = useEditor();
    const styles = useRelevantStyles();
    if (!styles) return null;

    const componentType = styles.get(componentTypeStyle);
    return (
      <DefaultStylePanel>
        <DefaultStylePanelContent styles={styles} />
        {componentType !== undefined && (
          <Select
            value={componentType.type === "mixed" ? "" : componentType.value}
            onValueChange={(v) => {
              editor.markHistoryStoppingPoint();
              const value = componentTypeStyle.validate(v);
              editor.setStyleForSelectedShapes(componentTypeStyle, value);
            }}
          >
            <SelectTrigger className="w-full border-0 capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {componentTypeStyle.values.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </DefaultStylePanel>
    );
  },
};
