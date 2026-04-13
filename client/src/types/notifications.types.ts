/* Represent a single notification */
export type NotificationItem = {
    _id: string;
    symbol: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    emailSent: boolean;
    createdAt: string;
};

/* Response for notifications list */
export type NotificationsResponse = {
    success: boolean;
    data: NotificationItem[];
};

/* Response for a single notification mutation */
export type NotificationMutationResponse = {
    success: boolean;
    data: NotificationItem;
    message?: string;
};

/* Update read/unread status */
export type UpdateNotificationPayload = {
    isRead: boolean;
};