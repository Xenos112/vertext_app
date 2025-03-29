import prisma from "@/utils/prisma";

/**
 * Retreives all the communities that the user is a part of
 * @param userId The userId of the user
 * @returns An array of communities
 * @throws Error if something went wrong
 * @description This function is used to retreive all the communities that the user is a part of
 */
export default async function getCommunities(userId: string) {
  const communities = await prisma.community.findMany({
    where: {
      Membership: {
        some: {
          userId,
        },
      },
    },
  });

  return communities;
}
