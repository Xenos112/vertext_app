import prisma from "@/utils/prisma";

/**
 * a function to query the community
 * @param id - the community to query id
 * @returns the community if it exists, null if not
 * @description a function to fetch a community using it's id, the function does not perform any kin
 * of checking, it only query it from the database
 */
export default async function getCommunity(id: string) {
  const community = await prisma.community.findUnique({
    where: { id },
  });

  return community;
}
