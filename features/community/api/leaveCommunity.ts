import { type LeaveCommunityApiResponse } from "@/app/api";
import ky from "ky";

export default async function leaveCommunity(communityId: string) {
  const res = await ky.delete<LeaveCommunityApiResponse>(`/api/communities/membership`, {
    json: { communityId },
    throwHttpErrors: false,
  });
  const data = await res.json();

  if ("error" in data) throw new Error(data.error);

  return data;
}
