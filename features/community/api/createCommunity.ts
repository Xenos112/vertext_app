import ky from "ky";
import { type CreateCommunityData } from "../types";
import { type NewCommunityApiResponse } from "@/app/api";
import { newCommunityValidator } from '../validators'
import formatZodErrors from "@/utils/format-zod-errors";

export default async function createCommunityMutation(data: Omit<CreateCommunityData, 'creatorId'>) {
  const { success, data: communityData, error } = newCommunityValidator.safeParse(data);
  if (!success) {
    const errors = formatZodErrors(error)
    throw new Error(errors[0]);
  }

  const res = await ky.post<NewCommunityApiResponse>("/api/communities", {
    json: communityData,
    throwHttpErrors: false,
  });

  const responseData = await res.json()

  if ("error" in responseData) throw new Error(responseData.error)

  return responseData.community
}
