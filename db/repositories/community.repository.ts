import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

async function getCommunityById(id: string) {
  const community = await prisma.community.findUnique({
    where: { id },
  });

  return community;
}

async function createCommunity(community: Prisma.CommunityCreateInput) {
  const newCommunity = await prisma.community.create({
    data: community,
  });

  return newCommunity;
}

async function deleteCommunity(id: string) {
  const deletedCommunity = await prisma.community.delete({
    where: { id },
  });

  return deletedCommunity;
}

async function updateCommunity(community: Prisma.CommunityUpdateInput) {
  const updatedCommunity = await prisma.community.update({
    where: { id: community.id as string },
    data: community,
  });

  return updatedCommunity;
}

const CommunityRepository = {
  getCommunityById,
  createCommunity,
  deleteCommunity,
  updateCommunity,
};
export default CommunityRepository;
