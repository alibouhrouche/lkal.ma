import { assetsStore, db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
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
import { useApp } from "./context";
import { useState } from "react";
import { CheckIcon, ExternalLinkIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";

export default function AppAssets({ onClose }: { onClose(): void }) {
  const id = useApp().id;
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
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 left-4 z-50"
                  onClick={() => {
                    if (selected?.includes(asset.id)) {
                      setSelected(selected.filter((k) => k !== asset.id));
                    } else {
                      setSelected([...selected, asset.id]);
                    }
                  }}
                >
                  <CheckIcon
                    className={
                      selected?.includes(asset.id)
                        ? "visible text-primary-foreground"
                        : "invisible"
                    }
                  />
                </Button>
                {asset.type === "image" && (
                  <img
                    src={`/b/${id}/${asset.id}`}
                    className="w-full h-auto max-h-72 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                  />
                )}
                <a
                  href={`/b/${id}/${asset.id}`}
                  target="_blank"
                  className={buttonVariants({
                    className: "absolute top-4 right-4 z-50",
                    size: "icon",
                  })}
                >
                  <ExternalLinkIcon className="text-primary-foreground" />
                </a>
              </div>
            ))
          ) : (
            <div>
                No assets found
            </div>
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
