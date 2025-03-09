import { PostRelationResponse } from "@/app/api";
import ky from "ky";

export default async function followUserMutation(userId: string) {
  const res = await ky.post<PostRelationResponse>(`/api/users/relation`, {
    throwHttpErrors: false,
    json: {
      followedId: userId
    }
  })
  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data
}
