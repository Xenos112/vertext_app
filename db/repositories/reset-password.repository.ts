import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

async function getResetPassword(userId: string) {
  const [resetPassword] = await prisma.resetPassword.findMany({
    where: {
      userId,
    },
    orderBy: { created_at: "desc" },
    take: 1,
  });

  return resetPassword;
}

async function createResetPassword(
  resetPassword: Prisma.ResetPasswordCreateInput,
) {
  const newResetPassword = await prisma.resetPassword.create({
    data: resetPassword,
  });

  return newResetPassword;
}

async function deleteResetPassword(userId: string) {
  const deletedResetPassword = await prisma.resetPassword.deleteMany({
    where: { userId: userId as string },
  });

  return deletedResetPassword;
}

const ResetPasswordRepository = {
  getResetPassword,
  createResetPassword,
  deleteResetPassword,
};

export default ResetPasswordRepository;
