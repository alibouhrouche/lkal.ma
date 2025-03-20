import { db } from "@/db";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

export default function NewBoard() {
    const navigate = useNavigate();
    const ref = useRef(false);
    useEffect(() => {
        if (ref.current) return;
        ref.current = true;
        db.newBoard().then((id) => {
            navigate(`/b/${id}`, { replace: true });
        });
    }, [navigate]);
    return null;
}