import type {
  CreateTaskInput,
  TaskRepository,
} from "@/features/tasks/domain/repositories/TaskRepository";

export class CreateTask {
  private readonly taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(
    input: CreateTaskInput
  ) {
    if (!input.title.trim()) {
      throw new Error("Task title is required.");
    }

    if (!input.description.trim()) {
      throw new Error(
        "Task description is required."
      );
    }

    if (!input.createdBy) {
      throw new Error(
        "Task creator is required."
      );
    }

    return this.taskRepository.createTask({
      ...input,
      title: input.title.trim(),
      description: input.description.trim(),
    });
  }
}