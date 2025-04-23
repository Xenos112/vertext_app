import prisma from "@/utils/prisma";
import { type NotificationType } from "@prisma/client";

async function getNotifications(reciverId: string) {
  const notifications = await prisma.notification.findMany({
    where: { reciverId },
  });

  return notifications;
}

async function getNotification(id: string) {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  return notification;
}

async function createNotification({
  sender,
  reciver,
  type,
  content,
}: {
  sender: string;
  reciver: string;
  type: NotificationType;
  content: string;
}) {
  if (sender === reciver) return;
  const latestNofication = await prisma.notification.findFirst({
    where: { reciverId: reciver },
    orderBy: { createdAt: "desc" },
  });
  if (
    latestNofication &&
    latestNofication.createdAt.getTime() > Date.now() - 30 * 60 * 1000
  )
    return latestNofication;

  const newNotification = await prisma.notification.create({
    data: {
      senderId: sender,
      reciverId: reciver,
      type,
      content: content,
    },
  });

  return newNotification;
}

async function deleteNotification(id: string) {
  const deletedNotification = await prisma.notification.delete({
    where: { id },
  });

  return deletedNotification;
}

const NotificationRepository = {
  getNotifications,
  getNotification,
  createNotification,
  deleteNotification,
};
export default NotificationRepository;
