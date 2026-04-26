import { z } from "zod";

/* Validate profile update payload */
export const updateProfileSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must contain at least 2 characters"),

    lastName: z
        .string()
        .trim()
        .min(2, "Last name must contain at least 2 characters"),
});

/* Validate password change payload */
export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),

    newPassword: z
        .string()
        .min(8, "New password must contain at least 8 characters"),
});