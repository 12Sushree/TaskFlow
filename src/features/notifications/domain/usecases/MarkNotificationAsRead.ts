import type { NotificationRepository } from "@/features/notifications/domain/repositories/NotificationRepository";

export class MarkNotificationAsRead {
  private readonly notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(notificationId: string) {
    if (!notificationId.trim()) {
      throw new Error(
        "Notification ID is required."
      );
    }

    return this.notificationRepository.markNotificationAsRead(
      notificationId
    );
  }
}