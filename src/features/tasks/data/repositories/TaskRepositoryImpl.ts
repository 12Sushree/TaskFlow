import type {
  CreateTaskInput,
  TaskRepository,
  UpdateTaskInput,
} from "@/features/tasks/domain/repositories/TaskRepository";
import type { Task } from "@/features/tasks/domain/entities/Task";
import { TaskRemoteDataSource } from "../datasources/TaskRemoteDataSource";

export class TaskRepositoryImpl implements TaskRepository {
  private readonly dataSource: TaskRemoteDataSource;

  constructor(dataSource: TaskRemoteDataSource) {
    this.dataSource = dataSource;
  }

  async createTask(input: CreateTaskInput) {
    return this.dataSource.createTask(input);
  }

  async getTasks() {
    return this.dataSource.getTasks();
  }

  async getTaskById(id: string) {
    return this.dataSource.getTaskById(id);
  }

  async updateTask(id: string, input: UpdateTaskInput) {
    return this.dataSource.updateTask(id, input);
  }
}
