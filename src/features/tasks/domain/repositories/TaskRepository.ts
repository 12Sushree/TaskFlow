import type { Task } from "@/features/tasks/domain/entities/Task";

export interface CreateTaskInput {
  title: string;
  description: string;
  priority: Task["priority"];
  assignedTo: string | null;
  dueDate: string | null;
  createdBy: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: Task["priority"];
  status?: Task["status"];
  assignedTo?: string | null;
  dueDate?: string | null;
}

export interface TaskRepository {
  createTask(input: CreateTaskInput): Promise<Task>;

  getTasks(): Promise<Task[]>;

  getTaskById(id: string): Promise<Task | null>;

  updateTask(
    id: string,
    input: UpdateTaskInput
  ): Promise<Task>;
}