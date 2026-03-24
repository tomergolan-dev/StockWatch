import NotificationModel from "../models/notification.model";

type CreateNotificationInput = {
    userId: string;
    symbol: string;
    title: string;
    message: string;
    emailSent?: boolean;
};

/**
 * Create a new notification for a user.
 */
export const createNotification = async (
    input: CreateNotificationInput
) => {
    const notification = await NotificationModel.create({
        userId: input.userId,
        symbol: input.symbol.toUpperCase(),
        title: input.title,
        message: input.message,
        type: "alert_triggered",
        isRead: false,
        emailSent: input.emailSent ?? false
    });

    return notification;
};

/**
 * Get all notifications for a user.
 */
export const getUserNotifications = async (userId: string) => {
    return await NotificationModel.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Update the read status of a user's notification.
 */
export const updateNotificationReadStatus = async (
    userId: string,
    notificationId: string,
    isRead: boolean
) => {
    const notification = await NotificationModel.findOneAndUpdate(
        {
            _id: notificationId,
            userId
        },
        {
            isRead
        },
        {
            new: true
        }
    );

    if (!notification) {
        throw new Error("Notification not found");
    }

    return notification;
};