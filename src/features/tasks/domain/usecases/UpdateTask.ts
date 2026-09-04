import type {
  TaskRepository,
  UpdateTaskInput,
} from "@/features/tasks/domain/repositories/TaskRepository";

export class UpdateTask {
  private readonly taskRepository: TaskRepository;

  constructor( taskRepository: TaskRepository ) {
    this.taskRepository = taskRepository;
  }

  async execute(
    id: string,
    input: UpdateTaskInput
  ) {
    if (!id.trim()) {
      throw new Error("Task ID is required.");
    }

    if (!input.title.trim()) {
      throw new Error(
        "Task title cannot be empty."
      );
    }

    if (!input.description.trim()) {
      throw new Error(
        "Task description cannot be empty."
      );
    }

    return this.taskRepository.updateTask(
      id,
      {
        ...input,
        title: input.title.trim(),
        description: input.description.trim(),
      }
    );
  }
}