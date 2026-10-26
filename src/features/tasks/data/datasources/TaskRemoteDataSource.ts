import { apiService } from "@/shared/services/ApiService";
import type { Task, TaskStatus, TaskPriority } from "@/features/tasks/domain/entities/Task";
import type { CreateTaskInput, UpdateTaskInput } from "@/features/tasks/domain/repositories/TaskRepository";

export class TaskRemoteDataSource {
  private mapStatus(status: string): TaskStatus {
    return status.toLowerCase() as TaskStatus;
  }

  private mapPriority(priority: string): TaskPriority {
    return priority.toLowerCase() as TaskPriority;
  }

  private mapTask(data: any): Task {
    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      priority: this.mapPriority(data.priority),
      status: this.mapStatus(data.status),
      assignedTo: data.assignedToId || null,
      createdBy: data.createdById,
      dueDate: data.dueDate,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const response = await apiService.post<any>("/tasks", {
      title: input.title,
      description: input.description,
      priority: input.priority.toUpperCase(),
      assignedToId: input.assignedTo,
      dueDate: input.dueDate,
    });
    return this.mapTask(response.task);
  }

  async getTasks(): Promise<Task[]> {
    // Note: The API has separate endpoints for created and assigned tasks.
    // For general "getTasks", we might need to fetch both or assume a specific one.
    // Usually, a user wants to see tasks relevant to them.
    // I'll fetch assigned tasks by default for a "user" perspective.
    const response = await apiService.get<any>("/tasks/assigned");
    return response.tasks.map((t: any) => this.mapTask(t));
  }

  async getCreatedTasks(): Promise<Task[]> {
    const response = await apiService.get<any>("/tasks/created");
    return response.tasks.map((t: any) => this.mapTask(t));
  }

  async getAssignedTasks(): Promise<Task[]> {
    const response = await apiService.get<any>("/tasks/assigned");
    return response.tasks.map((t: any) => this.mapTask(t));
  }

  async getTaskById(id: string): Promise<Task | null> {
    const response = await apiService.get<any>(`/tasks/${id}`);
    return this.mapTask(response.task);
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    // If only status is provided, use the status update endpoint
    if (input.status && Object.keys(input).length === 1) {
      const response = await apiService.patch<any>(`/tasks/${id}/status`, {
        status: input.status.toUpperCase(),
      });
      return this.mapTask(response.task);
    }

    const response = await apiService.patch<any>(`/tasks/${id}`, {
      title: input.title,
      description: input.description,
      priority: input.priority?.toUpperCase(),
      assignedToId: input.assignedTo,
      dueDate: input.dueDate,
    });
    return this.mapTask(response.task);
  }
}
