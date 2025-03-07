import prisma from "@/utils/prisma"

type RemoveUserData = {
  removedUser: string,
  communityId: string
}

/**
  * function to rermove a user from a community
  * @param {RemoveUserData} data - user to remove id and the communityId
  * @returns void
  * @description a function to remove a user from a community, if checks if the user is a member, if yes it will remove it
*/
export default async function removeUser(data: RemoveUserData) {
  const memberShip = await prisma.membership.findUnique({
    where: {
      userId_communityId: {
        communityId: data.communityId,
        userId: data.removedUser
      }
    }
  })

  if (!memberShip) return

  const _removedMemberShip = await prisma.membership.delete({
    where: {
      userId_communityId: {
        communityId: data.communityId,
        userId: data.removedUser
      }
    }
  })
}
