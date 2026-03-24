import AlertModel from "../models/alert.model";

type CreateAlertInput = {
    symbol: string;
    metric: "price" | "percent";
    direction: "up" | "down";
    value: number;
};

/**
 * Create a new alert for a user.
 */
export const createAlert = async (
    userId: string,
    input: CreateAlertInput
) => {
    const alert = await AlertModel.create({
        userId,
        symbol: input.symbol.toUpperCase(),
        metric: input.metric,
        direction: input.direction,
        value: input.value,
        isActive: true
    });

    return alert;
};

/**
 * Get all alerts for a user.
 */
export const getUserAlerts = async (userId: string) => {
    return await AlertModel.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Delete a user's alert by id.
 */
export const deleteAlert = async (userId: string, alertId: string) => {
    const deletedAlert = await AlertModel.findOneAndDelete({
        _id: alertId,
        userId
    });

    if (!deletedAlert) {
        throw new Error("Alert not found");
    }

    return {
        success: true,
        message: "Alert deleted successfully"
    };
};