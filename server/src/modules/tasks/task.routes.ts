import { Router } from "express";

import {
  createTaskController,
  getCreatedTasksController,
  getAssignedTasksController,
  getTaskByIdController,
  updateTaskController,
  updateTaskStatusController
} from "./task.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";

const router = Router();

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createTaskController);
router.get("/created", authMiddleware, roleMiddleware("ADMIN"), getCreatedTasksController);
router.get("/assigned", authMiddleware, roleMiddleware("USER"), getAssignedTasksController);
router.get("/:id", authMiddleware, roleMiddleware("ADMIN"), getTaskByIdController);
router.patch("/:id", authMiddleware, roleMiddleware("ADMIN"), updateTaskController);
router.patch(":id/status", authMiddleware, roleMiddleware("USER"), updateTaskStatusController);

export default router;