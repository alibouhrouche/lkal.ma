import { db } from "@/db";
import AppStatus from "@/components/board/app-status.tsx";
import { useBoard } from "./board-context.ts";
import { useBoardPermissions } from "@/hooks/usePermissions.ts";
import { Input } from "@/components/ui/input.tsx";

function FileName() {
  const board = useBoard().board;
  const can = useBoardPermissions(board);
  return (
    <Input
      type="text"
      className="w-full pointer-events-all pl-10 bg-[#f9fafb]/75 dark:bg-[#101011]/75"
      value={board.name ?? ""}
      onChange={(e) => {
        db.boards.update(board, { name: e.target.value });
      }}
      readOnly={!can?.update("name")}
    />
  );
}

export default function TopPanel() {
  return (
    <div className="relative hidden sm:flex items-center w-full p-1">
      <AppStatus className="absolute">
        <AppStatus.Icon />
      </AppStatus>
      <FileName />
    </div>
  );
}
