import { Request, Response } from "express";
import {
    getStockQuote,
    searchStocks
} from "../services/stock.service";

/**
 * Controller to handle stock quote requests.
 */
export const getStockController = async (
    req: Request,
    res: Response
) => {
    try {
        const symbol = String(req.params.symbol || "").toUpperCase();

        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: "Stock symbol is required"
            });
        }

        const stockData = await getStockQuote(symbol);

        return res.json({
            success: true,
            data: stockData
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error?.message || "Failed to fetch stock data"
        });
    }
};

/**
 * Controller to search stocks.
 */
export const searchStocksController = async (
    req: Request,
    res: Response
) => {
    try {
        const query = String(req.query.q || "").trim();

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const results = await searchStocks(query);

        return res.json({
            success: true,
            data: results
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error?.message || "Failed to search stocks"
        });
    }
};