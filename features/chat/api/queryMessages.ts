import ky from "ky";
import type { GetCommunityMessagesResponse } from "@/app/api";

export default async function queryMessages(communityId: string) {
  const res = await ky.get<GetCommunityMessagesResponse>("/api/chat/get-community-messages", {
    searchParams: {
      communityId
    },
    throwHttpErrors: false
  });
  const data = await res.json()

  if ("error" in data) throw new Error(data.error);

  return data.messages
}
