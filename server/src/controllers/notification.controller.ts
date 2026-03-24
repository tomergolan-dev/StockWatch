import { Request, Response } from "express";
import {
    getUserNotifications,
    updateNotificationReadStatus
} from "../services/notification.service";

type AuthenticatedRequest = Request & {
    user?: {
        _id: string;
        email: string;
        role: string;
    };
};

/**
 * Get all notifications for the authenticated user.
 */
export const getUserNotificationsController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const notifications = await getUserNotifications(userId);

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to fetch notifications"
        });
    }
};

/**
 * Update the read status of a notification for the authenticated user.
 */
export const updateNotificationReadStatusController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const notificationId = String(req.params.id || "");
        const { isRead } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        if (!notificationId) {
            res.status(400).json({
                success: false,
                message: "Notification id is required"
            });
            return;
        }

        const notification = await updateNotificationReadStatus(
            userId,
            notificationId,
            isRead
        );

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to update notification"
        });
    }
};