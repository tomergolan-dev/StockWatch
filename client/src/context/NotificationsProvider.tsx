import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getNotifications } from "../api/notifications.api";
import { NotificationsContext } from "./NotificationsContext";
import { useAuth } from "../hooks/useAuth";
import type { NotificationItem } from "../types/notifications.types";

/* Provide global notifications state for authenticated users only */
export function NotificationsProvider({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const isRefreshingRef = useRef(false);

    /* Fetch notifications safely */
    const refresh = useCallback(async () => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }

        if (isRefreshingRef.current) {
            return;
        }

        isRefreshingRef.current = true;

        try {
            const response = await getNotifications();
            setNotifications(response.data);
        } catch {
            setNotifications([]);
        } finally {
            isRefreshingRef.current = false;
        }
    }, [isAuthenticated]);

    /* Poll notifications only when the user is authenticated */
    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }

        void refresh();

        const intervalId = window.setInterval(() => {
            void refresh();
        }, 30000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isAuthenticated, refresh]);

    /* Update one notification immediately in local state */
    const updateLocal = useCallback((updated: NotificationItem) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification._id === updated._id ? updated : notification
            )
        );
    }, []);

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
        [notifications, unreadCount, refresh, updateLocal]
    );

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}