import type { TaskRepository } from "@/features/tasks/domain/repositories/TaskRepository";

export class GetTaskById {
  private readonly taskRepository: TaskRepository;

  constructor( taskRepository: TaskRepository ) {
    this.taskRepository = taskRepository;
  }

  async execute(id: string) {
    if (!id.trim()) {
      throw new Error("Task ID is required.");
    }

    const task =
      await this.taskRepository.getTaskById(
        id
      );

    if (!task) {
      throw new Error("Task not found.");
    }

    return task;
  }
}