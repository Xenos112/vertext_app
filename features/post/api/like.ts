import { LikePostAPIResponse } from "@/app/api";
import ky from "ky";

export default async function likeMutationFunction(postId: string) {
  const res = await ky<LikePostAPIResponse>("/api/post/like", {
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
