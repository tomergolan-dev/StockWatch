import { z } from "zod";

const strongPasswordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one special character");

export const registerSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters long")
        .max(50, "First name must be at most 50 characters long"),
    lastName: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters long")
        .max(50, "Last name must be at most 50 characters long"),
    email: z
        .string()
        .trim()
        .email("Invalid email format")
        .max(255, "Email must be at most 255 characters long"),
    password: strongPasswordSchema
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email format")
        .max(255, "Email must be at most 255 characters long"),
    password: z
        .string()
        .min(1, "Password is required")
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email format")
        .max(255, "Email must be at most 255 characters long")
});

export const resetPasswordSchema = z.object({
    token: z
        .string()
        .trim()
        .min(1, "Token is required"),
    password: strongPasswordSchema
});

export const resendVerificationSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email format")
        .max(255, "Email must be at most 255 characters long")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;