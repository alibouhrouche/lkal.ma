import {ComponentShape} from "@/components/tools/index.tsx";
import {Editor} from "tldraw";
import {LockIcon, LockOpenIcon} from "lucide-react";

const ReadOnly = ({
                      editor,
                      shape,
                  }: {
    editor: Editor;
    shape: ComponentShape;
}) => <button
    className="tl-cursor-pointer hover:opacity-75"
    onPointerDown={() => {
        editor.updateShapes([{
            id: shape.id,
            type: shape.type,
            props: {
                readonly: !shape.props.readonly,
            },
        }]);
    }}
>
    {
        shape.props.readonly ?
            <LockIcon className="w-4 h-4"/>
            :
            <LockOpenIcon className="w-4 h-4"/>
    }
</button>

export default ReadOnly;