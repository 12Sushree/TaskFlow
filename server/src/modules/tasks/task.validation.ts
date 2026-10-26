import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required"),

  description: z
    .string()
    .trim()
    .optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

  assignedToId: z
    .string()
    .uuid("Invalid user ID")
    .nullable()
    .optional(),

  dueDate: z
    .string()
    .datetime("Invalid due date")
    .nullable()
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional(),

  assignedToId: z
    .string()
    .uuid("Invalid user ID")
    .nullable()
    .optional(),

  dueDate: z
    .string()
    .datetime("Invalid due date")
    .nullable()
    .optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
  ]),
});