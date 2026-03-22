import axios from "axios";

/**
 * Fetch stock quote data from Finnhub API.
 * Returns current price, change, and percent change.
 */
export const getStockQuote = async (symbol: string) => {
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
        throw new Error("FINNHUB_API_KEY is not defined");
    }

    try {
        const response = await axios.get(
            "https://finnhub.io/api/v1/quote",
            {
                params: {
                    symbol,
                    token: apiKey
                }
            }
        );

        const data = response.data;

        // Validate response
        if (!data || data.c === 0) {
            throw new Error("Invalid stock symbol or no data available");
        }

        return {
            symbol,
            currentPrice: data.c,
            change: data.d,
            percentChange: data.dp,
            high: data.h,
            low: data.l,
            open: data.o,
            previousClose: data.pc
        };
    } catch (error: any) {
        throw new Error(error?.message || "Failed to fetch stock data");
    }
};

/**
 * Search stocks by query (e.g., company name or symbol).
 */
export const searchStocks = async (query: string) => {
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
        throw new Error("FINNHUB_API_KEY is not defined");
    }

    if (!query) {
        throw new Error("Search query is required");
    }

    try {
        const response = await axios.get(
            "https://finnhub.io/api/v1/search",
            {
                params: {
                    q: query,
                    token: apiKey
                }
            }
        );

        const results = response.data.result;

        if (!results || results.length === 0) {
            return [];
        }

        // Return only relevant fields
        return results.slice(0, 10).map((item: any) => ({
            symbol: item.symbol,
            description: item.description,
            type: item.type
        }));
    } catch (error: any) {
        throw new Error(error?.message || "Failed to search stocks");
    }
};