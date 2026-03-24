import { z } from "zod";

export const updateNotificationReadStatusSchema = z.object({
    isRead: z.boolean()
});

export type UpdateNotificationReadStatusInput = z.infer<
    typeof updateNotificationReadStatusSchema
>;