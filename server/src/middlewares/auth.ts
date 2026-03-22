import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";

type AuthenticatedRequest = Request & {
    user?: {
        _id: string;
        email: string;
        role: string;
    };
};

export const requireAuth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Authorization token is missing"
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyJwt(token);

        req.user = {
            _id: payload._id,
            email: payload.email,
            role: payload.role
        };

        next();
    } catch {
        res.status(401).json({
            success: false,
            message: "Invalid or expired authorization token"
        });
    }
};