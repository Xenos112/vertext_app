import prisma from "@/utils/prisma";

async function getLike(postId: string, userId?: string | null) {
  if (!userId) return [];
  const like = await prisma.like.findUnique({
    where: { postId_userId: { userId, postId } },
  });

  return !!like;
}

async function createLike(userId: string, postId: string) {
  const newLike = prisma.like.create({ data: { userId, postId } });

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
