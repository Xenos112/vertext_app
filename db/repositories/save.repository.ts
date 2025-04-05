import prisma from "@/utils/prisma";

async function getSave(postId: string, userId?: string | null) {
  if (!userId) return [];
  const save = await prisma.save.findUnique({
    where: { postId_userId: { userId, postId } },
  });

  return !!save;
}

async function createSave(userId: string, postId: string) {
  const newSave = prisma.save.create({ data: { userId, postId } });

  return newSave;
}

async function deleteSave(userId: string, postId: string) {
  const deletedSave = await prisma.save.delete({
    where: { postId_userId: { userId, postId } },
  });

  return deletedSave;
}

async function getSaves(postId: string) {
  const saves = await prisma.save.count({
    where: { postId },
  });

  return saves;
}

const SaveRepository = { getSave, createSave, deleteSave, getSaves };
export default SaveRepository;
