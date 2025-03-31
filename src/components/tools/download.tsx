import { DownloadIcon } from "lucide-react";
import { ComponentShape } from ".";

export default function DownloadButton({ shape }: { shape: ComponentShape }) {
  const img = shape.props.data.find((d) => d.type === "image")?.src;
  if (!img) return null;
  return (
    <div
      className="tl-cursor-pointer"
      onPointerDown={() => {
        const a = document.createElement("a");
        a.href = img;
        a.download = "image.png";
        a.click();
        a.remove();
      }}
    >
      <DownloadIcon size={16} />
    </div>
  );
}
