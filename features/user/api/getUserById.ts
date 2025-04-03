import ky from "ky";
import { type GetUserByIdResponse } from "@/app/api";

export default async function getUserById(id: string) {
  const response = await ky.get<GetUserByIdResponse>(`/api/users/${id}`);
  const data = await response.json();

  if ("error" in data) throw new Error(data.error);

  return data.user;
}
