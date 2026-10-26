import prisma from "../../config/prisma";

import type {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from "./task.types";

export const createTask = async (
  input: CreateTaskInput,
  createdById: string
) => {
  const {
    title,
    description,
    priority,
    assignedToId,
    dueDate,
  } = input;

  if (assignedToId) {
    const assignedUser = await prisma.user.findUnique({
      where: {
        id: assignedToId,
      },
    });

    if (!assignedUser) {
      throw new Error("Assigned user not found");
    }

    if (assignedUser.role !== "USER") {
      throw new Error("Tasks can only be assigned to users");
    }
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      assignedToId: assignedToId ?? null,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdById,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (assignedToId) {
    try {
      await prisma.notification.create({
        data: {
          userId: assignedToId,
          taskId: task.id,
          title: "New Task Assigned",
          message: `You have been assigned the task "${task.title}"`,
          type: "TASK_ASSIGNED",
        },
      });
    } catch (error) {
      console.error(
        "Failed to create task assignment notification:",
        error
      );
    }
  }

  return task;
};

export const getCreatedTasks = async (
  createdById: string
) => {
  return prisma.task.findMany({
    where: {
      createdById,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAssignedTasks = async (
  assignedToId: string
) => {
  return prisma.task.findMany({
    where: {
      assignedToId,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTaskById = async (
  taskId: string,
  userId: string,
  role: "ADMIN" | "USER"
) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!task) {
    return null;
  }

  const hasAccess =
    (role === "ADMIN" && task.createdById === userId) ||
    (role === "USER" && task.assignedToId === userId);

  if (!hasAccess) {
    throw new Error("You do not have access to this task");
  }

  return task;
};

export const updateTask = async (
  taskId: string,
  input: UpdateTaskInput,
  userId: string
) => {
  const existingTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  if (existingTask.createdById !== userId) {
    throw new Error(
      "You do not have permission to update this task"
    );
  }

  if (input.assignedToId) {
    const assignedUser = await prisma.user.findUnique({
      where: {
        id: input.assignedToId,
      },
    });

    if (!assignedUser) {
      throw new Error("Assigned user not found");
    }

    if (assignedUser.role !== "USER") {
      throw new Error("Tasks can only be assigned to users");
    }
  }

  const task = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      ...(input.title !== undefined && {
        title: input.title,
      }),

      ...(input.description !== undefined && {
        description: input.description,
      }),

      ...(input.priority !== undefined && {
        priority: input.priority,
      }),

      ...(input.assignedToId !== undefined && {
        assignedToId: input.assignedToId,
      }),

      ...(input.dueDate !== undefined && {
        dueDate: input.dueDate
          ? new Date(input.dueDate)
          : null,
      }),
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (
    input.assignedToId &&
    input.assignedToId !== existingTask.assignedToId
  ) {
    try {
      await prisma.notification.create({
        data: {
          userId: input.assignedToId,
          taskId: task.id,
          title: "New Task Assigned",
          message: `You have been assigned the task "${task.title}"`,
          type: "TASK_ASSIGNED",
        },
      });
    } catch (error) {
      console.error(
        "Failed to create task assignment notification:",
        error
      );
    }
  } else if (task.assignedToId) {
    try {
      await prisma.notification.create({
        data: {
          userId: task.assignedToId,
          taskId: task.id,
          title: "Task Updated",
          message: `The task "${task.title}" has been updated`,
          type: "TASK_UPDATED",
        },
      });
    } catch (error) {
      console.error(
        "Failed to create task update notification:",
        error
      );
    }
  }

  return task;
};

export const updateTaskStatus = async (
  taskId: string,
  input: UpdateTaskStatusInput,
  userId: string,
  role: "ADMIN" | "USER"
) => {
  const existingTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  const hasPermission =
    existingTask.assignedToId === userId ||
    (role === "ADMIN" && existingTask.createdById === userId);

  if (!hasPermission) {
    throw new Error(
      "You do not have permission to update this task"
    );
  }

  if (
    existingTask.status === "COMPLETED" &&
    input.status !== "COMPLETED"
  ) {
    throw new Error("Completed tasks cannot be reopened");
  }

  const task = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status: input.status,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  const isCompleted = input.status === "COMPLETED";

  try {
    await prisma.notification.create({
      data: {
        userId: task.createdById,
        taskId: task.id,
        title: isCompleted
          ? "Task Completed"
          : "Task Status Updated",
        message: isCompleted
          ? `The task "${task.title}" has been completed`
          : `The task "${task.title}" status has been changed to ${input.status}`,
        type: isCompleted
          ? "TASK_COMPLETED"
          : "TASK_STATUS_CHANGED",
      },
    });
  } catch (error) {
    console.error(
      "Failed to create task status notification:",
      error
    );
  }

  return task;
};