import type { AppNotification } from "@/features/notifications/domain/entities/Notification";

export type CreateNotificationInput = {
  userId: string;
  title: string;
  message: string;
  type: AppNotification["type"];
  taskId?: string;
};

export interface NotificationRepository {
  createNotification(
    input: CreateNotificationInput
  ): Promise<AppNotification>;

  getNotificationsByUser(
    userId: string
  ): Promise<AppNotification[]>;

  getUnreadNotificationCount(
    userId: string
  ): Promise<number>;

  markNotificationAsRead(
    notificationId: string
  ): Promise<AppNotification>;

  markAllNotificationsAsRead(
    userId: string
  ): Promise<void>;
}