import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import {
  CommunityUpdateData,
  type CommunityCreateData,
} from "../services/validators/community.validator";
import UserRepository from "./user.repository";

async function getCommunityById(id: string) {
  const community = await prisma.community.findUnique({
    where: { id },
  });

  return community;
}

async function createCommunity(community: CommunityCreateData) {
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

async function updateCommunity(
  communityId: string,
  community: CommunityUpdateData,
) {
  const updatedCommunity = await prisma.community.update({
    where: { id: communityId },
    data: community,
  });

  return updatedCommunity;
}

async function getCommunities(data: Prisma.CommunityWhereInput) {
  const communities = await prisma.community.findMany({ where: data });

  return communities;
}

async function getCommunitiesSuggestions(userId: string) {
  const currentUser = await UserRepository.getUserById(userId);
  if (!currentUser) throw new Error("User not found");

  const randomCommunities = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "Community"
      ORDER BY RANDOM()
      LIMIT 3;
    `;
  return randomCommunities.map((community) => community.id);
}
const CommunityRepository = {
  getCommunityById,
  createCommunity,
  deleteCommunity,
  updateCommunity,
  getCommunities,
  getCommunitiesSuggestions,
};

export default CommunityRepository;
