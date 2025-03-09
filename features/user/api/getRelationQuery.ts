import { GetRelationResponse } from "@/app/api";
import ky from "ky";

export default async function getRelationQuery(userId: string) {
  const res = await ky.get<GetRelationResponse>(`/api/users/relation?followedId=${userId}`, {
    throwHttpErrors: false
  })
  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data.relation
}
