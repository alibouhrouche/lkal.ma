import { useEffect } from "react";

export default function Title({ children }: { children: string }) {
    useEffect(() => {
        document.title = `${children} - Lkal.ma`;
        return () => {
            document.title = "Lkal.ma";
        }
    }, [children]);
    return null;
}
