import ky from "ky";
import { type CreatePostCommentApiResponse } from "@/app/api";

type CreateCommentProps = {
  content: string,
  postId: string
}

export default async function createCommentFunction({ content, postId }: CreateCommentProps) {
  const res = await ky.post<CreatePostCommentApiResponse>("/api/post/comment/create", {
    json: {
      content: content,
      postId
    },
    throwHttpErrors: false
  })

  const data = await res.json()

  if ("error" in data) throw new Error(data.error as string)
  if ("errors" in data) throw new Error((data.errors as string[])[0])

  return data
}
