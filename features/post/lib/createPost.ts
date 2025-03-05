import prisma from "@/utils/prisma";

export type CreatePostData = {
  authorId: string;
  content?: string;
  medias?: string[];
  communityId?: string
}

/**
  * a function to create a new post
  * @param { CreatePostData } data - the data needed to create a post
  * @param  userId - the user who creates the post
  * @description this function will recieve a data for a post and will return it ready with author and Community and likes
*/
export default async function createPost(data: CreatePostData, userId: string) {
  const newPost = await prisma.post.create({
    data: {
      userId: data.authorId,
      content: data.content,
      medias: data.medias,
      communityId: data.communityId
    },
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

  return newPost
}
