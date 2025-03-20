import { db } from "@/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useLoaderData, useParams } from "react-router";

export const AppTitle = () => {
    const id = useParams().id!;
    const preloaded = useLoaderData<{ title: string }>();
    const boardTitle = useLiveQuery(() => db.boards.get(id, b => b?.name ?? "Not Found"), [id]);
    return <title>{`${boardTitle ?? preloaded.title} - Lkal.ma`}</title>
}