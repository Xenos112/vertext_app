import jwt from "jsonwebtoken";
import prisma from "./prisma";

export default async function validateUser(token: string | undefined) {
  if (!token) return;
  const { id } = jwt.decode(token) as { id: string };
  if (!id) return;

  const user = prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  });
  if (!user) return;
  return user;
}
