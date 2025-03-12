"use server";

import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";

export async function postSearch(query: string, limit = 3) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = await validateUser(token);
  try {
    const matchedPosts = await prisma.post.findMany({
      where: {
        content: {
          contains: query,
          mode: "insensitive",
        },
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
            userId: user?.id || ''
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
      take: limit,
    });

    return { posts: matchedPosts };
  } catch (error) {
    console.log("ERROR:" + error);
    return { error: "Something went wrong" };
  }
}

export async function usersSearch(query: string, limit = 3) {
  try {
    const matchedPosts = await prisma.user.findMany({
      where: {
        OR: [
          {
            user_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            bio: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      take: limit,
    });

    return { users: matchedPosts };
  } catch (error) {
    console.log("ERROR:" + error);
    return { error: "Something went wrong" };
  }
}

export async function communitiesSearch(query: string, limit = 3) {
  try {
    const matchedPosts = await prisma.community.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: limit,
    });

    return { communities: matchedPosts };
  } catch (error) {
    console.log("ERROR:" + error);
    return { error: "Something went wrong" };
  }
}
