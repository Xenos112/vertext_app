import prisma from "@/utils/prisma";
import getRelation from "./getRelation";

type FollowUserData = {
  userId: string;
  followedUserId: string;
};

/**
  * a function to make a user follow a nother in database level
  * @param {FollowUserData} data - data needed to create a relation
  * @returns relation contains the userId and the followed with extra information
  * @description a function to create a relation ship between two users, it does check before it creates a new record
    *  in the database
*/
export default async function followUser(data: FollowUserData) {
  const oldRelation = await getRelation(data)
  if (oldRelation)
    return oldRelation

  const newRelation = await prisma.follow.create({
    data: {
      followerId: data.userId,
      followingId: data.followedUserId
    }
  })

  return newRelation
}
