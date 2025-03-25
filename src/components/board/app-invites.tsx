import { db } from "@/db";
import { Invite } from "dexie-cloud-addon";
import { useObservable } from "dexie-react-hooks";
import { useEffect } from "react";
import { toast } from "sonner";

const InviteToast = ({ invite }: { invite: Invite }) => {
  useEffect(() => {
    if (invite.realm === undefined) return;
    const toastId = toast.info(
      `You are invited to act as ${invite.roles?.join(", ")} in the board ${
        invite.realm?.name
      }.`,
      {
        duration: Infinity,
        action: {
          label: "Accept",
          onClick: () => {
            invite.accept();
          },
        },
        cancel: {
          label: "Decline",
          onClick: () => {
            invite.reject();
          },
        },
      }
    );
    return () => {
      toast.dismiss(toastId);
    };
  }, [invite]);
  return null;
};

export default function AppInvites() {
  const invites = useObservable(db.cloud.invites);
  return (
    <>
      {invites?.map((invite) => (
        <InviteToast key={invite.id} invite={invite} />
      ))}
    </>
  );
}
