import ky from "ky";
import { type GetPosts } from "@/app/api";

export default async function getUserPosts(userId: string) {
  const response = await ky.get<GetPosts>("/api/post", {
    throwHttpErrors: false,
    searchParams: { userId },
  });

  const data = await response.json();
  if ("error" in data) throw new Error(data.error);

  return data.posts;
}
