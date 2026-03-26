import { axiosClient } from "./axiosClient";
import type {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ResendVerificationRequest,
    ResendVerificationResponse,
    ValidateResetTokenResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
} from "../types/auth.types";

/* Send login credentials to the backend */
export async function loginUser(payload: LoginRequest) {
    const response = await axiosClient.post<LoginResponse>("/auth/login", payload);
    return response.data;
}

/* Register a new user account */
export async function registerUser(payload: RegisterRequest) {
    const response = await axiosClient.post<RegisterResponse>(
        "/auth/register",
        payload
    );
    return response.data;
}

/* Request a password reset email */
export async function forgotPassword(payload: ForgotPasswordRequest) {
    const response = await axiosClient.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        payload
    );
    return response.data;
}

/* Validate whether the reset token is still valid */
export async function validateResetToken(token: string) {
    const response = await axiosClient.get<ValidateResetTokenResponse>(
        `/auth/validate-reset-token?token=${encodeURIComponent(token)}`
    );

    return response.data;
}

/* Reset the password using a valid reset token */
export async function resetPassword(payload: ResetPasswordRequest) {
    const response = await axiosClient.post<ResetPasswordResponse>(
        "/auth/reset-password",
        payload
    );
    return response.data;
}

/* Resend the email verification link */
export async function resendVerification(payload: ResendVerificationRequest) {
    const response = await axiosClient.post<ResendVerificationResponse>(
        "/auth/resend-verification",
        payload
    );
    return response.data;
}

/* Verify the email using the token from the URL */
export async function verifyEmail(token: string) {
    const response = await axiosClient.get(`/auth/verify-email?token=${token}`);
    return response.data;
}