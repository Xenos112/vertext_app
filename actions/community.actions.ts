'use server';

import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function getCommunityDetails(communityId: string) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)

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
              }
            }
          },
        },
        Membership: {
          where: {
            userId: user?.id
          }
        }
      },

    })

    return { community }
  } catch (error) {
    return { error }
  }
}

export async function joinCommunity(communityId: string) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)
    if (!user)
      redirect('/login')

    await prisma.membership.create({
      data: {
        communityId,
        userId: user.id,
        role: 'USER'
      }
    })

    return { message: "You Have Joined The Community Succesfully" }

  } catch (error) {
    return { error }
  }
}
