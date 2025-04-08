import { Editor, getDefaultColorTheme, HTMLContainer } from "tldraw";
import { CSSProperties } from "react";
import {
  AlertTriangleIcon,
  GripVerticalIcon,
  Loader2,
  Play,
} from "lucide-react";
import DownloadButton from "@/components/tools/download.tsx";
import Config from "@/components/tools/config.tsx";
import ReadOnly from "@/components/tools/readonly.tsx";
import { ShowTime, Stopwatch } from "@/components/tools/stopwatch.tsx";
import { ComponentShape } from "@/components/tools/index.tsx";
import Content from "@/components/content";

const ICON_SIZES = {
  s: 16,
  m: 24,
  l: 32,
  xl: 48,
};

const TimePosRight = {
  text: "right-4",
  instruction: "right-4",
  image: "right-1",
  website: "right-4",
  data: "right-4",
  query: "right-4",
};

const isSlow = ["image", "instruction"];

export default function UI({
  editor,
  shape,
  theme,
  loading,
  run,
  canEdit,
  isEditing,
}: {
  editor: Editor;
  shape: ComponentShape;
  theme: ReturnType<typeof getDefaultColorTheme>;
  loading: number | false;
  run: () => void;
  canEdit: boolean;
  isEditing: boolean;
}) {
  const componentType = shape.props.component;

  if (componentType === "button") {
    const min = Math.min(shape.props.w, shape.props.h);
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: canEdit ? "all" : "none",
          color: theme[shape.props.color].solid,
        }}
      >
        <div
          className="tl-cursor rounded-full flex items-center justify-center hover:opacity-75 ring-primary ring-2"
          style={{
            width: min,
            height: min,
            backgroundColor: theme[shape.props.color].semi,
            color: theme[shape.props.color].solid,
          }}
        >
          <button
            className="tl-cursor-pointer p-2"
            onPointerDown={(e) => {
              if (!canEdit) return;
              e.stopPropagation();
              run();
            }}
          >
            {loading !== false ? (
              <Loader2
                className="animate-spin"
                size={ICON_SIZES[shape.props.size]}
              />
            ) : shape.props.fail ? (
              <AlertTriangleIcon size={ICON_SIZES[shape.props.size]} />
            ) : (
              <Play size={ICON_SIZES[shape.props.size]} />
            )}
          </button>
        </div>
      </HTMLContainer>
    );
  }

  return (
    <HTMLContainer
      id={shape.id}
      className="ring-primary ring-2"
      style={
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "left",
          pointerEvents: canEdit ? "all" : "none",
          position: "relative",
          backgroundColor: theme[shape.props.color].semi,
          color: theme[shape.props.color].solid,
          "--bg": theme[shape.props.color].semi,
          "--fg": theme[shape.props.color].solid,
          borderRadius: "calc(var(--radius)",
        } as CSSProperties
      }
    >
      <div className="flex items-center justify-between w-full p-2 rounded-t-sm tl-cursor">
        <div className="flex items-center gap-1">
          <GripVerticalIcon size={16} />
          <div className="tl-text-wrapper capitalize" data-font="draw">
            {componentType}
          </div>
        </div>
        <div
          className="flex items-center gap-2"
          onPointerDown={(e) => {
            if (!canEdit) return;
            e.stopPropagation();
          }}
        >
          <DownloadButton shape={shape} />
          <Config
            editor={editor}
            shape={shape}
            canEdit={canEdit}
            loading={loading}
          />
          <ReadOnly editor={editor} shape={shape} />
          <button
            className="tl-cursor-pointer hover:opacity-75"
            disabled={loading !== false || !canEdit}
            onPointerDown={run}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : shape.props.fail ? (
              <AlertTriangleIcon size={16} />
            ) : (
              <Play size={16} />
            )}
          </button>
        </div>
      </div>
      <div
        className="w-full h-full overflow-hidden"
        style={{
          borderBottomLeftRadius: "calc(var(--radius)",
          borderBottomRightRadius: "calc(var(--radius)",
        }}
      >
        <Content
          shape={shape}
          loading={loading !== false}
          canEdit={canEdit}
          isEditing={isEditing}
          onRun={run}
        />
      </div>
      {isSlow.includes(shape.props.component) &&
        (loading !== false ? (
          <Stopwatch className={TimePosRight[componentType]} start={loading} />
        ) : (
          <ShowTime
            className={TimePosRight[componentType]}
            time={shape.props.time ?? 0}
          />
        ))}
    </HTMLContainer>
  );
}
