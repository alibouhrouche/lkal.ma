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
    window.onafterprint = function () {
        window.close();
    }
    </script>
</body>
</html>
`;
  const w = window.open("", "_blank", `popup=yes`);
  if (!w) {
    toast.error("Failed to open print window", {
      description: "Please allow popups for this site.",
    });
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
};
