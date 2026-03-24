import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createAlertSchema } from "../validations/alert.validation";
import {
    createAlertController,
    getUserAlertsController,
    deleteAlertController
} from "../controllers/alert.controller";

const alertRouter = Router();

/**
 * Get all alerts for the authenticated user.
 */
alertRouter.get("/", requireAuth, getUserAlertsController);

/**
 * Create a new alert for the authenticated user.
 */
alertRouter.post(
    "/", requireAuth, validate(createAlertSchema), createAlertController);

/**
 * Delete an alert by id for the authenticated user.
 */
alertRouter.delete("/:id", requireAuth, deleteAlertController);

export default alertRouter;