import { GetTasks } from "@/features/tasks/domain/usecases/GetTasks";
import { CreateTask } from "@/features/tasks/domain/usecases/CreateTask";
import { GetTaskById } from "@/features/tasks/domain/usecases/GetTaskById";
import { UpdateTask } from "@/features/tasks/domain/usecases/UpdateTask";
import { GetAssignedTasks } from "@/features/tasks/domain/usecases/GetAssignedTasks";
import { GetTasksCreatedBy } from "@/features/tasks/domain/usecases/GetTasksCreatedBy";

import { TaskLocalDataSource } from "@/features/tasks/data/datasources/TaskLocalDataSource";

import { TaskRepositoryImpl } from "@/features/tasks/data/repositories/TaskRepositoryImpl";

const taskLocalDataSource = new TaskLocalDataSource();

const taskRepository = new TaskRepositoryImpl(
  taskLocalDataSource
);

export const createTask =
  new CreateTask(taskRepository);

export const getTasks =
  new GetTasks(taskRepository);

export const getTaskById =
  new GetTaskById(taskRepository);

export const updateTask =
  new UpdateTask(taskRepository);

export const getAssignedTasks =
  new GetAssignedTasks(taskRepository);

export const getTasksCreatedBy =
  new GetTasksCreatedBy(taskRepository);