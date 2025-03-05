import prisma from "@/utils/prisma";

export type UpdatePostData = {
  id: string;
  content: string;
}

/**
  * a function to update post content
  * @param {UpdatePostData} data - data needed to update post including post id and content
  * @description function to update post content, it does not perform a check of user
*/
export default async function updatePost(data: UpdatePostData) {
  const updatedPost = await prisma.post.update({
    where: { id: data.id },
    data: {
      content: data.content
    }
  })

  return updatedPost
}
