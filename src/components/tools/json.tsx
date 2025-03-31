import { JsonEditor, githubDarkTheme, githubLightTheme } from "json-edit-react";
import { ComponentShape } from ".";
import { useTheme } from "next-themes";
import { preventDefault, stopEventPropagation, useEditor } from "tldraw";
import React, { useCallback } from "react";
import { ScrollArea } from "../ui/scroll-area";

export const JSONContent = React.memo(function JSONContent({
  shape,
  editable,
  isEditing,
}: {
  shape: ComponentShape;
  editable?: boolean;
  isEditing?: boolean;
}) {
  const editor = useEditor();
  const { resolvedTheme } = useTheme();
  return (
    <div
      className="w-full h-full rounded-none"
      onPointerDownCapture={stopEventPropagation}
      onWheelCapture={stopEventPropagation}
      onTouchEnd={stopEventPropagation}
      onDragStart={preventDefault}
    >
      <div className="w-full h-full overflow-y-scroll">
        <JsonEditor
          theme={resolvedTheme === "dark" ? githubDarkTheme : githubLightTheme}
          className="w-full h-full json-viewer"
          viewOnly={!editable}
          rootName="data"
          maxWidth="100%"
          data={shape.props.value}
          setData={(data) => {
            editor.updateShape({
              id: shape.id,
              type: shape.type,
              props: {
                ...shape.props,
                value: data,
              },
            });
          }}
        />
      </div>
    </div>
  );
});
