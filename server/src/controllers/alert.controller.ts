import { Request, Response } from "express";
import {
    createAlert,
    getUserAlerts,
    deleteAlert
} from "../services/alert.service";

type AuthenticatedRequest = Request & {
    user?: {
        _id: string;
        email: string;
        role: string;
    };
};

/**
 * Create a new alert for the authenticated user.
 */
export const createAlertController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const alert = await createAlert(userId, req.body);

        res.status(201).json({
            success: true,
            data: alert
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to create alert"
        });
    }
};

/**
 * Get all alerts for the authenticated user.
 */
export const getUserAlertsController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const alerts = await getUserAlerts(userId);

        res.status(200).json({
            success: true,
            data: alerts
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to fetch alerts"
        });
    }
};

/**
 * Delete an alert by id for the authenticated user.
 */
export const deleteAlertController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const alertId = String(req.params.id || "");

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        if (!alertId) {
            res.status(400).json({
                success: false,
                message: "Alert id is required"
            });
            return;
        }

        const result = await deleteAlert(userId, alertId);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to delete alert"
        });
    }
};