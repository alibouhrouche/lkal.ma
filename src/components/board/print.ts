import { toast } from "sonner";
import { Editor } from "tldraw";

export const print = async (editor: Editor) => {
  const shapes = Array.from(
    editor.getShapeAndDescendantIds(editor.getSelectedShapeIds()),
  );

  const svg = await toast
    .promise(
      editor.getSvgString(shapes, {
        darkMode: false,
        background: false,
        padding: 64,
      }),
      {
        loading: "Preparing print...",
      },
    )
    .unwrap();
  if (!svg) {
    return;
  }
    const html = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Print</title>
    <style>
        svg { position: fixed; inset: 0; width: 100vw; height: 100vh;}
        @page {
            size: ${svg.width}pt ${svg.height}pt;
        }
    </style>
</head>
<body>
    ${svg.svg}
    <script>
    window.onload = function () {
        window.print();
    }
    </script>
</body>
</html>
`;
  const iframe = document.getElementById("print") as HTMLIFrameElement;
  if (!iframe) {
    toast.error("Failed to print", {
      description: "Please try again later.",
      duration: 5000,
    });
    return;
  }
  iframe.contentDocument?.open();
  iframe.contentDocument?.write(html);
  iframe.contentDocument?.close();
};
