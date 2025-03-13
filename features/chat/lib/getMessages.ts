import prisma from "@/utils/prisma";

/**
 * a function to get messages from a community
 * @param communityId - the id of the community to get messages from
 * @returns - an array of messages from the community
 * @description a function to get messages from a community
*/
export default async function getMessages(communityId: string) {
  const messages = await prisma.message.findMany({
    where: {
      communityId
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Sender: {
        omit: {
          password: true
        }
      },
    },
    take: 20,
  })

  return messages
}

