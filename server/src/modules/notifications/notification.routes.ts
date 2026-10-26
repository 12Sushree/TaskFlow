import { Router } from "express";

import {
  getUserNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
} from "./notification.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getUserNotificationsController);
router.patch("/:id/read", markNotificationAsReadController);
router.patch("/read-all",markAllNotificationsAsReadController);

export default router;