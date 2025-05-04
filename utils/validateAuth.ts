import UserRepository from "@/db/repositories/user.repository";
import tryCatch from "@/utils/tryCatch";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// TODO: extand time to 30 days
export default async function validateAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) throw new Error("You Are not logged in");
  const { id } = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  const { data: user, error } = await tryCatch(UserRepository.getUserById(id));

  if (error || !user) {
    cookieStore.delete("auth_token");
    throw new Error("Invalid Auth token");
  }

  return user;
}
