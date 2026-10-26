import { Router } from "express";

import { getUsersController, getUserByIdController } from "./user.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("ADMIN"), getUsersController);
router.get(":id", authMiddleware, roleMiddleware("ADMIN"), getUserByIdController);

export default router;