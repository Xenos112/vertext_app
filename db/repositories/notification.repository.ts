import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

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

async function createNotification(
  notification: Prisma.NotificationCreateInput,
) {
  const newNotification = await prisma.notification.create({
    data: notification,
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
