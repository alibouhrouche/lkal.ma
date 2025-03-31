import { db } from "@/db";
import React from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { FilePlus2Icon, PlusCircleIcon } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { navigate } from "wouter/use-browser-location";

export const newBoard = () => {
  db.newBoard().then((id) => {
    location.href = `/b/${id}`;
  });
};

export const NewBoard = () => {
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

export const newBoardRouter = () => {
  db.newBoard().then((id) => {
    navigate(`/b/${id}`);
  });
}

export const NewBoardLink = () => {
  return (
    <div onClick={newBoardRouter} className="w-full">
      <SidebarMenuButton className="cursor-pointer flex justify-end">
        <FilePlus2Icon size={24} />
        <span>New</span>
      </SidebarMenuButton>
    </div>
  );
};
