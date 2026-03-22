import WatchlistItemModel from "../models/watchlist-item.model";
import axios from "axios";

/**
 * Fetch company name using Finnhub profile endpoint.
 */
const getCompanyName = async (symbol: string): Promise<string> => {
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
        throw new Error("FINNHUB_API_KEY is not defined");
    }

    const response = await axios.get(
        "https://finnhub.io/api/v1/stock/profile2",
        {
            params: {
                symbol,
                token: apiKey
            }
        }
    );

    const data = response.data;

    if (!data || !data.name) {
        throw new Error("Invalid stock symbol or company not found");
    }

    return data.name;
};

/**
 * Add stock to user's watchlist.
 */
export const addToWatchlist = async (
    userId: string,
    symbol: string
) => {
    const normalizedSymbol = symbol.toUpperCase();

    // Fetch company name from API
    const companyName = await getCompanyName(normalizedSymbol);

    try {
        const item = await WatchlistItemModel.create({
            userId,
            symbol: normalizedSymbol,
            companyName
        });

        return item;
    } catch (error: any) {
        // Handle duplicate key error (same symbol for same user)
        if (error.code === 11000) {
            throw new Error("Stock already exists in your watchlist");
        }

        throw new Error(error?.message || "Failed to add stock");
    }
};

/**
 * Get user's watchlist with live stock data.
 */
export const getUserWatchlist = async (userId: string) => {
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
        throw new Error("FINNHUB_API_KEY is not defined");
    }

    // Fetch user's watchlist from DB
    const items = await WatchlistItemModel.find({ userId }).sort({ createdAt: -1 });

    // Enrich each item with live stock data
    const enriched = await Promise.all(
        items.map(async (item) => {
            try {
                const response = await axios.get(
                    "https://finnhub.io/api/v1/quote",
                    {
                        params: {
                            symbol: item.symbol,
                            token: apiKey
                        }
                    }
                );

                const data = response.data;

                return {
                    symbol: item.symbol,
                    companyName: item.companyName,
                    currentPrice: data.c,
                    change: data.d,
                    percentChange: data.dp
                };
            } catch {
                // If API fails, still return base data
                return {
                    symbol: item.symbol,
                    companyName: item.companyName,
                    currentPrice: null,
                    change: null,
                    percentChange: null
                };
            }
        })
    );

    return enriched;
};

/**
 * Remove stock from watchlist.
 */
export const removeFromWatchlist = async (
    userId: string,
    symbol: string
) => {
    const normalizedSymbol = symbol.toUpperCase();

    const deleted = await WatchlistItemModel.findOneAndDelete({
        userId,
        symbol: normalizedSymbol
    });

    if (!deleted) {
        throw new Error("Stock not found in your watchlist");
    }

    return { success: true };
};