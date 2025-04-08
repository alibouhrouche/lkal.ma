import {
  Editor,
  TldrawUiButton,
  TldrawUiButtonLabel,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogFooter,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
  useEditor,
} from "tldraw";
import {
  ComponentConfig,
  ComponentConfigImage,
  ComponentConfigText,
  ComponentShape,
} from "../tools";
import InstructionConfig from "../tools/instructions";
import { ImageConfig } from "../tools/image";
import React, { useState } from "react";
import {
  defaultImageConfig,
  defaultInstructionConfig,
} from "../tools/defaults";

type ShapeConfigProps = {
  data: ComponentConfig;
  setData: React.Dispatch<React.SetStateAction<ComponentConfig>>;
  shape: ComponentShape;
  editor: Editor;
};

const dataType = <T extends ComponentConfig>(
  shape: ComponentShape,
  component: string,
  _data: ComponentConfig
): _data is T => shape.props.component === component;

function ShapeConfig({ data, setData, shape, editor }: ShapeConfigProps) {
  if (!shape || shape.type !== "component") return null;
  if (dataType<ComponentConfigImage>(shape, "image", data)) {
    return (
      <ImageConfig
        shape={shape}
        data={data}
        setData={
          setData as React.Dispatch<React.SetStateAction<ComponentConfigImage>>
        }
      />
    );
  }
  if (dataType<ComponentConfigText>(shape, "instruction", data)) {
    return (
      <InstructionConfig
        editor={editor}
        shape={shape}
        data={data}
        setData={
          setData as React.Dispatch<React.SetStateAction<ComponentConfigText>>
        }
      />
    );
  }
  return null;
}

function getInitialData(shape: ComponentShape) {
  if (!shape || shape.type !== "component") return null;
  switch (shape?.props.component) {
    case "image":
      return (shape.props.config ?? defaultImageConfig) as ComponentConfigImage;
    case "instruction":
      return (shape.props.config ??
        defaultInstructionConfig) as ComponentConfigText;
  }
  return null;
}

export default function AppDialog({
  onClose,
  shape,
}: {
  onClose(): void;
  shape: ComponentShape;
}) {
  const editor = useEditor();
  const [data, setData] = useState(() => getInitialData(shape));
  return (
    <>
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Edit AI Settings</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody className="max-w-full w-[450px]">
        {data ? (
          <ShapeConfig
            editor={editor}
            shape={shape}
            data={data}
            setData={
              setData as React.Dispatch<React.SetStateAction<ComponentConfig>>
            }
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-sm text-gray-500">
              No configuration available for this component.
            </p>
          </div>
        )}
      </TldrawUiDialogBody>
      <TldrawUiDialogFooter className="tlui-dialog__footer__actions">
        <TldrawUiButton
          type="normal"
          onClick={onClose}
          style={{
            cursor: "var(--tl-cursor-pointer)",
          }}
        >
          <TldrawUiButtonLabel>Cancel</TldrawUiButtonLabel>
        </TldrawUiButton>
        <TldrawUiButton
          type="primary"
          onClick={() => {
            editor.updateShape({
              id: shape.id,
              type: shape.type,
              props: {
                ...shape.props,
                config: data,
              },
            });
            onClose();
          }}
          style={{
            cursor: "var(--tl-cursor-pointer)",
          }}
        >
          <TldrawUiButtonLabel>Save</TldrawUiButtonLabel>
        </TldrawUiButton>
      </TldrawUiDialogFooter>
    </>
  );
}
