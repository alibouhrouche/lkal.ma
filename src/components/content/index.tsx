import React from "react";
import { ComponentShape } from "@/components/tools";
import ImageContent from "@/components/tools/image.tsx";

const EditableContent = React.lazy(() => import("./editable.tsx"))
const QueryContent = React.lazy(() => import("./query.tsx"))
const JSONContent = React.lazy(() => import("./json.tsx"))
const WebsiteContent = React.lazy(() => import("./website.tsx"))

export default React.memo(function Content({
  shape,
  loading,
  canEdit,
  isEditing,
  onRun,
}: {
  shape: ComponentShape;
  loading?: boolean;
  canEdit?: boolean;
  isEditing?: boolean;
  onRun?: () => void;
}) {
  const readonly = shape.props.readonly;
  switch (shape.props.component) {
    case "text":
    case "instruction":
      return (
        <EditableContent
          shape={shape}
          editable={!loading && !readonly && canEdit}
          onRun={onRun}
        />
      );
    case "query":
      return (
        <QueryContent
          shape={shape}
          editable={!loading && !readonly && canEdit}
          onRun={onRun}
        />
      );
    case "image":
      return <ImageContent shape={shape} isEditing={isEditing} />;
    case "data":
      return (
        <JSONContent
          shape={shape}
          editable={!loading && !readonly && canEdit}
          isEditing={isEditing}
        />
      );
    case "website":
      return <WebsiteContent shape={shape} />;
    default:
      return null;
  }
});
