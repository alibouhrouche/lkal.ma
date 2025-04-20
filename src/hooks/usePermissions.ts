import {Board, db} from "@/db";
import {useObservable} from "dexie-react-hooks";

export const useBoardPermissions = (board: Board) =>
    useObservable(() => db.cloud.permissions(board, "boards"), [board]);
