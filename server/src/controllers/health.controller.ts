import { Request, Response } from "express";

export const getHealthStatus = (_req: Request, res: Response): void => {
    res.status(200).json({
        success: true,
        message: "StockWatch API is running"
    });
};