import { db } from "@/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useApp } from "./context";
import Title from "../title";

export const AppTitle = () => {
    const id = useApp().id;
    const boardTitle = useLiveQuery(() => db.boards.get(id, b => b?.name ?? "Not Found"), [id]);
    return <Title key="title">{boardTitle ?? "loading..."}</Title>
}