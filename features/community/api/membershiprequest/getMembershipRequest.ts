import ky from "ky";
import { type GetMembershipRequest } from "@/app/api";

export default async function getMembershipRequest(
  communityId: string,
  userId: string,
) {
  const response = await ky.get<GetMembershipRequest>(
    "/api/communities/membership/request",
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
  return data.membershipRequest;
}
