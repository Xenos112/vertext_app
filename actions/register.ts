"use server";
import generateToken from "@/utils/generate-token";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

type UserData = {
  userName: string;
  password: string;
  email: string;
};
export async function register(userData: UserData) {
  const exsitingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (exsitingUser) return { message: "found user with same email" };

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      email: userData.email,
      user_name: userData.userName,
      password: hashedPassword,
    },
  });
  const token = generateToken(user.id);
  (await cookies()).set("auth_token", token);
  return { message: "user created successfully", user };
}
