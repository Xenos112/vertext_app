import prisma from "@/utils/prisma";

/**
  * Function To get the post by id
  * @param id - the post id
  * @param userId - the user to see if the post have been liked by him or not
  * @description function to get post and return it with needed informations like like count and if the user
    * did like it
*/
export default async function getPost(id: string, userId?: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      Community: true,
      Author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          Like: true,
          Save: true,
          Comment: true,
        },
      },
      Like: {
        where: {
          userId: userId,
        },
        select: {
          userId: true,
        },
      },
      Save: {
        where: {
          userId: userId,
        },
        select: {
          userId: true,
        },
      },
    },
  })

  return post
}
