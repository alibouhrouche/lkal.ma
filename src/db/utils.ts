import { db } from "."
import { navigate } from "wouter/use-browser-location";

export const newBoard = async () => {
    const id = db.newBoard();
    navigate(`/b/${id}`);
}