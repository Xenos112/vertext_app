import { type DislikePostAPIResponse } from "@/app/api";
import ky from "ky";

export default async function dislikeMutationFunction(postId: string) {
  const res = await ky<DislikePostAPIResponse>("/api/post/dislike", {
    method: "post",
    json: {
      postId,
    },
    throwHttpErrors: false,
  });

  const data = await res.json()
  if ('error' in data) {
    throw new Error(data.error)
  }

  return data.message
}
