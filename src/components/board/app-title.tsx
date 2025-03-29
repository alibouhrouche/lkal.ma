import { db } from "@/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useApp } from "./context";
import { useEffect } from "react";

export const AppTitle = () => {
    const id = useApp().id;
    const boardTitle = useLiveQuery(() => db.boards.get(id, b => b?.name ?? "Not Found"), [id]);
    useEffect(() => {
        document.title = `${boardTitle ?? "loading..."} - Lkal.ma`
    }, [boardTitle])
    return null
}