import { pdfjs } from 'react-pdf';
import { useEffect } from 'react';
import { defaultHandleExternalUrlContent, DEFAULT_MAX_ASSET_SIZE, DEFAULT_MAX_IMAGE_DIMENSION, DEFAULT_SUPPORTED_IMAGE_TYPES, useEditor, useToasts, useTranslation } from 'tldraw';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const assetsOptions = {
    maxImageDimension: DEFAULT_MAX_IMAGE_DIMENSION,
    maxAssetSize: DEFAULT_MAX_ASSET_SIZE,
    acceptedImageMimeTypes: DEFAULT_SUPPORTED_IMAGE_TYPES,
    acceptedVideoMimeTypes: [],
}

export default function AppMount({ canEdit = false }: { canEdit?: boolean }) {
    const editor = useEditor();
    const toasts = useToasts();
    const msg = useTranslation();
    // const handleMount = useCallback(() => {
    //     editor.registerExternalContentHandler("url", async (content) => {
    //         console.log(content);
    //         // if (!canEdit) {
    //         //     return;
    //         // }
    //         // const pdf = content.sources?.find((source) => source.type === "text" && source.data.endsWith(".pdf"));
    //         // if (pdf) {
    //         //     console.log("PDF URL detected", pdf.data);
    //         //     const center = content.point ?? editor.getViewportPageBounds().center;
    //         //     editor.createShapes([
    //         //         {
    //         //             type: "pdf",
    //         //             x: center.x - 50,
    //         //             y: center.y - 75,
    //         //             props: {
    //         //                 value: pdf.data,
    //         //                 w: 100,
    //         //                 h: 150,
    //         //             },
    //         //         },
    //         //     ]);
    //         //     return;
    //         // }
    //         // if (content.url.endsWith(".pdf")) {
    //         //     console.log("PDF URL detected", content.url);
    //         //     const center = content.point ?? editor.getViewportPageBounds().center;
    //         //     editor.createShapes([
    //         //         {
    //         //             type: "pdf",
    //         //             x: center.x - 50,
    //         //             y: center.y - 75,
    //         //             props: {
    //         //                 value: content.url,
    //         //                 w: 100,
    //         //                 h: 150,
    //         //             },
    //         //         },
    //         //     ]);

    //         //     return;
    //         // }
    //         // await defaultHandleExternalUrlContent(editor, content, {
    //         //     ...assetsOptions,
    //         //     toasts,
    //         //     msg,
    //         // })
    //     });
    // }, [editor, canEdit, toasts, msg]);
    useEffect(() => {
        editor.registerExternalContentHandler("url", async (content) => {
            if (content.url.endsWith(".pdf")) {
                const center = content.point ?? editor.getViewportPageBounds().center;
                editor.createShapes([
                    {
                        type: "pdf",
                        x: center.x - 50,
                        y: center.y - 75,
                        props: {
                            value: content.url,
                            w: 100,
                            h: 150,
                        },
                    },
                ]);

                return;
            }
            await defaultHandleExternalUrlContent(editor, content, {
                ...assetsOptions,
                toasts,
                msg,
            })
        });
    }, [editor, canEdit, toasts, msg]);
    return null;
}