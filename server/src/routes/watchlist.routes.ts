import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
    addToWatchlistController,
    getUserWatchlistController,
    removeFromWatchlistController
} from "../controllers/watchlist.controller";

const watchlistRouter = Router();

// Get authenticated user's watchlist
watchlistRouter.get("/", requireAuth, getUserWatchlistController);

// Add stock to authenticated user's watchlist
watchlistRouter.post("/", requireAuth, addToWatchlistController);

// Remove stock from authenticated user's watchlist
watchlistRouter.delete("/:symbol", requireAuth, removeFromWatchlistController);

export default watchlistRouter;