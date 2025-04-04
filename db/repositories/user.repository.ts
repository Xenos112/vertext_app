import { prisma } from "@/utils/prisma";
import { Prisma } from "@prisma/client";

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

async function updateUser(id: string, user: Prisma.UserUpdateInput) {
  delete user.created_at;
  delete user.Comment;
  delete user.MembershipRequest;
  delete user.premium;
  delete user.password;
  delete user.SubscriptionEndDate;
  delete user.Save;
  delete user.NotificationRecieved;
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
};

export default UserRepository;
