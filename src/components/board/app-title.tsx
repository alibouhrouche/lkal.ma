import { db } from "@/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useBoardId } from "."

export const AppTitle = () => {
    const id = useBoardId()
    const boardTitle = useLiveQuery(() => db.boards.get(id, b => b?.name ?? "Not Found"), [id]);
    return <title>{`${boardTitle ?? "Loading..."} - Lkal.ma`}</title>
}