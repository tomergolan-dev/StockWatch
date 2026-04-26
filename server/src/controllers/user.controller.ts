import { Request, Response } from "express";
import {
    changeMyPassword,
    getMyProfile,
    updateMyProfile,
} from "../services/user.service";

type AuthenticatedRequest = Request & {
    user?: {
        _id: string;
        email: string;
        role: string;
    };
};

/* Get authenticated user's profile */
export const getMyProfileController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const profile = await getMyProfile(userId);

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to fetch profile",
        });
    }
};

/* Update authenticated user's profile */
export const updateMyProfileController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const profile = await updateMyProfile(userId, req.body);

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to update profile",
        });
    }
};

/* Change authenticated user's password */
export const changeMyPasswordController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const result = await changeMyPassword(userId, req.body);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to update password",
        });
    }
};