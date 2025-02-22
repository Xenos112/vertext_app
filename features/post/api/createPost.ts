import ky from "ky";
import { type CreatePostApiResponse } from "@/app/api/post/create/route";
import { PostCreateValidator } from '../validators/post-validation'

export default async function createPost(content?: string, urls?: string[], communityId?: string) {
  const { data: requestData, success, error } = PostCreateValidator.safeParse({ content, urls, communityId })

  if (!success) throw new Error(error.errors[0].message)

  const res = await ky.post<CreatePostApiResponse>("/api/post/create", {
    method: "POST",
    json: requestData,
    throwHttpErrors: false,
  });

  const data = await res.json()

  if ("error" in data) throw new Error(data.error)
  if ("errors" in data) throw new Error(data.errors[0])

  return data
}
