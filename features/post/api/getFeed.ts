import ky from "ky";
import { FeedApiResponse } from "@/app/api";
type FeedType = "feed" | "communities"

// TODO: add pagination
// TODO: make use of the type
export default async function getFeed(type: FeedType) {
  const res = await ky.get<FeedApiResponse>(`/api/feed`)

  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data.posts
}
