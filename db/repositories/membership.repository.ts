import prisma from "@/utils/prisma";
import { type Role } from "@prisma/client";

async function getMembership(userId: string, communityId: string) {
  const membership = await prisma.membership.findUnique({
    where: { userId_communityId: { userId, communityId } },
  });

  return membership;
}

async function createMembership(communityId: string, userId: string) {
  const newMembership = await prisma.membership.create({
    data: { communityId, userId },
  });

  return newMembership;
}

async function deleteMembership(userId: string, communityId: string) {
  const deletedMembership = await prisma.membership.delete({
    where: { userId_communityId: { userId, communityId } },
  });

  return deletedMembership;
}

async function updateMembership(
  userId: string,
  communityId: string,
  role: Role,
) {
  const updatedMembership = await prisma.membership.update({
    where: { userId_communityId: { userId, communityId } },
    data: {
      role,
    },
  });

  return updatedMembership;
}

const MembershipRepository = {
  getMembership,
  createMembership,
  deleteMembership,
  updateMembership,
};

export default MembershipRepository;
