import { AxiosError } from "axios";
import { useState } from "react";
import { MailCheck, MailOpen } from "lucide-react";
import { updateNotificationReadStatus } from "../../api/notifications.api";
import { useNotifications } from "../../hooks/useNotifications"; // ✅ חשוב
import type { NotificationItem } from "../../types/notifications.types";

type NotificationItemCardProps = {
    notification: NotificationItem;
    onUpdated: (updatedNotification: NotificationItem) => void;
};

/* Display a single notification card with read/unread actions */
function NotificationItemCard({
                                  notification,
                                  onUpdated,
                              }: NotificationItemCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { updateLocal } = useNotifications(); // ✅ חשוב מאוד

    /* Format date like real apps */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();

        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);

        if (diffMinutes < 1) return "Just now";
        if (diffMinutes < 60) return `${diffMinutes} min ago`;
        if (diffHours < 24) return `${diffHours}h ago`;

        return date.toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleToggleReadStatus = async () => {
        setIsUpdating(true);
        setErrorMessage("");

        try {
            const response = await updateNotificationReadStatus(notification._id, {
                isRead: !notification.isRead,
            });

            // ✅ update global state (badge updates immediately)
            updateLocal(response.data);

            // ✅ keep local component sync (list refresh)
            onUpdated(response.data);
        } catch (error: unknown) {
            let serverMessage = "Failed to update notification status.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setErrorMessage(serverMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <article
            className={`notification-card ${
                notification.isRead ? "read" : "unread"
            }`}
        >
            <div className="notification-card-main">
                <div className="notification-card-top">
                    <div className="notification-title-group">
                        <h3 className="notification-title">{notification.title}</h3>

                        <span
                            className={`notification-status ${
                                notification.isRead ? "read" : "unread"
                            }`}
                        >
                            {notification.isRead ? "Read" : "Unread"}
                        </span>
                    </div>

                    <div className="notification-meta-row">
                        <span className="notification-chip">{notification.symbol}</span>
                        <span className="notification-chip">{notification.type}</span>

                        {notification.emailSent && (
                            <span className="notification-chip success">
                                Email sent
                            </span>
                        )}
                    </div>
                </div>

                <p className="notification-message">{notification.message}</p>

                {/* 🕒 Date */}
                <p className="notification-date">
                    {formatDate(notification.createdAt)}
                </p>

                {errorMessage && (
                    <p className="form-error notification-error">{errorMessage}</p>
                )}
            </div>

            <div className="notification-card-actions">
                <button
                    type="button"
                    className="notification-toggle-button"
                    onClick={handleToggleReadStatus}
                    disabled={isUpdating}
                >
                    {notification.isRead ? (
                        <>
                            <MailOpen size={16} />
                            <span>
                                {isUpdating ? "Updating..." : "Mark as unread"}
                            </span>
                        </>
                    ) : (
                        <>
                            <MailCheck size={16} />
                            <span>
                                {isUpdating ? "Updating..." : "Mark as read"}
                            </span>
                        </>
                    )}
                </button>
            </div>
        </article>
    );
}

export default NotificationItemCard;