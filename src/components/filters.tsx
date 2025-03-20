"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { db, ISpace } from "@/db";
import { Badge } from "./ui/badge";
import {
  CheckIcon,
  PlusCircleIcon,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import { ask } from "./prompts";

function SelectedCollections({ selected }: { selected: ISpace[] }) {
  const toDisplay = selected.length > 2 ? selected.slice(0, 2) : selected;
  return (
    <div className="flex flex-wrap gap-2">
      {toDisplay.map((status) => (
        <Badge key={status.id} className="px-2 py-1">
          {status.title}
        </Badge>
      ))}
      {selected.length > 2 && (
        <Badge className="px-2 py-1">+{selected.length - 2}</Badge>
      )}
    </div>
  );
}

export function Filters({
  collections,
  selected = [],
  setSelected,
}: {
  collections?: ISpace[];
  selected?: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const filteredSelected = collections
    ? selected
        .map((s) => collections.find((c) => c?.id === s))
        .filter((s) => !!s)
    : [];

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[300px] justify-start">
            {selected.length > 0 ? (
              <SelectedCollections selected={filteredSelected} />
            ) : (
              <>All Collections</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <CollectionList
            collections={collections}
            setOpen={setOpen}
            selected={selected}
            setSelected={setSelected}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selected.length > 0 ? (
            <SelectedCollections selected={filteredSelected} />
          ) : (
            <>All Collections</>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <CollectionList
            collections={collections}
            setOpen={setOpen}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CollectionList({
  collections,
  setOpen,
  selected,
  setSelected,
}: {
  collections?: ISpace[];
  setOpen: (open: boolean) => void;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter collections..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {collections?.map((collection) => (
            <CommandItem
              key={collection.id}
              value={collection.id}
              onSelect={(value) => {
                setSelected((selected) => {
                  const array = [...selected];
                  const index = array.indexOf(value);
                  if (index === -1) {
                    array.push(value);
                  } else {
                    array.splice(index, 1);
                  }
                  return array;
                });
              }}
            >
              {selected.includes(collection.id) && <CheckIcon />}
              {collection.title}
              <button
                className="group ml-auto hover:bg-secondary rounded-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Settings clicked");
                }}
              >
                <Settings2Icon className="text-foreground/80 group-hover:text-foreground" />
              </button>
              <button
                className="group ml-2 hover:bg-secondary rounded-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  ask({
                    type: "confirm",
                    title: "Delete Collection",
                    message: `Are you sure you want to delete the collection "${collection.title}"?`,
                    destructive: true,
                    callback: (confirmed) => {
                      if (confirmed) {
                        db.spaces.delete(collection.id);
                      }
                    },
                  });
                }}
              >
                <Trash2Icon className="text-red-800 group-hover:text-red-600" />
              </button>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup>
          <CommandItem
            className="cursor-pointer"
            onSelect={() => {
              setOpen(false);
              ask({
                type: "prompt",
                title: "New Collection",
                message: "What would you like to name your new collection?",
                label: "Collection Name",
                placeholder: "Collection Name",
                callback: (value) => {
                  if (!value) return;
                  db.newSpace(value);
                },
              });
            }}
          >
            <PlusCircleIcon size={16} className="mr-2" />
            New Collection
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
