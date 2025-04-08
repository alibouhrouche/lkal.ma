import { JsonEditor, githubDarkTheme, githubLightTheme } from "json-edit-react";
import { ComponentShape } from "../tools";
import { useTheme } from "next-themes";
import { preventDefault, stopEventPropagation, useEditor } from "tldraw";
import React from "react";

export default React.memo(function JSONContent({
  shape,
  editable,
}: {
  shape: ComponentShape;
  editable?: boolean;
  isEditing?: boolean;
}) {
  const editor = useEditor();
  const { resolvedTheme } = useTheme();
  return (
    <div
      className="w-full h-full rounded-none tl-text-wrapper"
      onPointerDownCapture={stopEventPropagation}
      onWheelCapture={stopEventPropagation}
      onTouchEnd={stopEventPropagation}
      onDragStart={preventDefault}
      data-font={shape.props.font}
    >
      <div className="w-full h-full overflow-y-scroll tl-rich-text">
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
