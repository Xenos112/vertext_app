import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

async function getMembership(userId: string, communityId: string) {
  const membership = await prisma.membership.findUnique({
    where: { userId_communityId: { userId, communityId } },
  });

  return membership;
}

async function createMembership(membership: Prisma.MembershipCreateInput) {
  const newMembership = await prisma.membership.create({
    data: membership,
  });

  return newMembership;
}

async function deleteMembership(userId: string, communityId: string) {
  const deletedMembership = await prisma.membership.delete({
    where: { userId_communityId: { userId, communityId } },
  });

  return deletedMembership;
}

const MembershipRepository = {
  getMembership,
  createMembership,
  deleteMembership,
};

export default MembershipRepository;
