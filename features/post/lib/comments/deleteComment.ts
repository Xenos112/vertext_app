import prisma from "@/utils/prisma";


/**
  * a function to delete a comment
  * @param id - the comment id to delete
  * @returns the deleted comment record if needed for usage
  * @description a function to delete a post from the database, the function does not validate any thing
*/
export default async function deleteComment(id: string) {
  const deletedComment = await prisma.comment.delete({
    where: { id }
  })

  return deletedComment
}
