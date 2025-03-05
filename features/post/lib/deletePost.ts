import prisma from "@/utils/prisma"

/**
  * a Function to delete a post for a user creator
  * @param  id - the post id to delete
  * @description a function to delete a post and return it, it wont perform any authentication level validation
    * as it will just remove it from the database
*/
export default async function deletePost(id: string) {
  const deletedPost = await prisma.post.delete({
    where: { id }
  })

  return deletedPost
}
