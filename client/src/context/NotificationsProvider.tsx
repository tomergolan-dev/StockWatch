import { useEffect, useMemo, useState } from "react";
import { getNotifications } from "../api/notifications.api";
import { NotificationsContext } from "./NotificationsContext";
import type { NotificationItem } from "../types/notifications.types";

/* Provide global notifications state */
export function NotificationsProvider({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    /* Fetch notifications from the backend */
    const refresh = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data);
        } catch {
            /* Silent fail for background refresh */
        }
    };

    /* Poll notifications every 10 seconds */
    useEffect(() => {
        void refresh();

        const intervalId = window.setInterval(() => {
            void refresh();
        }, 10000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    /* Update one notification immediately in local state */
    const updateLocal = (updated: NotificationItem) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification._id === updated._id ? updated : notification
            )
        );
    };

    const unreadCount = useMemo(
        () => notifications.filter((notification) => !notification.isRead).length,
        [notifications]
    );

    const value = useMemo(
        () => ({
            notifications,
            unreadCount,
            refresh,
            updateLocal,
        }),
        [notifications, unreadCount]
    );

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}