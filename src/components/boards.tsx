import {
  DeleteIcon,
  EllipsisVerticalIcon,
  PlusCircleIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { Board, db, ISpace } from "@/db";
import BoardCard from "./board/board-card";
import { AspectRatio } from "./ui/aspect-ratio";
import { GridComponents, VirtuosoGrid } from "react-virtuoso";
import React, {
  Dispatch,
  forwardRef,
  HtmlHTMLAttributes,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { Scroller } from "./ui/scroll-area";
import { Filters } from "./filters";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { ask } from "./prompts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NuqsAdapter } from "nuqs/adapters/react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { Spinner } from "./loading";
import { NewBoard } from "./board/app-new";

const List = forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLDivElement>>(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: "flex",
        flexWrap: "wrap",
        padding: "0.5rem",
        ...style,
      }}
    >
      {children}
    </div>
  )
);

List.displayName = "List";

const gridComponents: GridComponents = {
  List,
  Item: ({ children, ...props }: HtmlHTMLAttributes<HTMLDivElement>) => (
    <div
      {...props}
      className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 2xl:w-1/5"
      style={{
        padding: "0.5rem",
        display: "flex",
        flex: "none",
        alignContent: "stretch",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  ),
  Scroller,
};

const ItemWrapper = ({
  children,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => (
  <AspectRatio ratio={16 / 9} {...props}>
    {children}
  </AspectRatio>
);


function AddBoardToCollection({
  collections,
  selectedBoards,
  setSelectedBoards,
  children,
}: {
  collections?: ISpace[];
  selectedBoards: string[];
  setSelectedBoards: Dispatch<SetStateAction<string[]>>;
  children: React.ReactNode[];
}) {
  const [selectedCollection, setSelectedCollection] = useState<
    string | undefined
  >(undefined);

  if (selectedBoards.length === 0) {
    return null;
  }

  return (
    <Dialog onOpenChange={(open) => !open && setSelectedCollection(undefined)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <EllipsisVerticalIcon className="size-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <PlusCircleIcon className="size-4" />
              Add to Collection
            </DropdownMenuItem>
          </DialogTrigger>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add {selectedBoards.length} boards to a collection
          </DialogTitle>
          <DialogDescription>
            Select a collection to add the selected boards to.
          </DialogDescription>
        </DialogHeader>
        <Select
          value={selectedCollection}
          onValueChange={setSelectedCollection}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Collection" />
          </SelectTrigger>
          <SelectContent>
            {collections?.map((collection) => (
              <SelectItem key={collection.id} value={collection.id}>
                {collection.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={!selectedCollection}
              onClick={() => {
                db.transaction("rw", db.spaces, db.boards, async () => {
                  const boards =
                    (await db.spaces.get(selectedCollection!))?.boards ?? [];
                  const filter = boards.filter(
                    (id) => !selectedBoards.includes(id)
                  );
                  db.spaces.update(selectedCollection!, {
                    boards: [...filter, ...selectedBoards],
                  });
                });
                setSelectedBoards([]);
              }}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BoardsCollections({
  selectedBoards,
  setSelectedBoards,
  selectedCollectionsIds,
  setSelectedCollectionsIds,
}: {
  selectedBoards: string[];
  setSelectedBoards: Dispatch<SetStateAction<string[]>>;
  selectedCollectionsIds: string[];
  setSelectedCollectionsIds: Dispatch<SetStateAction<string[]>>;
}) {
  const collections = useLiveQuery(() => db.spaces.toArray(), []);
  return (
    <>
      <Filters
        collections={collections}
        selected={selectedCollectionsIds}
        setSelected={setSelectedCollectionsIds}
      />
      <AddBoardToCollection
        collections={collections}
        selectedBoards={selectedBoards}
        setSelectedBoards={setSelectedBoards}
      >
        <DropdownMenuItem
          onClick={() => {
            ask({
              type: "confirm",
              title: "Remove Boards from Collection",
              message: `Are you sure you want to remove ${selectedBoards.length} boards from their collections?`,
              destructive: true,
              callback: (confirmed) => {
                if (confirmed) {
                  db.spaces.bulkUpdate(
                    collections
                      ?.filter((collection) =>
                        selectedCollectionsIds.includes(collection.id)
                      )
                      .map((collection) => {
                        return {
                          key: collection.id,
                          changes: {
                            boards: collection.boards?.filter(
                              (id) => !selectedBoards.includes(id)
                            ),
                          },
                        };
                      }) ?? []
                  );
                  setSelectedBoards([]);
                }
              },
            });
          }}
        >
          <DeleteIcon className="size-4" />
          Remove from Collection
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedBoards([]);
          }}
        >
          <XIcon className="size-4" />
          Clear Selection
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            ask({
              type: "confirm",
              title: "Delete Boards",
              message: `Are you sure you want to delete ${selectedBoards.length} boards?`,
              destructive: true,
              callback: (confirmed) => {
                if (confirmed) {
                  db.boards.bulkDelete(selectedBoards);
                  setSelectedBoards([]);
                }
              },
            });
          }}
        >
          <Trash2Icon className="size-4" />
          Delete
        </DropdownMenuItem>
      </AddBoardToCollection>
    </>
  );
}

const GridItem = React.memo(function GridItem({
  index,
  board,
  selectedBoards,
  setSelectedBoards,
}: {
  index: number;
  board: Board;
  selectedBoards: string[];
  setSelectedBoards: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <ItemWrapper>
      {index === 0 ? (
        <NewBoard />
      ) : (
        <div className="relative">
          <Checkbox
            className="peer absolute top-0 left-0 m-2 z-10"
            checked={selectedBoards.includes(board.id)}
            onCheckedChange={(checked) => {
              setSelectedBoards((prev) =>
                checked
                  ? [...prev, board.id]
                  : prev.filter((id) => id !== board.id)
              );
            }}
          />
          <BoardCard
            classname="peer-data-[state=checked]:bg-primary"
            key={board.id}
            board={board}
          />
        </div>
      )}
    </ItemWrapper>
  );
});

const VirtualGrid = React.memo(function VirtualGrid({
  data,
  selectedBoards,
  setSelectedBoards,
}: {
  data: Board[];
  selectedBoards: string[];
  setSelectedBoards: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <VirtuosoGrid
      style={{ height: "calc(100vh - 7rem)" }}
      totalCount={data.length}
      components={gridComponents}
      data={data}
      itemContent={(index, board) => (
        <GridItem
          index={index}
          board={board}
          selectedBoards={selectedBoards}
          setSelectedBoards={setSelectedBoards}
        />
      )}
    />
  );
});

function BoardsGrid() {
  const [selectedCollectionsIds, setSelectedCollectionsIds] = useQueryState(
    "c",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const boards = useLiveQuery(
    () => db.boards.orderBy("created_at").reverse().toArray(),
    []
  );
  const selectedCollections = useLiveQuery(
    () => db.spaces.where("id").anyOf(selectedCollectionsIds).toArray(),
    [selectedCollectionsIds]
  );
  const data = useMemo(() => {
    if (!boards) {
      return [];
    }
    if (!selectedCollections || selectedCollections.length === 0) {
      return [{} as Board, ...boards];
    }
    const boardsIds = selectedCollections.flatMap(
      (collection) => collection.boards ?? []
    );
    const ret = boards.filter((board) => {
      return boardsIds.includes(board.id);
    });
    return [{} as Board, ...ret];
  }, [selectedCollections, boards]);
  return (
    <>
      <div className="flex gap-2 px-6 py-1">
        <BoardsCollections
          selectedBoards={selectedBoards}
          setSelectedBoards={setSelectedBoards}
          selectedCollectionsIds={selectedCollectionsIds}
          setSelectedCollectionsIds={setSelectedCollectionsIds}
        />
      </div>
      {boards ? (
        <VirtualGrid
          data={data}
          selectedBoards={selectedBoards}
          setSelectedBoards={setSelectedBoards}
        />
      ) : (
        <div
          className="w-full flex flex-col items-center justify-center"
          style={{ height: "calc(100vh - 14rem)", marginBottom: "7rem" }}
        >
          <Spinner />
        </div>
      )}
    </>
  );
}

export default function Boards() {
  return (
    <NuqsAdapter>
      <BoardsGrid />
    </NuqsAdapter>
  );
}
