import { prisma } from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import type { UserUpdateData } from "../services/validators/user.validator";

async function getUserById(id: string, omitPassword: boolean = true) {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: omitPassword },
  });

  return user;
}

async function getUserByEmail(email: string, omitPassword: boolean = true) {
  const user = await prisma.user.findUnique({
    where: { email },
    omit: { password: omitPassword },
  });

  return user;
}
async function createUser(user: Prisma.UserCreateInput) {
  const newUser = await prisma.user.create({
    data: user,
    omit: { password: true },
  });

  return newUser;
}

async function getUserByTag(tag: string) {
  const user = await prisma.user.findUnique({
    where: { tag },
  });

  return user;
}

async function updateUser(id: string, user: UserUpdateData) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: user,
    omit: { password: true },
  });

  return updatedUser;
}

async function deleteUser(id: string) {
  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  return deletedUser;
}

const UserRepository = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getUserByTag,
};

export default UserRepository;
