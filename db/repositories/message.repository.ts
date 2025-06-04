import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

async function getMessages(communityId: string) {
  const messages = await prisma.message.findMany({
    where: { communityId },
  });

  return messages;
}

async function getMessage(id: string) {
  const message = await prisma.message.findUnique({
    where: { id },
  });

  return message;
}

async function createMessage(message: Prisma.MessageCreateInput) {
  const newMessage = await prisma.message.create({
    data: message,
  });

  return newMessage;
}

const MessageRepository = { getMessages, getMessage, createMessage };
export default MessageRepository;
