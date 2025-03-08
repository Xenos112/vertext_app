import prisma from "@/utils/prisma"

export type GetRelationData = {
  userId: string
  followedUserId: string
}


/**
  * a function to query the relation from a database
  * @param {GetRelationData} data - data needed to query the record
  * @returns the relation if exists, null if not
  * @description a function to query the relation at the databse level
*/
export default async function getRelation(data: GetRelationData) {
  const relation = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: data.userId,
        followingId: data.followedUserId
      }
    }
  })

  return relation
}
