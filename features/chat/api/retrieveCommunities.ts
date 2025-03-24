import ky from "ky";
import { type RetrieveChatCommunitiesResponse } from "@/app/api";
import { redirect } from "next/navigation";

export default async function retrieveCommunitiesQuery() {
  const res = await ky.get<RetrieveChatCommunitiesResponse>("/api/chat/get-chat-communities",
    { throwHttpErrors: false }
  );
  const data = await res.json()

  if (res.status === 401) redirect("/login")
  if ("error" in data) throw new Error(data.error)
  return data
}
