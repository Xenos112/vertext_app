import ky from "ky";
import { type RefuseMembershipRequest } from "@/app/api";

export default async function refuseMembershipRequest(
  communityId: string,
  userId: string,
) {
  const response = await ky.delete<RefuseMembershipRequest>(
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
  return data.refusedMemberShip;
}
