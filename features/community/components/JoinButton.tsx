import { Button, ButtonProps } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import queryMembership from "../api/queryMembership";
import { FiLoader } from "react-icons/fi";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import LeaveCommunityWarningModal from "./LeaveCommunityWarningModal";

type JoinButtonProps = {
  communityId: string;
} & ButtonProps;

// HACK: make this in a hook to handle everything
export default function JoinButton({ communityId, ...props }: JoinButtonProps) {
  const { data: membership, isPending: isQueringMembership } = useQuery({
    queryKey: ["communityMembership", communityId],
    queryFn: () => queryMembership(communityId),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props} disabled={isQueringMembership}>
          {isQueringMembership && <FiLoader />}
          {membership ? "Leave" : "Join"}
        </Button>
      </DialogTrigger>
      <LeaveCommunityWarningModal communityId={communityId} />
    </Dialog>
  );
}
