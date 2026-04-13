import { axiosClient } from "./axiosClient";
import type {
    AlertsResponse,
    AlertMutationResponse,
    CreateAlertPayload,
} from "../types/alerts.types";

/* Fetch all alerts for the authenticated user */
export async function getAlerts(): Promise<AlertsResponse> {
    const response = await axiosClient.get<AlertsResponse>("/api/alerts");
    return response.data;
}

/* Create a new alert */
export async function createAlert(
    payload: CreateAlertPayload
): Promise<AlertMutationResponse> {
    const response = await axiosClient.post<AlertMutationResponse>(
        "/api/alerts",
        payload
    );

    return response.data;
}

/* Delete an existing alert */
export async function deleteAlert(
    id: string
): Promise<AlertMutationResponse> {
    const response = await axiosClient.delete<AlertMutationResponse>(
        `/api/alerts/${id}`
    );

    return response.data;
}