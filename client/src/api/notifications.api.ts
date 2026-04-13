import { axiosClient } from "./axiosClient";
import type {
    NotificationsResponse,
    NotificationMutationResponse,
    UpdateNotificationPayload,
} from "../types/notifications.types";

/* Fetch all notifications for the authenticated user */
export async function getNotifications(): Promise<NotificationsResponse> {
    const response = await axiosClient.get<NotificationsResponse>("/api/notifications");
    return response.data;
}

/* Update notification read status */
export async function updateNotificationReadStatus(
    id: string,
    payload: UpdateNotificationPayload
): Promise<NotificationMutationResponse> {
    const response = await axiosClient.patch<NotificationMutationResponse>(
        `/api/notifications/${id}/read-status`,
        payload
    );

    return response.data;
}