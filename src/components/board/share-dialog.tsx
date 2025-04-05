import { Button } from "../ui/button";
import {
  CheckCircle2Icon,
  CircleAlertIcon,
  Share2Icon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useLiveQuery } from "dexie-react-hooks";
import { db, useUser } from "@/db";
import { ask } from "../prompts";
import {
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
  useDialogs,
} from "tldraw";
import { cn } from "@/lib/utils";
import { useApp } from "./context";

const selectClassName =
  "tl-cursor-pointer shrink-[2] w-full appearance-none rounded-md border-input h-9 border px-3 py-2 text-sm whitespace-nowrap shadow-xs bg-popover text-popover-foreground forced-colors:appearance-auto";

function RoleSelect() {
  return (
    <select
      name="role"
      className={selectClassName}
      defaultValue="viewer"
      required
    >
      <option value="editor">Editor</option>
      <option value="viewer">Viewer</option>
    </select>
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
    <select
      disabled={disabled}
      name="role"
      className={cn(selectClassName, "tl-cursor-pointer w-[120px]")}
      value={role}
      onChange={(e) => onChange(e.target.value)}
      required
    >
      <option value="editor">Editor</option>
      <option value="viewer">Viewer</option>
    </select>
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
    db.members.where("realmId").equals(realmId).toArray(),
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
  const id = useApp().id;
  const board = useLiveQuery(() => db.boards.get(id));
  const user = useUser();
  const isOwner = board?.owner === user?.userId;
  return (
    <>
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Share board</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody className="max-w-full w-[450px]">
        <div className="space-y-4 w-full">
          {isOwner && (
            <form
              className="flex sm:grid sm:grid-cols-3 w-full items-center gap-1.5"
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
                className="tl-cursor-text shrink col-span-2 bg-background text-foreground"
                required
                type="email"
                name="email"
                id="email"
                placeholder="Email"
              />
              <RoleSelect />
            </form>
          )}
          <ScrollArea className="max-h-64 w-full">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                People with access
              </h4>
              {board?.realmId && (
                <SharePanel
                  isOwner={board?.owner === user?.userId}
                  realmId={board.realmId}
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </TldrawUiDialogBody>
    </>
  );
}

export default function ShareDialogTrigger() {
  const { addDialog } = useDialogs();
  return (
    <Button
      size="icon"
      className="tl-cursor-pointer"
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
