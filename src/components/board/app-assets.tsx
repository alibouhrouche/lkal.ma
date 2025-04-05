import {
  TLAssetId,
  TldrawUiButton,
  TldrawUiButtonLabel,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogFooter,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
  useEditor,
} from "tldraw";
import { useState } from "react";
import {
  ClipboardPasteIcon,
  ExternalLinkIcon,
  XIcon,
} from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils.ts";

export default function AppAssets({ onClose }: { onClose(): void }) {
  const editor = useEditor();
  const assets = editor.getAssets();
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <>
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Assets</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody style={{ maxWidth: 650 }}>
        <div className="grid grid-cols-3 gap-4 overflow-auto">
          {assets.length > 0 ? (
            assets.map((asset) => (
              <div key={asset.id} className="relative flex items-center">
                <div className="absolute flex w-full top-0 p-2 left-0 justify-between z-50">
                  <Button
                    variant="secondary"
                    size="icon"
                    className={
                      selected?.includes(asset.id) ? "bg-destructive" : ""
                    }
                    onClick={() => {
                      if (selected?.includes(asset.id)) {
                        setSelected(selected.filter((k) => k !== asset.id));
                      } else {
                        setSelected([...selected, asset.id]);
                      }
                    }}
                    title="Select For Deletion"
                  >
                    <XIcon
                      strokeWidth="4"
                      className={
                        selected?.includes(asset.id)
                          ? "visible text-red-500"
                          : "invisible"
                      }
                    />
                  </Button>
                  {asset.props.src && (
                    <a
                      href={asset.props.src ?? ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        size: "icon",
                      })}
                      title="Open In New Tab"
                    >
                      <ExternalLinkIcon className="text-primary-foreground" />
                    </a>
                  )}
                  <Button
                    size="icon"
                    title="Paste Asset"
                    onClick={() => {
                      const box = editor.getViewportPageBounds();
                      switch (asset.type) {
                        case "image":
                          editor.createShape({
                            type: "image",
                            x: box.x + box.width / 2 - asset.props.w / 2,
                            y: box.y + box.height / 2 - asset.props.h / 2,
                            props: {
                              assetId: asset.id,
                              w: asset.props.w,
                              h: asset.props.h,
                            },
                          });
                          break;
                        case "bookmark":
                          editor.createShape({
                            type: "bookmark",
                            x: box.x + box.width / 2 - 300 / 2,
                            y: box.y + box.height / 2 - 320 / 2,
                            props: {
                              assetId: asset.id,
                              w: 300,
                              h: 320,
                              url: asset.props.src,
                            },
                          });
                      }
                      onClose();
                    }}
                  >
                    <ClipboardPasteIcon />
                  </Button>
                </div>
                {asset.type === "image" && asset.props.src && (
                  <img
                    src={asset.props.src}
                    className={cn(
                      "w-full h-auto max-h-72 min-h-64 object-cover rounded-md border border-gray-200 dark:border-gray-700",
                      selected?.includes(asset.id) && "opacity-50"
                    )}
                  />
                )}
                {asset.type === "bookmark" && (
                  <div className="h-full flex flex-col justify-end min-h-24 z-10 p-2 w-full bg-card rounded-md border border-gray-200 dark:border-gray-700"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${asset.props.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                  >
                    <div className="break-all mt-16">{asset.props.title}</div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No assets found</div>
          )}
        </div>
      </TldrawUiDialogBody>
      <TldrawUiDialogFooter className="tlui-dialog__footer__actions">
        <TldrawUiButton type="normal" onClick={onClose}>
          <TldrawUiButtonLabel>Cancel</TldrawUiButtonLabel>
        </TldrawUiButton>
        <TldrawUiButton
          type="primary"
          onClick={() => {
            if (selected.length > 0) {
              editor.deleteAssets(selected as TLAssetId[]);
            }
            onClose();
          }}
        >
          <TldrawUiButtonLabel>
            Delete {selected.length} Assets
          </TldrawUiButtonLabel>
        </TldrawUiButton>
      </TldrawUiDialogFooter>
    </>
  );
}
