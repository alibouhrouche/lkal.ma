import { EditorView } from "@tiptap/pm/view";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import {
  EditorContent,
  EditorEvents,
  useEditor as useHTMLEditor,
} from "@tiptap/react";
import React, { useCallback, useEffect } from "react";
import { Editor, TEXT_PROPS, TLDefaultSizeStyle, useEditor } from "tldraw";
import { ComponentShape } from ".";

const FONT_SIZES: Record<TLDefaultSizeStyle, number> = {
  s: 12,
  m: 16,
  l: 22,
  xl: 38,
};

const preventDefault = (event: React.DragEvent) => event.preventDefault();
const stopEventPropagation = (event: React.BaseSyntheticEvent) =>
  event.stopPropagation();

// Prevent exiting the editor when hitting Tab.
// Also, insert a tab character at the front of the line if the shift key isn't pressed,
// otherwise if shift is pressed, remove a tab character from the front of the line.
function handleTab(editor: Editor, view: EditorView, event: KeyboardEvent) {
  // Don't exit the editor.
  event.preventDefault();

  const textEditor = editor.getRichTextEditor();
  if (textEditor?.isActive("bulletList") || textEditor?.isActive("orderedList"))
    return;

  const { state, dispatch } = view;
  const { $from, $to } = state.selection;
  const isShift = event.shiftKey;

  // Create a new transaction
  let tr = state.tr;

  // Iterate over each line in the selection in reverse so that the positions
  // are stable as we modify the document.
  let pos = $to.end();
  while (pos >= $from.start()) {
    const line = state.doc.resolve(pos).blockRange();
    if (!line) break;

    const lineStart = line.start;
    const lineEnd = line.end;
    const lineText = state.doc.textBetween(lineStart, lineEnd, "\n");

    // Check if the current line or any of its parent nodes are part of a list
    let isInList = false;
    state.doc.nodesBetween(lineStart, lineEnd, (node) => {
      if (node.type.name === "bulletList" || node.type.name === "orderedList") {
        isInList = true;
        return false; // Stop iteration
      }
    });

    // TODO: for now skip over lists. Later, we might consider handling them using
    // sinkListItem and liftListItem from @tiptap/pm/schema-list
    if (!isInList) {
      if (!isShift) {
        // Insert a tab character at the start of the line
        tr = tr.insertText("\t", lineStart + 1);
      } else {
        // Remove a tab character from the start of the line
        if (lineText.startsWith("\t")) {
          tr = tr.delete(lineStart + 1, lineStart + 2);
        }
      }
    }

    pos = lineStart - 1;
  }

  const mappedSelection = state.selection.map(tr.doc, tr.mapping);
  tr.setSelection(mappedSelection);

  if (tr.docChanged) {
    dispatch(tr);
  }
}

export const EditableContent = React.memo(function Content({
  shape,
  style,
  editable = true,
  onRun,
}: {
  shape: ComponentShape;
  style?: React.CSSProperties;
  editable?: boolean;
  onRun?: () => void;
}) {
  const shapeId = shape.id;
  const editor = useEditor();
  const handleUpdate = useCallback(
    (props: EditorEvents["update"]) => {
      editor.updateShape({
        id: shapeId,
        type: "component",
        props: {
          value: props.editor.getHTML(),
        },
      });
    },
    [editor, shapeId]
  );

  const onKeyDown = useCallback(
		(view: EditorView, event: KeyboardEvent) => {
			if (event.key === 'Tab') {
				handleTab(editor, view, event)
			} else if (event.key === 'Enter' && event.ctrlKey) {
        event.preventDefault()
        onRun?.()
      }
		},
		[editor, onRun]
	)

  const htmlEditor = useHTMLEditor({
    extensions: [Document, Paragraph, Text, History],
    content: shape.props.value,
    onUpdate: handleUpdate,
    editorProps: {
      handleKeyDown: onKeyDown,
    },
    editable,
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
  });

  useEffect(() => {
    if (shape.props.value !== htmlEditor.getHTML())
      htmlEditor.commands.setContent(shape.props.value, false, {
        preserveWhitespace: "full",
      });
  }, [shape.props.value, htmlEditor]);

  useEffect(() => {
    htmlEditor.setEditable(editable);
  }, [editable, htmlEditor]);

  const fontSize = FONT_SIZES[shape.props.size];
  const lineHeight = TEXT_PROPS.lineHeight;
  //   const textWidth = shape.props.w;

  return (
    <div
      className="w-full h-full p-2 overflow-y-scroll overflow-x-hidden tl-text-wrapper"
      data-font={shape.props.font}
      style={{
        fontSize,
        lineHeight: Math.floor(fontSize * lineHeight) + "px",
        minHeight: Math.floor(fontSize * lineHeight) + "px",
        // minWidth: Math.ceil(textWidth || 0),
        cursor: "var(--tl-cursor-text)",
        ...style,
      }}
      onContextMenu={stopEventPropagation}
      onPointerDownCapture={stopEventPropagation}
      onTouchEnd={stopEventPropagation}
      onDragStart={preventDefault}
    >
      <div className="tl-rich-text w-full h-full">
        <EditorContent
          autoFocus
          editor={htmlEditor}
          tabIndex={-1}
          className="tl-rich-text tl-text w-full h-full"
        />
      </div>
    </div>
  );
});

export default function Content({
  shape,
  loading,
  onRun,
}: {
  shape: ComponentShape;
  loading?: boolean;
  onRun?: () => void;
}) {
  switch (shape.props.component) {
    case "text":
      return <EditableContent shape={shape} editable={!loading} onRun={onRun} />;
    default:
      return null;
  }
}
