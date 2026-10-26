import type {
  CreateNotificationInput,
  NotificationRepository,
} from "@/features/notifications/domain/repositories/NotificationRepository";
import { NotificationRemoteDataSource } from "../datasources/NotificationRemoteDataSource";

export class NotificationRepositoryImpl implements NotificationRepository {
  private readonly dataSource: NotificationRemoteDataSource;

  constructor(dataSource: NotificationRemoteDataSource) {
    this.dataSource = dataSource;
  }

  async createNotification(input: CreateNotificationInput) {
    return this.dataSource.createNotification(input);
  }

  async getNotificationsByUser(userId: string) {
    return this.dataSource.getNotificationsByUser(userId);
  }

  async getUnreadNotificationCount(userId: string) {
    return this.dataSource.getUnreadNotificationCount(userId);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.dataSource.markNotificationAsRead(notificationId);
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.dataSource.markAllNotificationsAsRead(userId);
  }
}
