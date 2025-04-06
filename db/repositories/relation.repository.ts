import prisma from "@/utils/prisma";

async function getRelationsNumbers(id: string) {
  const followers = await prisma.follow.count({
    where: {
      followerId: id,
    },
  });
  const following = await prisma.follow.count({
    where: {
      followingId: id,
    },
  });
  return { followers, following };
}

async function createRelation(userId: string, targetId: string) {
  const newRelation = await prisma.follow.create({
    data: {
      followerId: userId,
      followingId: targetId,
    },
  });

  return newRelation;
}

async function removeRelation(userId: string, targetId: string) {
  const deletedRelation = await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: targetId,
      },
    },
  });

  return deletedRelation;
}
async function getRelation(userId: string, targetId: string) {
  const relation = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: targetId,
      },
    },
  });

  return relation;
}
const RelationRepository = {
  getRelationsNumbers,
  createRelation,
  removeRelation,
  getRelation,
};

export default RelationRepository;
