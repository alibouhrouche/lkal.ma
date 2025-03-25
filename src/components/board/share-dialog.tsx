import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import {
  CheckCircle2Icon,
  ChevronDown,
  CircleAlertIcon,
  Share2Icon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useLiveQuery } from "dexie-react-hooks";
import { db, useUser } from "@/db";
import { useParams } from "react-router";
import { ask } from "../prompts";
import {
  TldrawUiDialogCloseButton,
  useDialogs,
} from "tldraw";
import { cn } from "@/lib/utils";

const selectClassName =
  "col-start-1 row-start-1 w-full appearance-none rounded-md border-input h-9 border px-3 py-2 text-sm whitespace-nowrap shadow-xs bg-popover text-popover-foreground forced-colors:appearance-auto"; // bg-gray-50 px-2 text-gray-700 hover:border-cyan-500 hover:bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-cyan-700 dark:hover:bg-gray-700 forced-colors:appearance-auto"
const selectArrowClassName =
  "pointer-events-none relative right-1 z-10 col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden";

function RoleSelect() {
  return (
    <div className="grid w-full">
      <ChevronDown className={selectArrowClassName} />
      <select
        name="role"
        className={selectClassName}
        defaultValue="viewer"
        required
      >
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  );
}

function RoleChange({
  role,
  onChange,
  disabled,
}: {
  role: string;
  onChange: (role: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid w-full">
      <ChevronDown className={selectArrowClassName} />
      <select
        disabled={disabled}
        name="role"
        className={cn(selectClassName, "mr-4")}
        value={role}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  );
}

export function InviteIndicator({
  accepted,
  rejected,
}: {
  accepted?: Date;
  rejected?: Date;
}) {
  if (accepted) {
    return (
      <CheckCircle2Icon size={16} className="text-success">
        <title>Accepted</title>
      </CheckCircle2Icon>
    );
  }
  if (rejected) {
    return (
      <XCircleIcon size={16} className="text-destructive">
        <title>Rejected</title>
      </XCircleIcon>
    );
  }
  return (
    <CircleAlertIcon size={16} className="text-muted-foreground">
      <title>Pending</title>
    </CircleAlertIcon>
  );
}

export function SharePanel({
  realmId,
  isOwner,
}: {
  realmId: string;
  isOwner?: boolean;
}) {
  const members = useLiveQuery(() =>
    db.members.where("realmId").equals(realmId).toArray()
  );
  return (
    <div className="flex flex-col items-center space-y-2 mt-2">
      {members?.map((member) => {
        return (
          <div
            key={member.id}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2 text-sm">
              <span>{member.email ?? member.userId}</span>
              {member.roles?.[0] && (
                <InviteIndicator
                  accepted={member.accepted}
                  rejected={member.rejected}
                />
              )}
            </div>
            {isOwner ? (
              <div className="flex items-center space-x-2">
                {member.roles?.[0] && (
                  <>
                    <RoleChange
                      role={member.roles?.[0]}
                      onChange={(role) =>
                        ask({
                          type: "confirm",
                          title: "Change role",
                          message: `Do you want to change ${member.email}'s role to ${role}?`,
                          ok: "Change",
                          callback: async (result) => {
                            if (!result) return;
                            await db.updateBoard(member, role);
                            db.cloud.sync();
                          },
                        })
                      }
                    />
                    <button
                      className="cursor-pointer text-destructive"
                      onClick={() => {
                        ask({
                          type: "confirm",
                          destructive: true,
                          title: "Remove",
                          message: `Do you want to remove ${member.email}?`,
                          ok: "Remove",
                          callback: async (result) => {
                            if (!result) return;
                            await db.deleteMember(member);
                          },
                        });
                      }}
                    >
                      <XIcon />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 capitalize text-muted-foreground text-sm">
                {member.roles?.[0] && member.roles[0]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ShareDialog() {
  const id = useParams().id!;
  const board = useLiveQuery(() => db.boards.get(id));
  const user = useUser();
  const isOwner = board?.owner === user?.userId;
  return (
    <div className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[500] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Share board</DialogTitle>
        <DialogDescription>
          Share this board with others by inviting them to collaborate.
        </DialogDescription>
        <div className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <TldrawUiDialogCloseButton />
        </div>
      </DialogHeader>
      <div className="space-y-4">
        {isOwner && (
          <form
            className="grid grid-cols-3 w-full items-center gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!board) return;
              const formData = new FormData(e.target as HTMLFormElement);
              const email = formData.get("email") as string;
              const role = formData.get("role") as string;
              (e.target as HTMLFormElement).reset();
              if (!email || !role) return;
              if (!["editor", "viewer"].includes(role)) return;
              ask({
                type: "confirm",
                title: "Invite",
                message: `Do you want to invite ${email} as a ${role}?`,
                ok: "Invite",
                callback: async () => {
                  await db.addMember(board, email, role);
                },
              });
            }}
          >
            <Input
              className="col-span-2"
              required
              type="email"
              name="email"
              id="email"
              placeholder="Email"
            />
            <RoleSelect />
          </form>
        )}
        <ScrollArea className="max-h-64 w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              People with access
            </h4>
            {board?.realmId && (
              <SharePanel isOwner={true} realmId={board.realmId} />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default function ShareDialogTrigger() {
  const { addDialog } = useDialogs();
  return (
    <Button
      size="icon"
      className="cursor-pointer"
      onClick={() => {
        addDialog({
          component: ShareDialog,
        });
      }}
    >
      <Share2Icon />
    </Button>
  );
}
