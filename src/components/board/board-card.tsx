/* eslint-disable @next/next/no-img-element */ // For data URLs SVGs
import { Link } from "react-router";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import { ask } from "../prompts";
import { Board, db } from "@/db";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BoardCard({
  board,
  currentBoardId,
  classname,
}: {
  board: Board;
  currentBoardId?: string;
  classname?: string;
}) {
  return (
    <div
      className={cn("cursor-pointer data-[active=true]:bg-primary hover:bg-primary/50 rounded-xl", classname)}
      data-active={board.id === currentBoardId}
    >
      <AspectRatio
        ratio={16 / 9}
        className="relative rounded-lg overflow-hidden m-1"
      >
        {board.thumbnail ? (
          <>
            <img
              className="object-fit h-full w-full p-2 bg-[#f9fafb] dark:hidden"
              src={`data:image/svg+xml,${encodeURIComponent(board.thumbnail[0])}`}
              alt={`Thumbnail for board "${board.name}"`}
            />
            <img
              className="object-fit h-full w-full p-2 bg-[#101011] hidden dark:block"
              src={`data:image/svg+xml,${encodeURIComponent(board.thumbnail[1])}`}
              alt={`Thumbnail for board "${board.name}"`}
            />
          </>
        ) : (
          <div className="absolute bg-[#f9fafb] dark:bg-[#101011] h-full w-full" />
        )}
        {currentBoardId !== board.id ? (
          <Link
            to={`/b/${board.id}`}
            className="absolute inset-0 bg-gradient-to-t from-white dark:from-black from-10% to-50%"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black from-10% to-50" />
        )}
        <div className="absolute bottom-0 w-full px-2">
          <div className="text-black dark:text-white flex gap-2 items-center justify-between bg-opacity-50 p-1 text-xs">
            {currentBoardId !== board.id ? (
              <Link to={`/b/${board.id}`} className="flex-1">
                {board.name}
              </Link>
            ) : (
              <div>{board.name} </div>
            )}
            <div className="space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className="size-6 cursor-pointer"
                onClick={() => {
                  ask({
                    type: "prompt",
                    title: "Rename Board",
                    message: `Enter a new name for the board "${board.name}"`,
                    label: "Name",
                    default: board.name,
                    placeholder: "Enter a name",
                    callback: (name) => {
                      if (name) {
                        db.boards.update(board.id, { name });
                      }
                    },
                  });
                }}
              >
                <PencilIcon />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-6 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  ask({
                    type: "confirm",
                    title: "Delete Board",
                    message: `Are you sure you want to delete the board "${board.name}"?`,
                    destructive: true,
                    callback: (result) => {
                      if (result) {
                        db.boards.delete(board.id);
                      }
                    },
                  });
                }}
              >
                <Trash2Icon />
              </Button>
            </div>
          </div>
        </div>
      </AspectRatio>
    </div>
  );
}
