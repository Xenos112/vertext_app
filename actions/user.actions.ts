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
