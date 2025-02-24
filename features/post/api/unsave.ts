import { UnSavePostAPIResponse } from "@/app/api";
import ky from "ky";

export default async function unsaveMutationFunction(postId: string) {
  const res = await ky<UnSavePostAPIResponse>("/api/post/unsave", {
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
