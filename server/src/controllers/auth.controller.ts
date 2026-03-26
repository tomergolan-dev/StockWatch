import { Request, Response } from "express";
import {
    loginUser,
    registerUser,
    resendVerificationEmail,
    requestPasswordReset,
    resetPassword,
    validateResetToken,
    verifyEmail
} from "../services/auth.service";

export const registerController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const result = await registerUser(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Registration failed"
        });
    }
};

export const verifyEmailController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const token = String(req.query.token || "");

        if (!token) {
            res.status(400).json({
                success: false,
                message: "Missing verification token"
            });
            return;
        }

        const result = await verifyEmail(token);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Email verification failed"
        });
    }
};

export const resendVerificationController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const email = String(req.body?.email || "");

        if (!email) {
            res.status(400).json({
                success: false,
                message: "Email is required"
            });
            return;
        }

        const result = await resendVerificationEmail(email);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Resending verification email failed"
        });
    }
};

export const loginController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error?.message || "Login failed",
            code: error?.code
        });
    }
};

export const forgotPasswordController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const email = String(req.body?.email || "");
        const result = await requestPasswordReset(email);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Password reset request failed"
        });
    }
};

export const validateResetTokenController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const token = String(req.query.token || "");

        if (!token) {
            res.status(400).json({
                success: false,
                valid: false,
                message: "Missing reset token"
            });
            return;
        }

        const result = await validateResetToken(token);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            valid: false,
            message: error?.message || "Reset token validation failed"
        });
    }
};

export const resetPasswordController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const token = String(req.body?.token || "");
        const password = String(req.body?.password || "");

        const result = await resetPassword(token, password);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error?.message || "Password reset failed",
            code: error?.code
        });
    }
};