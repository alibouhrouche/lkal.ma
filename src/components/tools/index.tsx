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
import { runners } from "./run";
import {
  CSSProperties,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { componentRunner } from "./observer";
import { toAdjacencyList, topologicalSort } from "./graph";
import { toast } from "sonner";
import {
  buttonSVG,
  dataSVG,
  imageSVG,
  textSVG,
  websiteSVG,
} from "@/components/svg";

const UI = lazy(() => import("./ui.tsx"));

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
    if (["text", "instructions", "query"].includes(shape.props.component)) {
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
    if (shape.props.component === "data") {
      return [
        {
          src: {
            url: `tldraw_${shape.props.font}`,
          },
          family: `tldraw_${shape.props.font}`,
          weight: "normal",
          style: "normal",
        },
      ];
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
    const canEdit = this.canEdit();
    const isEditing = this.editor.getEditingShapeId() === shape.id;
    const [loading, setLoading] = useState<number | false>(false);
    const [abort, setAbort] = useState<AbortController | null>(null);
    useEffect(() => {
      return componentRunner.subscribe(shape.id, (data) => {
        setLoading(data.loading);
        setAbort(data.abort ?? null);
      });
    }, [shape.id]);
    const run = useCallback(() => {
      if (loading !== false) {
        abort?.abort();
        return;
      }
      this.run(shape);
    }, [shape, loading, abort]);

    return (
      <Suspense
        fallback={
          <HTMLContainer
            id={shape.id}
            className="ring-primary ring-2"
            style={
              {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyItems: "center",
                justifyContent: "center",
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
            Loading...
          </HTMLContainer>
        }
      >
        <UI
          editor={this.editor}
          shape={shape}
          theme={theme}
          run={run}
          canEdit={canEdit}
          isEditing={isEditing}
          loading={loading}
        />
      </Suspense>
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
