import {useBoard} from "@/components/board/board-context.ts";
import Head from "next/head";

export const AppTitle = () => {
    const board = useBoard();
    return <Head>
        <title key="title">{`${board.board.name ?? "Loading..."} - Lkal.ma`}</title>
    </Head>
}