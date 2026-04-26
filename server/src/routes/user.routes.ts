import { Router } from "express";
import { validate } from "../middlewares/validate";
import { requireAuth } from "../middlewares/auth";
import {
    changeMyPasswordController,
    getMyProfileController,
    updateMyProfileController,
} from "../controllers/user.controller";
import {
    changePasswordSchema,
    updateProfileSchema,
} from "../validations/user.validation";

const userRouter = Router();

/* Get current user's profile */
userRouter.get("/me", requireAuth, getMyProfileController);

/* Update current user's profile */
userRouter.put(
    "/me",
    requireAuth,
    validate(updateProfileSchema),
    updateMyProfileController
);

/* Change current user's password */
userRouter.put(
    "/me/password",
    requireAuth,
    validate(changePasswordSchema),
    changeMyPasswordController
);

export default userRouter;