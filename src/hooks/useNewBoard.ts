import {useRouter} from "next/router";
import {useCallback} from "react";
import {db} from "@/db";

export default function useNewBoard() {
    const router = useRouter();
    return useCallback(() => {
        db.newBoard().then((id) => {
            void router.push(`/b/${id}`);
        });
    }, [router]);
}