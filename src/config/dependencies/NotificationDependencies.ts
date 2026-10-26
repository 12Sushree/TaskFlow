import { NotificationRemoteDataSource } from "@/features/notifications/data/datasources/NotificationRemoteDataSource";
import { NotificationRepositoryImpl } from "@/features/notifications/data/repositories/NotificationRepositoryImpl";

import { CreateNotification } from "@/features/notifications/domain/usecases/CreateNotification";
import { GetUserNotifications } from "@/features/notifications/domain/usecases/GetUserNotifications";
import { GetUnreadNotificationCount } from "@/features/notifications/domain/usecases/GetUnreadNotificationCount";
import { MarkNotificationAsRead } from "@/features/notifications/domain/usecases/MarkNotificationAsRead";
import { MarkAllNotificationsAsRead } from "@/features/notifications/domain/usecases/MarkAllNotificationsAsRead";

const notificationRemoteDataSource = new NotificationRemoteDataSource();

const notificationRepository = new NotificationRepositoryImpl(
  notificationRemoteDataSource
);

export const createNotification = new CreateNotification(notificationRepository);
export const getUserNotifications = new GetUserNotifications(notificationRepository);
export const getUnreadNotificationCount = new GetUnreadNotificationCount(notificationRepository);
export const markNotificationAsRead = new MarkNotificationAsRead(notificationRepository);
export const markAllNotificationsAsRead = new MarkAllNotificationsAsRead(notificationRepository);
