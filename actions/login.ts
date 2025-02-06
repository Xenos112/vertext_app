"use server";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import generateToken from "@/utils/generate-token";
import { cookies } from "next/headers";

type Login = {
  email: string;
  password: string;
};
export default async function login({ password, email }: Login) {
  try {
    // search for the user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return { error: "User Not Found" };
    }
    if (!user.password) {
      return { error: "User Is Linked With A Social Platform" };
    }

    // chack if the password is right
    const isPasswordRight = bcrypt.compareSync(password, user.password!);

    if (!isPasswordRight) {
      return { error: "Wrong Password Provided" };
    }

    const token = generateToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token);

    return { message: "You Have Logged In" };
  } catch (error) {
    console.log(error);
    return { error: "server Issue" };
  }
}
