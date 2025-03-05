import prisma from "@/utils/prisma";

export default async function getComment(id: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      Author: {
        omit: {
          password: true
        }
      }
    }
  })

  return comment
}
