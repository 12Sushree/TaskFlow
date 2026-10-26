import { Router } from "express";

import {
  getMeController,
  loginController,
  registerController,
} from "./auth.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, getMeController);

export default router;