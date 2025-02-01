"use server";

import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";

export async function getUserById(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const currentUser = await validateUser(token);
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        followers: {
          where: {
            followerId: currentUser?.id,
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
    return { user, isFollowedByCurrentUser: user!.followers.length > 0 };
  } catch (error) {
    return { error };
  }
}

export async function followUser(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);

    if (!user) {
      return { error: "You Are Not Authenticated" };
    }

    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: userId,
      },
    });

    return { message: "Success" };
  } catch (error) {
    return { error };
  }
}

export async function unFollwerUser(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);

    if (!user) {
      return { error: "You Are Not Authenticated" };
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId,
        },
      },
    });
    return { message: "Success" };
  } catch (error) {
    return { error };
  }
}

export async function getUserPosts(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);

    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
      include: {
        Author: {
          omit: {
            password: true,
          },
        },
        Community: true,
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
        _count: {
          select: {
            Like: true,
            Comment: true,
            Save: true,
          },
        },
      },
    });

    return { posts };
  } catch (error) {
    return { error };
  }
}

export async function getUserCommunities(userId: string) {
  try {
    const communities = await prisma.membership.findMany({
      where: {
        userId: userId,
      },
    });
    return { communities };
  } catch (error) {
    return { error };
  }
}

export async function fetchUserJoinedCommunities(userId: string) {
  try {
    const communities = await prisma.membership.findMany({
      where: {
        userId: userId,
      },
      include: {
        Community: {
          select: {
            name: true,
            created_at: true,
            id: true,
            image: true,
            _count: {
              select: {
                Post: true,
                Membership: true,
              },
            },
          },
        },
      },
    });

    return { communities };
  } catch (error) {
    return { error };
  }
}

