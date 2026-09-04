import type {
  CreateNotificationInput,
  NotificationRepository,
} from "@/features/notifications/domain/repositories/NotificationRepository";

export class CreateNotification {
  private readonly notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(
    input: CreateNotificationInput
  ) {
    if (!input.userId) {
      throw new Error(
        "Notification user is required."
      );
    }

    if (!input.title.trim()) {
      throw new Error(
        "Notification title is required."
      );
    }

    if (!input.message.trim()) {
      throw new Error(
        "Notification message is required."
      );
    }

    return this.notificationRepository.createNotification({
      ...input,
      title: input.title.trim(),
      message: input.message.trim(),
    });
  }
}