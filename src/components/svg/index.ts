import type {Editor, SvgExportContext} from "tldraw";
import type {ComponentShape} from "@/components/tools";

type Props =  {
    editor: Editor;
    shape: ComponentShape;
    ctx: SvgExportContext;
}

export const textSVG = (props: Props) => import("./text.tsx").then((m) => m.default(props));
export const imageSVG = (props: Props) => import("./image.tsx").then((m) => m.default(props));
export const websiteSVG = (props: Props) => import("./website.tsx").then((m) => m.default(props));
export const dataSVG = (props: Props) => import("./data.tsx").then((m) => m.default(props));
export const buttonSVG = (props: Props) => import("./button.tsx").then((m) => m.default(props));
