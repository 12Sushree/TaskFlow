import { Request, Response, NextFunction } from "express";

import AppError from "../../utils/AppError";

import {
  getUserById,
  getUsers,
} from "./user.service";

export const getUsersController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsers();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError(
        "User ID is required",
        400
      );
    }

    const user = await getUserById(id);

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};