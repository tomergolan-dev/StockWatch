import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";

export const validate =
    (schema: ZodTypeAny) =>
        (req: Request, res: Response, next: NextFunction): void => {
            try {
                schema.parse(req.body);
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation failed",
                        errors: error.issues.map((issue) => ({
                            path: issue.path.join("."),
                            message: issue.message
                        }))
                    });
                    return;
                }

                res.status(500).json({
                    success: false,
                    message: "Unexpected validation error"
                });
            }
        };