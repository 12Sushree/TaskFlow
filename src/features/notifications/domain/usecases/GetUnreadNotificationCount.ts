import type { NotificationRepository } from "@/features/notifications/domain/repositories/NotificationRepository";

export class GetUnreadNotificationCount {
  private readonly notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(userId: string) {
    if (!userId.trim()) {
      throw new Error("User ID is required.");
    }

    return this.notificationRepository.getUnreadNotificationCount(
      userId
    );
  }
}