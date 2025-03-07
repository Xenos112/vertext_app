import ky from "ky";
import { type JoinCommunityApiResponse } from '@/app/api'

export default async function joinCommunity(communityId: string) {
  const res = await ky.post<JoinCommunityApiResponse>("/api/communities/membership", {
    json: { communityId },
    throwHttpErrors: false
  })
  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data
}
