import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resendVerificationSchema,
    resetPasswordSchema
} from "../validations/auth.validation";
import {
    registerController,
    verifyEmailController,
    resendVerificationController,
    loginController,
    forgotPasswordController,
    validateResetTokenController,
    resetPasswordController,
} from "../controllers/auth.controller";

const authRouter = Router();

// Register a new user
authRouter.post("/register", validate(registerSchema), registerController);

// Verify email using token from query params
authRouter.get("/verify-email", verifyEmailController);

// Resend verification email
authRouter.post(
    "/resend-verification",
    validate(resendVerificationSchema),
    resendVerificationController
);

// Login with email and password
authRouter.post("/login", validate(loginSchema), loginController);

// Request password reset link
authRouter.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPasswordController
);

authRouter.get("/validate-reset-token", validateResetTokenController);

// Reset password using token + new password
authRouter.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPasswordController
);

export default authRouter;