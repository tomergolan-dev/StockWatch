import { Router } from "express";
import { getStockController,
    searchStocksController
} from "../controllers/stock.controller";

const stockRouter = Router();

// Search stocks by query (e.g., "apple", "tesla").
stockRouter.get("/search", searchStocksController);
// Get stock data by symbol (e.g., AAPL, TSLA)
stockRouter.get("/:symbol", getStockController);

export default stockRouter;