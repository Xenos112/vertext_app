import prisma from "@/utils/prisma";

export type CreatePostData = {
  postId: string;
  userId: string;
  content?: string;
  medias?: string[]
}


/**
  * a function to create a post comment
  * @param {CreatePostData} data - data needed to create a comment
  * @returns newComment - the comment created
  * @description a function to create a new post, the function does not do any type of checking, it only
  * creates the record of new comment and return it
*/
export default async function createComment(data: CreatePostData) {
  const newComment = await prisma.comment.create({
    data: {
      userId: data.userId,
      postId: data.postId,
      content: data.content,
      medias: data.medias,
    },
    include: {
      Author: {
        omit: {
          password: true
        }
      }
    }
  })

  return newComment
}
