import { Board, db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { createContext, useContext } from "react";

export const BoardsContext = createContext<{
    boards?: Board[];
} | null>(null);

export const useBoards = () => {
    const context = useContext(BoardsContext);
    if (!context) {
        throw new Error("useBoards must be used within a BoardsProvider");
    }
    return context.boards;
}

export default function BoardsProvider({ children }: { children: React.ReactNode }) {
    const boards = useLiveQuery(
        () => db.boards.orderBy("created_at").reverse().toArray(),
        []
    );
    return (
        <BoardsContext.Provider value={{ boards }}>
            {children}
        </BoardsContext.Provider>
    );
}
