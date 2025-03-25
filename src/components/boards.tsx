import {
  DeleteIcon,
  EllipsisVerticalIcon,
  PlusCircleIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import LoginButton from "./board/login-button";
import { useLiveQuery } from "dexie-react-hooks";
import { Board, db, ISpace } from "@/db";
import BoardCard from "./board/board-card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Link } from "react-router";
import { GridComponents, VirtuosoGrid } from "react-virtuoso";
import {
  Dispatch,
  forwardRef,
  HtmlHTMLAttributes,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { Scroller } from "./ui/scroll-area";
import { ModeToggle } from "./mode-toggle";
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
import { Logo } from "./logo";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

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

function NewBoard() {
  return (
    <Link to="/b/new" className="cursor-pointer rounded-xl">
      <AspectRatio
        ratio={16 / 9}
        className="p-1 hover:bg-primary/50 rounded-xl"
      >
        <div className="h-full w-full flex justify-center items-center bg-gray-200 dark:bg-[#101011] text-black dark:text-white rounded-lg overflow-hidden">
          <PlusCircleIcon className="size-12" />
        </div>
      </AspectRatio>
    </Link>
  );
}

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
                  const boards = (await db.spaces.get(selectedCollection!))?.boards ?? [];
                  const filter = boards.filter((id) => !selectedBoards.includes(id));
                  db.spaces.update(selectedCollection!, {
                    boards: [...filter, ...selectedBoards],
                  });
                });
                // db.spaces.update(selectedCollection!, {
                //   boards: selectedBoards,
                // });
                // const updated = selectedBoards.map((id) => ({
                //   key: id,
                //   changes: { spaceId: selectedCollection },
                // }));
                // db.boards.bulkUpdate(updated);
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
    const boardsIds = selectedCollections.flatMap((collection) =>
      collection.boards ?? []
    );
    const ret = boards.filter((board) => {
      return boardsIds.includes(board.id);
    });
    return [{} as Board, ...ret];
  }, [selectedCollections, boards]);
  return (
    <>
      <title>{`Boards - Lkal.ma`}</title>
      <div className="flex gap-2 px-6 py-1">
        <BoardsCollections
          selectedBoards={selectedBoards}
          setSelectedBoards={setSelectedBoards}
          selectedCollectionsIds={selectedCollectionsIds}
          setSelectedCollectionsIds={setSelectedCollectionsIds}
        />
      </div>
      <VirtuosoGrid
        style={{ height: "calc(100vh - 7rem)" }}
        totalCount={data.length}
        components={gridComponents}
        data={data}
        itemContent={(index, board) => (
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
        )}
      />
    </>
  );
}

export default function Boards() {
  return (
    <div>
      <div className="w-full h-16 bg-card flex items-center p-4 justify-between">
        <div className="flex gap-4 items-center">
          <Logo />
          <div className="text-2xl">Boards</div>
        </div>
        <div className="flex gap-4 items-center">
          <ModeToggle />
          <LoginButton />
        </div>
      </div>
      <BoardsGrid />
    </div>
  );
}
