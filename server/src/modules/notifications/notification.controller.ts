import {
  Request,
  Response,
  NextFunction,
} from "express";

import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import AppError from "../../utils/AppError";

import {
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.service";

export const getUserNotificationsController = async (
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

    const notifications = await getUserNotifications(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsReadController = async (
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
        "Notification ID is required",
        400
      );
    }

    const notification = await markNotificationAsRead(
      id,
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Notification not found"
    ) {
      return next(
        new AppError(
          "Notification not found",
          404
        )
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "You do not have permission to update this notification"
    ) {
      return next(
        new AppError(
          "You do not have permission to update this notification",
          403
        )
      );
    }

    next(error);
  }
};

export const markAllNotificationsAsReadController =
  async (
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

      await markAllNotificationsAsRead(
        req.user.userId
      );

      return res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      next(error);
    }
  };