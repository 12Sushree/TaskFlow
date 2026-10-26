import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Task } from "@/features/tasks/domain/entities/Task";

import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "@/features/tasks/domain/repositories/TaskRepository";

const TASKS_STORAGE_KEY = "@taskflow/tasks";

const generateId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

export class TaskLocalDataSource {
  private async getStoredTasks() {
    const storedTasks =
      await AsyncStorage.getItem(
        TASKS_STORAGE_KEY
      );

    if (!storedTasks) {
      return [];
    }

    return JSON.parse(storedTasks) as Task[];
  }

  private async saveTasks(tasks: Task[]) {
    await AsyncStorage.setItem(
      TASKS_STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }

  async createTask(input: CreateTaskInput) {
    if (!input.title.trim()) {
      throw new Error("Task title is required.");
    }

    const tasks =
      await this.getStoredTasks();

    const now = new Date().toISOString();

    const task: Task = {
      id: generateId(),
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: "pending",
      assignedTo: input.assignedTo,
      createdBy: input.createdBy,
      dueDate: input.dueDate,
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(task);

    await this.saveTasks(tasks);

    return task;
  }

  async getTasks() {
    return this.getStoredTasks();
  }

  async getTaskById(id: string) {
    const tasks =
      await this.getStoredTasks();

    return (
      tasks.find(
        (task) => task.id === id
      ) ?? null
    );
  }

  async updateTask(id: string,input: UpdateTaskInput) {
    const tasks =
      await this.getStoredTasks();

    const taskIndex = tasks.findIndex(
      (task) => task.id === id
    );

    if (taskIndex === -1) {
      throw new Error("Task not found.");
    }

    const existingTask =
      tasks[taskIndex];

    const updatedTask: Task = {
      ...existingTask,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;

    await this.saveTasks(tasks);

    return updatedTask;
  }
}