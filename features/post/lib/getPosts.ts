import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";

type PostsFilter = Partial<{
  userId: string;
  communityId: string;
}>;

// HACK: some of the post fetchers are repeating the same code, creating a
//       single fetcher and using the prisma batcher might help reducing repeatation

/**
 * Function To get the posts
 * @param data - the data to filter the posts
 * @description function to get posts and return it with needed informations like like count and if the user
 * did like it
 */
export default async function getPosts(data: PostsFilter) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = await validateUser(token);

  const where: PostsFilter = {};
  if (data.userId) where.userId = data.userId;
  if (data.communityId) where.communityId = data.communityId;

  const posts = await prisma.post.findMany({
    where,
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
          userId: user?.id,
        },
        select: {
          userId: true,
        },
      },
      Save: {
        where: {
          userId: user?.id,
        },
        select: {
          userId: true,
        },
      },
    },
  });

  return posts;
}
