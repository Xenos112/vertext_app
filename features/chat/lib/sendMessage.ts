import prisma from "@/utils/prisma";

type MessageData = {
  room: string;
  sender: string;
  content: string;
}
/**
  * a function to send a message to a community
  * @param data - data needed to send a message
  * @returns - the message that was sent with the sender data
  * @description a function to send a message to a community
  *
*/
export default async function sendMessage(data: MessageData) {
  const message = await prisma.message.create({
    data: {
      content: data.content,
      senderId: data.sender,
      communityId: data.room,
    },
    include: {
      Sender: true,
    }
  });

  return message;
}
