import { Button, ButtonProps } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FiLoader } from "react-icons/fi";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import LeaveCommunityWarningModal from "./LeaveCommunityWarningModal";
import queryFetcherFunction from "@/utils/queryFetcherFunction";
import { GetMembershipApiResponse } from "@/app/api";

type JoinButtonProps = {
  communityId: string;
} & ButtonProps;

// HACK: make this in a hook to handle everything
export default function JoinButton({ communityId, ...props }: JoinButtonProps) {
  const { data: membership, isPending: isQueringMembership } = useQuery({
    queryKey: ["communityMembership", communityId],
    queryFn: () =>
      queryFetcherFunction<GetMembershipApiResponse>(
        "/api/communities/membership",
        { searchParams: { communityId } },
      ).then((data) => data.membership),
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
