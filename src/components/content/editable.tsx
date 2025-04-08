import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { ComponentShape } from "@/components/tools";
import {
  Editor,
  preventDefault,
  stopEventPropagation,
  TEXT_PROPS,
  useEditor,
  useValue,
} from "tldraw";
import {
  EditorContent,
  EditorEvents,
  Extensions,
  useEditor as useHTMLEditor,
} from "@tiptap/react";
import { EditorView } from "@tiptap/pm/view";
import { all, createLowlight } from "lowlight";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import Bold from "@tiptap/extension-bold";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import {
  FONT_SIZES,
  stopEventPropagationNoZoom,
} from "@/components/content/shared.ts";

const lowlight = createLowlight(all);

// Copied from tldraw rich text.
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

const extensions: Extensions = [
  Document,
  Paragraph,
  Text,
  History,
  Bold,
  Blockquote,
  BulletList,
  Code,
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Dropcursor,
  Gapcursor,
  HardBreak,
  Heading,
  HorizontalRule,
  Italic,
  Strike,
  ListItem,
  OrderedList,
  Highlight,
  Typography,
];

const EditableContent = React.memo(function Content({
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
  const wrapperRef = useRef<HTMLDivElement>(null);
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
    [editor, shapeId],
  );

  const onKeyDown = useCallback(
    (view: EditorView, event: KeyboardEvent) => {
      if (event.key === "Tab") {
        handleTab(editor, view, event);
      } else if (event.key === "Enter" && event.ctrlKey) {
        event.preventDefault();
        const pos = view.state.selection.from;
        onRun?.();
        setTimeout(() => {
          htmlEditor.commands.setTextSelection(pos);
          view.focus();
        });
      }
    },
    [editor, onRun],
  );

  const htmlEditor = useHTMLEditor({
    extensions,
    content: shape.props.value,
    onUpdate: handleUpdate,
    editorProps: {
      handleKeyDown: onKeyDown,
    },
    parseOptions: {
      preserveWhitespace: "full",
    },
    editable,
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
  });

  const selectToolActive = useValue(
    "isSelectToolActive",
    () => editor.getCurrentToolId() === "select",
    [editor],
  );

  const onClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      if (editor.getCurrentToolId() !== "select") return;
      if (editor.getEditingShapeId() !== shapeId) {
        editor.setEditingShape(null);
        editor.setEditingShape(shapeId);
      }
      if (e.target === wrapperRef.current) {
        htmlEditor.commands.focus("end");
      }
    },
    [htmlEditor, shapeId],
  );

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

  return (
    <div
      className="prose text-fg max-w-none w-full h-full p-2 overflow-y-scroll overflow-x-hidden tl-text-wrapper"
      data-font={shape.props.font}
      style={{
        fontSize,
        lineHeight: Math.floor(fontSize * lineHeight) + "px",
        minHeight: Math.floor(fontSize * lineHeight) + "px",
        cursor: "var(--tl-cursor-text)",
        ...style,
      }}
      onContextMenu={selectToolActive ? stopEventPropagation : undefined}
      onPointerDownCapture={selectToolActive ? stopEventPropagation : undefined}
      onTouchEnd={selectToolActive ? stopEventPropagation : undefined}
      onWheelCapture={selectToolActive ? stopEventPropagationNoZoom : undefined}
      onDragStart={selectToolActive ? preventDefault : undefined}
    >
      <div className="relative tl-rich-text w-full h-full">
        <EditorContent
          autoFocus
          ref={wrapperRef}
          editor={htmlEditor}
          tabIndex={-1}
          className="tl-rich-text tl-text w-full h-full"
          onClick={onClick}
        />
      </div>
    </div>
  );
});

export default EditableContent;
