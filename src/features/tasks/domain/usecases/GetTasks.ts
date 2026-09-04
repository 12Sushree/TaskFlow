import type { TaskRepository } from "@/features/tasks/domain/repositories/TaskRepository";

export class GetTasks {
  private readonly taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute() {
    return this.taskRepository.getTasks();
  }
}