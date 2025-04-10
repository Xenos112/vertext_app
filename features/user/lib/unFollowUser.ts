import prisma from "@/utils/prisma"
import getRelation from "./getRelation"

type UnFollowUserData = {
  userId: string
  tounfollowUser: string
}


/**
  * a function to delete a follow record from the database
  * @param {UnFollowUserData} data - data needed to delete the record
  * @returns the relation if exists, null if not
  * @description a function to delete a relationship between two users
*/
export default async function unfollowUser(data: UnFollowUserData) {
  const relation = getRelation({ followedUserId: data.tounfollowUser, userId: data.userId })
  if (!relation)
    return
  const relationRecord = await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: data.userId,
        followingId: data.tounfollowUser
      }
    }
  })

  return relationRecord
}
