import ky from "ky";
import { type GetMembershipApiResponse } from '@/app/api'

export default async function queryMembership(communityId: string) {
  const res = await ky.get<GetMembershipApiResponse>("/api/communities/membership", {
    searchParams: { communityId },
    throwHttpErrors: false
  })
  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data.membership
}
