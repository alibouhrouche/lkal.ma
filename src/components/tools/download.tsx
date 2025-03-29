import { DownloadIcon } from "lucide-react";
import { ComponentShape } from ".";
import { stopEventPropagation } from "tldraw";

export default function DownloadButton({ shape }: { shape: ComponentShape }) {
  const img = shape.props.data.find((d) => d.type === "image")?.src;
  if (!img) return null;
  return (
    <a
      className="tl-cursor-pointer"
      href={img}
      target="_blank"
      rel="noopener noreferrer"
      onContextMenu={stopEventPropagation}
    >
      <DownloadIcon size={16} />
    </a>
  );
}
