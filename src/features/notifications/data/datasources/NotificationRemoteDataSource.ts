import { apiService } from "@/shared/services/ApiService";
import type { AppNotification } from "@/features/notifications/domain/entities/Notification";
import type { CreateNotificationInput } from "@/features/notifications/domain/repositories/NotificationRepository";

export class NotificationRemoteDataSource {
  private mapNotification(data: any): AppNotification {
    return {
      id: data.id,
      userId: data.userId,
      taskId: data.taskId,
      title: data.title,
      message: data.message,
      type: data.type,
      isRead: data.isRead,
      createdAt: data.createdAt,
    };
  }

  async createNotification(input: CreateNotificationInput): Promise<AppNotification> {
    const response = await apiService.post<any>("/notifications", {
      userId: input.userId,
      taskId: input.taskId,
      title: input.title,
      message: input.message,
      type: input.type.toUpperCase(),
    });
    return this.mapNotification(response.notification);
  }

  async getNotificationsByUser(userId: string): Promise<AppNotification[]> {
    const response = await apiService.get<any>("/notifications");
    return response.notifications.map((n: any) => this.mapNotification(n));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const notifications = await this.getNotificationsByUser(userId);
    return notifications.filter(n => !n.isRead).length;
  }

  async markNotificationAsRead(notificationId: string): Promise<AppNotification> {
    const response = await apiService.patch<any>(`/notifications/${notificationId}/read`, {});
    return this.mapNotification(response.notification);
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await apiService.patch<any>("/notifications/read-all", {});
  }
}
