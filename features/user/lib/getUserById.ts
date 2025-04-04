import prisma from "@/utils/prisma";

/**
 * a function to get a user by id
 * @param {string} id - the id of the user
 * @returns user - the user object
 * @description a function to get a user by id
 */
export default async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
}
