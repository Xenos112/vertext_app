import ky from "ky";
import type { GetCommunities } from "@/app/api";

export default async function getUserCommunities(userId: string) {
  const response = await ky.get<GetCommunities>("/api/communities", {
    searchParams: { userId },
    throwHttpErrors: false,
  });

  const data = await response.json();
  if ("error" in data) throw new Error(data.error);
  return data.communties;
}
