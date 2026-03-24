import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { updateNotificationReadStatusSchema } from "../validations/notification.validation";
import {
    getUserNotificationsController,
    updateNotificationReadStatusController
} from "../controllers/notification.controller";

const notificationRouter = Router();

/**
 * Get all notifications for the authenticated user.
 */
notificationRouter.get("/", requireAuth, getUserNotificationsController);

/**
 * Update the read status of a notification for the authenticated user.
 */
notificationRouter.patch(
    "/:id/read-status",
    requireAuth,
    validate(updateNotificationReadStatusSchema),
    updateNotificationReadStatusController
);

export default notificationRouter;