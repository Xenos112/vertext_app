import prisma from "@/utils/prisma";

export type UpdateCommentData = {
  id: string
  content: string
}
export default async function updateData(data: UpdateCommentData) {
  const updatedPost = await prisma.comment.update({
    where: { id: data.id },
    data: {
      content: data.content
    }
  })

  return updatedPost
}
