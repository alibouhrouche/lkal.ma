import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Share2Icon } from "lucide-react";

export default function ShareDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="cursor-pointer">
          <Share2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share board</DialogTitle>
          <DialogDescription>
            Share this board with others by inviting them to collaborate.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
