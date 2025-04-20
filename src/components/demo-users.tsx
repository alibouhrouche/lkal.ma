import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import demo from "../../demoUsers.json";
import { CirclePlay, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { db } from "@/db";
import { useCallback, useState } from "react";
// import { useNavigate } from "react-router";
import { toast } from "sonner";
import {useRouter} from "next/router";

const { demoUsers } = demo;

export default function DemoUsers() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState("");
  const router = useRouter();
  // const navigate = useNavigate();
  const demoLogin = useCallback((email: string) => {
    setLoading(email);
    db.cloud
      .login({
        email,
      })
      .catch(() => {
        toast.error("Failed to login");
        setLoading("");
        setOpen(false);
      })
      .then(() => {
        setLoading("");
        setOpen(false);
        router.push("/boards");
      });
  }, [router]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="cursor-pointer rounded-full text-base shadow-none"
        >
          <CirclePlay className="!h-5 !w-5" /> Visit Demo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Choose a demo account to explore the features
          </DialogTitle>
          <DialogDescription>
            The demo account an be accessed by anyone. It is a great way to
            explore the features of the app without having to sign up.
            Alternatively, you can sign up for a free account to create your own
            boards and collaborate with your team, or continue without an
            account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(demoUsers).map((user) => (
            <Button
              key={user}
              variant="outline"
              size="lg"
              className="cursor-pointer rounded-full text-base"
              onClick={() => demoLogin(user)}
            >
              {loading === user && (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              )}
              <span>{user}</span>
            </Button>
          ))}
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer rounded-full text-base"
            onClick={() => {
              setOpen(false);
              router.push("/boards");
            }}
          >
            Continue without an account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
