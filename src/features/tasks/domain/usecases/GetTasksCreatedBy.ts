import type { TaskRepository } from "@/features/tasks/domain/repositories/TaskRepository";

export class GetTasksCreatedBy {
  private readonly taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(userId: string) {
    if (!userId.trim()) {
      throw new Error("User ID is required.");
    }

    const tasks = await this.taskRepository.getTasks();

    return tasks.filter(
      (task) => task.createdBy === userId
    );
  }
}
