import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

async function getLike(userId: string, postId: string) {
  const like = await prisma.like.findUnique({
    where: { postId_userId: { userId, postId } },
  });

  return like;
}

async function createLike(like: Prisma.LikeCreateInput) {
  const newLike = prisma.like.create({ data: like });

  return newLike;
}

async function deleteLike(userId: string, postId: string) {
  const deletedLike = await prisma.like.delete({
    where: { postId_userId: { userId, postId } },
  });

  return deletedLike;
}

const LikeRepository = { getLike, createLike, deleteLike };
export default LikeRepository;
