import {
  BaseBoxShapeTool,
  DefaultColorStyle,
  DefaultFontStyle,
  DefaultSizeStyle,
  Geometry2d,
  getDefaultColorTheme,
  getFontsFromRichText,
  HTMLContainer,
  RecordPropsType,
  Rectangle2d,
  renderRichTextFromHTML,
  resizeBox,
  ShapeUtil,
  StyleProp,
  SvgExportContext,
  T,
  TLBaseShape,
  TLFontFace,
  TLResizeInfo,
  TLShapeId,
} from "tldraw";
import {
  AlertTriangleIcon,
  GripVerticalIcon,
  Loader2,
  Play,
} from "lucide-react";
import Content from "./content";
import { runners } from "./run";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { componentRunner } from "./observer";
import { toAdjacencyList, topologicalSort } from "./graph";
import { ShowTime, Stopwatch } from "./stopwatch";
import Config from "./config";
import { buttonSVG, dataSVG, imageSVG, textSVG, websiteSVG } from "./svg";
import DownloadButton from "./download";
import { toast } from "sonner";
import ReadOnly from "@/components/tools/readonly.tsx";

const ICON_SIZES = {
  s: 16,
  m: 24,
  l: 32,
  xl: 48,
};

export class ComponentTool extends BaseBoxShapeTool {
  static override id = "component";
  static override initial = "idle";
  override shapeType = "component";
}

export const componentTypeStyle = StyleProp.defineEnum("component:type", {
  defaultValue: "text",
  values: [
    "text",
    "instruction",
    "button",
    "website",
    "image",
    "data",
    "query",
  ],
});

const TimePosRight = {
  text: "right-4",
  instruction: "right-4",
  image: "right-1",
  website: "right-4",
  data: "right-4",
  query: "right-4",
};

const isSlow = ["image", "instruction"];

// const minSizes = {
//   text: { w: 250, h: 150 },
//   instruction: { w: 250, h: 150 },
//   image: { w: 350, h: 380 },
//   command: { w: 250, h: 150 },
//   button: { w: 50, h: 50 },
// };

export type ComponentTypeStyle = T.TypeOf<typeof componentTypeStyle>;

export const ComponentConfigs = {
  image: T.object({
    type: T.literal("image"),
    model: T.string,
    seed: T.nullable(T.number),
    width: T.number,
    height: T.number,
    nologo: T.boolean,
    private: T.boolean,
    enhance: T.boolean,
    safe: T.boolean,
  }),
  text: T.object({
    type: T.literal("text"),
    model: T.string,
    seed: T.nullable(T.number),
    json: T.boolean,
    private: T.boolean,
  }),
};

export type ComponentConfigImage = T.TypeOf<typeof ComponentConfigs.image>;
export type ComponentConfigText = T.TypeOf<typeof ComponentConfigs.text>;
export type ComponentConfig = ComponentConfigImage | ComponentConfigText;

export const componentShapeProps = {
  component: componentTypeStyle,
  color: DefaultColorStyle,
  w: T.number,
  h: T.number,
  value: T.or(T.string, T.jsonDict()),
  procedure: T.nullable(
    T.object({
      description: T.string,
      name: T.string,
      outputDescription: T.string,
      steps: T.arrayOf(T.string),
      userPrompt: T.string,
    }),
  ),
  readonly: T.boolean,
  data: T.arrayOf(
    T.union("type", {
      text: T.object({
        type: T.literal("text"),
        text: T.string,
        model: T.optional(T.string),
        seed: T.optional(T.number),
        description: T.optional(T.string),
        name: T.optional(T.string),
      }),
      image: T.object({
        type: T.literal("image"),
        src: T.string,
        height: T.number,
        width: T.number,
        seed: T.optional(T.number),
        model: T.optional(T.string),
        description: T.optional(T.string),
        name: T.optional(T.string),
      }),
      json: T.object({
        type: T.literal("json"),
        data: T.any,
      }),
    }),
  ),
  config: T.optional(T.union("type", ComponentConfigs)),
  scale: T.number,
  font: DefaultFontStyle,
  size: DefaultSizeStyle,
  fail: T.optional(T.boolean),
  time: T.optional(T.number),
};

export type ComponentShapeProps = RecordPropsType<typeof componentShapeProps>;
export type ComponentShape = TLBaseShape<"component", ComponentShapeProps>;

