import ky from "ky";
import { type GetPostCommentsApiResponse } from "@/app/api/post/comment/route";

export default async function getCommentsQueryFunction(postId: string) {

  // TODO: change this to use the GET handler even in the api route
  const res = await ky.post<GetPostCommentsApiResponse>(`/api/post/comment`, {
    json: {
      postId: postId
    },
    throwHttpErrors: false
  })

  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data.comments
}
