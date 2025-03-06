import prisma from "@/utils/prisma";

type GetMembershipData = {
  userId: string;
  communityId: string;
}
export default async function getMembership(data: GetMembershipData) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_communityId: {
        communityId: data.communityId,
        userId: data.userId
      }
    }
  })

  return membership
}
