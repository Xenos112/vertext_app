import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

async function getSave(postId: string, userId?: string | null) {
  if (!userId) return [];
  const save = await prisma.save.findUnique({
    where: { postId_userId: { userId, postId } },
  });

  return !!save;
}

async function createSave(save: Prisma.SaveCreateInput) {
  const newSave = prisma.save.create({ data: save });

  return newSave;
}

async function deleteSave(userId: string, postId: string) {
  const deletedSave = await prisma.save.delete({
    where: { postId_userId: { userId, postId } },
  });

  return deletedSave;
}

const SaveRepository = { getSave, createSave, deleteSave };
export default SaveRepository;
