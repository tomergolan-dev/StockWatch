/* Represent a single alert item */
export type AlertItem = {
    _id: string;
    symbol: string;
    metric: "price" | "percent";
    direction: "up" | "down";
    value: number;
    isActive: boolean;
    triggeredAt: string | null;
};

/* Represent the alerts list response */
export type AlertsResponse = {
    success: boolean;
    data: AlertItem[];
};

/* Represent the request payload for creating a new alert */
export type CreateAlertPayload = {
    symbol: string;
    metric: "price" | "percent";
    direction: "up" | "down";
    value: number;
};

/* Represent a generic alert mutation response */
export type AlertMutationResponse = {
    success: boolean;
    message?: string;
    data?: AlertItem;
};