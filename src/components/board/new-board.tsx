import { db } from "@/db";
import { useEffect, useRef } from "react";
import { navigate } from "wouter/use-browser-location";

export default function NewBoard() {
    const ref = useRef(false);
    useEffect(() => {
        if (ref.current) return;
        ref.current = true;
        db.newBoard().then((id) => {
            navigate(`/b/${id}`, { replace: true });
        });
    }, []);
    return null;
}