import prisma from "@/utils/prisma";

/**
 * @param communityId - The id of the community to get membership requests
 * @returns An array of membership requests for the given community with their user informations
 * @description This function returns an array of membership requests for a given community.
 */
export default async function getMembershipRequests(communityId: string) {
  const membershipRequests = await prisma.membershipRequest.findMany({
    where: {
      communityId,
    },
    include: {
      User: true,
    },
  });

  return membershipRequests;
}
