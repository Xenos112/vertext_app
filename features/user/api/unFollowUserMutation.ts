import { DeleteRelationResponse } from "@/app/api";
import ky from "ky";

export default async function unfollowUserMutation(userId: string) {
  const res = await ky.delete<DeleteRelationResponse>(`/api/users/relation`, {
    throwHttpErrors: false,
    json: {
      followedId: userId
    }
  })
  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data
}
