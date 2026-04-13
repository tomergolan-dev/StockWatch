import NotificationItemCard from "./NotificationItemCard";
import type { NotificationItem } from "../../types/notifications.types";

type NotificationsListProps = {
    notifications: NotificationItem[];
    isLoading: boolean;
    onUpdated: (updatedNotification: NotificationItem) => void;
};

/* Render the notifications list with loading and empty states */
function NotificationsList({
                               notifications,
                               isLoading,
                               onUpdated,
                           }: NotificationsListProps) {
    if (isLoading) {
        return (
            <div className="notifications-state">
                <p className="page-description">Loading your notifications...</p>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="notifications-state">
                <p className="page-description">
                    You do not have any notifications yet.
                </p>
            </div>
        );
    }

    return (
        <div className="notifications-list">
            {notifications.map((notification) => (
                <NotificationItemCard
                    key={notification._id}
                    notification={notification}
                    onUpdated={onUpdated}
                />
            ))}
        </div>
    );
}

export default NotificationsList;