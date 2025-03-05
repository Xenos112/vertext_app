import prisma from "@/utils/prisma"

type JoinUserData = {
  userId: string,
  communityId: string
}


/**
  * @param {JoinUserData} data - userId and the communityId
  * @returns the new record of the membership
  * @description a function to let user join a community, this function does check if the record does exist and will create if if it does not exist
*/
export default async function joinUser(data: JoinUserData) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_communityId: {
        communityId: data.communityId,
        userId: data.userId
      }
    }
  })

  if (membership) return membership

  const newMemberShip = await prisma.membership.create({
    data,
  })

  return newMemberShip
}
