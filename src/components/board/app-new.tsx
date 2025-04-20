import { AspectRatio } from "../ui/aspect-ratio";
import { FilePlus2Icon, PlusCircleIcon } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import useNewBoard from "@/hooks/useNewBoard.ts";

export const NewBoard = () => {
  const newBoard = useNewBoard();
  return (
    <div className="cursor-pointer rounded-xl" onClick={newBoard}>
      <AspectRatio
        ratio={16 / 9}
        className="p-1 hover:bg-primary/50 rounded-xl"
      >
        <div className="h-full w-full flex justify-center items-center bg-gray-200 dark:bg-[#101011] text-black dark:text-white rounded-lg overflow-hidden">
          <PlusCircleIcon className="size-12" />
        </div>
      </AspectRatio>
    </div>
  );
};

export const NewBoardLink = () => {
  const newBoard = useNewBoard();
  return (
    <div onClick={newBoard} className="w-full">
      <SidebarMenuButton className="cursor-pointer flex justify-end">
        <FilePlus2Icon size={24} />
        <span>New</span>
      </SidebarMenuButton>
    </div>
  );
};