export class ComponentUtil extends ShapeUtil<ComponentShape> {
  static override type = "component" as const;
  static override props = componentShapeProps;

  override isAspectRatioLocked() {
    return false;
  }

  override canResize() {
    return !this.editor.getIsReadonly();
  }

  override canEdit() {
    return !this.editor.getIsReadonly();
  }

  override getFontFaces(shape: ComponentShape): TLFontFace[] {
    if (["text", "instructions"].includes(shape.props.component)) {
      const value =
        typeof shape.props.value !== "string"
          ? JSON.stringify(shape.props.value)
          : shape.props.value;
      const richText = renderRichTextFromHTML(this.editor, value);
      return getFontsFromRichText(this.editor, richText, {
        family: `tldraw_${shape.props.font}`,
        weight: "normal",
        style: "normal",
      });
    }
    return [];
  }

  getDefaultProps(): ComponentShapeProps {
    return {
      component: "text",
      color: "light-violet",
      w: 100,
      h: 50,
      value: "",
      procedure: null,
      readonly: false,
      data: [],
      font: "draw",
      size: "s",
      scale: 1,
    };
  }

  getGeometry(shape: ComponentShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: ComponentShape) {
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = useState<number | false>(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [abort, setAbort] = useState<AbortController | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      return componentRunner.subscribe(shape.id, (data) => {
        setLoading(data.loading);
        setAbort(data.abort ?? null);
      });
    }, [shape.id]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const run = useCallback(() => {
      if (loading !== false) {
        abort?.abort();
        return;
      }
      this.run(shape);
    }, [shape, loading, abort]);

    const componentType = shape.props.component;

    const canEdit = this.canEdit();
    const isEditing = this.editor.getEditingShapeId() === shape.id;

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
            className="tl-cursor rounded-full flex items-center justify-center hover:opacity-75"
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
              editor={this.editor}
              shape={shape}
              canEdit={canEdit}
              loading={loading}
            />
            <ReadOnly editor={this.editor} shape={shape} />
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
            <Stopwatch
              className={TimePosRight[componentType]}
              start={loading}
            />
          ) : (
            <ShowTime
              className={TimePosRight[componentType]}
              time={shape.props.time ?? 0}
            />
          ))}
      </HTMLContainer>
    );
  }

  indicator(shape: ComponentShape) {
    return (
      <rect rx="10px" ry="10px" width={shape.props.w} height={shape.props.h} />
    );
  }

  override onResize(shape: ComponentShape, info: TLResizeInfo<ComponentShape>) {
    return resizeBox(shape, info);
  }

  async run(shape: ComponentShape) {
    const abort = new AbortController();
    const signal = abort.signal;
    if (!this.canEdit()) return;
    const namesMap = new Map<TLShapeId, (string | undefined)[]>();
    const adj = toAdjacencyList(this.editor, shape.id, namesMap);
    const order = topologicalSort(adj).map(
      (id) => this.editor.getShape(id)! as ComponentShape,
    );
    for (const shape of order) {
      if (shape.props.readonly) continue;
      const start = performance.now();
      componentRunner.notify({ id: shape.id, loading: start, abort });
      signal?.throwIfAborted();
      try {
        const props = await runners[shape.props.component]({
          editor: this.editor,
          shape,
          signal,
        });
        const end = performance.now();
        this.editor.updateShape({
          id: shape.id,
          type: "component",
          props: {
            ...props,
            fail: false,
            time: end - start,
          },
        });
      } catch (e: any) {
        this.editor.updateShape({
          id: shape.id,
          type: "component",
          props: {
            fail: true,
            time: 0,
          },
        });
        console.error(e);
        toast.error(`Error: ${e.message} failed to run.`);
      } finally {
        componentRunner.notify({ id: shape.id, loading: false });
      }
    }
  }

  override async toSvg(shape: ComponentShape, ctx: SvgExportContext) {
    switch (shape.props.component) {
      case "image":
        return imageSVG({ editor: this.editor, shape, ctx });
      case "text":
      case "instruction":
      case "query":
        return textSVG({ editor: this.editor, shape, ctx });
      case "button":
        return buttonSVG({ editor: this.editor, shape, ctx });
      case "data":
        return dataSVG({ editor: this.editor, shape, ctx });
      case "website":
        return websiteSVG({ editor: this.editor, shape, ctx });
      default:
        return null;
    }
  }
}
