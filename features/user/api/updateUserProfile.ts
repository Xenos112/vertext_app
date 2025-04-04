import ky from "ky";
import {
  type UserProfileUpdateSchemaValidatorType,
  UserProfileUpdateSchemaValidator,
} from "../validators";
import { type UpdateUserByIdResponse } from "@/app/api";

export default async function updateUserProfile(
  newUserData: UserProfileUpdateSchemaValidatorType,
) {
  const {
    success,
    data: newUserUpdateData,
    error,
  } = UserProfileUpdateSchemaValidator.safeParse(newUserData);
  if (!success) {
    console.log(error);
    throw new Error("Invalid data provided");
  }

  const res = await ky.post<UpdateUserByIdResponse>("/api/me", {
    json: newUserUpdateData,
    throwHttpErrors: false,
  });

  const data = await res.json();
  if ("error" in data) throw new Error(data.error);

  return data.updatedUser;
}
