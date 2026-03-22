import { Request, Response } from "express";
import {
    addToWatchlist,
    getUserWatchlist,
    removeFromWatchlist
} from "../services/watchlist.service";

type AuthenticatedRequest = Request & {
    user?: {
        _id: string;
        email: string;
        role: string;
    };
};

/**
 * Add a stock to the authenticated user's watchlist.
 */
export const addToWatchlistController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const symbol = String(req.body?.symbol || "").trim();

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        if (!symbol) {
            res.status(400).json({
                success: false,
                message: "Stock symbol is required"
            });
            return;
        }

        const item = await addToWatchlist(userId, symbol);

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to add stock to watchlist"
        });
    }
};

/**
 * Get all watchlist items for the authenticated user.
 */
export const getUserWatchlistController = async (
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

        const items = await getUserWatchlist(userId);

        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to fetch watchlist"
        });
    }
};

/**
 * Remove a stock from the authenticated user's watchlist.
 */
export const removeFromWatchlistController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const symbol = String(req.params.symbol || "").trim();

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        if (!symbol) {
            res.status(400).json({
                success: false,
                message: "Stock symbol is required"
            });
            return;
        }

        const result = await removeFromWatchlist(userId, symbol);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to remove stock from watchlist"
        });
    }
};