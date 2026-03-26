export type AuthUser = {
    _id: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email: string;
    role?: string;
};

export type RegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type RegisterResponse = {
    success: boolean;
    message?: string;
};

export type VerifyEmailParams = {
    token: string;
};

export type VerifyEmailResponse = {
    success: boolean;
    message?: string;
};

export type ResendVerificationRequest = {
    email: string;
};

export type ResendVerificationResponse = {
    success: boolean;
    message?: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    success: boolean;
    token: string;
    user: AuthUser;
};

export type ForgotPasswordRequest = {
    email: string;
};

export type ForgotPasswordResponse = {
    success: boolean;
    message?: string;
};

export type ValidateResetTokenResponse = {
    success: boolean;
    valid: boolean;
    message?: string;
};

export type ResetPasswordRequest = {
    token: string;
    password: string;
};

export type ResetPasswordResponse = {
    success: boolean;
    message?: string;
};

