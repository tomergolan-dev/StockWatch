import { createContext } from "react";
import type { NotificationItem } from "../types/notifications.types";

export type NotificationsContextType = {
    notifications: NotificationItem[];
    unreadCount: number;
    refresh: () => Promise<void>;
    updateLocal: (updated: NotificationItem) => void;
};

export const NotificationsContext =
    createContext<NotificationsContextType | null>(null);