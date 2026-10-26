export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_STATUS_CHANGED"
  | "TASK_COMPLETED";

export interface CreateNotificationInput {
  userId: string;
  taskId?: string | null;
  title: string;
  message: string;
  type: NotificationType;
}