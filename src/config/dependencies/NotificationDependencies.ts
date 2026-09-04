import { CreateNotification } from "@/features/notifications/domain/usecases/CreateNotification";
import { GetNotificationsByUser } from "@/features/notifications/domain/usecases/GetNotificationByUser";
import { GetUnreadNotificationCount } from "@/features/notifications/domain/usecases/GetUnreadNotificationCount";
import { MarkNotificationAsRead } from "@/features/notifications/domain/usecases/MarkNotificationAsRead";
import { MarkAllNotificationsAsRead } from "@/features/notifications/domain/usecases/MarkAllNotificationsAsRead";
import { NotificationLocalDataSource } from "@/features/notifications/data/datasources/NotificationLocalDataSource";
import { NotificationRepositoryImpl } from "@/features/notifications/data/repositories/NotificationRepositoryImpl";

const notificationLocalDataSource =
  new NotificationLocalDataSource();

const notificationRepository =
  new NotificationRepositoryImpl(notificationLocalDataSource);

export const createNotification =
  new CreateNotification(notificationRepository);

export const getNotificationsByUser =
  new GetNotificationsByUser(notificationRepository);

export const getUnreadNotificationCount =
  new GetUnreadNotificationCount(notificationRepository);

export const markNotificationAsRead =
  new MarkNotificationAsRead(notificationRepository);

export const markAllNotificationsAsRead =
  new MarkAllNotificationsAsRead(notificationRepository);

