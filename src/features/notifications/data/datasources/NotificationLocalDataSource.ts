import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AppNotification } from "@/features/notifications/domain/entities/Notification";
import type { CreateNotificationInput } from "@/features/notifications/domain/repositories/NotificationRepository";

const NOTIFICATIONS_STORAGE_KEY = "@taskflow/notifications";

const generateId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

export class NotificationLocalDataSource {
  private async getStoredNotifications() {
    const storedNotifications =
      await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);

    if (!storedNotifications) {
      return [];
    }

    return JSON.parse(storedNotifications) as AppNotification[];
  }

  private async saveNotifications(notifications: AppNotification[]) {
    await AsyncStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications)
    );
  }

  async createNotification(input: CreateNotificationInput) {
    const notifications =
      await this.getStoredNotifications();

    const notification: AppNotification = {
      id: generateId(),
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      taskId: input.taskId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    notifications.push(notification);

    await this.saveNotifications(notifications);

    return notification;
  }

  async getNotifications() {
    return this.getStoredNotifications();
  }

  async getNotificationsByUser(userId: string) {
    const notifications =
      await this.getStoredNotifications();

    return notifications.filter(
      (notification) =>
        notification.userId === userId
    );
  }

  async getUnreadNotificationCount(userId: string) {
    const notifications =
      await this.getStoredNotifications();

    return notifications.filter(
      (notification) =>
        notification.userId === userId &&
        !notification.isRead
    ).length;
  }

  async markNotificationAsRead(notificationId: string) {
    const notifications =
      await this.getStoredNotifications();

    const notificationIndex =
      notifications.findIndex(
        (notification) =>
          notification.id === notificationId
      );

    if (notificationIndex === -1) {
      throw new Error(
        "Notification not found."
      );
    }

    const existingNotification =
      notifications[notificationIndex];

    const updatedNotification: AppNotification = {
      ...existingNotification,
      isRead: true,
    };

    notifications[notificationIndex] =
      updatedNotification;

    await this.saveNotifications(
      notifications
    );

    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: string) {
    const notifications =
      await this.getStoredNotifications();

    const updatedNotifications =
      notifications.map((notification) => {
        if (
          notification.userId === userId &&
          !notification.isRead
        ) {
          return {
            ...notification,
            isRead: true,
          };
        }

        return notification;
      });

    await this.saveNotifications(
      updatedNotifications
    );
  }
}