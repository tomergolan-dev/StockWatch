import crypto from "crypto";
import UserModel from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";
import { sendEmail } from "../utils/mailer";

type RegisterUserInput = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

/**
 * Normalize email before lookup or persistence.
 */
const normalizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

/**
 * Create a verification token pair:
 * - rawToken is sent to the user
 * - tokenHash is stored in the database
 */
const createEmailVerificationToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    return { rawToken, tokenHash, expiresAt };
};

/**
 * Check whether the current email verification token is still valid.
 */
const isEmailVerificationValid = (user: any): boolean => {
    return (
        !!user.emailVerificationTokenHash &&
        !!user.emailVerificationExpiresAt &&
        user.emailVerificationExpiresAt.getTime() > Date.now()
    );
};

/**
 * Create a password reset token pair:
 * - rawToken is sent to the user
 * - tokenHash is stored in the database
 */
const createPasswordResetToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    return { rawToken, tokenHash, expiresAt };
};

/**
 * Check whether the current password reset token is still valid.
 */
const isResetTokenValid = (user: any): boolean => {
    return (
        !!user.passwordResetTokenHash &&
        !!user.passwordResetExpiresAt &&
        user.passwordResetExpiresAt.getTime() > Date.now()
    );
};

/**
 * Send account verification email.
 */
const sendVerificationEmail = async (
    email: string,
    rawToken: string
): Promise<void> => {
    const apiUrl = process.env.API_URL || "http://localhost:5000";
    const verifyLink = `${apiUrl}/api/auth/verify-email?token=${rawToken}`;

    await sendEmail({
        to: email,
        subject: "Verify your email - StockWatch",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to StockWatch</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <p><a href="${verifyLink}">${verifyLink}</a></p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `
    });
};

/**
 * Send password reset email.
 */
const sendResetPasswordEmail = async (
    email: string,
    rawToken: string
): Promise<void> => {
    const appUrl = process.env.APP_URL || "http://localhost:5173";
    const resetLink = `${appUrl}/reset-password?token=${rawToken}`;

    await sendEmail({
        to: email,
        subject: "Reset your password - StockWatch",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>You can reset your password by clicking the link below:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 30 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `
    });
};

export const registerUser = async (input: RegisterUserInput) => {
    const email = normalizeEmail(input.email);

    const existingUser = await UserModel.findOne({ email });

    if (existingUser && existingUser.isEmailVerified) {
        throw new Error("Email already exists");
    }

    if (existingUser && !existingUser.isEmailVerified) {
        if (isEmailVerificationValid(existingUser)) {
            return {
                success: true,
                message:
                    "A verification email was already sent. Please check your inbox or spam folder.",
                code: "VERIFICATION_ALREADY_SENT"
            };
        }

        const { rawToken, tokenHash, expiresAt } = createEmailVerificationToken();

        existingUser.emailVerificationTokenHash = tokenHash as any;
        existingUser.emailVerificationExpiresAt = expiresAt as any;
        await existingUser.save();

        await sendVerificationEmail(email, rawToken);

        return {
            success: true,
            message:
                "Your previous verification link expired. A new verification email has been sent.",
            code: "VERIFICATION_RESENT"
        };
    }

    const passwordHash = await hashPassword(input.password);
    const { rawToken, tokenHash, expiresAt } = createEmailVerificationToken();

    await UserModel.create({
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email,
        passwordHash,
        role: "user",
        isEmailVerified: false,
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpiresAt: expiresAt
    });

    await sendVerificationEmail(email, rawToken);

    return {
        success: true,
        message: "Registration completed. Please verify your email address."
    };
};

