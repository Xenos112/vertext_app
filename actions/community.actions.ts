"use server";

import { ERRORS } from "@/constants";
import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function getCommunityDetails(communityId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);

    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        _count: {
          select: {
            Membership: true,
            Post: true,
          },
        },
        Post: {
          include: {
            Author: true,
            Like: true,
            Save: true,
            Comment: true,
            Community: true,
            _count: {
              select: {
                Like: true,
                Save: true,
                Comment: true,
              },
            },
          },
        },
        Membership: {
          where: {
            userId: user?.id,
          },
        },
      },
    });

    return { community };
  } catch (error) {
    return { error };
  }
}

export async function joinCommunity(communityId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    if (!user) redirect("/login");

    await prisma.membership.create({
      data: {
        communityId,
        userId: user.id,
        role: "USER",
      },
    });

    return { message: "You Have Joined The Community Succesfully" };
  } catch (error) {
    return { error };
  }
}

export async function leaveCommunity(communityId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    if (!user) redirect("/login");
    // check if he is joined
    const isJoined = await prisma.membership.findFirst({
      where: {
        AND: [{ communityId }, { userId: user.id }],
      },
    });

    if (!isJoined) {
      return { message: "You Have Already Left" };
    }

    // remove the membership
    await prisma.membership.deleteMany({
      where: {
        AND: [{ communityId }, { userId: user.id }],
      },
    });

    return { message: "You have left the Community" };
  } catch (error) {
    return { error };
  }
}

type CreateCommuntyProps = {
  name: string;
  desc: string | null;
  image: string | null;
  banner: string | null;
};
export async function createCommunity({
  name,
  desc,
  image,
  banner,
}: CreateCommuntyProps) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    if (!user) {
      return { error: ERRORS.NOT_AUTHENTICATED };
    }

    const community = await prisma.community.create({
      data: {
        name,
        image,
        banner,
        bio: desc || "",
      },
    });
    await prisma.membership.create({
      data: {
        role: "ADMIN",
        userId: user.id,
        communityId: community.id,
      },
    });

    return { community };
  } catch (error) {
    console.log(error);
    return { error: "Something Went Wrong" };
  }
}
