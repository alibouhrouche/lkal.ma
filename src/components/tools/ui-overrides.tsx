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
import { componentTypeStyle } from ".";
import {print} from "@/components/board/print.ts";

export const uiOverrides: TLUiOverrides = {
  actions(editor, actions) {
    actions.print = {
      id: "print",
      icon: "printer",
      label: "Print",
      kbd: "$p",
      onSelect: () => print(editor),
    };

    return actions;
  },
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
    ...getAssetUrls().fonts,
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
          <select
            className="tl-text-wrapper w-full border-0 capitalize tl-cursor-pointer appearance-none h-9 px-3 py-2 text-sm whitespace-nowrap bg-input text-popover-foreground forced-colors:appearance-auto"
            data-font="draw"
            value={componentType.type === "mixed" ? "" : componentType.value}
            onChange={(e) => {
              const v = e.target.value;
              editor.markHistoryStoppingPoint();
              const value = componentTypeStyle.validate(v);
              editor.setStyleForSelectedShapes(componentTypeStyle, value);
            }}
          >
            {componentTypeStyle.values.map((value) => (
              <option key={value} value={value} className="capitalize">
                {value}
              </option>
            ))}
          </select>
        )}
      </DefaultStylePanel>
    );
  },
};
