import prisma from "@/utils/prisma";
import { CreateCommunityData } from "../types";




/**
  * function to create a new community
  * @param {CreateCommunityData} data - data needed to create a community including creatorId
  * @returns the new created community
  * @description a function to create a new community and create the fist member ship for the admin, the function does not perform any kind of cheking
*/
export default async function createCommunity(data: CreateCommunityData) {
  const newCommunity = await prisma.community.create({
    data: {
      name: data.name,
      bio: data.bio,
      image: data.image,
      banner: data.banner,
    },
  })

  const _adminMemberShip = await prisma.membership.create({
    data: {
      userId: data.creatorId,
      communityId: newCommunity.id,
      role: 'ADMIN'
    }
  })

  return newCommunity
}
