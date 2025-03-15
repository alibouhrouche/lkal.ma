import { LayoutTemplateIcon, PlusCircleIcon } from "lucide-react";
import LoginButton from "./board/login-button";
import { useLiveQuery } from "dexie-react-hooks";
import { Board, db } from "@/db";
import BoardCard from "./board/board-card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Link } from "wouter";
import { GridComponents, VirtuosoGrid } from "react-virtuoso";
import { forwardRef, HtmlHTMLAttributes } from "react";
import { Scroller } from "./ui/scroll-area";
import { ModeToggle } from "./mode-toggle";

const gridComponents: GridComponents = {
  List: forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLDivElement>>(
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
  ),
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
    <Link href="/b/new" className="cursor-pointer rounded-xl">
      <AspectRatio ratio={16 / 9} className="p-1 hover:bg-primary/50 rounded-xl">
        <div className="h-full w-full flex justify-center items-center bg-gray-200 dark:bg-[#101011] text-black dark:text-white rounded-lg overflow-hidden">
          <PlusCircleIcon className="size-12" />
        </div>
      </AspectRatio>
    </Link>
  );
}

function BoardsGrid() {
  const boards = useLiveQuery(() =>
    db.boards.orderBy("order").reverse().toArray()
  );
  const data = boards ? [{} as Board, ...boards] : [];
  const length = boards ? boards.length + 1 : 0;
  return (
    <VirtuosoGrid
      style={{ height: "calc(100vh - 4rem)" }}
      totalCount={length}
      components={gridComponents}
      data={data}
      itemContent={(index, board) => (
        <ItemWrapper>
          {index === 0 ? (
            <NewBoard />
          ) : (
            <BoardCard key={board.id} board={board} />
          )}
        </ItemWrapper>
      )}
    />
  );
}

export default function Boards() {
  return (
    <div>
      <div className="w-full h-16 bg-card flex items-center p-4 justify-between">
        <div className="flex gap-4 items-center">
          <LayoutTemplateIcon size={24} />
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
