import { SavePostAPIResponse } from "@/app/api";
import ky from "ky";

export default async function saveMutationFunction(postId: string) {
  const res = await ky<SavePostAPIResponse>("/api/post/save", {
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
