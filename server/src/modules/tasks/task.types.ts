export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  assignedToId?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assignedToId?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}