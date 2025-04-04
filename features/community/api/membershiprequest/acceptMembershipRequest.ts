import ky from "ky";
import { type AcceptMembershipRequest } from "@/app/api";

export default async function acceptMembershipRequest(
  communityId: string,
  userId: string,
) {
  const response = await ky.post<AcceptMembershipRequest>(
    "/api/communities/membership/requests",
    {
      searchParams: {
        communityId,
        userId,
      },
      throwHttpErrors: false,
    },
  );

  const data = await response.json();
  if ("error" in data) throw new Error(data.error);
  return data.newMembership;
}
