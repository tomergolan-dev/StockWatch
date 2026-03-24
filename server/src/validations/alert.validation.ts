import { z } from "zod";

export const createAlertSchema = z.object({
    symbol: z
        .string()
        .trim()
        .min(1, "Stock symbol is required")
        .max(10, "Stock symbol must be at most 10 characters long")
        .transform((value) => value.toUpperCase()),

    metric: z.enum(["price", "percent"], {
        message: "Metric must be either 'price' or 'percent'"
    }),

    direction: z.enum(["up", "down"], {
        message: "Direction must be either 'up' or 'down'"
    }),

    value: z
        .coerce
        .number()
        .positive("Value must be greater than 0")
});

export type CreateAlertInput = z.infer<typeof createAlertSchema>;