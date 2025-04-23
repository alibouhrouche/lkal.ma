import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import { ask } from "../prompts";
import { Board, db } from "@/db";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useObservable } from "dexie-react-hooks";
import React from "react";
import Link from "next/link";

const BoardCard = React.memo(function BoardCard({
  board,
  currentBoardId,
  classname,
}: {
  board: Board;
  currentBoardId?: string;
  classname?: string;
}) {
  const can = useObservable(
    () => db.cloud.permissions(board, "boards"),
    [board]
  );
  const canEditBoardName = can?.update("name");
  const canDeleteBoard = can?.delete();
  return (
    <div
      className={cn(
        "cursor-pointer data-[active=true]:bg-primary hover:bg-primary/50 rounded-xl",
        classname
      )}
      data-active={board.id === currentBoardId}
    >
      <AspectRatio
        ratio={16 / 9}
        className="relative rounded-lg overflow-hidden m-1"
      >
        {board.thumbnail &&
        board.thumbnail[0].startsWith("data:") &&
        board.thumbnail[1].startsWith("data:") ? (
          <>
            <img
              className="object-fit h-full w-full p-2 bg-[#f9fafb] dark:hidden"
              src={board.thumbnail[0]}
              alt={`Thumbnail for board "${board.name}"`}
            />
            <img
              className="object-fit h-full w-full p-2 bg-[#101011] hidden dark:block"
              src={board.thumbnail[1]}
              alt={`Thumbnail for board "${board.name}"`}
            />
          </>
        ) : (
          <div className="absolute bg-[#f9fafb] dark:bg-[#101011] h-full w-full" />
        )}
        {currentBoardId !== board.id ? (
          <Link
            href={`/b/${board.id}`}
            className="absolute inset-0 bg-gradient-to-t from-white dark:from-black from-10% to-50%"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black from-10% to-50" />
        )}
        <div className="absolute bottom-0 w-full px-2">
          <div className="text-black dark:text-white flex gap-2 items-center justify-between bg-opacity-50 p-1 text-xs">
            {currentBoardId !== board.id ? (
              <Link href={`/b/${board.id}`} className="flex-1">
                {board.name}
              </Link>
            ) : (
              <div>{board.name} </div>
            )}
            <div className="space-x-2">
              {canEditBoardName && (
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
                          db.transaction(
                            "rw",
                            db.realms,
                            db.boards,
                            async () => {
                              db.boards.update(board.id, { name });
                              db.realms.update(board.realmId!, { name });
                            }
                          );
                        }
                      },
                    });
                  }}
                >
                  <PencilIcon />
                </Button>
              )}
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
                        const user = db.cloud.currentUser?.value;
                        if (!canDeleteBoard) {
                          if (!user.email || !board.realmId) return;
                          db.members
                            .where("[email+realmId]")
                            .equals([user.email, board.realmId])
                            .delete();
                          return;
                        }
                        db.transaction("rw", db.realms, db.boards, async () => {
                          return db.transaction(
                            "rw",
                            db.boards,
                            db.realms,
                            async () => {
                              db.boards.delete(board.id);
                              db.realms.delete(board.realmId!);
                            }
                          );
                        });
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
});

export default BoardCard;
