import {
  DialogPortal,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import joinCommunity from "../api/joinComunity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import leaveCommunity from "../api/leaveCommunity";
import { FiLoader } from "react-icons/fi";
import { useRef } from "react";
import { type Membership } from "@prisma/client";
import { Button } from "@/components/ui/button";

// TODO: no need to use queryClient here
export default function LeaveCommunityWarningModal({
  communityId,
}: {
  communityId: string;
}) {
  const query = useQueryClient();
  const membership = query.getQueryData([
    "communityMembership",
    communityId,
  ]) as Membership;
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate: joinCommunityMutation, isPending: isJoining } = useMutation({
    mutationKey: ["joinCommunity", communityId],
    mutationFn: () => joinCommunity(communityId),
    onError(error) {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Error",
            description: error.message,
            variant: "destructive",
          },
        }),
      );
    },
    onSuccess() {
      query.invalidateQueries({
        queryKey: ["communityMembership", communityId],
      });
      closeButtonRef.current?.click();
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Success",
            description: "You have joined the community",
          },
        }),
      );
    },
  });

  const { mutate: leaveCommunityMutation, isPending: isLeaving } = useMutation({
    mutationKey: ["leaveCommunity", communityId],
    mutationFn: () => leaveCommunity(communityId),
    onError(error) {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Error",
            description: error.message,
            variant: "destructive",
          },
        }),
      );
    },
    onSuccess() {
      query.invalidateQueries({
        queryKey: ["communityMembership", communityId],
      });

      closeButtonRef.current?.click();
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Success",
            description: "You have Left the community",
          },
        }),
      );
    },
  });

  return (
    <DialogPortal>
      <DialogContent>
        <DialogTitle>{membership ? "Leave" : "Join"} Community</DialogTitle>
        <DialogDescription>
          Are you sure you want to {membership ? "leave" : "join"} the
          community?
        </DialogDescription>
        {membership?.role === "ADMIN" && (
          <div className="text-sm text-muted-foreground">
            • we will remove your community as there is no admin for it
            <br />
            • you will no longer be able to edit the community
            <br />
            • you will no longer be able to add members
            <br />• you will no longer be able to remove members
          </div>
        )}
        <DialogFooter className="flex gap-2">
          <DialogClose ref={closeButtonRef}>Cancel</DialogClose>
          <Button
            onClick={() =>
              membership ? leaveCommunityMutation() : joinCommunityMutation()
            }
            className={`${membership ? "bg-red-700 text-white" : ""}`}
            disabled={isLeaving || isJoining}
          >
            {isLeaving && <FiLoader />}
            {isJoining && <FiLoader />}
            {membership ? "Leave" : "Join"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  );
}
