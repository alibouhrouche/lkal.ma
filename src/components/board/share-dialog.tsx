import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Share2Icon } from "lucide-react";
import Observable, { useSubscribe } from "@/lib/observable";
import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

const observable = new Observable<unknown>();

const share = () => {
  observable.notify(null);
};

// function UserLine({ email, role }: { email: string; role: string }) {
//   return (
//     <div className="flex items-center justify-between">
//       <div className="text-sm">{email}</div>
//       <div className="text-sm">{role}</div>
//     </div>
//   );
// }

function RoleSelect() {
  return (
    <Select name="role" required>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function ShareDialog() {
  const [open, setOpen] = useState(false);
  useSubscribe(
    observable,
    useCallback(() => {
      setOpen(true);
    }, [])
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share board</DialogTitle>
          <DialogDescription>
            Share this board with others by inviting them to collaborate.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <form
            className="grid grid-cols-3 w-full items-center gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              for (const [key, value] of formData.entries()) {
                console.log(key, value);
              }
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
          <ScrollArea className="max-h-64 w-full rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                People with access
              </h4>
              <div className="flex items-center justify-between">
                <div className="text-sm">You</div>
                <div className="text-sm text-muted-foreground">Owner</div>
              </div>
              {/* {tags.map((tag) => (
                <>
                  <div key={tag} className="text-sm">
                    {tag}
                  </div>
                  <Separator className="my-2" />
                </>
              ))} */}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ShareDialogTrigger() {
  return (
    <Button size="icon" className="cursor-pointer" onClick={share}>
      <Share2Icon />
    </Button>
  );
}