export const verifyEmail = async (token: string) => {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await UserModel.findOne({
        emailVerificationTokenHash: tokenHash
    });

    if (!user) {
        throw new Error("Invalid verification token");
    }

    if (
        !user.emailVerificationExpiresAt ||
        user.emailVerificationExpiresAt.getTime() < Date.now()
    ) {
        user.emailVerificationTokenHash = null as any;
        user.emailVerificationExpiresAt = null as any;
        await user.save();

        throw new Error(
            "Verification token expired. Please request a new verification email."
        );
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null as any;
    user.emailVerificationExpiresAt = null as any;
    await user.save();

    return {
        success: true,
        message: "Email verified successfully"
    };
};

export const resendVerificationEmail = async (emailRaw: string) => {
    const email = normalizeEmail(emailRaw);

    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isEmailVerified) {
        return {
            success: true,
            message: "Email is already verified"
        };
    }

    if (isEmailVerificationValid(user)) {
        return {
            success: true,
            message:
                "A verification email was already sent. Please check your inbox or spam folder.",
            code: "VERIFICATION_ALREADY_SENT"
        };
    }

    const { rawToken, tokenHash, expiresAt } = createEmailVerificationToken();

    user.emailVerificationTokenHash = tokenHash as any;
    user.emailVerificationExpiresAt = expiresAt as any;
    await user.save();

    await sendVerificationEmail(email, rawToken);

    return {
        success: true,
        message: "A new verification email has been sent.",
        code: "VERIFICATION_RESENT"
    };
};

export const loginUser = async (emailRaw: string, password: string) => {
    const email = normalizeEmail(emailRaw);

    const user = await UserModel.findOne({ email });

    if (!user) {
        const error: Error & { code?: string } = new Error(
            "Email or password is incorrect"
        );
        error.code = "INVALID_CREDENTIALS";
        throw error;
    }

    if (!user.isEmailVerified) {
        const hasValidVerification = isEmailVerificationValid(user);

        const error: Error & { code?: string } = new Error(
            hasValidVerification
                ? "Email not verified. Please use the verification link sent to your inbox."
                : "Email not verified. Your verification link may have expired. Please request a new one."
        );

        error.code = hasValidVerification
            ? "EMAIL_NOT_VERIFIED"
            : "EMAIL_NOT_VERIFIED_EXPIRED";

        throw error;
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
        const error: Error & { code?: string } = new Error(
            "Email or password is incorrect"
        );
        error.code = "INVALID_CREDENTIALS";
        throw error;
    }

    const token = signJwt({
        _id: String(user._id),
        email: user.email,
        role: user.role
    });

    return {
        success: true,
        token,
        user: {
            _id: String(user._id),
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role
        }
    };
};

export const requestPasswordReset = async (emailRaw: string) => {
    const email = normalizeEmail(emailRaw);

    const user = await UserModel.findOne({ email });

    const genericResponse = {
        success: true,
        message: "If the email exists, a password reset link will be sent."
    };

    if (!user) {
        return genericResponse;
    }

    if (!user.isEmailVerified) {
        return genericResponse;
    }

    if (isResetTokenValid(user)) {
        return genericResponse;
    }

    const { rawToken, tokenHash, expiresAt } = createPasswordResetToken();

    user.passwordResetTokenHash = tokenHash as any;
    user.passwordResetExpiresAt = expiresAt as any;
    await user.save();

    await sendResetPasswordEmail(email, rawToken);

    return genericResponse;
};

export const resetPassword = async (
    tokenRaw: string,
    newPassword: string
) => {
    const tokenHash = crypto.createHash("sha256").update(tokenRaw).digest("hex");

    const user = await UserModel.findOne({
        passwordResetTokenHash: tokenHash
    });

    if (!user) {
        const error: Error & { code?: string } = new Error(
            "Invalid or expired reset token"
        );
        error.code = "INVALID_OR_EXPIRED_RESET_TOKEN";
        throw error;
    }

    if (
        !user.passwordResetExpiresAt ||
        user.passwordResetExpiresAt.getTime() < Date.now()
    ) {
        user.passwordResetTokenHash = null as any;
        user.passwordResetExpiresAt = null as any;
        await user.save();

        const error: Error & { code?: string } = new Error(
            "Invalid or expired reset token"
        );
        error.code = "INVALID_OR_EXPIRED_RESET_TOKEN";
        throw error;
    }

    const isSamePassword = await comparePassword(newPassword, user.passwordHash);

    if (isSamePassword) {
        const error: Error & { code?: string } = new Error(
            "New password must be different from the current password"
        );
        error.code = "PASSWORD_REUSE_NOT_ALLOWED";
        throw error;
    }

    user.passwordHash = await hashPassword(newPassword);
    user.passwordResetTokenHash = null as any;
    user.passwordResetExpiresAt = null as any;

    await user.save();

    return {
        success: true,
        message: "Password updated successfully"
    };
};