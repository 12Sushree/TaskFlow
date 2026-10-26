import {
  Request,
  Response,
  NextFunction,
} from "express";

import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import AppError from "../../utils/AppError";

import {
  createTask,
  getAssignedTasks,
  getTaskById,
  getCreatedTasks,
  updateTask,
  updateTaskStatus,
} from "./task.service";

import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "./task.validation";

export const createTaskController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const result = createTaskSchema.safeParse(
      req.body
    );

    if (!result.success) {
      throw new AppError(
        "Invalid task data",
        400
      );
    }

    const task = await createTask(
      result.data,
      req.user.userId
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const getCreatedTasksController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const tasks = await getCreatedTasks(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedTasksController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const tasks = await getAssignedTasks(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskByIdController = async (
  req: AuthenticatedRequest & Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const { id } = req.params;

    if (!id) {
      throw new AppError(
        "Task ID is required",
        400
      );
    }

    const task = await getTaskById(
      id,
      req.user.userId,
      req.user.role
    );

    if (!task) {
      throw new AppError(
        "Task not found",
        404
      );
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "You do not have access to this task"
    ) {
      return next(
        new AppError(
          "You do not have access to this task",
          403
        )
      );
    }

    next(error);
  }
};

export const updateTaskController = async (
  req: AuthenticatedRequest & Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const { id } = req.params;

    if (!id) {
      throw new AppError(
        "Task ID is required",
        400
      );
    }

    const result = updateTaskSchema.safeParse(
      req.body
    );

    if (!result.success) {
      throw new AppError(
        "Invalid task data",
        400
      );
    }

    const task = await updateTask(
      id,
      result.data,
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Task not found"
    ) {
      return next(
        new AppError(
          "Task not found",
          404
        )
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "You do not have permission to update this task"
    ) {
      return next(
        new AppError(
          "You do not have permission to update this task",
          403
        )
      );
    }

    next(error);
  }
};

export const updateTaskStatusController = async (
  req: AuthenticatedRequest & Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const { id } = req.params;

    if (!id) {
      throw new AppError(
        "Task ID is required",
        400
      );
    }

    const result =
      updateTaskStatusSchema.safeParse(
        req.body
      );

    if (!result.success) {
      throw new AppError(
        "Invalid task status",
        400
      );
    }

    const task = await updateTaskStatus(
      id,
      result.data,
      req.user.userId,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Task not found"
    ) {
      return next(
        new AppError(
          "Task not found",
          404
        )
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "You do not have permission to update this task"
    ) {
      return next(
        new AppError(
          "You do not have permission to update this task",
          403
        )
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "Completed tasks cannot be reopened"
    ) {
      return next(
        new AppError(
          "Completed tasks cannot be reopened",
          400
        )
      );
    }

    next(error);
  }
};