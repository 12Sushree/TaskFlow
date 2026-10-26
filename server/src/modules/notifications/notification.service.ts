import prisma from "../../config/prisma";

import type { CreateNotificationInput } from "./notification.types";

export const createNotification = async (
  input: CreateNotificationInput
) => {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      taskId: input.taskId ?? null,
      title: input.title,
      message: input.message,
      type: input.type,
    },
  });
};

export const getUserNotifications = async (
  userId: string
) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
) => {
  const notification = await prisma.notification.findUnique({
    where: {
      id: notificationId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error(
      "You do not have permission to update this notification"
    );
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });
};

export const markAllNotificationsAsRead = async (
  userId: string
) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};