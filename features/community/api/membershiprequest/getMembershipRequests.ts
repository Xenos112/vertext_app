import ky from "ky";
import { type GetMembershipRequests } from "@/app/api";

export default async function getMembershipRequests(communityId: string) {
  const response = await ky.get<GetMembershipRequests>(
    "/api/communities/membership/requests",
    {
      searchParams: {
        communityId,
      },
      throwHttpErrors: false,
    },
  );

  const data = await response.json();
  if ("error" in data) throw new Error(data.error);
  return data.membershipRequests;
}
